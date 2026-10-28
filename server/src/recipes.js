// Recipe library. Quantities are for `serves` people, in the ingredient's unit
// (see ingredients.js). `hero` lists the ingredients that make a dish worth
// suggesting: if one of them is on offer in a chosen store, the dish shows up.

export const RECIPES = [
  {
    id: 'spaghetti-bolognese',
    title: 'Spaghetti bolognese',
    blurb: 'Langtidssimret kødsauce med gulerod og et drys parmesan.',
    minutes: 40, diet: 'kod', serves: 4, emoji: '🍝', hue: 14,
    hero: ['hakket_okse'],
    ingredients: [
      ['hakket_okse', 500], ['loeg', 1], ['hvidloeg', 2], ['gulerod', 2],
      ['hakkede_tomater', 800], ['tomatpure', 70], ['pasta', 500], ['parmesan', 40],
      ['olie', 15], ['oregano', 2], ['bouillon', 1], ['salt', 3], ['peber', 1]
    ],
    steps: [
      'Hak løg og hvidløg, riv gulerødderne.',
      'Brun kødet i olie, tilsæt løg, hvidløg og gulerod.',
      'Rør tomatpuré, hakkede tomater, bouillon og oregano i. Simr 25 min.',
      'Kog pastaen. Smag saucen til med salt og peber.',
      'Server med revet parmesan.'
    ]
  },
  {
    id: 'kylling-i-karry',
    title: 'Kylling i karry',
    blurb: 'Mild, cremet karry med peberfrugt over ris.',
    minutes: 30, diet: 'kod', serves: 4, emoji: '🍛', hue: 42,
    hero: ['kyllingebryst'],
    ingredients: [
      ['kyllingebryst', 600], ['loeg', 1], ['peberfrugt', 1], ['flode', 250], ['ris', 300],
      ['karry', 8], ['olie', 15], ['bouillon', 1], ['salt', 3], ['peber', 1]
    ],
    steps: [
      'Sæt risene over.',
      'Skær kylling i tern, løg og peberfrugt i strimler.',
      'Steg kyllingen gylden, tilsæt løg og karry og rist et minut.',
      'Hæld fløde og knust bouillon ved, og simr 10 min med peberfrugten.',
      'Smag til og server over ris.'
    ]
  },
  {
    id: 'ovnlaks-kartofler',
    title: 'Ovnlaks med kartofler og broccoli',
    blurb: 'Laks i ovnen med citron, sprøde kartofler og dildcreme.',
    minutes: 35, diet: 'fisk', serves: 4, emoji: '🐟', hue: 8,
    hero: ['laks'],
    ingredients: [
      ['laks', 500], ['kartofler', 1000], ['broccoli', 1], ['citron', 1],
      ['creme_fraiche', 200], ['krydderurter', 1], ['olie', 30], ['salt', 4], ['peber', 1]
    ],
    steps: [
      'Skær kartofler i både, vend i olie og salt, og bag 30 min ved 220°.',
      'Læg laksen i et fad med citronskiver de sidste 15 min.',
      'Damp broccolien 4 min.',
      'Rør creme fraiche med hakket dild og lidt citronsaft.',
      'Server det hele med dildcremen.'
    ]
  },
  {
    id: 'tacos',
    title: 'Fredagstacos',
    blurb: 'Tortillas med krydret oksekød og alt det friske på bordet.',
    minutes: 25, diet: 'kod', serves: 4, emoji: '🌮', hue: 30,
    hero: ['hakket_okse', 'tortillas'],
    ingredients: [
      ['hakket_okse', 500], ['tacokrydderi', 28], ['tortillas', 8], ['salat', 150],
      ['tomater', 300], ['agurk', 1], ['majs', 300], ['revet_ost', 150],
      ['creme_fraiche', 200], ['olie', 15]
    ],
    steps: [
      'Brun kødet, rør tacokrydderi og en skvæt vand i, og lad det simre 5 min.',
      'Snit salat, tomat og agurk. Hæld majsene fra.',
      'Lun tortillas på en tør pande.',
      'Sæt det hele på bordet, så alle kan bygge selv.'
    ]
  },
  {
    id: 'frikadeller',
    title: 'Frikadeller med kartofler og agurkesalat',
    blurb: 'Klassiske frikadeller, nye kartofler og syrlig agurk.',
    minutes: 45, diet: 'kod', serves: 4, emoji: '🧆', hue: 26,
    hero: ['hakket_grisekalv'],
    ingredients: [
      ['hakket_grisekalv', 500], ['aeg', 1], ['loeg', 1], ['maelk', 100], ['kartofler', 1000],
      ['agurk', 1], ['hvedemel', 40], ['smor', 30], ['eddike', 50], ['sukker', 30],
      ['salt', 5], ['peber', 1]
    ],
    steps: [
      'Rør fars med revet løg, æg, mel, mælk, salt og peber. Lad den hvile 15 min.',
      'Kog kartoflerne.',
      'Skær agurken tyndt og vend den i eddike, sukker og en knivspids salt.',
      'Form frikadeller med en ske og steg dem i smør, ca. 6 min på hver side.',
      'Server med kartofler og agurkesalat.'
    ]
  },
  {
    id: 'stegt-flaesk',
    title: 'Stegt flæsk med persillesovs',
    blurb: 'Danmarks nationalret – sprødt flæsk og en grøn sovs.',
    minutes: 40, diet: 'kod', serves: 4, emoji: '🥓', hue: 20,
    hero: ['flaesk'],
    ingredients: [
      ['flaesk', 800], ['kartofler', 1200], ['maelk', 500], ['krydderurter', 1],
      ['smor', 30], ['hvedemel', 30], ['salt', 4], ['peber', 1]
    ],
    steps: [
      'Kog kartoflerne.',
      'Steg flæsket sprødt på en pande eller i ovnen ved 200° i 25 min.',
      'Smelt smør, pisk mel i og spæd med mælk til en jævn sovs. Kog 5 min.',
      'Rør masser af hakket persille i og smag til.',
      'Server flæsk, kartofler og sovs.'
    ]
  },
  {
    id: 'koteletter-i-fad',
    title: 'Koteletter i fad',
    blurb: 'Koteletter i flødesauce med champignon og paprika.',
    minutes: 50, diet: 'kod', serves: 4, emoji: '🥩', hue: 18,
    hero: ['koteletter'],
    ingredients: [
      ['koteletter', 800], ['champignon', 250], ['flode', 250], ['loeg', 1], ['ris', 300],
      ['paprika', 5], ['olie', 15], ['bouillon', 1], ['salt', 3], ['peber', 1]
    ],
    steps: [
      'Brun koteletterne hurtigt på begge sider og læg dem i et fad.',
      'Steg løg og champignon, tilsæt paprika, fløde og bouillon.',
      'Hæld saucen over og bag 30 min ved 180°.',
      'Kog risene imens.'
    ]
  },
  {
    id: 'polsegryde',
    title: 'Pølsegryde',
    blurb: 'Børnenes favorit: pølser i tomatflødesauce med ris.',
    minutes: 25, diet: 'kod', serves: 4, emoji: '🌭', hue: 6,
    hero: ['polser'],
    ingredients: [
      ['polser', 500], ['loeg', 1], ['peberfrugt', 1], ['hakkede_tomater', 400],
      ['flode', 200], ['ris', 300], ['paprika', 5], ['olie', 15], ['salt', 2]
    ],
    steps: [
      'Sæt risene over.',
      'Skær pølser i skiver og steg dem med løg og peberfrugt.',
      'Tilsæt paprika, hakkede tomater og fløde. Simr 10 min.',
      'Server over ris.'
    ]
  },
  {
    id: 'medister-spidskaal',
    title: 'Medister med stuvet spidskål',
    blurb: 'Gammeldags hverdagsmad, der altid smager af mere.',
    minutes: 40, diet: 'kod', serves: 4, emoji: '🥬', hue: 90,
    hero: ['medister', 'hvidkaal'],
    ingredients: [
      ['medister', 600], ['kartofler', 1000], ['hvidkaal', 1], ['maelk', 400],
      ['smor', 30], ['hvedemel', 30], ['salt', 4], ['peber', 1]
    ],
    steps: [
      'Steg medisteren ved middel varme i ca. 20 min, vend den undervejs.',
      'Kog kartoflerne.',
      'Snit kålen og kog den 3 min. Hæld vandet fra.',
      'Lav en hvid sovs af smør, mel og mælk og vend kålen i. Smag til med salt og peber.'
    ]
  },
  {
    id: 'kyllingelaar-ovn',
    title: 'Kyllingelår i ovn med rodfrugter',
    blurb: 'Én bradepande, nul stress. Sprødt skind og søde gulerødder.',
    minutes: 55, diet: 'kod', serves: 4, emoji: '🍗', hue: 34,
    hero: ['kyllingelaar'],
    ingredients: [
      ['kyllingelaar', 1000], ['kartofler', 1000], ['gulerod', 4], ['loeg', 2], ['hvidloeg', 4],
      ['olie', 30], ['timian', 2], ['salt', 5], ['peber', 1]
    ],
    steps: [
      'Skær kartofler, gulerødder og løg i grove stykker.',
      'Vend grøntsagerne i olie, timian, salt og peber på en bradepande.',
      'Læg kyllingelårene ovenpå med hele hvidløgsfed.',
      'Bag 45 min ved 200°, til skindet er sprødt.'
    ]
  },
  {
    id: 'kylling-wok',
    title: 'Wok med kylling og nudler',
    blurb: 'Hurtig wok med ingefær, soja og knas.',
    minutes: 20, diet: 'kod', serves: 4, emoji: '🍜', hue: 40,
    hero: ['kyllingebryst', 'nudler', 'frost_gront'],
    ingredients: [
      ['kyllingebryst', 500], ['nudler', 250], ['frost_gront', 500], ['forarsloeg', 1],
      ['ingefaer', 20], ['hvidloeg', 2], ['soja', 60], ['honning', 15], ['olie', 30]
    ],
    steps: [
      'Kog nudlerne efter anvisningen.',
      'Skær kyllingen i strimler og steg den ved høj varme.',
      'Tilsæt revet ingefær, hvidløg og grøntsagerne. Wok 4 min.',
      'Vend nudler, soja og honning i. Top med forårsløg.'
    ]
  },
  {
    id: 'thai-karry',
    title: 'Rød thaikarry',
    blurb: 'Kokos, lime og varme. Klar på under en halv time.',
    minutes: 25, diet: 'kod', serves: 4, emoji: '🥘', hue: 2,
    hero: ['kyllingebryst', 'kokosmaelk'],
    ingredients: [
      ['kyllingebryst', 500], ['kokosmaelk', 400], ['karrypasta', 50], ['peberfrugt', 1],
      ['squash', 1], ['ris', 300], ['lime', 1], ['krydderurter', 1], ['olie', 15], ['soja', 15]
    ],
    steps: [
      'Sæt risene over.',
      'Rist karrypastaen i olie et minut, tilsæt kylling i tern.',
      'Hæld kokosmælk ved og tilsæt peberfrugt og squash. Simr 10 min.',
      'Smag til med soja og limesaft. Top med koriander.'
    ]
  },
  {
    id: 'torsk-persillesmor',
    title: 'Torsk med citron og grønne bønner',
    blurb: 'Let, hvid fisk stegt i smør med friske krydderurter.',
    minutes: 25, diet: 'fisk', serves: 4, emoji: '🐠', hue: 200,
    hero: ['hvid_fisk'],
    ingredients: [
      ['hvid_fisk', 600], ['kartofler', 1000], ['groenne_bonner', 300], ['citron', 1],
      ['krydderurter', 1], ['smor', 40], ['salt', 4], ['peber', 1]
    ],
    steps: [
      'Kog kartoflerne.',
      'Krydr fisken med salt og peber og steg den i smør 3 min på hver side.',
      'Kog bønnerne 3 min.',
      'Rør hakkede krydderurter og citronskal i resten af smørret og hæld over fisken.'
    ]
  },
  {
    id: 'fiskepinde',
    title: 'Fiskepinde med kartoffelbåde',
    blurb: 'Sprødt, nemt og elsket af alle under 10 år.',
    minutes: 30, diet: 'fisk', serves: 4, emoji: '🐡', hue: 48,
    hero: ['fiskepinde'],
    ingredients: [
      ['fiskepinde', 500], ['kartofler', 1000], ['aerter', 300], ['citron', 1],
      ['olie', 30], ['salt', 4]
    ],
    steps: [
      'Skær kartofler i både, vend i olie og salt, bag 30 min ved 220°.',
      'Bag fiskepindene de sidste 15 min.',
      'Kog ærterne 2 min.',
      'Server med citronbåde.'
    ]
  },
  {
    id: 'laks-teriyaki',
    title: 'Laks teriyaki med ris',
    blurb: 'Blank, sød-salt glaze på laks med broccoli.',
    minutes: 25, diet: 'fisk', serves: 4, emoji: '🍣', hue: 12,
    hero: ['laks'],
    ingredients: [
      ['laks', 500], ['ris', 300], ['broccoli', 1], ['forarsloeg', 1], ['ingefaer', 15],
      ['soja', 60], ['honning', 30], ['olie', 15]
    ],
    steps: [
      'Sæt risene over.',
      'Rør soja, honning og revet ingefær sammen.',
      'Steg laksen 3 min på hver side, hæld saucen ved og lad den koge ind til glaze.',
      'Damp broccolien. Top med forårsløg.'
    ]
  },
  {
    id: 'lasagne',
    title: 'Lasagne',
    blurb: 'Lag på lag af kødsauce, bechamel og gylden ost.',
    minutes: 75, diet: 'kod', serves: 4, emoji: '🫕', hue: 10,
    hero: ['hakket_okse', 'lasagneplader'],
    ingredients: [
      ['hakket_okse', 500], ['loeg', 1], ['hvidloeg', 2], ['gulerod', 2],
      ['hakkede_tomater', 800], ['lasagneplader', 250], ['maelk', 600], ['revet_ost', 150],
      ['smor', 40], ['hvedemel', 40], ['oregano', 2], ['salt', 4], ['peber', 1]
    ],
    steps: [
      'Lav en kødsauce af kød, løg, hvidløg, gulerod og tomater. Simr 20 min.',
      'Lav bechamel: smelt smør, pisk mel i, spæd med mælk og kog 5 min.',
      'Læg lag af sauce, plader og bechamel i et fad. Slut med bechamel og ost.',
      'Bag 40 min ved 200°.'
    ]
  },
  {
    id: 'chili-sin-carne',
    title: 'Chili sin carne',
    blurb: 'Bønner, majs og røget paprika. Mætter uden kød.',
    minutes: 35, diet: 'vegetar', serves: 4, emoji: '🌶️', hue: 0,
    hero: ['bonner', 'hakkede_tomater'],
    ingredients: [
      ['bonner', 800], ['hakkede_tomater', 800], ['loeg', 1], ['hvidloeg', 2],
      ['peberfrugt', 2], ['majs', 300], ['ris', 300], ['creme_fraiche', 200],
      ['spidskommen', 4], ['paprika', 5], ['chili', 1], ['olie', 15], ['salt', 4]
    ],
    steps: [
      'Sæt risene over.',
      'Svits løg, hvidløg og peberfrugt med krydderierne.',
      'Tilsæt tomater, bønner og majs. Simr 20 min.',
      'Server med ris og en klat creme fraiche.'
    ]
  },
  {
    id: 'chili-con-carne',
    title: 'Chili con carne',
    blurb: 'Krydret oksekød og bønner – god til to dage.',
    minutes: 40, diet: 'kod', serves: 4, emoji: '🫘', hue: 4,
    hero: ['hakket_okse'],
    ingredients: [
      ['hakket_okse', 500], ['bonner', 400], ['hakkede_tomater', 800], ['loeg', 1],
      ['hvidloeg', 2], ['peberfrugt', 1], ['ris', 300], ['creme_fraiche', 200],
      ['spidskommen', 4], ['chili', 1], ['olie', 15], ['salt', 4]
    ],
    steps: [
      'Brun kødet med løg, hvidløg og krydderier.',
      'Tilsæt peberfrugt, tomater og bønner. Simr 25 min.',
      'Kog risene.',
      'Server med creme fraiche.'
    ]
  },
  {
    id: 'carbonara',
    title: 'Pasta carbonara',
    blurb: 'Æg, bacon og parmesan. Fem ingredienser, femten minutter.',
    minutes: 15, diet: 'kod', serves: 4, emoji: '🥚', hue: 50,
    hero: ['bacon'],
    ingredients: [
      ['bacon', 200], ['pasta', 500], ['aeg', 4], ['parmesan', 60], ['peber', 2], ['salt', 4]
    ],
    steps: [
      'Kog pastaen i godt saltet vand.',
      'Steg baconen sprød.',
      'Pisk æg med revet parmesan og masser af peber.',
      'Vend den varme pasta i bacon, tag panden af varmen og rør æggemassen i med lidt pastavand.'
    ]
  },
  {
    id: 'pesto-kylling-pasta',
    title: 'Pasta med pesto og kylling',
    blurb: 'Grøn pesto, saftig kylling og søde tomater.',
    minutes: 20, diet: 'kod', serves: 4, emoji: '🌿', hue: 110,
    hero: ['kyllingebryst', 'pesto'],
    ingredients: [
      ['kyllingebryst', 400], ['pasta', 500], ['pesto', 190], ['tomater', 250],
      ['spinat', 100], ['parmesan', 30], ['olie', 15], ['salt', 4], ['peber', 1]
    ],
    steps: [
      'Kog pastaen.',
      'Steg kyllingen i strimler.',
      'Vend pasta, pesto, kylling, halverede tomater og spinat sammen.',
      'Top med parmesan.'
    ]
  },
  {
    id: 'kikaertecurry',
    title: 'Kikærtecurry med spinat',
    blurb: 'Varm, cremet og helt plantebaseret.',
    minutes: 25, diet: 'vegetar', serves: 4, emoji: '🍲', hue: 36,
    hero: ['kikaerter', 'kokosmaelk', 'spinat'],
    ingredients: [
      ['kikaerter', 800], ['kokosmaelk', 400], ['hakkede_tomater', 400], ['spinat', 200],
      ['loeg', 1], ['hvidloeg', 2], ['ingefaer', 20], ['ris', 300],
      ['karry', 10], ['olie', 15], ['salt', 4]
    ],
    steps: [
      'Sæt risene over.',
      'Svits løg, hvidløg og ingefær med karry.',
      'Tilsæt kikærter, tomater og kokosmælk. Simr 12 min.',
      'Vend spinaten i lige før servering.'
    ]
  },
  {
    id: 'linse-dahl',
    title: 'Rød linsedahl',
    blurb: 'Silkeblød dahl med lime. Billig, mættende, god.',
    minutes: 30, diet: 'vegetar', serves: 4, emoji: '🥣', hue: 28,
    hero: ['linser'],
    ingredients: [
      ['linser', 300], ['kokosmaelk', 400], ['hakkede_tomater', 400], ['loeg', 1],
      ['hvidloeg', 2], ['ingefaer', 20], ['ris', 300], ['lime', 1],
      ['karry', 8], ['spidskommen', 3], ['olie', 15], ['salt', 4]
    ],
    steps: [
      'Svits løg, hvidløg, ingefær og krydderier.',
      'Tilsæt skyllede linser, tomater, kokosmælk og 4 dl vand. Simr 20 min.',
      'Kog risene.',
      'Smag dahlen til med limesaft og salt.'
    ]
  },
  {
    id: 'frittata',
    title: 'Frittata med kartofler og feta',
    blurb: 'Ovnbagt æggekage med spinat og salt feta.',
    minutes: 30, diet: 'vegetar', serves: 4, emoji: '🍳', hue: 52,
    hero: ['aeg', 'feta'],
    ingredients: [
      ['aeg', 8], ['kartofler', 600], ['spinat', 150], ['loeg', 1], ['feta', 150],
      ['salat', 150], ['olie', 15], ['salt', 3], ['peber', 1]
    ],
    steps: [
      'Kog kartoflerne og skær dem i skiver.',
      'Steg løg og kartofler i en ovnfast pande, tilsæt spinat.',
      'Hæld sammenpiskede æg over og smuldr feta på.',
      'Bag 15 min ved 200°. Server med salat.'
    ]
  },
  {
    id: 'hjemmelavet-pizza',
    title: 'Hjemmelavet pizza',
    blurb: 'Tynd bund, tomat, mozzarella og det grønne, I har lyst til.',
    minutes: 30, diet: 'vegetar', serves: 4, emoji: '🍕', hue: 16,
    hero: ['pizzadej', 'mozzarella'],
    ingredients: [
      ['pizzadej', 800], ['hakkede_tomater', 400], ['mozzarella', 250], ['champignon', 200],
      ['peberfrugt', 1], ['oregano', 2], ['olie', 15], ['salt', 2]
    ],
    steps: [
      'Varm ovnen op til 250°.',
      'Rul dejen ud og smør tynde lag tomat på, krydret med oregano og salt.',
      'Fordel champignon, peberfrugt og revet mozzarella.',
      'Bag 10–12 min til bunden er sprød.'
    ]
  },
  {
    id: 'burgere',
    title: 'Hjemmelavede burgere',
    blurb: 'Saftige bøffer, briochebolle og ovnfritter.',
    minutes: 35, diet: 'kod', serves: 4, emoji: '🍔', hue: 24,
    hero: ['hakket_okse', 'burgerboller'],
    ingredients: [
      ['hakket_okse', 500], ['burgerboller', 4], ['salat', 100], ['tomater', 250], ['loeg', 1],
      ['kartofler', 800], ['olie', 30], ['salt', 5], ['peber', 1]
    ],
    steps: [
      'Skær kartofler i stave, vend i olie og salt og bag 30 min ved 220°.',
      'Form 4 bøffer og krydr dem godt.',
      'Steg bøfferne 3–4 min på hver side og rist bollerne.',
      'Byg burgerne med salat, tomat og løg.'
    ]
  },
  {
    id: 'kylling-pita',
    title: 'Pita med kylling og tzatziki',
    blurb: 'Krydret kylling, sprødt grønt og kølig yoghurtsauce.',
    minutes: 25, diet: 'kod', serves: 4, emoji: '🥙', hue: 38,
    hero: ['kyllingebryst', 'pita'],
    ingredients: [
      ['kyllingebryst', 500], ['pita', 8], ['salat', 150], ['tomater', 250], ['agurk', 1],
      ['yoghurt', 300], ['hvidloeg', 1], ['paprika', 4], ['spidskommen', 2],
      ['olie', 15], ['salt', 4]
    ],
    steps: [
      'Skær kyllingen i strimler og vend den i paprika, spidskommen og salt.',
      'Riv halvdelen af agurken og rør den i yoghurt med presset hvidløg.',
      'Steg kyllingen og lun pitabrødene.',
      'Fyld pitaerne med salat, tomat, agurk, kylling og tzatziki.'
    ]
  },
  {
    id: 'morbradgryde',
    title: 'Mørbradgryde',
    blurb: 'Mørt svinekød i flødesauce med svampe.',
    minutes: 30, diet: 'kod', serves: 4, emoji: '🍄', hue: 22,
    hero: ['svinemorbrad'],
    ingredients: [
      ['svinemorbrad', 600], ['champignon', 250], ['flode', 250], ['loeg', 1], ['ris', 300],
      ['paprika', 5], ['olie', 15], ['bouillon', 1], ['salt', 3], ['peber', 1]
    ],
    steps: [
      'Sæt risene over.',
      'Skær mørbraden i medaljoner og brun dem.',
      'Steg løg og svampe, tilsæt paprika, fløde og bouillon.',
      'Læg kødet tilbage og simr 10 min.'
    ]
  },
  {
    id: 'hel-kylling',
    title: 'Hel kylling i ovn',
    blurb: 'Søndagsfølelse en tirsdag. Citron, hvidløg og sprødt skind.',
    minutes: 80, diet: 'kod', serves: 4, emoji: '🐔', hue: 44,
    hero: ['hel_kylling'],
    ingredients: [
      ['hel_kylling', 1400], ['kartofler', 1000], ['citron', 1], ['hvidloeg', 4], ['salat', 150],
      ['olie', 30], ['timian', 2], ['salt', 6], ['peber', 1]
    ],
    steps: [
      'Fyld kyllingen med citron og hvidløg. Gnid den med olie, salt og timian.',
      'Læg kartofler omkring den i bradepanden.',
      'Steg 70 min ved 200°, til saften er klar.',
      'Lad den hvile 10 min og server med salat.'
    ]
  },
  {
    id: 'stroganoff',
    title: 'Bøf stroganoff',
    blurb: 'Oksestrimler i paprika-fløde med svampe.',
    minutes: 25, diet: 'kod', serves: 4, emoji: '🥘', hue: 16,
    hero: ['oksestrimler'],
    ingredients: [
      ['oksestrimler', 500], ['champignon', 250], ['loeg', 1], ['creme_fraiche', 200],
      ['tomatpure', 30], ['ris', 300], ['paprika', 6], ['olie', 15], ['salt', 3], ['peber', 1]
    ],
    steps: [
      'Sæt risene over.',
      'Steg kødet ved høj varme i små portioner. Tag det af panden.',
      'Steg løg og svampe, tilsæt paprika og tomatpuré.',
      'Rør creme fraiche i, vend kødet tilbage og varm igennem.'
    ]
  },
  {
    id: 'kylling-bowl',
    title: 'Kyllingebowl med avocado',
    blurb: 'Ris, kylling, avocado og sprødt grønt med lime.',
    minutes: 25, diet: 'kod', serves: 4, emoji: '🥗', hue: 120,
    hero: ['kyllingebryst', 'avocado'],
    ingredients: [
      ['kyllingebryst', 500], ['ris', 300], ['avocado', 2], ['agurk', 1], ['majs', 300],
      ['lime', 1], ['forarsloeg', 1], ['soja', 30], ['olie', 15], ['salt', 2]
    ],
    steps: [
      'Kog risene.',
      'Steg kyllingen og skær den i skiver.',
      'Skær avocado og agurk i tern.',
      'Saml skålene og dryp med soja og lime.'
    ]
  },
  {
    id: 'tun-pasta',
    title: 'Pasta med tun og tomat',
    blurb: 'Fra skabet til bordet på et kvarter.',
    minutes: 15, diet: 'fisk', serves: 4, emoji: '🐟', hue: 196,
    hero: ['tun'],
    ingredients: [
      ['tun', 300], ['pasta', 500], ['hakkede_tomater', 400], ['loeg', 1], ['hvidloeg', 2],
      ['krydderurter', 1], ['olie', 15], ['chili', 1], ['salt', 4]
    ],
    steps: [
      'Kog pastaen.',
      'Svits løg, hvidløg og chili, tilsæt tomater og simr 8 min.',
      'Vend tunen i saucen.',
      'Bland med pastaen og top med persille.'
    ]
  },
  {
    id: 'sod-sur-kodboller',
    title: 'Kødboller i sød-sur sauce',
    blurb: 'Små kødboller med peberfrugt i blank sauce.',
    minutes: 35, diet: 'kod', serves: 4, emoji: '🍡', hue: 356,
    hero: ['hakket_svin'],
    ingredients: [
      ['hakket_svin', 500], ['aeg', 1], ['ris', 300], ['peberfrugt', 2], ['loeg', 1],
      ['tomatpure', 70], ['sukker', 40], ['eddike', 40], ['soja', 30], ['olie', 15], ['salt', 3]
    ],
    steps: [
      'Rør farsen med æg og salt og rul små kødboller.',
      'Steg kødbollerne gyldne. Kog risene.',
      'Steg løg og peberfrugt, tilsæt tomatpuré, sukker, eddike, soja og 2 dl vand.',
      'Kog saucen tyk og vend kødbollerne i.'
    ]
  },
  {
    id: 'kyllingefrikadeller',
    title: 'Kyllingefrikadeller med ovnkartofler',
    blurb: 'Lette frikadeller og en kølig tzatziki.',
    minutes: 40, diet: 'kod', serves: 4, emoji: '🍽️', hue: 60,
    hero: ['hakket_kylling'],
    ingredients: [
      ['hakket_kylling', 500], ['aeg', 1], ['loeg', 1], ['kartofler', 1000], ['yoghurt', 300],
      ['agurk', 1], ['hvidloeg', 1], ['hvedemel', 30], ['olie', 30], ['salt', 5], ['peber', 1]
    ],
    steps: [
      'Bag kartofler i både med olie og salt, 30 min ved 220°.',
      'Rør farsen med revet løg, æg, mel, salt og peber.',
      'Steg frikadellerne 5 min på hver side.',
      'Rør tzatziki af yoghurt, revet agurk og hvidløg.'
    ]
  },
  {
    id: 'sode-kartofler-feta',
    title: 'Søde kartofler med feta og kikærter',
    blurb: 'Ovnbagte søde kartofler, sprøde kikærter og yoghurt.',
    minutes: 40, diet: 'vegetar', serves: 4, emoji: '🍠', hue: 24,
    hero: ['sode_kartofler'],
    ingredients: [
      ['sode_kartofler', 1000], ['kikaerter', 400], ['feta', 200], ['spinat', 100], ['loeg', 1],
      ['yoghurt', 200], ['spidskommen', 3], ['olie', 30], ['salt', 4]
    ],
    steps: [
      'Skær søde kartofler i tern og vend dem med kikærter, olie, spidskommen og salt.',
      'Bag 30 min ved 220°.',
      'Vend med spinat, rødløg i tynde ringe og smuldret feta.',
      'Server med en klat yoghurt.'
    ]
  },
  {
    id: 'champignonrisotto',
    title: 'Champignonrisotto',
    blurb: 'Cremet risotto med ristede svampe og parmesan.',
    minutes: 35, diet: 'vegetar', serves: 4, emoji: '🍚', hue: 32,
    hero: ['champignon'],
    ingredients: [
      ['ris', 350], ['champignon', 400], ['loeg', 1], ['hvidloeg', 2], ['parmesan', 80],
      ['bouillon', 2], ['smor', 40], ['olie', 15], ['salt', 2], ['peber', 1]
    ],
    steps: [
      'Steg svampene gyldne og tag halvdelen fra til pynt.',
      'Svits løg, hvidløg og ris, og tilsæt varm bouillon lidt ad gangen under omrøring i 18 min.',
      'Rør smør og revet parmesan i.',
      'Top med de ristede svampe.'
    ]
  },
  {
    id: 'aebleflaesk',
    title: 'Æbleflæsk',
    blurb: 'Sprødt flæsk, bløde løg og syrlige æbler på rugbrød.',
    minutes: 35, diet: 'kod', serves: 4, emoji: '🍎', hue: 4,
    hero: ['aebler', 'flaesk'],
    ingredients: [
      ['flaesk', 500], ['aebler', 4], ['loeg', 2], ['rugbrod', 300], ['krydderurter', 1],
      ['sukker', 12], ['olie', 15], ['salt', 3], ['peber', 1]
    ],
    steps: [
      'Steg flæsket sprødt på panden ved middel varme, eller i ovnen ved 200° i ca. 25 min.',
      'Skær løg i ringe og æbler i både uden kernehus.',
      'Svits løget blødt i lidt af fedtet fra flæsket, tilsæt æblerne og sukkeret og steg 5 min, til æblerne er møre men hele.',
      'Vend flæsket i, smag til med peber og drys med purløg. Server på rugbrød.'
    ]
  },
  {
    id: 'braendende-kaerlighed',
    title: 'Brændende kærlighed',
    blurb: 'Smørmos med sprød bacon og søde, stegte løg.',
    minutes: 40, diet: 'kod', serves: 4, emoji: '🥔', hue: 30,
    hero: ['kartofler', 'bacon'],
    ingredients: [
      ['kartofler', 1000], ['bacon', 350], ['loeg', 3], ['maelk', 100], ['smor', 75],
      ['krydderurter', 1], ['salt', 4], ['peber', 1]
    ],
    steps: [
      'Skræl kartoflerne og kog dem møre, ca. 20 min.',
      'Steg baconen sprød og tag den op. Steg løg i halve ringe i fedtet ved middel varme i ca. 10 min.',
      'Hæld vandet fra kartoflerne og mos dem med smør og varm mælk. Smag til med salt og peber.',
      'Læg mosen på tallerkener, lav en fordybning og fyld den med bacon og løg. Drys med persille.'
    ]
  },
  {
    id: 'skipperlabskovs',
    title: 'Skipperlabskovs',
    blurb: 'Mørt oksekød og kartofler kogt ud til en tyk gryde med smør og purløg.',
    minutes: 135, diet: 'kod', serves: 4, emoji: '🍲', hue: 22,
    hero: ['oksekod_gryde', 'kartofler'],
    ingredients: [
      ['oksekod_gryde', 800], ['kartofler', 1500], ['loeg', 4], ['laurbaer', 4],
      ['smor', 75], ['krydderurter', 1], ['salt', 6], ['peber', 2]
    ],
    steps: [
      'Skær kødet i grove tern og brun det i lidt smør i en gryde i et par omgange.',
      'Tilsæt løg i både, laurbærblade, hele peberkorn og 1 liter vand. Simr under låg i ca. 1½ time.',
      'Skræl kartoflerne, skær dem i tern og kom dem i gryden. Kog videre i ca. 45 min, til de falder ud.',
      'Rør kraftigt, så kød og kartofler bliver til en tyk gryde, og smag til med salt.',
      'Server med en klat smør og masser af hakket purløg.'
    ]
  },
  {
    id: 'gullasch',
    title: 'Gullasch med kartoffelmos',
    blurb: 'Langtidssimret oksekød med paprika og peberfrugt over blød mos.',
    minutes: 120, diet: 'kod', serves: 4, emoji: '🥘', hue: 8,
    hero: ['oksekod_gryde', 'peberfrugt'],
    ingredients: [
      ['oksekod_gryde', 500], ['loeg', 2], ['hvidloeg', 1], ['peberfrugt', 1], ['gulerod', 2],
      ['hakkede_tomater', 400], ['kartofler', 1000], ['maelk', 150], ['smor', 90],
      ['hvedemel', 15], ['paprika', 8], ['spidskommen', 1], ['laurbaer', 2], ['bouillon', 1],
      ['salt', 5], ['peber', 1]
    ],
    steps: [
      'Skær kødet i tern, vend det i mel og paprika og brun det i smør i et par omgange.',
      'Tilsæt hakket løg og hvidløg, gulerod i skiver, tomater, spidskommen, laurbær, bouillon og 4 dl vand.',
      'Simr under låg ved svag varme i ca. 1½ time. Kom peberfrugt i tern i de sidste 20 min.',
      'Kog kartoflerne og mos dem med smør og varm mælk.',
      'Smag gullaschen til og server over mosen.'
    ]
  },
  {
    id: 'fyldte-peberfrugter',
    title: 'Fyldte peberfrugter',
    blurb: 'Peberfrugter fyldt med krydret oksekød og ris, bagt med ost.',
    minutes: 45, diet: 'kod', serves: 4, emoji: '🫑', hue: 6,
    hero: ['peberfrugt'],
    ingredients: [
      ['peberfrugt', 4], ['hakket_okse', 400], ['ris', 125], ['loeg', 1], ['hvidloeg', 2],
      ['gulerod', 2], ['hakkede_tomater', 400], ['revet_ost', 60], ['salat', 100],
      ['spidskommen', 2], ['paprika', 3], ['olie', 15], ['salt', 4], ['peber', 1]
    ],
    steps: [
      'Kog risene. Varm ovnen op til 200°.',
      'Brun kødet med hakket løg, hvidløg og revet gulerod. Rør krydderier og tomater i og simr 5 min. Vend risene i.',
      'Skær toppen af peberfrugterne, fjern kernerne og fyld dem med kødet. Stil dem i et fad med lidt vand i bunden.',
      'Drys med ost og bag ca. 20 min, til peberfrugterne er møre. Server med salat.'
    ]
  },
  {
    id: 'porrekylling-i-fad',
    title: 'Kylling i fad med porrer',
    blurb: 'Kylling bagt i flødesauce med porrer, svampe og bacon.',
    minutes: 45, diet: 'kod', serves: 4, emoji: '🍗', hue: 70,
    hero: ['porre'],
    ingredients: [
      ['kyllingebryst', 600], ['porre', 2], ['bacon', 150], ['champignon', 250], ['loeg', 1],
      ['hvidloeg', 2], ['flode', 500], ['bouillon', 1], ['ris', 300], ['krydderurter', 1],
      ['olie', 15], ['salt', 3], ['peber', 1]
    ],
    steps: [
      'Varm ovnen op til 200° og sæt risene over.',
      'Brun kyllingen hurtigt på begge sider og læg den i et ovnfast fad.',
      'Steg bacon, løg, hvidløg, svampe og porrer i ringe på samme pande. Hæld fløde og bouillon ved og lad det koge op.',
      'Hæld saucen over kyllingen og bag ca. 25 min, til kyllingen er gennemstegt.',
      'Drys med persille og server med ris.'
    ]
  },
  {
    id: 'mango-kyllingecurry',
    title: 'Kyllingecurry med mango',
    blurb: 'Kokoskarry med kylling, ingefær og søde mangostykker.',
    minutes: 30, diet: 'kod', serves: 4, emoji: '🥭', hue: 40,
    hero: ['mango'],
    ingredients: [
      ['kyllingebryst', 500], ['mango', 1], ['kokosmaelk', 400], ['loeg', 1], ['hvidloeg', 2],
      ['ingefaer', 15], ['peberfrugt', 1], ['forarsloeg', 1], ['ris', 300], ['karry', 10],
      ['bouillon', 1], ['olie', 15], ['salt', 4]
    ],
    steps: [
      'Sæt risene over.',
      'Svits hakket løg, hvidløg og revet ingefær i olie, tilsæt karry og rist et minut.',
      'Tilsæt kylling i tern, peberfrugt i strimler, kokosmælk og bouillon. Simr 15 min.',
      'Vend mango i tern i lige før servering, så den bare bliver lun.',
      'Server over ris med forårsløg på toppen.'
    ]
  },
  {
    id: 'groenkaalspasta',
    title: 'Pasta med grønkål og bacon',
    blurb: 'Sprød bacon, grønkål og bløde tomater vendt med pasta.',
    minutes: 25, diet: 'kod', serves: 4, emoji: '🥬', hue: 100,
    hero: ['groenkaal'],
    ingredients: [
      ['pasta', 400], ['groenkaal', 150], ['bacon', 200], ['tomater', 400], ['hvidloeg', 2],
      ['oregano', 1], ['olie', 30], ['salt', 4], ['peber', 1]
    ],
    steps: [
      'Kog pastaen i godt saltet vand.',
      'Steg baconen sprød og tag den op.',
      'Steg halverede tomater og hvidløg i olie med oregano, til tomaterne bliver bløde.',
      'Tilsæt grønkål uden stilke og steg 2–3 min, til den falder sammen.',
      'Vend pasta og bacon i med lidt pastavand, og smag til med salt og peber.'
    ]
  },
  {
    id: 'porretaerte',
    title: 'Porretærte med bacon',
    blurb: 'Sprød hjemmelavet bund med porrer, bacon og æggestand.',
    minutes: 75, diet: 'kod', serves: 4, emoji: '🥧', hue: 56,
    hero: ['porre'],
    ingredients: [
      ['hvedemel', 180], ['smor', 100], ['porre', 2], ['bacon', 150], ['aeg', 4],
      ['flode', 100], ['maelk', 100], ['salat', 150], ['salt', 3], ['peber', 1]
    ],
    steps: [
      'Smuldr mel, koldt smør og en knivspids salt sammen, saml dejen med 3 spsk koldt vand og læg den på køl i 30 min.',
      'Rul dejen ud i en tærteform, prik bunden og forbag den 10 min ved 185°.',
      'Steg baconen, og svits porrerne i tynde ringe i fedtet.',
      'Fordel porrer og bacon i bunden. Pisk æg, fløde, mælk, salt og peber og hæld over.',
      'Bag ca. 30 min, til fyldet er stivnet. Server med salat.'
    ]
  },
  {
    id: 'fiskefrikadeller',
    title: 'Fiskefrikadeller med gulerodssalat',
    blurb: 'Gyldne fiskefrikadeller, kartofler og frisk råkost med æble.',
    minutes: 45, diet: 'fisk', serves: 4, emoji: '🐟', hue: 32,
    hero: ['fiskefars', 'gulerod'],
    ingredients: [
      ['fiskefars', 500], ['aeg', 1], ['loeg', 1], ['maelk', 100], ['hvedemel', 25],
      ['krydderurter', 1], ['kartofler', 1000], ['gulerod', 4], ['aebler', 2], ['citron', 1],
      ['honning', 15], ['smor', 25], ['olie', 15], ['salt', 5], ['peber', 1]
    ],
    steps: [
      'Rør fiskefarsen med æg, revet løg, mel, mælk, hakket dild, salt og peber. Lad den hvile koldt i 30 min.',
      'Kog kartoflerne.',
      'Riv gulerødder og æbler groft og vend dem med citronsaft og honning.',
      'Form frikadeller med en ske og steg dem i smør og olie ved middel varme, ca. 5 min på hver side.',
      'Server med kartofler, råkost og citronbåde.'
    ]
  },
  {
    id: 'rejepasta',
    title: 'Pasta med rejer, hvidløg og chili',
    blurb: 'Hurtig pasta med rejer, citron og frisk persille.',
    minutes: 20, diet: 'fisk', serves: 4, emoji: '🦐', hue: 12,
    hero: ['rejer'],
    ingredients: [
      ['pasta', 400], ['rejer', 300], ['hvidloeg', 3], ['citron', 1], ['krydderurter', 1],
      ['chili', 1], ['olie', 45], ['salt', 4], ['peber', 1]
    ],
    steps: [
      'Kog pastaen i godt saltet vand og gem 1 dl af kogevandet.',
      'Svits hakket hvidløg og chili i olie ved lav varme i 2 min.',
      'Tilsæt rejerne og steg dem 1–3 min, til de lige er gennemstegte.',
      'Vend pasta, pastavand, revet citronskal, citronsaft og hakket persille i. Smag til med salt og peber.'
    ]
  },
  {
    id: 'laksepasta-broccoli',
    title: 'Pasta med laks og broccoli',
    blurb: 'Saftig laks og sprød broccoli i en let citronflødesauce.',
    minutes: 30, diet: 'fisk', serves: 4, emoji: '🍝', hue: 150,
    hero: ['laks', 'broccoli'],
    ingredients: [
      ['pasta', 400], ['laks', 500], ['broccoli', 1], ['flode', 250], ['citron', 1],
      ['krydderurter', 1], ['olie', 15], ['salt', 4], ['peber', 1]
    ],
    steps: [
      'Kog pastaen. Kom broccolibuketterne i gryden de sidste 3 min.',
      'Steg laksen i tern i olie et par minutter, til den lige er gennemstegt.',
      'Hæld fløde, revet citronskal og lidt citronsaft på panden og lad det koge op.',
      'Vend pasta og broccoli forsigtigt i saucen og drys med persille.'
    ]
  },
  {
    id: 'fiskefad-spinat',
    title: 'Fiskefad med spinat og mos',
    blurb: 'Hvid fisk og spinat i cremet sauce under et låg af gylden kartoffelmos.',
    minutes: 60, diet: 'fisk', serves: 4, emoji: '🥧', hue: 190,
    hero: ['hvid_fisk', 'spinat'],
    ingredients: [
      ['hvid_fisk', 500], ['spinat', 400], ['kartofler', 800], ['maelk', 400], ['smor', 50],
      ['hvedemel', 25], ['revet_ost', 75], ['citron', 1], ['salt', 5], ['peber', 1]
    ],
    steps: [
      'Kog kartoflerne og mos dem med halvdelen af smørret og 1 dl mælk. Varm ovnen op til 200°.',
      'Lad spinaten falde sammen i en tør gryde og pres vandet fra.',
      'Lav en sauce af resten af smørret, mel og 3 dl mælk. Smag til med citronskal, salt og peber.',
      'Læg fisk i stykker og spinat i et fad, hæld saucen over og fordel mosen ovenpå.',
      'Drys med ost og bag ca. 30 min, til toppen er gylden.'
    ]
  },
  {
    id: 'kartoffel-porresuppe',
    title: 'Kartoffel-porresuppe',
    blurb: 'Fløjlsblød suppe med porre, purløg og sprøde rugbrødsterninger.',
    minutes: 30, diet: 'vegetar', serves: 4, emoji: '🥣', hue: 80,
    hero: ['porre', 'kartofler'],
    ingredients: [
      ['kartofler', 1000], ['porre', 3], ['loeg', 1], ['bouillon', 2], ['flode', 100],
      ['rugbrod', 150], ['krydderurter', 1], ['smor', 15], ['salt', 4], ['peber', 1]
    ],
    steps: [
      'Svits løg og porrer i ringe i smør, uden at de tager farve.',
      'Tilsæt kartofler i tern, grøntsagsbouillon og 1,2 l vand. Simr ca. 15 min, til kartoflerne er møre.',
      'Blend suppen glat, rør fløden i og smag til med salt og peber.',
      'Rist rugbrød i tern på en tør pande og server på suppen med hakket purløg.'
    ]
  },
  {
    id: 'graeskarsuppe',
    title: 'Græskarsuppe med ingefær',
    blurb: 'Cremet hokkaidosuppe med en varm tone af ingefær og chili.',
    minutes: 35, diet: 'vegetar', serves: 4, emoji: '🎃', hue: 28,
    hero: ['graeskar'],
    ingredients: [
      ['graeskar', 1], ['kartofler', 200], ['loeg', 1], ['hvidloeg', 2], ['ingefaer', 10],
      ['bouillon', 2], ['flode', 100], ['chili', 1], ['olie', 15], ['salt', 4], ['peber', 1]
    ],
    steps: [
      'Skær græskarret i tern uden kerner. Skrællen på hokkaido kan blive på.',
      'Svits løg, hvidløg og revet ingefær i olie, tilsæt græskar, kartoffel i tern og chili.',
      'Hæld grøntsagsbouillon og 1 l vand ved og simr ca. 20 min.',
      'Blend suppen glat, rør fløden i og smag til med salt og peber.'
    ]
  },
  {
    id: 'graeskarrisotto',
    title: 'Græskarrisotto',
    blurb: 'Cremet risotto med ovnbagt hokkaido, salvie og parmesan.',
    minutes: 45, diet: 'vegetar', serves: 4, emoji: '🍚', hue: 36,
    hero: ['graeskar'],
    ingredients: [
      ['ris', 350], ['graeskar', 0.5], ['loeg', 1], ['hvidloeg', 2], ['parmesan', 75],
      ['bouillon', 2], ['smor', 40], ['krydderurter', 1], ['olie', 15], ['salt', 3], ['peber', 1]
    ],
    steps: [
      'Skær græskarret i tern, vend dem i olie og salt og bag ca. 20 min ved 200°.',
      'Svits løg, hvidløg og ris, og tilsæt varm grøntsagsbouillon lidt ad gangen under omrøring i ca. 18 min.',
      'Mos halvdelen af græskarret og rør det i risottoen sammen med smør og revet parmesan.',
      'Top med resten af græskarret og salvieblade sprødstegt i lidt smør.'
    ]
  },
  {
    id: 'shakshuka',
    title: 'Shakshuka',
    blurb: 'Æg pocheret i krydret tomat og peberfrugt, med feta og varmt brød.',
    minutes: 30, diet: 'vegetar', serves: 4, emoji: '🍳', hue: 10,
    hero: ['peberfrugt'],
    ingredients: [
      ['aeg', 6], ['hakkede_tomater', 800], ['peberfrugt', 2], ['loeg', 2], ['hvidloeg', 3],
      ['feta', 75], ['pita', 4], ['krydderurter', 1], ['spidskommen', 3], ['paprika', 4],
      ['chili', 1], ['olie', 15], ['salt', 4], ['peber', 1]
    ],
    steps: [
      'Svits løg, hvidløg og peberfrugt i strimler i olie, til de er bløde.',
      'Rist spidskommen, paprika og chili med et minut, tilsæt tomaterne og simr ca. 10 min. Smag til.',
      'Lav små fordybninger i saucen, slå æggene ud i dem og læg låg på. Lad dem stivne i 5–7 min.',
      'Drys med smuldret feta og persille, og server med lune pitabrød.'
    ]
  },
  {
    id: 'gulerodssuppe',
    title: 'Gulerodssuppe med kokos og ingefær',
    blurb: 'Silkeblød, solgul suppe med kokos, ingefær og lime.',
    minutes: 35, diet: 'vegetar', serves: 4, emoji: '🥕', hue: 26,
    hero: ['gulerod'],
    ingredients: [
      ['gulerod', 8], ['kokosmaelk', 400], ['loeg', 1], ['hvidloeg', 3], ['ingefaer', 20],
      ['lime', 1], ['bouillon', 2], ['spidskommen', 2], ['chili', 1], ['olie', 15],
      ['salt', 4], ['peber', 1]
    ],
    steps: [
      'Svits løg, hvidløg og revet ingefær i olie med spidskommen og chili.',
      'Tilsæt gulerødder i skiver, grøntsagsbouillon og 8 dl vand. Simr ca. 25 min, til gulerødderne er helt møre.',
      'Rør kokosmælken i og blend suppen glat.',
      'Smag til med limesaft, salt og peber.'
    ]
  },
  {
    id: 'rodbede-linsesalat',
    title: 'Linsesalat med bagte rødbeder og feta',
    blurb: 'Lun salat af linser, søde ovnbagte rødbeder og salt feta.',
    minutes: 45, diet: 'vegetar', serves: 4, emoji: '🫘', hue: 340,
    hero: ['rodbeder'],
    ingredients: [
      ['gronne_linser', 200], ['rodbeder', 600], ['feta', 150], ['salat', 100], ['loeg', 1],
      ['citron', 1], ['honning', 10], ['krydderurter', 1], ['olie', 45], ['salt', 3], ['peber', 1]
    ],
    steps: [
      'Skræl rødbederne, skær dem i både, vend dem i lidt olie og salt og bag ca. 30 min ved 220°.',
      'Kog linserne møre i ca. 20 min og hæld vandet fra.',
      'Rør en dressing af olie, citronsaft, honning, salt og peber, og vend de lune linser i den.',
      'Vend rødbeder, rødløg i tynde skiver, salat og krydderurter i, og smuldr feta over.'
    ]
  },
  {
    id: 'blomkaalskarry',
    title: 'Blomkålskarry med kikærter',
    blurb: 'Kokoskarry med blomkål, kikærter og spinat over ris.',
    minutes: 35, diet: 'vegetar', serves: 4, emoji: '🥦', hue: 48,
    hero: ['blomkaal'],
    ingredients: [
      ['blomkaal', 1], ['kikaerter', 400], ['kokosmaelk', 400], ['hakkede_tomater', 400],
      ['spinat', 100], ['loeg', 1], ['hvidloeg', 2], ['ingefaer', 15], ['ris', 300],
      ['karry', 10], ['spidskommen', 3], ['bouillon', 1], ['olie', 15], ['salt', 4]
    ],
    steps: [
      'Sæt risene over.',
      'Svits løg, hvidløg og revet ingefær i olie med karry og spidskommen.',
      'Tilsæt kokosmælk, tomater, bouillon og blomkål i små buketter. Simr ca. 15 min, til blomkålen er mør.',
      'Vend skyllede kikærter i og varm igennem. Rør spinaten i til sidst og server over ris.'
    ]
  }
];
