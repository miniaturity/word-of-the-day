import { supabase } from "$lib/supabase";
import type { Word } from "$lib/types";

export async function getGenerationAvailable(userId: string): Promise<{ allowed: boolean; nextTime: Date | null }> {
    const { data, error } = await supabase
        .from("word_history")
        .select("generated_at")
        .eq("user_id", userId)
        .order("generated_at", { ascending: false })
        .limit(1)
        .single();
    
    if (error?.code === "PGRST116" || !data) {
        return { allowed: true, nextTime: null };
    }

    if (error) throw error;
    
    const lastGeneration = new Date(data.generated_at);
    const nextTime = new Date(lastGeneration.getTime() + 24 * 60 * 60 * 1000);
    const now = new Date();

    return {
        allowed: now >= nextTime,
        nextTime: now >= nextTime ? null : nextTime
    }
}

export type PropertySaveRes = {
    propertyId: number;
    isNew: boolean;
    newCount: number;
}

export async function saveWordResult(userId: string, word: Word): Promise<PropertySaveRes[]> {

    const { error: wordError } = await supabase
        .from("word_history")
        .insert({
            user_id: userId,
            word: word.getWord(),
            color: word.getColor()
        })
    
    if (wordError) throw wordError;

    const propertyIds = word.getProperties().map(p => p.id);

    const { data: existing, error: fetchErr } = await supabase
        .from("property_history")
        .select("property_id, count")
        .eq("user_id", userId)
        .in("property_id", propertyIds);

    if (fetchErr) throw fetchErr;

    const existingMap = new Map<number, number>(
        (existing ?? []).map(row => [row.property_id, row.count])
    );

    const upsertRows = propertyIds.map(id => ({
        user_id: userId,
        property_id: id,
        count: (existingMap.get(id) ?? 0) + 1,
    }));

    const { error: upsertError } = await supabase
        .from("property_history")
        .upsert(upsertRows, { onConflict: "user_id,property_id" });
    
    if (upsertError) throw upsertError;

    return propertyIds.map(id => ({
        propertyId: id,
        isNew: !existingMap.has(id),
        newCount: (existingMap.get(id) ?? 0) + 1,
    }));
}

export async function getUsername(userId: string): Promise<string | null> {
    const { data, error } = await supabase
        .from("profiles")
        .select("username")
        .eq("id", userId)
        .single();

    if (error) return null;
    return data.username;
}

export async function logout(): Promise<void> {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
}

export interface WordHistory {
    id: string;
    word: string;
    color: string;
    generated_at: string;
}

export async function getUserWords(userId: string): Promise<WordHistory[]> {
    const { data, error } = await supabase
        .from("word_history")
        .select("id, word, color, generated_at")
        .eq("user_id", userId)
        .order("generated_at", { ascending: false });

    if (error) throw error;
    return data ?? [];
}

export async function getLastWord(userId: string): Promise<WordHistory | null> {
    const { data, error } = await supabase
        .from("word_history")
        .select("id, word, color, generated_at")
        .eq("user_id", userId)
        .order("generated_at", { ascending: false })
        .limit(1)
        .single();

    if (error?.code === "PGRST116") return null;
    if (error) throw error;
    return data;
}