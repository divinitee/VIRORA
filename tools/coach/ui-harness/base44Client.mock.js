const WORDS = [
  { id: "v1", english: "apple", uzbek: "olma", russian: "яблоко", cefr: "A2", def_a2: "a round fruit with red or green skin", example_en: "I eat an apple every morning." },
  { id: "v2", english: "bread", uzbek: "non", russian: "хлеб", cefr: "A2", def_a2: "a food made from flour and baked", example_en: "We bought fresh bread at the shop." },
  // VT-40 5c/5d: like the real corpus (english_definition + example_en on all 2,282 rows), every
  // mock word has an English definition; v3-v6 have no def_a2, so A2 learners fall back to english_definition.
  { id: "v3", english: "river", uzbek: "daryo", russian: "река", cefr: "A2", def_a2: "a long line of water that flows to the sea", english_definition: "a natural stream of water flowing to the sea", example_en: "We swam in the river." },
  { id: "v4", english: "house", uzbek: "uy", russian: "дом", cefr: "A2", def_a2: "a building where a family lives", english_definition: "a building for people to live in", example_en: "Their house has a red door." },
  { id: "v5", english: "book", uzbek: "kitob", russian: "книга", cefr: "A2", def_a2: "pages with words that you read", english_definition: "a set of printed pages to read", example_en: "She reads a book every week." },
  { id: "v6", english: "water", uzbek: "suv", russian: "вода", cefr: "A2", def_a2: "the clear liquid that you drink", english_definition: "the clear liquid in rivers, lakes and rain", example_en: "Drink some water after running." },
];
const match = (w, q) => Object.entries(q || {}).every(([k, v]) => (v && v.$in ? v.$in.includes(w[k]) : w[k] === v));
export const base44 = { entities: { VocabularyWord: { filter: async (q, _s, limit = 50) => WORDS.filter((w) => match(w, q)).slice(0, limit), list: async () => WORDS } } };
