// ISO 639-1 language codes
// https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes
export const Lang = Object.freeze({
  English: Symbol("en"),
  Slovak: Symbol("sk"),
  Latin: Symbol("la"),
});


export const Category = Object.freeze({
  All: Symbol("all"),
  Basic: Symbol("basic"),
  Rosary: Symbol("rosary"),
  Litany: Symbol("litany"),
  Saints: Symbol("saints"),
});


export const Prayer = Object.freeze({
  OurFather: 1,
  HailMary: 2,
  GloryBe: 3,
  ApostlesCreed: 4,
  HailHolyQueen: 5,
  FatimaPrayer: 6,
  Memorare: 7,
  GuardianAngelPrayer: 8,
  StMichaelPrayer: 9,
  NiceneCreed: 10,
  RosaryJoyful: 11,
  RosaryLuminous: 12,
  RosarySorrowful: 13,
  RosaryGlorious: 14,
  LitanyHolySpirit: 15,
  Angelus: 16,
  ReginaCaeli: 17,
  EternalRest: 18,
  WeFlyToThyProtection: 19,
  StJosephHusband: 20,
  StJosephWife: 21,
  TenCommandments: 22,
  SixChiefTruths: 23,
});

export const Categories = Object.freeze({
  [Category.Basic]: [
    Prayer.OurFather, Prayer.HailMary, Prayer.GloryBe, Prayer.ApostlesCreed,
    Prayer.HailHolyQueen, Prayer.Memorare, Prayer.GuardianAngelPrayer,
    Prayer.StMichaelPrayer, Prayer.NiceneCreed, Prayer.WeFlyToThyProtection, Prayer.EternalRest,
    Prayer.Angelus, Prayer.ReginaCaeli, Prayer.SixChiefTruths, Prayer.TenCommandments,
  ],
  [Category.Rosary]: [
    Prayer.RosaryJoyful, Prayer.RosaryLuminous, Prayer.RosarySorrowful, Prayer.RosaryGlorious,
    Prayer.FatimaPrayer,
  ],
  [Category.Litany]: [Prayer.LitanyHolySpirit],
  [Category.Saints]: [
    Prayer.StMichaelPrayer, Prayer.StJosephHusband, Prayer.StJosephWife, Prayer.GuardianAngelPrayer
  ],
});

// find all prayers in a category
// find different versions of the same prayer
// find the same prayer in different languages

