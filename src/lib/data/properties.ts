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
        score: 121000,

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
        score: 353333,

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
                "dinosaur"
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
                "Ac", "Th", "Pa", "Np", "Pu", "Am", "Cm", "Bk", "Cf", "Es", "Fm", "Md", "No", "Lr",
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
                "Ac", "Th", "Pa", "Np", "Pu", "Am", "Cm", "Bk", "Cf", "Es", "Fm", "Md", "No", "Lr",
                "Rf", "Db", "Sg", "Bh", "Hs", "Mt", "Ds", "Rg", "Cn",
                "Nh", "Fl", "Mc", "Lv", "Ts", "Og"
            ];

            let element: string = "He";

            for (const e of ELEMENT_SYMBOLS) {
                if (word.includes(e.toLowerCase())) element = e.toLowerCase();
            }

            for (let i = word.indexOf(element); i < word.indexOf(element) + 2; i++) {
                highlights[i] = {};
            }

            return highlights;
        }
    },
    {
        id: 10,
        name: "pair: adjacent",
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
        score: 301010,

        applicable: (word: string) => word.length === 1
    },
    {
        id: 12,
        name: "hyphenation",
        desc: "contains a dash",
        probability: 2.3,
        icon: "➖",
        score: 15500,

        applicable: (word: string) => word.includes("-"),
        highlight: (word: string) => ({[word.indexOf("-")]: {}})
    },
    {
        id: 13,
        name: "marks the spot",
        desc: "contains the character x",
        probability: 2.4,
        icon: "❎",
        score: 18444,

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
        score: 4333,

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
        score: 42000,

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
        score: 4290,

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
        score: 21030,

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
        score: 80310,

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
        score: 100001,

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
    },
    {
        id: 25,
        name: "starter",
        desc: "only contains letters from the first half of the alphabet",
        icon: "🌗",
        probability: 2.06,
        score: 20000,

        applicable: (word: string) => {
            const alpha = 'abcdefghijklm';

            for (let i = 0; i < word.length; i++) {
                if (!alpha.includes(word[i])) return false;
            }

            return true;
        }
    },
    {
        id: 26,
        name: "ascent",
        desc: "letters are organized alphabetically",
        icon: "🔤",
        probability: 1.1,
        score: 69200,

        applicable: (word: string) => {
            for (let i = 0; i < word.length - 1; i++) {
                if (word[i] > word[i + 1]) return false;
            }
            return true;
        }
    },
    {
        id: 27,
        name: "-tious",
        desc: "contains the suffix '-tious'",
        icon: "😋",
        probability: 0.07,
        score: 250000,

        applicable: (word: string) => word.endsWith("tious"),
        highlight: (word: string) => {
            return {
                [word[word.length - 1]]: {},
                [word[word.length - 2]]: {},
                [word[word.length - 3]]: {},
                [word[word.length - 4]]: {},
                [word[word.length - 5]]: {}
            }
        }
    },
    {
        id: 28,
        name: "descent",
        desc: "letters are organized alphabetically, descending",
        icon: "🔡",
        probability: 0.79,
        score: 71321,

        applicable: (word: string) => {
            for (let i = 0; i < word.length - 1; i++) {
                if (word[i] < word[i + 1]) return false;
            }
            return true;
        }
    },
    {
        id: 29,
        name: "ooough",
        desc: "contains the substring 'ough'",
        icon: "🐈",
        probability: 0.18,
        score: 120002,

        applicable: (word: string) => word.includes("ough"),
        highlight: (word: string) => {
            return {
                [word[word.length - 1]]: {},
                [word[word.length - 2]]: {},
                [word[word.length - 3]]: {},
                [word[word.length - 4]]: {},
            }
        }
    },
    {
        id: 30,
        name: "elemental (2)",
        desc: "is an element in the periodic table",
        icon: "⚗️",
        probability: 0.08,
        score: 249900,

        applicable: (word: string) => {
            const ELEMENTS: string[] = [
                "hydrogen",
                "helium",
                "lithium",
                "beryllium",
                "boron",
                "carbon",
                "nitrogen",
                "oxygen",
                "fluorine",
                "neon",
                "sodium",
                "magnesium",
                "aluminium",
                "silicon",
                "phosphorus",
                "sulfur",
                "chlorine",
                "argon",
                "potassium",
                "calcium",
                "scandium",
                "titanium",
                "vanadium",
                "chromium",
                "manganese",
                "iron",
                "cobalt",
                "nickel",
                "copper",
                "zinc",
                "gallium",
                "germanium",
                "arsenic",
                "selenium",
                "bromine",
                "krypton",
                "rubidium",
                "strontium",
                "yttrium",
                "zirconium",
                "niobium",
                "molybdenum",
                "technetium",
                "ruthenium",
                "rhodium",
                "palladium",
                "silver",
                "cadmium",
                "indium",
                "tin",
                "antimony",
                "tellurium",
                "iodine",
                "xenon",
                "cesium",
                "barium",
                "lanthanum",
                "cerium",
                "praseodymium",
                "neodymium",
                "promethium",
                "samarium",
                "europium",
                "gadolinium",
                "terbium",
                "dysprosium",
                "holmium",
                "erbium",
                "thulium",
                "ytterbium",
                "lutetium",
                "hafnium",
                "tantalum",
                "tungsten",
                "rhenium",
                "osmium",
                "iridium",
                "platinum",
                "gold",
                "mercury",
                "thallium",
                "lead",
                "bismuth",
                "polonium",
                "astatine",
                "radon",
                "francium",
                "radium",
                "actinium",
                "thorium",
                "protactinium",
                "uranium",
                "neptunium",
                "plutonium",
                "americium",
                "curium",
                "berkelium",
                "californium",
                "einsteinium",
                "fermium",
                "mendelevium",
                "nobelium",
                "lawrencium",
                "rutherfordium",
                "dubnium",
                "seaborgium",
                "bohrium",
                "hassium",
                "meitnerium",
                "darmstadtium",
                "roentgenium",
                "copernicium",
                "nihonium",
                "flerovium",
                "moscovium",
                "livermorium",
                "tennessine",
                "oganesson",
                "ununennium"
            ]

            return ELEMENTS.includes(word);
        }
    },
    {
        id: 31,
        name: "GOLD GOLD GOLD",
        desc: "is gold",
        icon: "🔪",
        probability: 0.002,
        score: 999999,

        applicable: (word: string) => word === "gold",
    },
    {
        id: 32,
        name: "alternator",
        desc: "the letters alternate from being consonants and vowels (and vice versa)",
        icon: "🔃",
        probability: 9.75,
        score: 9990,

        applicable: (word: string) => {
            const vowels = "aeiou";
            let isVowel = vowels.includes(word[0]);
            
            if (word.length === 1) return true;
            
            for (let i = 1; i < word.length; i++) {
                const curr = vowels.includes(word[i]);

                if (isVowel === curr) return false;
                isVowel = curr;
            }

            return true;
        }
    },
    {
        id: 33,
        name: "voweler",
        desc: "there are more vowels than consonants",
        icon: "🎚️",
        probability: 4.77,
        score: 13400,

        applicable: (word: string) => {
            const vowels = "aeiou";
            let vc = 0, cc = 0;

            for (let i = 0; i < word.length; i++) {
                if (vowels.includes(word[i])) vc++;
                else if (/^[A-Za-z]+$/.test(word[i])) cc++;
            }

            return vc > cc;
        }
    },
    {
        id: 34,
        name: "inter-",
        desc: "contains the prefix 'inter'",
        icon: "👉",
        probability: 0.42,
        score: 100100,

        applicable: (word: string) => word.startsWith("inter"),
        highlight: (word: string) => ({
            [word[0]]: {},
            [word[1]]: {},
            [word[2]]: {},
            [word[3]]: {},
            [word[4]]: {}
        })
    },
    {
        id: 35,
        name: "ender",
        desc: "only contains letters from the second half of the alphabet",
        icon: "🌓",
        probability: 0.83,
        score: 83000,

        applicable: (word: string) => {
            const alpha = 'abcdefghijklm';

            for (let i = 0; i < word.length; i++) {
                if (alpha.includes(word[i])) return false;
            }

            return true;
        }
    },
    {
        id: 36,
        name: "two words",
        desc: "contains a space",
        icon: "👽",
        probability: 1.17,
        score: 67000,

        applicable: (word: string) => word.includes(" "),
        highlight: (word: string) => {
            return {
                [word.indexOf(" ")]: {}
            }
        }
    },
    {
        id: 37,
        name: "j",
        desc: "contains the letter j",
        icon: "🏢",
        probability: 1.3,
        score: 55060,
        
        applicable: (word: string) => word.includes("j"),
        highlight: (word: string) => {
            const highlights: Record<number, Highlight> = {};

            for (let i = 0; i < word.length; i++) {
                if (word[i] === "j") highlights[i] = {};
            }

            return highlights;
        }
    },
    {
        // NOTE: subject to change in probability
        id: 38,
        name: "meta",
        desc: "is the name of a property",
        icon: "💻",
        probability: 0.12,
        score: 131000,

        applicable: (word: string) => isPropertyName(word)
    },
    {
        id: 39,
        name: "bookends",
        desc: "starts and ends with the same character",
        icon: "📖",
        probability: 4.68,
        score: 12021,

        applicable: (word: string) => {
            const s = word[0], e = word[word.length - 1];

            return s === e;
        },

        highlight: (word: string) => ({
            [word[0]]: {},
            [word[word.length - 1]]: {}
        })
    },
    {
        id: 40,
        name: "mirrored",
        desc: "the second half of the word is the first half reversed",
        icon: "🪩",
        probability: 0.02,
        score: 360063,

        applicable: (word: string) => {
            const a = word.substring(0, word.length / 2);
            const b = word.substring(word.length / 2, word.length).split("").reverse().join("");
        
            return a === b;
        }
    },
    {
        id: 41,
        name: "coordinate",
        desc: "contains the letters x and y",
        icon: "📊",
        probability: 0.4,
        score: 106700,

        applicable: (word: string) => word.includes("x") && word.includes("y"),
        highlight: (word: string) => ({
            [word.indexOf("x")]: {},
            [word.indexOf("y")]: {}
        })
    },
    {
        id: 42,
        name: "flat",
        desc: "contains 4 or less unique characters",
        icon: "🫓",
        probability: 14.85,
        score: 3560,

        applicable: (word: string) => {
            let seen: Set<string> = new Set<string>();

            for (let i = 0; i < word.length; i++) {
                if (!seen.has(word[i])) seen.add(word[i]);
            }

            return seen.size <= 4;
        }
    },
    {
        id: 43,
        name: "medley",
        desc: "contains 10 or more unique characters",
        icon: "🥗",
        probability: 7.3,
        score: 6000,

        applicable: (word: string) => {
            let seen: Set<string> = new Set<string>();

            for (let i = 0; i < word.length; i++) {
                if (!seen.has(word[i])) seen.add(word[i]);
            }

            return seen.size >= 8;
        }
    },
    {
        id: 44,
        name: "numerical prefix",
        desc: "contains a numerical prefix",
        icon: "1️⃣",
        probability: 1.2,
        score: 57000,

        applicable: (word: string) => {
            const PREFIXES: string[] = [
                "uni",
                "bi",
                "tri",
                "quadri",
                "quinque",
                "sex",
                "octo",
                "nona",
                "decem"
            ];

            for (const pre of PREFIXES) {
                if (word.startsWith(pre)) return true;
            }

            return false;
        },

        highlight: (word: string) => {
            const highlights: Record<number, Highlight> = {};
            const PREFIXES: string[] = [
                "uni",
                "bi",
                "tri",
                "quadri",
                "quinque",
                "sex",
                "octo",
                "nona",
                "decem"
            ];

            for (const pre of PREFIXES) {
                if (word.startsWith(pre)) {
                    for (let i = 0; i < pre.length; i++)
                        highlights[i] = {};
                }
            }

            return highlights;
        }
    },
    {
        id: 45,
        name: "consonanter",
        desc: "contains more consonants than vowels",
        icon: "🧶",
        probability: 80.25,
        score: 500,

        applicable: (word: string) => {
            const consonants = "bcdfghjklmnpqrstvwxyz";
            let ccount = 0, vcount = 0;
        
            for (let i = 0; i < word.length; i++) {
                if (consonants.includes(word[i])) ccount++;
                else vcount++;
            }

            return ccount > vcount;
        }
    },
    {
        id: 46,
        name: "balanced",
        desc: "contains an equal amount of vowels and consonants",
        icon: "🟰",
        probability: 14.28,
        score: 4060,
        
        applicable: (word: string) => {
            const consonants = "bcdfghjklmnpqrstvwxyz";
            const vowels = "aeiou";
            let ccount = 0, vcount = 0;

            for (let i = 0; i < word.length; i++) {
                if (consonants.includes(word[i])) {
                    ccount++;
                } else if (vowels.includes(word[i])) {
                    vcount++;
                }
            }

            return ccount === vcount;
        }
    },
    {
        id: 47,
        name: "3D",
        desc: "contains x, y and z, or three of the letter D.",
        icon: "📦",
        probability: 0.16,
        score: 109000,

        applicable: (word: string) => {
            const xyz = word.includes("x") && word.includes("y") && word.includes("z");

            let dcount = 0;
            for (let i = 0; i < word.length; i++) {
                if (word[i] === "d") dcount++;
            }

            return xyz || dcount === 3;
        },

        highlight: (word: string) => {
            const xyz = word.includes("x") && word.includes("y") && word.includes("z");

            let dcount = 0;
            for (let i = 0; i < word.length; i++) {
                if (word[i] === "d") dcount++;
            }

            if (xyz) {
                return {
                    [word.indexOf("x")]: {},
                    [word.indexOf("y")]: {},
                    [word.indexOf("z")]: {}
                }
            } else {
                const highlights: Record<number, Highlight> = {};
                const char = "d";
                let indices: number[] = [];
                let index = word.indexOf(char);
  
                while (index !== -1) {
                    indices.push(index);
                    index = word.indexOf(char, index + 1); // Start next search after current match
                }

                for (let i = 0; i < indices.length; i++) {
                    highlights[indices[i]] = {};
                }

                return highlights;
            }
        }
    },
    {
        id: 48,
        name: "past",
        desc: "contains the suffix '-ed'",
        icon: "🫛",
        probability: 5.7,
        score: 8000,

        applicable: (word: string) => word.endsWith("ed"),
    },
    {
        id: 49,
        name: "repetitive",
        desc: "contains 4 or more of the same character",
        icon: "🔂",
        probability: 1.3,
        score: 55067,

        applicable: (word: string) => /([a-z])(?=(?:.*?\1){3})/.test(word),
        highlight: (word: string) => {
            const positions: Record<string, number[]> = {};

            for (let i = 0; i < word.length; i++) {
                const char = word[i];

                if (!positions[char]) {
                    positions[char] = [];
                }

                positions[char].push(i);
            }

            let result: number[] = [];
            let maxCount = 0;

            for (const char in positions) {
                const indices = positions[char];

                if (indices.length > maxCount) {
                    maxCount = indices.length;
                    result = indices;
                }
            }

            const highlights: Record<number, Highlight> = {};
            for (let i = 0; i < result.length; i++) {
                highlights[result[i]] = {};
            }

            return highlights;
        }
    },
    {
        id: 50,
        name: "snake",
        desc: "contains 3 or more of the letter s",
        icon: "🐍",
        probability: 0.16,
        score: 109999,

        applicable: (word: string) => /(s)(?=(?:.*?\1){3})/.test(word),
        highlight: (word: string) => {
            const char = "s";
            const indices: number[] = [];
            let index = word.indexOf(char);
            
            while (index !== -1) {
                indices.push(index);
                index = word.indexOf(char, index + 1);
            }

            const highlights: Record<number, Highlight> = {};
            for (let i = 0; i < indices.length; i++) {
                highlights[indices[i]] = {};
            }

            return highlights;
        }
    },
    {
        id: 51,
        name: "double hockey sticks",
        desc: "contains two adjacent letters (l)",
        icon: "👿",
        probability: 4.1,
        score: 14300,

        applicable: (word: string) => word.includes("ll"),
        highlight: (word: string) => ({
            [word.indexOf("ll")]: {},
            [word.indexOf("ll") + 1]: {}
        })
    },
    {
        id: 52,
        name: "study",
        desc: "contains the suffix '-ology'",
        icon: "📕",
        probability: 0.21,
        score: 100000,

        applicable: (word: string) => word.endsWith("ology"),
        highlight: (word: string) => {
            const highlights: Record<number, Highlight> = {};
            const w = "ology";
            for (let i = 0; i < w.length; i++) {
                highlights[word.length - i - 1] = {};   
            }
            return highlights;
        }
    },
    {
        id: 53,
        name: "colorful",
        desc: "contains a primary or secondary color as a substring",
        icon: "🟪",
        probability: 1,
        score: 70001,

        applicable: (word: string) => {
            const COLORS = [
                "red",
                "yellow",
                "green",
                "blue",
                "orange",
                "purple"
            ]

            for (const c of COLORS) {
                if (word.includes(c)) return true;
            }

            return false;
        },

        highlight: (word: string) => {
            const COLORS = [
                "red",
                "yellow",
                "green",
                "blue",
                "orange",
                "purple"
            ]

            let col = "red";
            for (const c of COLORS) {
                if (word.includes(c)) col = c;
            }

            const highlights: Record<number, Highlight> = {};
            const index = word.indexOf(col);
            for (let i = index; i < col.length; i++) {
                highlights[i] = {};
            }
            return highlights;
        }

    }
    
]


function isPropertyName(name: string) {
    const pnames = PROPERTIES.map(p => p.name);
    return pnames.includes(name);
}