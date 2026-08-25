import "server-only";
import { createClient } from "@supabase/supabase-js";

// Server-only: uses the service_role key, same as src/lib/storage.ts.
// Never import this from a Client Component or expose the key to the browser.
function getRealtimeAdminClient() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}

// Each user has their own broadcast channel (`dm-user-{id}`) that the chat
// widget subscribes to while mounted. The payload only carries the
// conversation id — never message content — so the channel needs no
// Realtime Authorization/RLS setup: a listener can only learn "conversation
// X changed", and actually reading it still goes through the
// authorization-checked fetchMessagesAction.
export async function broadcastNewMessage(userIds: string[], conversationId: string) {
  const client = getRealtimeAdminClient();
  // NEXT_PUBLIC_SUPABASE_ANON_KEY isn't configured yet (see .env.example) —
  // chat still works, it just requires a manual refresh instead of a live
  // push. Not a hard error.
  if (!client) return;

  await Promise.all(
    userIds.map(
      (userId) =>
        new Promise<void>((resolve) => {
          const channel = client.channel(`dm-user-${userId}`);
          // removeChannel() itself reports a status change back through the
          // same subscribe() callback below, so without this guard finish()
          // would call itself recursively until the stack overflows.
          let settled = false;
          const finish = () => {
            if (settled) return;
            settled = true;
            resolve();
            client.removeChannel(channel);
          };
          const timeout = setTimeout(finish, 3000);
          channel.subscribe((status) => {
            if (status === "SUBSCRIBED") {
              channel
                .send({ type: "broadcast", event: "new_message", payload: { conversationId } })
                .finally(() => {
                  clearTimeout(timeout);
                  finish();
                });
            } else if (status === "CHANNEL_ERROR" || status === "TIMED_OUT" || status === "CLOSED") {
              clearTimeout(timeout);
              finish();
            }
          });
        }),
    ),
  );
}
