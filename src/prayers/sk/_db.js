import {Prayer} from "@/constants";
import ourFather from "@/prayers/sk/ourFather";
import hailMary from "@/prayers/sk/hailMary";
import rosaryJoyful from "@/prayers/sk/rosaryJoyful";
import rosaryLuminous from "@/prayers/sk/rosaryLuminous";
import rosarySorrowful from "@/prayers/sk/rosarySorrowful";
import rosaryGlorious from "@/prayers/sk/rosaryGlorious";
import litanyHolySpirit from "@/prayers/sk/litanyHolySpirit";
import angelus from "@/prayers/sk/angelus";
import apostlesCreed from "@/prayers/sk/apostlesCreed";
import eternalRest from "@/prayers/sk/eternalRest";
import fatimaPrayer from "@/prayers/sk/fatimaPrayer";
import gloryBe from "@/prayers/sk/gloryBe";
import guardianAngelPrayer from "@/prayers/sk/guardianAngelPrayer";
import niceneCreed from "@/prayers/sk/niceneCreed";
import reginaCaeli from "@/prayers/sk/reginaCaeli";
import stJosephHusband from "@/prayers/sk/stJosephHusband";
import stJosephWife from "@/prayers/sk/stJosephWife";
import stMichaelPrayer from "@/prayers/sk/stMichaelPrayer";
import weFlyToThyProtection from "@/prayers/sk/weFlyToThyProtection";
import sixChiefTruths from "@/prayers/sk/sixChiefTruths";
import tenCommandments from "@/prayers/sk/tenCommandments";


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
  [Prayer.SixChiefTruths]: sixChiefTruths,
  [Prayer.StJosephHusband]: stJosephHusband,
  [Prayer.StJosephWife]: stJosephWife,
  [Prayer.StMichaelPrayer]: stMichaelPrayer,
  [Prayer.TenCommandments]: tenCommandments,
  [Prayer.WeFlyToThyProtection]: weFlyToThyProtection,
}
