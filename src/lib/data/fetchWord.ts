import { Word } from "$lib/types";
import { supabase } from "$lib/supabase";
import { getUsername, type WordHistory } from "$lib/data/wordHistory";

interface DictionaryWord {
    word: string;
    pos: string;
    definition: string;
}

export async function fetchWord(): Promise<DictionaryWord> {
    const res = await fetch('/api/word');
    return res.json();
}

export function getWord(word: string): Word {
    const w = new Word(word);
    return w;
}

export interface WordCardData {
    word: Word;
    user: string;
    date: Date;
}

export async function getHighestScoringWordToday(): Promise<WordCardData | null> {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const { data, error } = await supabase
        .from("word_history")
        .select("word, color, generated_at, score, user_id")
        .gte("generated_at", startOfDay.toISOString())
        .lte("generated_at", endOfDay.toISOString())
        .order("score", { ascending: false })
        .limit(1)
        .maybeSingle();
    
    if (error) throw error;
    if (!data) return null;


    return {
        word: new Word(data.word, data.color),
        user: await getUsername(data.user_id) ?? "unknown",
        date: new Date(data.generated_at),
    };
}




