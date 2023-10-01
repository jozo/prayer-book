const prayers = [
    {
        "category": "rosary",
        "title": "Radostný ruženec",
        "content": `
<p>Modlí sa v pondelok a sobotu, v Adventnom období aj v iné dni.</p>
<ul class="list-disc list-inside">
  <li>ktorý nech rozmnožuje našu vieru.</li>
  <li>ktorý nech posilňuje našu nádej.</li>
  <li>ktorý nech roznecuje našu lásku.</li>
</ul>
<br>
<ol class="list-decimal list-inside">
  <li>ktorého si, Panna, z Ducha Svätého počala.</li>
  <li>ktorého si, Panna, pri návšteve Alžbety v živote nosila.</li>
  <li>ktorého si, Panna, v Betleheme porodila.</li>
  <li>ktorého si, Panna, so svätým Jozefom v chráme obetovala.</li>
  <li>ktorého si, Panna, so svätým Jozefom v chráme našla.</li>
</ol>`
    },
    {
        "category": "rosary",
        "title": "Bolestný ruženec",
        "content": `
<p>Modlí sa v utorok a piatok, v Pôstnom období aj v iné dni.</p>
<ul class="list-disc list-inside">
  <li>ktorý nech osvecuje náš rozum.</li>
  <li>ktorý nech upevňuje našu vôľu.</li>
  <li>ktorý nech posilňuje našu pamäť.</li>
</ul>
<br>
<ol class="list-decimal list-inside">
  <li>ktorý sa pre nás krvou potil.</li>
  <li>ktorý pre nás bičovaný bol.</li>
  <li>ktorý pre nás tŕním korunovaný bol.</li>
  <li>ktorý pre nás ťažký kríž niesol.</li>
  <li>ktorý pre nás ukrižovaný bol.</li>
</ol>`
    },
    {
        "category": "rosary",
        "title": "Slávnostný ruženec",
        "content": `
<p>Modlí sa v stredu a nedeľu, vo Veľkonočnom období aj v iné dni.</p>
<ul class="list-disc list-inside">
  <li>ktorý nech usporadúva naše myšlienky.</li>
  <li>ktorý nech riadi naše slová.</li>
  <li>ktorý nech spravuje naše skutky.</li>
</ul>
<br>
<ol class="list-decimal list-inside">
  <li>ktorý slávne vstal z mŕtvych.</li>
  <li>ktorý slávne vystúpil do neba.</li>
  <li>ktorý nám zoslal Ducha Svätého.</li>
  <li>ktorý ťa, Panna, do neba vzal.</li>
  <li>ktorý ťa, Panna, v nebi korunoval.</li>
</ol>`
    },
    {
        "category": "rosary",
        "title": "Ruženec svetla",
        "content": `
<p>Modlí sa v štvrtok.</p>
<ul class="list-disc list-inside">
  <li>ktorý nech je Svetlom nášho života.</li>
  <li>ktorý nech nás uzdravuje milosrdnou láskou.</li>
  <li>ktorý nech nás vezme k sebe do večnej slávy.</li>
</ul>
<br>
<ol class="list-decimal list-inside">
  <li>ktorý bol pokrstený v Jordáne a začal svoje verejne účinkovanie.</li>
  <li>ktorý zázrakom v Káne Galilejskej otvoril srdcia učeníkov pre vieru.</li>
  <li>ktorý ohlasoval Božie kráľovstvo a vyzýval ľud na pokánie.</li>
  <li>ktorý sa ukázal v božskej sláve na hore premenenia.</li>
  <li>ktorý nám dal seba za pokrm a nápoj v Oltárnej sviatosti.</li>
</ol>
<br>
<p>Skrátené tajomstvá ruženca svetla:</p>
<br>
<ol class="list-decimal list-inside">
  <li>ktorý bol pokrstený v Jordáne.</li>
  <li>ktorý zjavil seba samého na svadbe v Káne.</li>
  <li>ktorý ohlasoval Božie kráľovstvo a pokánie.</li>
  <li>ktorý sa premenil na vrchu Tábor.</li>
  <li>ktorý ustanovil Oltárnu sviatosť.</li>
</ol>`
    },
    {
        "category": "basic",
        "title": "Otčenáš",
        "content": `Otče náš, ktorý si na nebesiach,<br>
    posväť sa meno tvoje,<br>
    príď kráľovstvo tvoje,<br>
    buď vôľa tvoja ako v nebi, tak i na zemi.<br>
    Chlieb náš každodenný daj nám dnes<br>
    a odpusť nám naše viny,<br>
    ako i my odpúšťame svojim vinníkom,<br>
    a neuveď nás do pokušenia,<br>
    ale zbav nás Zlého. Amen.
    `
    },
    {
        "category": "basic",
        "title": "Zdravas’ Mária",
        "content": `Zdravasʼ, Mária milosti plná,<br>
Pán s tebou.<br>
Požehnaná si medzi ženami<br>
a požehnaný je plod života tvojho, Ježiš.<br>
Svätá Mária, Matka Božia,<br>
pros za nás hriešnych teraz<br>
i v hodinu smrti našej. Amen. 
    `
    },
    {
        "category": "saints",
        "title": "K sv. Michalovi archanjelovi",
        "content": `Sv. Michal archanjel, bráň nás v boji,<br>
buď nám ochrancom proti zlobe a úkladom diabla.<br>
Pokorne prosíme, nech mu Boh ukáže svoju moc.<br>
A ty, knieža nebeských zástupov,<br>
Božou mocou zažeň do pekla satana a iných zlých duchov,<br>
ktorí sa na skazu duší potulujú po svete.<br>
Amen.
    `
    },
    {
        "category": "saints",
        "title": "K sv. Jozefovi - za manžela",
        "content": `Svätý Jozef, ďakujem ti za to,<br>
že som sa ešte nevydala.<br>
Svätý Jozef, ty v Bohu vieš,<br>
kto má byť mojím manželom,<br>
pomôž mi ho stretnúť.<br>
Svätý Jozef daj, aby to bol dobrý manžel,<br>
ktorý ma bude milovať a vážiť si ma tak,<br>
ako si si ty vážil Pannu Máriu.<br>
Svätý Jozef daj, aby sa rozpadol môj vzťah, ak sa Bohu nepáči.<br>
Svätý Jozef, sľubujem ti, že si zachovám predmanželskú čistotu.<br>
Svätý Jozef, sľubujem ti, že budem iným ľuďom hovoriť,<br>
že takého dobrého manžela mám od teba.<br>
Amen.
    `
    },
    {
        "category": "saints",
        "title": "K sv. Jozefovi - za manželku",
        "content": `Svätý Jozef, ďakujem ti za to,<br>
že som sa ešte neoženil.<br>
Svätý Jozef, ty v Bohu vieš,<br>
kto má byť mojou manželkou,<br>
pomôž mi ju stretnúť.<br>
Svätý Jozef daj, aby to bola dobrá manželka,<br>
ktorá ma bude milovať a vážiť si ma tak,<br>
ako si si ty vážil Pannu Máriu.<br>
Svätý Jozef daj, aby sa rozpadol môj vzťah, ak sa Bohu nepáči.<br>
Svätý Jozef, sľubujem ti, že si zachovám predmanželskú čistotu.<br>
Svätý Jozef, sľubujem ti, že budem iným ľuďom hovoriť,<br>
že takú dobrú manželku mám od teba.<br>
Amen.
    `
    },
    {
        "category": "basic",
        "title": "Desatoro",
        "content": `
    <ol class="list-decimal list-inside">
        <li>Ja som Pán Boh tvoj. Nebudeš mať iných bohov okrem mňa, ktorým by si sa klaňal.</li>
        <li>Nevezmeš meno Božie nadarmo.</li>
        <li>Pamätaj, že máš svätiť sviatočné dni.</li>
        <li>Cti otca svojho i matku svoju.</li>
        <li>Nezabiješ.</li>
        <li>Nezosmilníš.</li>
        <li>Nepokradneš.</li>
        <li>Nebudeš krivo svedčiť proti svojmu blížnemu.</li>
        <li>Nebudeš žiadostivo túžiť po manželke svojho blížneho.</li>
        <li>Nebudeš túžiť po majetku svojho blížneho.</li>
    </ol>
    `
    },
    {
        "category": "basic",
        "title": "Šesť hlavných právd",
        "content": `
    <ol class="list-decimal list-inside">
        <li>Boh je len jeden.</li>
        <li>V Bohu sú tri osoby: Otec, Syn a Duch Svätý.</li>
        <li>Syn Boží sa stal človekom, aby nás vykúpil.</li>
        <li>Boh je spravodlivý sudca, ktorý dobrých odmeňuje a zlých tresce.</li>
        <li>Duša človeka je nesmrteľná.</li>
        <li>Milosť Božia je na spásu potrebná.</li>
    </ol>
    `
    },
    {
        "category": "litany",
        "title": "Litánie k Duchu Svätému",
        "content": `
<p class="whitespace-pre-line">Sláva Otcu i Synu i Duchu Svätému…

BUĎ ZVELEBENÝ! (opakuje sa za každou prosbou)


Duchu Svätý, zostúp z trónu svojej velebnosti a vybuduj si stánok v srdci svojho služobníka!

Duchu Svätý, ktorý si Otcom i Synom uctievaný, nauč ma žiť v stálej prítomnosti Božej!

Duchu Svätý, ktorý si Otcom i Synom uctievaný, nauč ma žiť podľa vôle Najvyššieho!

Duchu Svätý, ktorý sídliš v srdci Božieho Syna, nauč ma poznávať Ťa a úprimne milovať!

Duchu Svätý, ktorý sa staráš o slávu Boha Otca, nauč ma žiť v odovzdanosti a v úplnej dôvere v Boha!

Duchu Svätý, znamenie ohnivých jazykov, zapáľ v mojom srdci oheň svojej lásky!

Duchu Svätý, tajomná holubica, nauč ma chápať Sväté písmo!

Duchu Svätý, ktorý nemáš tvár ani meno, nauč ma správne sa modliť!

Duchu Svätý, ktorý hovoríš ústami prorokov, nauč ma žiť v pokoji a vo vyrovnanosti ducha – duše!

Duchu Svätý, horiace ohnisko lásky, nauč ma žiť múdro a trpezlivo!

Duchu Svätý, darca všetkých darov, nauč ma žiť v pokore a skromnosti!

Duchu Svätý, pretekajúca pokladnica milosti, nauč ma chápať cenu utrpenia!

Duchu Svätý, bezodná pokladnica milosti, nauč ma správne využívať drahocenný čas!

Duchu Svätý, z pokladnice ktorého neubúda, chráň ma od každej nelásky a pýchy!

Duchu Svätý, ktorého bohatstvo nikto nespočíta, nauč ma čeliť zbytočným predstavám a myšlienkam!

Duchu Svätý, premnohých darov, nauč ma vyhýbať sa neužitočnej činnosti a planým rečiam!

Duchu Svätý, z ktorého plnosti sme všetci prijali, nauč ma mlčať a prehovoriť v pravý čas!

Duchu Svätý, láska večná, nauč ma dávať dobrý príklad iným!

Duchu Svätý, dobrota nekonečná, daj mi vytrvalosť v dobrom!

Duchu Svätý, sladký učiteľ, nauč ma správne zaobchádzať s ľuďmi!

Duchu Svätý, milý priateľ duší, nauč ma nikoho neposudzovať a na krivdy nikdy nespomínať!

Duchu Svätý, obšťastňujúce Svetlo duše, nauč ma vidieť potreby iných a nezanedbávať dobré skutky!

Duchu Svätý, Otče úbohých, daj mi poznať svoje chyby!

Duchu Svätý, ktorý konáš v dušiach zázraky, veď ma bdelosťou k dokonalosti!

Duchu Svätý, pred ktorým nič nie je utajené, nauč ma unikať osídlam diablovým!

Duchu Svätý, ktorý poznáš budúcnosť vesmíru, pomôž mi vymaniť sa z područia tela a diabla!

Duchu Svätý, ktorý poznáš i moju budúcnosť, zverujem do Tvojej ochrany i moju rodinu, priateľov, dobrodincov a všetkých ľudí!


Duchu Svätý, s Tvojou Božskou pomocou nauč ma žiť na česť a slávu Božiu, k spáse duší a k radosti Matke Božej, aby som mohol umrieť ako užitočný sluha. Amen.</p>
    `
    },
    {
        "category": "basic",
        "title": "Sláva Otcu",
        "content": `
    Sláva Otcu i Synu i Duchu Svätému;<br>
ako bolo na počiatku, tak nech je i teraz, 
i vždycky, i na veky vekov.<br>
Amen.
    `
    },
    {
        "category": "basic",
        "title": "Apoštolské vyznanie viery",
        "content": `
    Verím v Boha,
Otca všemohúceho,
Stvoriteľa neba i zeme,
i v Ježiša Krista,
jeho jediného Syna, nášho Pána,
ktorý sa počal z Ducha Svätého,
narodil sa z Márie Panny,
trpel za vlády Poncia Piláta,
bol ukrižovaný, umrel a bol pochovaný.
Zostúpil k zosnulým,
tretieho dňa vstal z mŕtvych,
vystúpil na nebesia,
sedí po pravici Boha Otca všemohúceho.
Odtiaľ príde súdiť živých i mŕtvych.
Verím v Ducha Svätého,
v svätú Cirkev katolícku,
v spoločenstvo svätých,
v odpustenie hriechov,
vo vzkriesenie tela
a v život večný.<br>
Amen.
    `
    },
    {
        "category": "basic",
        "title": "Nicejsko-carihradské vyznanie viery",
        "content": `
Verím v jedného Boha,
Otca všemohúceho,
Stvoriteľa neba i zeme,
sveta viditeľného i neviditeľného.
Verím v jedného Pána Ježiša Krista,
jednorodeného Syna Božieho,
zrodeného z Otca pred všetkými vekmi;
Boha z Boha, Svetlo zo Svetla,
pravého Boha z Boha pravého,
splodeného, nie stvoreného,
jednej podstaty s Otcom.
Skrze neho bolo všetko stvorené.
On pre nás ľudí a pre našu spásu
zostúpil z nebies.
A mocou Ducha Svätého
vzal si telo z Márie Panny
a stal sa človekom.
Za nás bol aj ukrižovaný
za vlády Poncia Piláta,
bol umučený a pochovaný,
ale tretieho dňa vstal z mŕtvych
podľa Svätého písma.
A vystúpil do neba,
sedí po pravici Otca.
<br>
A zasa príde v sláve
súdiť živých i mŕtvych
a jeho kráľovstvu nebude konca.
Verím v Ducha Svätého,
Pána a Oživovateľa,
ktorý vychádza z Otca i Syna.
Jemu sa zároveň vzdáva
tá istá poklona a sláva
ako Otcovi a Synovi.
On hovoril ústami prorokov.
Verím v jednu, svätú,
katolícku, apoštolskú Cirkev.
Vyznávam jeden krst
na odpustenie hriechov
a očakávam vzkriesenie mŕtvych
a život budúceho veku.<br>
Amen.
    `
    },
    {
        "category": "basic",
        "title": "Fatimská modlitba – Ó, Ježišu",
        "content": `
Ó, Ježišu, odpusť nám naše hriechy,
zachráň nás od pekelného ohňa
a priveď do neba všetky duše, najmä tie,
ktoré najviac potrebujú tvoje milosrdenstvo.
    `
    },
    {
        "category": "basic",
        "title": "K anjelovi strážnemu",
        "content": `
Anjel Boží, strážca môj,<br>
prosím ťa, vždy pri mne stoj.<br>
Pomocnú mi ruku daj,<br>
vo všetkom mi pomáhaj,<br>
aby som vždy v každej chvíli<br>
viedol/-dla život Bohu milý,<br>
a tak tebou chránený/-á<br>
bol/-a raz v nebi spasený/-á.<br>
Amen.
    `
    },
    {
        "category": "basic",
        "title": "Anjel Pána",
        "content": `
V: Anjel Pána zvestoval Panne Márii.<br>
R: A ona počala z Ducha Svätého.<br>
<em>Zdravas’, Mária.</em>
<br><br>
V: Hľa, služobnica Pána.<br>
R: Nech sa mi stane podľa tvojho slova.<br>
<em>Zdravas’, Mária.</em>
<br><br>
V: A Slovo sa telom stalo.<br>
R: A prebývalo medzi nami.<br>
<em>Zdravas’, Mária.</em>
<br><br>
V: Oroduj za nás, svätá Božia Rodička.<br>
R: Aby sme sa stali hodni Kristových prisľúbení.
<br><br>
Modlime sa:
<br>
Bože, z anjelovho zvestovania vieme, že tvoj Syn Ježiš
Kristus sa stal človekom; prosíme ťa, vlej nám do duše
svoju milosť, aby nás jeho umučenie a kríž priviedli
k slávnemu vzkrieseniu. Skrze Krista, nášho Pána.
<br>
Amen.
    `
    },
    {
        "category": "basic",
        "title": "Raduj sa, nebies Kráľovná",
        "content": `
Raduj sa, nebies Kráľovná, aleluja.<br>
Lebo koho si nosila, aleluja,<br>
z mŕtvych vstal, jak predpovedal, aleluja.<br>
Pros, aby nás k sebe prijal, aleluja.<br>
<br>
V: Raduj sa a veseľ sa, Panna Mária, aleluja.<br>
R: Lebo Pán naozaj vstal z mŕtvych, aleluja.<br>
<br>
Modlime sa:<br>
Bože, ty si zmŕtvychvstaním tvojho Syna, nášho Pána
Ježiša Krista, potešil celý svet; prosíme ťa, daj, aby sme
na príhovor jeho Rodičky, Panny Márie, dosiahli radosti
večného života. Skrze Krista, nášho Pána.
<br>
Amen.
    `
    },
    {
        "category": "basic",
        "title": "Pod tvoju ochranu",
        "content": `
Pod tvoju ochranu sa utiekame,
svätá Božia Rodička,
neodvracaj zrak od našich prosieb,
pomôž nám v núdzi
a z každého nebezpečenstva nás vysloboď,
ty Panna slávna a požehnaná.
<br>
Amen.
    `
    },
    {
        "category": "basic",
        "title": "Odpočinutie večné",
        "content": `
Odpočinutie večné daj dušiam, Pane,
a svetlo večné nech im svieti.
Nech odpočívajú v pokoji.
<br>
Amen.
    `
    },
]

// Add id so we can easily build urls
for (let i = 0; i < prayers.length; i++) {
    prayers[i]["id"] = i
}

export default prayers
