import { writable } from "svelte/store";
import type { User } from "@supabase/supabase-js";
import { supabase } from "$lib/supabase";
import { getUsername } from "$lib/data/wordHistory";

export const user     = writable<User | null>(null);
export const username = writable<string | null>(null);
export const loaded   = writable<boolean>(false);
export const guest    = writable<boolean>(false);

export async function init() {
    const { data } = await supabase.auth.getUser();
    const authUser = data.user;

    if (authUser) {
        const { data: profile } = await supabase
            .from("profiles")
            .select("id")
            .eq("id", authUser.id)
            .single();

        if (profile) {
            user.set(authUser);
            const u = await getUsername(authUser.id);
            username.set(u);
        }
    }

    loaded.set(true);

    supabase.auth.onAuthStateChange(async (event, session) => {
        if (event === "SIGNED_OUT") {
            user.set(null);
            username.set(null);
        } else if (event === "SIGNED_IN" && session?.user) {
            const { data: profile } = await supabase
                .from("profiles")
                .select("id")
                .eq("id", session.user.id)
                .single();

            if (profile) {
                user.set(session.user);
                const u = await getUsername(session.user.id);
                username.set(u);
            }
        } else if (event === "TOKEN_REFRESHED") {
            user.set(session?.user ?? null);
        }
    });
}

export async function logout() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    user.set(null);
    username.set(null);
    guest.set(false);
}

export function continueAsGuest() {
    guest.set(true);
}

export function onLoginComplete(u: User) {
    user.set(u);
    guest.set(false);
}