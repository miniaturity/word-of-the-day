import type { Property } from "$lib/types";
import type { Highlight } from "$lib/types";

export const PROPERTIES: Property[] = [
    {
        id: 0,
        name: "pair",
        desc: "contains two of the same character",
        probability: 68.9,
        icon: "🧑‍🤝‍🧑",
        score: 550,

        applicable: (word: string) => {
            return /(.).*\1/i.test(word);
        },

        highlight: (word: string) => {
            const firstSeen: Record<string, number> = {};
            let indices: number[] = [];

            for (let i = 0; i < word.length; i++) {
                const char = word[i];

                if (char in firstSeen) {
                    const prevIndex = firstSeen[char];

                    indices = [prevIndex, i];
                    
                } else {
                    firstSeen[char] = i;
                }
            }

            return {
                [indices[0]]: {},
                [indices[1]]: {}
            }
        }
    },
    {
        id: 1,
        name: "vowel",
        desc: "contains at least one vowel",
        probability: 99.8,
        icon: "🌱",
        score: 100,
        
        applicable: (word: string) => {
            return /[aeiou]/i.test(word);
        },

        highlight: (word: string) => {
            const vowels = "aeiou";
            const highlights: Record<number, Highlight> = {};
            for (let i = 0; i < word.length; i++) {
                if (vowels.includes(word[i])) {
                    highlights[i] = {};
                }
            }
            return highlights;
        }
    },
    {
        id: 2,
        name: "consonant",
        desc: "contains at least one consonant",
        probability: 99.98,
        icon: "🪢",
        score: 50,

        applicable: (word: string) => {
            return /[bcdfghjklmnpqrstvwxyz]/i.test(word);
        },

        highlight: (word: string) => {
            const consonants = "bcdfghjklmnpqrstvwxyz";
            const highlights: Record<number, Highlight> = {};
            for (let i = 0; i < word.length; i++) {
                if (consonants.includes(word[i])) {
                    highlights[i] = {};
                }
            }
            return highlights;
        }
    },
    {
        id: 3,
        name: "vowelless",
        desc: "does not contain any vowels",
        probability: 0.18,
        icon: "🔇",
        score: 50000,

        applicable: (word: string) => {
            return /^[^aeiou]*$/i.test(word);
        }
    },
    {
        id: 4,
        name: "consonantless",
        desc: "does not contain any consonants",
        probability: 0.023,
        icon: "💎",
        score: 153333,

        applicable: (word: string) => {
            return /^[^bcdfghjklmnpqrstvwxyz]*$/i.test(word);
        },

    },
    {
        id: 5,
        name: "furry",
        desc: "contains a popular fursona type as a substring",
        probability: 0.033,
        icon: "🐲",
        score: 264000,
        
        applicable: (word: string) => {
            const furries = [
                "dragon",
                "feline",
                "canine",
                "rodent",
                "avian",
                "aquatic",
                "dinosaur",
                "pokemon",
                "big cat",
                "awwkitty"
            ]

            for (const fur of furries) {
                if (word.includes(fur)) return true;
            }

            return false;
        },

        highlight: (word: string) => {
            const highlights: Record<number, Highlight> = {};

            const furries = [
                "dragon",
                "feline",
                "canine",
                "rodent",
                "avian",
                "aquatic",
                "dinosaur",
                "pokemon",
                "big cat",
                "awwkitty"
            ]

            let furry: string = "dragon";

            for (const fur of furries) {
                if (word.includes(fur)) {
                    furry = fur;
                }
            }


            for (let i = word.indexOf(furry); i < furry.length; i++) {
                highlights[i] = {};
            }

            return highlights;
        }
    },
    {
        id: 6,
        name: "palindrome",
        desc: "spelled the same way backwards and forwards",
        probability: 0.17,
        icon: "🪞",
        score: 123321,

        applicable: (word: string) => {
            const rev = word.toLowerCase().split('').reverse().join('');
            return word.toLowerCase() === rev;
        }
    },
    {
        id: 7,
        name: "short",
        desc: "less than 4 characters long",
        probability: 2.45,
        icon: "📏",
        score: 12400,

        applicable: (word: string) => word.length < 4
    },
    {
        id: 8,
        name: "long",
        desc: "more than 12 characters long",
        probability: 5.8,
        icon: "📏",
        score: 7800,

        applicable: (word: string) => word.length > 12
    },
    {
        id: 9,
        name: "elemental",
        desc: "contains an element's symbol (longer than 1 character) as a substring",
        probability: 92,
        icon: "🧪",
        score: 250,
        
        applicable: (word: string) => {
             const ELEMENT_SYMBOLS: string[] = [
                "He",
                "Li", "Be", "Ne",
                "Na", "Mg", "Al", "Si", "Cl", "Ar",
                "Ca", "Sc", "Ti", "Cr", "Mn", "Fe", "Co", "Ni", "Cu", "Zn",
                "Ga", "Ge", "As", "Se", "Br", "Kr",
                "Rb", "Sr","Zr", "Nb", "Mo", "Tc", "Ru", "Rh", "Pd", "Ag", "Cd",
                "In", "Sn", "Sb", "Te", "Xe",
                "Cs", "Ba",
                "La", "Ce", "Pr", "Nd", "Pm", "Sm", "Eu", "Gd", "Tb", "Dy", "Ho", "Er", "Tm", "Yb", "Lu",
                "Hf", "Ta", "Re", "Os", "Ir", "Pt", "Au", "Hg",
                "Tl", "Pb", "Bi", "Po", "At", "Rn",
                "Fr", "Ra",
                "Ac", "Th", "Pa", "U", "Np", "Pu", "Am", "Cm", "Bk", "Cf", "Es", "Fm", "Md", "No", "Lr",
                "Rf", "Db", "Sg", "Bh", "Hs", "Mt", "Ds", "Rg", "Cn",
                "Nh", "Fl", "Mc", "Lv", "Ts", "Og"
            ];

            for (const e of ELEMENT_SYMBOLS) {
                if (word.includes(e.toLowerCase())) return true;
            }

            return false;
        },

        highlight: (word: string) => {
            const highlights: Record<number, Highlight> = {};
            const ELEMENT_SYMBOLS: string[] = [
                "He",
                "Li", "Be", "Ne",
                "Na", "Mg", "Al", "Si", "Cl", "Ar",
                "Ca", "Sc", "Ti", "Cr", "Mn", "Fe", "Co", "Ni", "Cu", "Zn",
                "Ga", "Ge", "As", "Se", "Br", "Kr",
                "Rb", "Sr","Zr", "Nb", "Mo", "Tc", "Ru", "Rh", "Pd", "Ag", "Cd",
                "In", "Sn", "Sb", "Te", "Xe",
                "Cs", "Ba",
                "La", "Ce", "Pr", "Nd", "Pm", "Sm", "Eu", "Gd", "Tb", "Dy", "Ho", "Er", "Tm", "Yb", "Lu",
                "Hf", "Ta", "Re", "Os", "Ir", "Pt", "Au", "Hg",
                "Tl", "Pb", "Bi", "Po", "At", "Rn",
                "Fr", "Ra",
                "Ac", "Th", "Pa", "U", "Np", "Pu", "Am", "Cm", "Bk", "Cf", "Es", "Fm", "Md", "No", "Lr",
                "Rf", "Db", "Sg", "Bh", "Hs", "Mt", "Ds", "Rg", "Cn",
                "Nh", "Fl", "Mc", "Lv", "Ts", "Og"
            ];

            let element: string = "He";
            let wordRef: string = word;

            for (const e of ELEMENT_SYMBOLS) {
                if (word.includes(e.toLowerCase())) element = e;
            }

            for (let i = wordRef.indexOf(element); i < element.length; i++) {
                highlights[i] = {};
            }

            return highlights;
        }
    },
    {
        id: 10,
        name: "adjacent (pair)",
        desc: "contains an adjacent pair of characters",
        probability: 20,
        icon: "👯‍♀️",
        score: 1202,

        applicable: (word: string) => {
            return /([a-z])\1/.test(word);
        },

        highlight: (word: string) => {
            const highlights: Record<number, Highlight> = {};

            for (let i = 0; i < word.length - 1; i++) {
                if (word[i] === word[i + 1]) {
                    highlights[i] = {};
                    highlights[i + 1] = {};
                }
            }

            return highlights;
        }
    },
    {
        id: 11,
        name: "one (short)",
        desc: "contains only 1 character",
        probability: 0.038,
        icon: "1️⃣",
        score: 801010,

        applicable: (word: string) => word.length === 1
    },
    {
        id: 12,
        name: "hyphenation",
        desc: "contains a dash",
        probability: 2.3,
        icon: "➖",
        score: 14500,

        applicable: (word: string) => word.includes("-"),
        highlight: (word: string) => ({[word.indexOf("-")]: {}})
    },
    {
        id: 13,
        name: "marks the spot",
        desc: "contains the character x",
        probability: 2.4,
        icon: "❎",
        score: 14444,

        applicable: (word: string) => word.includes("x"),
        highlight: (word: string) => {
            const highlights: Record<number, Highlight> = {};

            for (let i = 0; i < word.length; i++) {
                if (word[i] === "x") highlights[i] = {};
            }

            return highlights;
        }
    },
    {
        id: 14,
        name: "threepeat",
        desc: "contains three of the same character",
        probability: 13.3,
        icon: "👩‍👧‍👦",
        score: 6333,

        applicable: (word: string) => /([a-z])(?=(?:.*?\1){2})/.test(word),

       highlight: (word: string) => {
            const seen: Record<string, number[]> = {};
            let indices: number[] = [];

            for (let i = 0; i < word.length; i++) {
                const char = word[i];

                if (!seen[char]) {
                    seen[char] = [];
                }

                seen[char].push(i);

                if (seen[char].length === 3) {
                    indices = seen[char];
                    break;
                }
            }

            return {
                [indices[0]]: {},
                [indices[1]]: {},
                [indices[2]]: {}
            };
        }
    },
    {
        id: 15,
        name: "queue",
        desc: "contains the character q",
        probability: 1.6,
        icon: "⁉️",
        score: 32000,

        applicable: (word: string) => word.includes("q"),
        highlight: (word: string) => {
            const highlights: Record<number, Highlight> = {};

            for (let i = 0; i < word.length; i++) {
                if (word[i] === "q") highlights[i] = {};
            }

            return highlights;
        }
        
    },
    {
        id: 16,
        name: "action!",
        desc: "has the suffix 'ing'",
        probability: 5.5,
        icon: "‼️",
        score: 7600,

        applicable: (word: string) => word.endsWith("ing"),
        highlight: (word: string) => {
            const index = word.indexOf("ing");

            return {
                [index]: {},
                [index + 1]: {},
                [index + 2]: {}
            }
        }
    },
    {
        id: 17,
        name: "heavy",
        desc: "the sum of the indices of each character in the alphabet is greater than 100",
        probability: 18.2,
        icon: "🪨",
        score: 9090,

        applicable: (word: string) => {
            let total: number = 0;
            const alpha = "abcdefghijklmnopqrstuvwxyz";

            for (let i = 0; i < word.length; i++) {
                const index = alpha.indexOf(word[i]);
                if (index !== -1) {
                    total += index + 1;
                }
            }

            return total > 125;
        }
    },
    {
        id: 18,
        name: "light",
        desc: "the sum of the indices of each character in the alphabet is less than 30",
        probability: 2,
        icon: "🪶",
        score: 10030,

        applicable: (word: string) => {
            let total: number = 0;
            const alpha = "abcdefghijklmnopqrstuvwxyz";

            for (let i = 0; i < word.length; i++) {
                const index = alpha.indexOf(word[i]);
                if (index !== -1) {
                    total += index + 1;
                }
            }

            return total < 30;
        }
    },
    {
        id: 19,
        name: "heavy (roman)",
        desc: "the sum of all the roman numerals in the word is greater than 10000",
        probability: 18.67,
        icon: "🏦",
        score: 4700,

        applicable: (word: string) => {
            const ROMAN_VALUES: Record<string, number> = {
                i: 1,
                v: 5,
                x: 10,
                l: 50,
                c: 100,
                d: 500,
                m: 1000
            };

            let total = 0;

            for (let i = 0; i < word.length; i++) {
                const current = ROMAN_VALUES[word[i]];
                const next = ROMAN_VALUES[word[i + 1]];

                if (!current) continue;

                if (next && current < next) {
                    total -= current;
                } else {
                    total += current;
                }
            }

            return total > 1000;
        },

        highlight: (word: string) => {
            const highlights: Record<number, Highlight> = {};
            const ROMAN: string[] = [
                "i", "v", "x", "l", "c", "d", "m"
            ]

            for (let i = 0; i < word.length; i++) {
                if (ROMAN.includes(word[i])) highlights[i] = {};
            }

            return highlights;
        }
    },
    {
        id: 20,
        name: "3.14159265359..",
        desc: "contains the substring pi",
        icon: "🥧",
        probability: 2.4,
        score: 31415,

        applicable: (word: string) => word.includes("pi"),
        highlight: (word: string) => {
            const i = word.indexOf("pi");
            return {
                [i]: {},
                [i + 1]: {}
            }
        }
    },
    {
        id: 21,
        name: "ism",
        desc: "has the suffix 'ism'",
        icon: "🧩",
        probability: 0.7,
        score: 100310,

        applicable: (word: string) => word.endsWith("ism"),
        highlight: (word: string) => ({
            [word[word.length - 1]]: {},
            [word[word.length - 2]]: {},
            [word[word.length - 3]]: {}
        })
    },
    {
        id:  22,
        name: "even",
        desc: "contains an even amount of letters",
        icon: "✌️",
        probability: 50.6,
        score: 49,

        applicable: (word: string) => word.length % 2 === 0,
    },
    {
        id: 23,
        name: "odd",
        desc: "contains an odd amount of letters",
        icon: "☝️",
        probability: 49.4,
        score: 51,

        applicable: (word: string) => word.length % 2 === 1,
    },
    {
        id: 24,
        name: "typescript",
        desc: "is a typescript keyword",
        icon: "🧑‍💻",
        probability: 0.2,
        score: 177000,

        applicable: (word: string) => {
            const KEYWORDS: string[] = [
                "break",
                "case",
                "catch",
                "class",
                "const",
                "continue",
                "debugger",
                "default",
                "delete",
                "do",
                "else",
                "enum",
                "export",
                "extends",
                "false",
                "finally",
                "for",
                "function",
                "if",
                "import",
                "in",
                "instanceof",
                "new",
                "null",
                "return",
                "super",
                "switch",
                "this",
                "throw",
                "true",
                "try",
                "typeof",
                "var",
                "void",
                "while",
                "with",
                "as",
                "implements",
                "interface",
                "let",
                "package",
                "private",
                "protected",
                "public",
                "static",
                "yield",
                "any",
                "boolean",
                "constructor",
                "declare",
                "get",
                "module",
                "require",
                "number",
                "set",
                "string",
                "symbol",
                "type",
                "from",
            ]

            return KEYWORDS.includes(word);
        }
    }
    
]