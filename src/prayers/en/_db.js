import {Prayer} from "@/constants";
import ourFather from "@/prayers/en/ourFather";
import hailMary from "@/prayers/en/hailMary";
import rosaryJoyful from "@/prayers/en/rosaryJoyful";
import rosaryLuminous from "@/prayers/en/rosaryLuminous";
import rosarySorrowful from "@/prayers/en/rosarySorrowful";
import rosaryGlorious from "@/prayers/en/rosaryGlorious";
import litanyHolySpirit from "@/prayers/en/litanyHolySpirit";
import fatimaPrayer from "@/prayers/en/fatimaPrayer";
import apostlesCreed from "@/prayers/en/apostlesCreed";
import eternalRest from "@/prayers/en/eternalRest";
import angelus from "@/prayers/en/angelus";
import gloryBe from "@/prayers/en/gloryBe";
import guardianAngelPrayer from "@/prayers/en/guardianAngelPrayer";
import niceneCreed from "@/prayers/en/niceneCreed";
import reginaCaeli from "@/prayers/en/reginaCaeli";
import stMichaelPrayer from "@/prayers/en/stMichaelPrayer";
import tenCommandments from "@/prayers/en/tenCommandments";
import weFlyToThyProtection from "@/prayers/en/weFlyToThyProtection";


// prayerId: array of prayerVersions
export default {
  [Prayer.Angelus]: angelus,
  [Prayer.ApostlesCreed]: apostlesCreed,
  [Prayer.EternalRest]: eternalRest,
  [Prayer.FatimaPrayer]: fatimaPrayer,
  [Prayer.GloryBe]: gloryBe,
  [Prayer.GuardianAngelPrayer]: guardianAngelPrayer,
  [Prayer.HailMary]: hailMary,
  [Prayer.LitanyHolySpirit]: litanyHolySpirit,
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
