"use server";

import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { broadcastNewMessage } from "@/lib/realtime-server";

// userAId is always the lexicographically smaller id — see the comment on
// the Conversation model — so a lookup only ever needs one ordering.
function pairKey(a: string, b: string) {
  return a < b ? { userAId: a, userBId: b } : { userAId: b, userBId: a };
}

async function requireUserId() {
  const session = await auth().catch(() => null);
  return session?.user?.id ?? null;
}

export type ConversationSummary = {
  id: string;
  otherUser: {
    id: string;
    username: string;
    displayName: string;
    avatarUrl: string | null;
  };
  lastMessage: { body: string; createdAt: Date; senderId: string } | null;
  unreadCount: number;
  updatedAt: Date;
};

export async function listConversationsAction(): Promise<ConversationSummary[]> {
  const userId = await requireUserId();
  if (!userId) return [];

  try {
    const rows = await prisma.conversation.findMany({
      where: { OR: [{ userAId: userId }, { userBId: userId }] },
      include: {
        userA: true,
        userB: true,
        messages: { orderBy: { createdAt: "desc" }, take: 1 },
      },
      orderBy: { updatedAt: "desc" },
    });

    return await Promise.all(
      rows.map(async (row) => {
        const isA = row.userAId === userId;
        const other = isA ? row.userB : row.userA;
        const myReadAt = isA ? row.userAReadAt : row.userBReadAt;
        const unreadCount = await prisma.directMessage.count({
          where: {
            conversationId: row.id,
            senderId: { not: userId },
            ...(myReadAt ? { createdAt: { gt: myReadAt } } : {}),
          },
        });
        const last = row.messages[0];
        return {
          id: row.id,
          otherUser: {
            id: other.id,
            username: other.username,
            displayName: other.displayName,
            avatarUrl: other.avatarUrl,
          },
          lastMessage: last
            ? { body: last.body, createdAt: last.createdAt, senderId: last.senderId }
            : null,
          unreadCount,
          updatedAt: row.updatedAt,
        };
      }),
    );
  } catch {
    return [];
  }
}

export type StartConversationResult =
  | { ok: true; conversationId: string }
  | { ok: false; error: string };

export async function getOrCreateConversationAction(
  otherUserId: string,
): Promise<StartConversationResult> {
  const userId = await requireUserId();
  if (!userId) return { ok: false, error: "로그인이 필요해요." };
  if (userId === otherUserId) {
    return { ok: false, error: "자신에게는 메시지를 보낼 수 없어요." };
  }

  try {
    const otherUser = await prisma.user.findUnique({ where: { id: otherUserId } });
    if (!otherUser) return { ok: false, error: "사용자를 찾을 수 없어요." };

    const key = pairKey(userId, otherUserId);
    const existing = await prisma.conversation.findUnique({
      where: { userAId_userBId: key },
    });
    if (existing) return { ok: true, conversationId: existing.id };

    const created = await prisma.conversation.create({ data: key });
    return { ok: true, conversationId: created.id };
  } catch {
    return { ok: false, error: "대화를 시작하지 못했어요." };
  }
}

export type DirectMessageItem = {
  id: string;
  body: string;
  createdAt: Date;
  senderId: string;
};

export async function fetchMessagesAction(
  conversationId: string,
): Promise<DirectMessageItem[]> {
  const userId = await requireUserId();
  if (!userId) return [];

  try {
    const conv = await prisma.conversation.findUnique({ where: { id: conversationId } });
    if (!conv || (conv.userAId !== userId && conv.userBId !== userId)) return [];

    const isA = conv.userAId === userId;
    await prisma.conversation.update({
      where: { id: conversationId },
      data: isA ? { userAReadAt: new Date() } : { userBReadAt: new Date() },
    });

    const messages = await prisma.directMessage.findMany({
      where: { conversationId },
      orderBy: { createdAt: "asc" },
    });
    return messages.map((m) => ({
      id: m.id,
      body: m.body,
      createdAt: m.createdAt,
      senderId: m.senderId,
    }));
  } catch {
    return [];
  }
}

const sendSchema = z.object({ body: z.string().trim().min(1).max(2000) });

export type SendMessageResult =
  | { ok: true; message: DirectMessageItem }
  | { ok: false; error: string };

export async function sendMessageAction(
  conversationId: string,
  body: string,
): Promise<SendMessageResult> {
  const userId = await requireUserId();
  if (!userId) return { ok: false, error: "로그인이 필요해요." };

  const parsed = sendSchema.safeParse({ body });
  if (!parsed.success) return { ok: false, error: "메시지를 입력해주세요." };

  try {
    const conv = await prisma.conversation.findUnique({ where: { id: conversationId } });
    if (!conv || (conv.userAId !== userId && conv.userBId !== userId)) {
      return { ok: false, error: "대화를 찾을 수 없어요." };
    }

    const message = await prisma.directMessage.create({
      data: { conversationId, senderId: userId, body: parsed.data.body },
    });
    await prisma.conversation.update({
      where: { id: conversationId },
      data: { updatedAt: new Date() },
    });

    const otherUserId = conv.userAId === userId ? conv.userBId : conv.userAId;
    // Fire-and-forget — a missed live push just means the recipient sees
    // the new message on their next manual refresh instead of instantly;
    // it must never block the (already-persisted) send from returning.
    void broadcastNewMessage([userId, otherUserId], conversationId);

    return {
      ok: true,
      message: {
        id: message.id,
        body: message.body,
        createdAt: message.createdAt,
        senderId: message.senderId,
      },
    };
  } catch {
    return { ok: false, error: "메시지를 보내지 못했어요." };
  }
}

export type UserSearchResult = {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string | null;
};

export async function searchUsersAction(query: string): Promise<UserSearchResult[]> {
  const userId = await requireUserId();
  if (!userId) return [];

  const q = query.trim();
  if (q.length === 0) return [];

  try {
    return await prisma.user.findMany({
      where: {
        id: { not: userId },
        OR: [
          { username: { contains: q, mode: "insensitive" } },
          { displayName: { contains: q, mode: "insensitive" } },
        ],
      },
      take: 8,
      select: { id: true, username: true, displayName: true, avatarUrl: true },
    });
  } catch {
    return [];
  }
}
