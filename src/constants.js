// ISO 639-1 language codes
// https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes
export const Lang = {
  English: "en",
  French: "fr",
  Italian: "it",
  Latin: "la",
  Polish: "pl",
  Portuguese: "pt",
  Romanian: "ro",
  Slovak: "sk",
  Spanish: "es",
  Swahili: "sw"
};

// {"en": "English", "la": "Latin"}, the names shown on the home screen by language code
export const LanguageNames = Object.fromEntries(Object.entries(Lang).map(([name, code]) => [code, name]));
