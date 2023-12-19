const prayers = [
  {
    "category": "basic",
    "title": "Our Father",
    "content": `
<p>
Our Father, Who art in heaven,<br> 
Hallowed be Thy Name.<br>
Thy Kingdom come.<br>
Thy Will be done,<br>
on earth as it is in Heaven.
</p>
<p>
Give us this day our daily bread.<br>
And forgive us our trespasses,<br>
as we forgive those who trespass against us.<br>
And lead us not into temptation,<br>
but deliver us from evil. Amen.
</p>`
  },
  {
    "category": "basic",
    "title": "Hail Mary",
    "content": `
<p>
Hail Mary, full of grace,<br>
The Lord is with thee.<br>
Blessed art thou amongst women,<br>
And blessed is the fruit of thy womb, Jesus.<br>
Holy Mary, Mother of God,<br>
Pray for us sinners,<br>
Now and at the hour of our death. Amen.
</p>`
  },
  {
    "category": "rosary",
    "title": "Joyful Mysteries",
    "content": `
<ol class="list-decimal list-inside">
  <li>
    <strong>The Annunciation.</strong>
    Fruit of the Mystery: Humility</li>
  <li>
    <strong>The Visitation.</strong>
    Fruit of the Mystery: Love of Neighbour
  </li>
  <li>
    <strong>The Birth of Jesus.</strong>
    Fruit of the Mystery: Poverty, Detachment from the things of the world, Contempt of Riches, Love of the Poor</li>
  <li>
    <strong>The Presentation of Jesus at the Temple.</strong>
    Fruit of the Mystery: Gift of Wisdom and Purity of mind and body (Obedience)
  </li>
  <li>
    <strong>The Finding of Jesus in the Temple.</strong>
    Fruit of the Mystery: True Conversion (Piety, Joy of Finding Jesus)
  </li>
</ol>`
  },
  {
    "category": "rosary",
    "title": "Luminous Mysteries",
    "content": `
<ol class="list-decimal list-inside">
  <li>
    <strong>The Baptism of Jesus in the Jordan.</strong>
    Fruit of the Mystery: Openness to the Holy Spirit, the Healer.
  </li>
  <li>
    <strong>The Wedding at Cana.</strong>
    Fruit of the Mystery: To Jesus through Mary, Understanding of the ability to manifest-through faith.
  </li>
  <li>
    <strong>Jesus' Proclamation of the Kingdom of God.</strong>
    Fruit of the Mystery: Trust in God (Call of Conversion to God)
  </li>
  <li>
    <strong>The Transfiguration.</strong>
    Fruit of the Mystery: Desire for Holiness.
  </li>
  <li>
    <strong>The Institution of the Eucharist.</strong>
    Fruit of the Mystery: Adoration.
  </li>
</ol>`
  },
  {
    "category": "rosary",
    "title": "Sorrowful Mysteries",
    "content": `
<ol class="list-decimal list-inside">
  <li>
    <strong>The Agony in the Garden.</strong>
    Fruit of the Mystery: Sorrow for Sin, Uniformity with the Will of God
  </li>
  <li>
    <strong>The Scourging at the Pillar.</strong>
    Fruit of the Mystery: Mortification (Purity)
  </li>
  <li>
    <strong>The Crowning with Thorns.</strong>
    Fruit of the Mystery: Contempt of the World (Moral Courage)
  </li>
  <li>
    <strong>The Carrying of the Cross.</strong>
    Fruit of the Mystery: Patience
  </li>
  <li>
    <strong>The Crucifixion and Death of our Lord.</strong>
    Fruit of the Mystery: Perseverance in Faith, Grace for a Holy Death, Forgiveness.
  </li>
</ol>`
  },
  {
    "category": "rosary",
    "title": "Glorious Mysteries",
    "content": `
<ol class="list-decimal list-inside">
  <li>
    <strong>The Resurrection.</strong>
    Fruit of the Mystery: Faith
  </li>
  <li>
    <strong>The Ascension.</strong>
    Fruit of the Mystery: Hope, Desire to Ascend to Heaven
  </li>
  <li>
    <strong>The Descent of the Holy Spirit.</strong>
    Fruit of the Mystery: Love of God, Holy Wisdom to know the truth and share it with everyone, Divine Charity, Worship of the Holy Spirit
  </li>
  <li>
    <strong>The Assumption of Mary.</strong>
    Fruit of the Mystery: Union with Mary and True Devotion to Mary
  </li>
  <li>
    <strong>The Coronation of the Virgin.</strong>
    Fruit of the Mystery: Perseverance and an Increase in Virtue (Trust in Mary's Intercession)
  </li>
</ol>`
  },
  {
    "category": "litany",
    "title": "Litany to the Holy Spirit",
    "content": `
<p class="whitespace-pre-line">Lord, have mercy on us.
Lord, have mercy on us.
Lord, have mercy on us.

God the Father of Heaven,
Have mercy on us.

God the Son, Redeemer of the world,
Have mercy on us.

God the Holy Spirit,
Have mercy on us.

Holy Trinity, One God,
Have mercy on us.

Divine Essence, one true God,
Have mercy on us

Spirit of truth and wisdom,
Have mercy on us

Spirit of holiness and justice, 
Have mercy on us

Spirit of understanding and counsel,
Have mercy on us

Spirit of love and joy,
Have mercy on us

Spirit of peace and patience,
Have mercy on us

Spirit of longanimity and meekness,
Have mercy on us

Spirit of benignity and goodness,
Have mercy on us

Love substantial of the Father and the Son,
Have mercy on us

Love and life of saintly souls,
Have mercy on us

Fire ever burning,
Have mercy on us

Living water to quench the thirst of hearts,
Have mercy on us

From all evil, 
Deliver us, O Holy Spirit.

From all impurity of soul and body, 
Deliver us, O Holy Spirit.

From all gluttony and sensuality, 
Deliver us, O Holy Spirit.

From all attachments to the things of the earth, 
Deliver us, O Holy Spirit.

From all hypocrisy and pretense, 
Deliver us, O Holy Spirit.

From all imperfections and deliberate faults, 
Deliver us, O Holy Spirit.

From our own will, 
Deliver us, O Holy Spirit.

From slander, 
Deliver us, O Holy Spirit.

From deceiving our neighbors, 
Deliver us, O Holy Spirit.

From our passions and disorderly appetites, 
Deliver us, O Holy Spirit.

From our inattentiveness to Thy holy inspirations, 
Deliver us, O Holy Spirit.

From despising little things, 
Deliver us, O Holy Spirit.

From debauchery and malice, 
Deliver us, O Holy Spirit.

From love of comfort and luxury, 
Deliver us, O Holy Spirit.

From wishing to seek or desire anything other than Thee, 
Deliver us, O Holy Spirit.

From everything that displeases Thee, 
Deliver us, O Holy Spirit.

Most loving Father,
forgive us.

Divine Word,
have pity on us.

Holy and divine Spirit,
leave us not until we are in possession of the Divine Essence, Heaven of heavens.

Lamb of God, Who takest away the sins of the world,
Send us the divine Consoler.

Lamb of God, Who takest away the sins of the world,
Fill us with the gifts of Thy Spirit.

Lamb of God, Who takest away the sins of the world,
Make the fruits of the Holy Spirit increase within us.

<strong>V.</strong> Come, O Holy Spirit, fill the hearts of Thy faithful,
<strong>R.</strong> And enkindle in them the fire of Thy love.
<strong>V.</strong> Send forth Thy Spirit and they shall be created,
<strong>R.</strong> And Thou shalt renew the face of the earth.

<strong>Let Us Pray</strong>
God, Who by the light of the Holy Spirit instructed the hearts of the faithful, grant us by the same Spirit to be truly wise and ever to rejoice in His consolation. Through Jesus Christ Our Lord, Amen.
</p>`
  },
]

// Add id so we can easily build urls
for (let i = 0; i < prayers.length; i++) {
  prayers[i]["id"] = i
}

const prayersEn = prayers

export default prayersEn
