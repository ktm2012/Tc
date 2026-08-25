"use server";

import { signIn, signOut } from "@/auth";

// These buttons live on /login and /register and are meant to sign in as
// the identity the user is about to authenticate as — never to silently
// attach a new provider to whatever session happens to already be active in
// the browser. Auth.js links an OAuth account to the current session user
// with no extra confirmation whenever one exists (see handleLoginOrRegister
// in @auth/core), so on a shared/forgotten-logout browser this would let a
// second person's Naver/Kakao/Google account get merged into the first
// person's Tc account. Clearing the session first guarantees these buttons
// always start a fresh sign-in instead.
async function signOutExistingSession() {
  await signOut({ redirect: false });
}

export async function signInWithGoogle() {
  await signOutExistingSession();
  await signIn("google", { redirectTo: "/profile" });
}

export async function signInWithNaver() {
  await signOutExistingSession();
  await signIn("naver", { redirectTo: "/profile" });
}

export async function signInWithKakao() {
  await signOutExistingSession();
  await signIn("kakao", { redirectTo: "/profile" });
}

export async function signOutAction() {
  await signOut({ redirectTo: "/" });
}
