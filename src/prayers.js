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
        "category": "basic",
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
        "category": "basic",
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
        "category": "basic",
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
    }
]

// Add id so we can easily build urls
for (let i = 0; i < prayers.length; i++) {
    prayers[i]["id"] = i
}

export default prayers
