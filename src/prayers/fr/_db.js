import {Prayer} from "@/constants";
import ourFather from "@/prayers/fr/ourFather";
import hailMary from "@/prayers/fr/hailMary";
import rosaryJoyful from "@/prayers/fr/rosaryJoyful";
import rosaryLuminous from "@/prayers/fr/rosaryLuminous";
import rosarySorrowful from "@/prayers/fr/rosarySorrowful";
import rosaryGlorious from "@/prayers/fr/rosaryGlorious";
// import litanyHolySpirit from "@/prayers/fr/litanyHolySpirit";
import fatimaPrayer from "@/prayers/fr/fatimaPrayer";
import apostlesCreed from "@/prayers/fr/apostlesCreed";
import eternalRest from "@/prayers/fr/eternalRest";
import angelus from "@/prayers/fr/angelus";
import gloryBe from "@/prayers/fr/gloryBe";
import guardianAngelPrayer from "@/prayers/fr/guardianAngelPrayer";
import niceneCreed from "@/prayers/fr/niceneCreed";
import reginaCaeli from "@/prayers/fr/reginaCaeli";
import stMichaelPrayer from "@/prayers/fr/stMichaelPrayer";
import tenCommandments from "@/prayers/fr/tenCommandments";
import weFlyToThyProtection from "@/prayers/fr/weFlyToThyProtection";


// prayerId: array of prayerVersions
export default {
  [Prayer.Angelus]: angelus,
  [Prayer.ApostlesCreed]: apostlesCreed,
  [Prayer.EternalRest]: eternalRest,
  [Prayer.FatimaPrayer]: fatimaPrayer,
  [Prayer.GloryBe]: gloryBe,
  [Prayer.GuardianAngelPrayer]: guardianAngelPrayer,
  [Prayer.HailMary]: hailMary,
  // [Prayer.LitanyHolySpirit]: litanyHolySpirit,
  [Prayer.NiceneCreed]: niceneCreed,
  [Prayer.OurFather]: ourFather,
  [Prayer.ReginaCaeli]: reginaCaeli,
  [Prayer.RosaryGlorious]: rosaryGlorious,
  [Prayer.RosaryJoyful]: rosaryJoyful,
  [Prayer.RosaryLuminous]: rosaryLuminous,
  [Prayer.RosarySorrowful]: rosarySorrowful,
  [Prayer.StMichaelPrayer]: stMichaelPrayer,
  [Prayer.TenCommandments]: tenCommandments,
  [Prayer.WeFlyToThyProtection]: weFlyToThyProtection,
}
