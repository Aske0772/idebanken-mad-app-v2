// Canonical ingredients. Recipes reference these ids, and offers are matched to them.
//
// unit    – what recipes measure in: 'g', 'ml' or 'stk'
// normal  – [pack size in unit, kr] ≈ normal shelf price, used when nothing is on offer
// gPerStk – grams per piece, lets us convert between weight offers and piece recipes
// pcsAs   – how many recipe units one offer "piece" holds (a garlic head = 10 fed)
// minAmount – smallest pack of the raw ingredient; smaller packs are pålæg or snacks
//             ("Kyllingebryst 80 g" is sliced cold cuts, not chicken breast)
// match   – regex run against the offer heading; not – regex that vetoes a match
// staple  – basisvare: never priced unless the user turns it on for a recipe

const L = 'a-zæøåéèü';
// Whole word with Danish-aware boundaries ("ris" but not "risalamande").
const word = (s) => new RegExp(`(?<![${L}])(?:${s})(?![${L}])`, 'i');
const has = (s) => new RegExp(s, 'i');

export const CATEGORIES = {
  gront: 'Frugt & grønt',
  kod: 'Kød',
  fisk: 'Fisk',
  mejeri: 'Mejeri & æg',
  brod: 'Brød',
  kolonial: 'Kolonial',
  frost: 'Frost',
  basis: 'Basisvarer'
};

export const INGREDIENTS = {
  // Kød
  hakket_okse: {
    name: 'hakket oksekød', unit: 'g', cat: 'kod', normal: [500, 45], minAmount: 250,
    match: has('(hakket|hk\\.).{0,20}okse|oksefars|hakket kødkvæg'),
    not: has('pålæg|burger|bøf|kebab|lasagne|bolognese|frikadel|færdig')
  },
  hakket_svin: {
    name: 'hakket svinekød', unit: 'g', cat: 'kod', normal: [500, 32], minAmount: 250,
    match: has('(hakket|hk\\.).{0,20}(svine|grise)kød|svinefars'),
    not: has('kalv|okse|pålæg|færdig')
  },
  hakket_grisekalv: {
    name: 'hakket grise- og kalvekød', unit: 'g', cat: 'kod', normal: [500, 38], minAmount: 250,
    match: has('(gris|grise|svine)-? ?(og|&|/) ?kalv|kalve?-? ?(og|&) ?(grise|svine|flæsk)|flæske?- og kalv|frikadellefars'),
    not: has('pålæg|færdig|frikadeller(?!fars)')
  },
  hakket_kylling: {
    name: 'hakket kyllingekød', unit: 'g', cat: 'kod', normal: [400, 30], minAmount: 250,
    match: has('(hakket|hk\\.).{0,20}kylling|kyllingefars'),
    not: has('pålæg|færdig')
  },
  kyllingebryst: {
    name: 'kyllingebryst', unit: 'g', cat: 'kod', normal: [400, 40], minAmount: 200,
    match: has('kyllingebryst|kyllingefilet|kyllingeinderfilet|inderfilet'),
    not: has('pålæg|skiver|nugget|paner|røget|kebab|salat|wings|spyd|tikka|grillet|stegt|med mozzarella|flødekartof')
  },
  kyllingelaar: {
    name: 'kyllingelår', unit: 'g', cat: 'kod', normal: [1000, 45], minAmount: 300,
    match: has('kylling.{0,10}(over|under)?lår|lårfilet|kyllingeoverlår|kyllingeunderlår|kyllingeben'),
    not: has('pålæg|paner|nugget|grillet|stegt|wings')
  },
  hel_kylling: {
    name: 'hel kylling', unit: 'g', cat: 'kod', normal: [1400, 60], minAmount: 800,
    match: has('hel(e)? .{0,15}kylling|kylling,? hel'),
    not: has('grillet|grillkylling|stegt|pålæg|lår|bryst|vinger|hakket')
  },
  flaesk: {
    name: 'flæsk i skiver', unit: 'g', cat: 'kod', normal: [500, 32], minAmount: 200,
    match: has('flæsk i skiver|stegeflæsk|flæskeskiver|skiveskåret.{0,10}flæsk|brystflæsk'),
    not: has('pålæg|sprødt|snack|chips')
  },
  koteletter: {
    name: 'svinekoteletter', unit: 'g', cat: 'kod', normal: [1000, 60], minAmount: 250,
    match: has('kotelet'),
    not: has('lam|kalv|okse|røget|hamburgerryg')
  },
  svinemorbrad: {
    name: 'svinemørbrad', unit: 'g', cat: 'kod', normal: [500, 55], minAmount: 300,
    match: has('mørbrad'),
    not: has('okse|kalv|lam|bøf|pålæg|sauce|sovs|færdig|a la creme')
  },
  oksestrimler: {
    name: 'oksekød i strimler', unit: 'g', cat: 'kod', normal: [400, 55], minAmount: 200,
    match: has('okse.{0,10}strimler|strimler.{0,10}okse|oksekød i strimler|wokstrimler af okse'),
    not: has('pålæg|færdig')
  },
  bacon: {
    name: 'bacon', unit: 'g', cat: 'kod', normal: [200, 22],
    match: word('bacon|baconskiver|bacontern|baconstrimler'),
    not: has('chips|snack|ost|pålæg|dressing|bites|smagt|krydderi|kødpølse|med bacon|m/bacon')
  },
  polser: {
    name: 'pølser', unit: 'g', cat: 'kod', normal: [500, 30], minAmount: 200,
    match: has('pølser|wienerpølse|frankfurter|grillpølse|hotdogpølse|chorizopølse'),
    not: has('pålæg|cocktail|spege|salami|rulle|leverpostej|pølsebrød|pølsehorn|dyre|medister|mini')
  },
  medister: {
    name: 'medisterpølse', unit: 'g', cat: 'kod', normal: [600, 40], minAmount: 250,
    match: has('medister'),
    not: has('pålæg|færdig|røget|sylte|blodpølse|salami')
  },
  oksekod_gryde: {
    name: 'oksekød til gryderet', unit: 'g', cat: 'kod', normal: [600, 80], minAmount: 300,
    match: has('okse.{0,20}(tern|grydesteg|bov|tykkam|spidsbryst)|oksebov|gullaschkød|gullasch|grydesteg af (bov|tykkam)'),
    not: has('lam|pålæg|færdig|suppe|ret(?![a-zæøå])|sovs|sauce|hakket|dåse|burger')
  },

  // Fisk
  laks: {
    name: 'laks', unit: 'g', cat: 'fisk', normal: [400, 70], minAmount: 150,
    match: word('laks|laksefilet|lakseside|laksefileter|laksestykker|laksefars|laksebøf'),
    not: has('røget|gravad|pålæg|salat|sushi|paté|frikadel|smørepålæg|koldrøget|varmrøget|rogn|snack|kats?emad|hunde|indbagt|fars|røræg|asparges|rossini|i citron')
  },
  hvid_fisk: {
    name: 'torsk eller anden hvid fisk', unit: 'g', cat: 'fisk', normal: [400, 55], minAmount: 150,
    match: has('torsk|(?<![a-zæøå])sej(filet|fileter)?(?![a-zæøå])|kuller|rødspætte|fiskefilet|pangasius|kulmule|hvid fisk'),
    not: has('paner|røget|rogn|lever|frikadel|fiskepinde|pålæg|tempura|gratin|fars|frit|indbagt')
  },
  fiskepinde: {
    name: 'fiskepinde', unit: 'g', cat: 'frost', normal: [450, 35],
    match: has('fiskepinde'),
    not: has('mini|snack')
  },
  tun: {
    name: 'tun på dåse', unit: 'g', cat: 'kolonial', normal: [185, 15],
    match: word('tun|tunfisk|tun i vand|tun i olie|tunstykker'),
    not: has('salat|mousse|pålæg|kats?emad|hund|snack|sushi|steak')
  },
  fiskefars: {
    name: 'fiskefars', unit: 'g', cat: 'fisk', normal: [400, 40], minAmount: 200,
    match: has('fiskefars|torskefars|laksefars|sejfars'),
    not: has('frikadel|færdig|stegt|pålæg|kats?emad')
  },
  rejer: {
    name: 'rejer', unit: 'g', cat: 'fisk', normal: [400, 50], minAmount: 150,
    match: word('rejer|vannameirejer|kæmperejer|tigerrejer|kutterrejer|kogte rejer|rå rejer'),
    not: has('salat|tempura|torpedo|paner|indbagt|chips|cocktail|pålæg|i lage|kats?emad|røget|sushi|suppe|krebs|chili-?rejer|snack')
  },

  // Mejeri & æg
  aeg: {
    name: 'æg', unit: 'stk', cat: 'mejeri', normal: [10, 32], gPerStk: 60,
    match: word('æg|skrabeæg|frilandsæg|økologiske æg|buræg|skrabeæg|æggebakke'),
    not: has('påske|chokolade|kinder|salat|nudler|pasta|pålæg|mayo|overraskelse|snaps|likør')
  },
  flode: {
    name: 'fløde', unit: 'ml', cat: 'mejeri', normal: [250, 14],
    match: has('piskefløde|madlavningsfløde|kokkefløde|cremefine|creme cuisine|(?<![a-zæøå])fløde(?![a-zæøå])'),
    not: has('flødeis|is(?![a-zæøå])|bolle|kaffe|chokolade|karamel|kartofler|ost|skum|sprøjte|spray|likør')
  },
  creme_fraiche: {
    name: 'creme fraiche', unit: 'g', cat: 'mejeri', normal: [200, 12],
    match: has('cr[eè]me ?fra[iî]che|cremefraiche|fraiche'),
    not: has('dressing|dress\\.|dip|sauce|chips')
  },
  maelk: {
    name: 'mælk', unit: 'ml', cat: 'mejeri', normal: [1000, 13],
    match: has('(?<![a-zæøå])(sød|let|mini|skummet|kærnemælk|økologisk )?mælk(?![a-zæøå])|minimælk|letmælk|sødmælk|skummetmælk'),
    not: has('chokolade|kakao|kokos|havre|plante|mandel|soja|ris|pulver|kærne|snitte|bøtte|is(?![a-zæøå])|drik|kondens')
  },
  kokosmaelk: {
    name: 'kokosmælk', unit: 'ml', cat: 'kolonial', normal: [400, 12],
    match: has('kokosmælk|coconut milk|kokosfløde'),
    not: has('drik|is(?![a-zæøå])|yoghurt')
  },
  yoghurt: {
    name: 'yoghurt naturel', unit: 'g', cat: 'mejeri', normal: [1000, 18],
    match: has('yoghurt naturel|græsk yoghurt|tyrkisk yoghurt|naturel yoghurt|skyr naturel|yoghurt 10 ?%|ymer'),
    not: has('drik|frugt|vanilje|jordbær|müsli|granola|is(?![a-zæøå])')
  },
  revet_ost: {
    name: 'revet ost', unit: 'g', cat: 'mejeri', normal: [175, 18],
    match: has('revet ost|revet .{0,20}ost|pizzaost|gratinost|ost.{0,10}revet|reven ost|pizza ?topping'),
    not: has('gulerod|kokos|citron|appelsin|ingefær|parmesan')
  },
  mozzarella: {
    name: 'mozzarella', unit: 'g', cat: 'mejeri', normal: [125, 10],
    match: has('mozzarella'),
    not: has('stick|snack|pizza(?![a-zæøå]*ost)|sandwich')
  },
  feta: {
    name: 'feta', unit: 'g', cat: 'mejeri', normal: [200, 16],
    match: has('feta|salattern|salatost|hvid ost i tern|græsk salatost'),
    not: has('dressing|dip|pesto|salat med|tærte')
  },
  parmesan: {
    name: 'parmesan', unit: 'g', cat: 'mejeri', normal: [100, 22],
    match: has('parmesan|grana padano|parmigiano'),
    not: has('chips|kiks|snack|dressing|pesto')
  },
  smor: {
    name: 'smør', unit: 'g', cat: 'basis', normal: [250, 22], staple: true,
    match: has('(?<![a-zæøå])smør(?![a-zæøå])|smørbar|bagemargarine|plantesmør'),
    not: has('smørrebrød|pålæg|kakao|jordnød|peanut|cookie|kage|kiks|brød|hvidløgssmør|kryddersmør|baguette|flute|croissant')
  },

  // Frugt & grønt
  kartofler: {
    name: 'kartofler', unit: 'g', cat: 'gront', normal: [2000, 22],
    match: has('kartofler|kartoffel(?!mos|chips|salat|mel)|bagekartof|nye kartofler|kartofler'),
    not: has('chips|mos|salat|både|pommes|fritter|frit|rösti|røsti|pinsa|gratin|sticks|snack|søde|sød kartof|bataljon|flødekartof|kroketter|hasselback|frost|frossen')
  },
  sode_kartofler: {
    name: 'søde kartofler', unit: 'g', cat: 'gront', normal: [1000, 25], gPerStk: 400,
    match: has('søde kartof|sød kartof|sødkartof'),
    not: has('chips|fritter|frit|frost|frossen|mos|snack')
  },
  loeg: {
    name: 'løg', unit: 'stk', cat: 'gront', normal: [10, 12], gPerStk: 100,
    match: word('løg|gule løg|rødløg|skalotteløg|løg i net'),
    not: has('forårs|purløg|stegte|ristede|syltede|ringe|chips|sovs|sauce|dip|pulver|suppe|marmelade|kryddersalt')
  },
  forarsloeg: {
    name: 'forårsløg', unit: 'stk', cat: 'gront', normal: [1, 8],
    match: has('forårsløg'),
    not: has('dip|chips')
  },
  hvidloeg: {
    name: 'hvidløg', unit: 'stk', cat: 'gront', normal: [30, 12], gPerStk: 5, pcsAs: 10, label: 'fed',
    match: word('hvidløg|hvidløgsfed'),
    not: has('smør|brød|flute|dressing|dip|sauce|pulver|granulat|salt|olie|pasta|chips|pesto|aioli|gyros|mørbrad|kotelet|flæsk|kylling|med hvidløg|/hvidløg|i chili|& urter|philadelphia|krydderolie|crouton')
  },
  gulerod: {
    name: 'gulerødder', unit: 'stk', cat: 'gront', normal: [12, 12], gPerStk: 85,
    match: has('gulerod|gulerødder|gulerød'),
    not: has('juice|kage|revne|revet|salat|snack|stænger|chips|mos|mix|blanding|frost|ærter')
  },
  broccoli: {
    name: 'broccoli', unit: 'stk', cat: 'gront', normal: [1, 15], gPerStk: 400,
    match: has('broccoli|brocolli'),
    not: has('frost|frossen|blanding|wok|mix|tærte|suppe|mos|ris(?![a-zæøå])|-ris|sris')
  },
  blomkaal: {
    name: 'blomkål', unit: 'stk', cat: 'gront', normal: [1, 15], gPerStk: 700,
    match: has('blomkål'),
    not: has('frost|frossen|ris|mos|blanding|mix|suppe|gratin')
  },
  hvidkaal: {
    name: 'spidskål eller hvidkål', unit: 'stk', cat: 'gront', normal: [1, 14], gPerStk: 900,
    match: has('spidskål|hvidkål'),
    not: has('salat|coleslaw|frost|stuvet')
  },
  peberfrugt: {
    name: 'peberfrugt', unit: 'stk', cat: 'gront', normal: [1, 7], gPerStk: 160,
    match: has('peberfrugt|(?<![a-zæøå])(rød|gul|grøn|orange|gul/orange|øko\\.) peber(?![a-zæøå])'),
    not: has('grillede|syltede|frost|pesto|spread|chips|pulver|dip|hummus|fyldte|skinke|sauce|mix')
  },
  agurk: {
    name: 'agurk', unit: 'stk', cat: 'gront', normal: [1, 8], gPerStk: 350,
    match: word('agurk|agurker|slangeagurk|snackagurker'),
    not: has('syltede|asie|salat|pickles|cornichon')
  },
  tomater: {
    name: 'tomater', unit: 'g', cat: 'gront', normal: [500, 20], gPerStk: 100,
    match: has('(?<![a-zæøå])tomater|cherrytomat|snacktomat|blommetomat|cocktailtomat|bøftomat|vintomat'),
    not: has('hakkede|flåede|dåse|soltørrede|passata|ketchup|pur[eé]|suppe|sauce|pesto|juice|tørrede|på glas')
  },
  hakkede_tomater: {
    name: 'hakkede tomater', unit: 'g', cat: 'kolonial', normal: [400, 7],
    match: has('hakkede tomater|flåede tomater|tomater på dåse|passata|tomatpassata|tomater i tern'),
    not: has('suppe|ketchup|chili sauce')
  },
  tomatpure: {
    name: 'tomatpuré', unit: 'g', cat: 'kolonial', normal: [140, 9],
    match: has('tomatpur'),
    not: has('suppe')
  },
  squash: {
    name: 'squash', unit: 'stk', cat: 'gront', normal: [1, 10], gPerStk: 300,
    match: has('squash|courgette|zucchini'),
    not: has('saft|drik|frost|nudler|spaghetti|sirup|kage|tuborg|coca|fanta|schweppes|sodavand|pepsi|faxe')
  },
  champignon: {
    name: 'champignon', unit: 'g', cat: 'gront', normal: [250, 15],
    match: has('champignon|svampe(?!suppe)|brune champignon|østershatte|portobello'),
    not: has('suppe|sauce|sovs|dåse|konserv|ristede|marinerede|på glas|pizza|frost|paté|pate|postej|pålæg|sky|risotto')
  },
  spinat: {
    name: 'spinat', unit: 'g', cat: 'gront', normal: [200, 16],
    match: has('spinat'),
    not: has('tærte|lasagne|pizza|pande|bøf|fyldt|tortellini|ravioli|wrap|dip|indbagt|laks|rejer|sauce|risotto|fettuccine|pasta')
  },
  salat: {
    name: 'salat', unit: 'g', cat: 'gront', normal: [150, 15], gPerStk: 250,
    match: has('salat ?mix|salatblanding|salathoved|hjertesalat|icebergsalat|iceberg|romaine|rucola|babyspinat|feldsalat|frisk salat|salatbuket'),
    not: has('kartoffel|pasta|tun|æg|reje|høns|italiensk|waldorf|skaldyr|kylling|cæsar|caesar|dressing|bowl|kartofel|prosciutto|pizza')
  },
  majs: {
    name: 'majs', unit: 'g', cat: 'kolonial', normal: [300, 10],
    match: word('majs|majskorn|majskolber?|sukkermajs|perlemajs'),
    not: has('chips|mel|popcorn|snack|stivelse|tortilla|nachos|kiks|crisps|pops')
  },
  aerter: {
    name: 'ærter', unit: 'g', cat: 'frost', normal: [450, 16],
    match: has('(?<![a-zæøåk])ærter(?![a-zæøå])|grønne ærter|haveærter|sukkerærter'),
    not: has('kikærter|snack|wasabi|mos|suppe|split')
  },
  groenne_bonner: {
    name: 'grønne bønner', unit: 'g', cat: 'frost', normal: [450, 18],
    match: has('grønne bønner|haricots? verts?|bønner, grønne|aspargesbønner'),
    not: has('snack|kaffe')
  },
  kikaerter: {
    name: 'kikærter', unit: 'g', cat: 'kolonial', normal: [400, 9],
    match: has('kikærter'),
    not: has('snack|chips|hummus|mel|ristede')
  },
  bonner: {
    name: 'kidneybønner eller sorte bønner', unit: 'g', cat: 'kolonial', normal: [400, 9],
    match: has('kidneybønner|sorte bønner|chilibønner|bønner i chili|hvide bønner|(?<![a-zæøå])bønner(?![a-zæøå])'),
    not: has('kaffe|grønne|snack|chips|vanilje|haricot|asparges|edamame|helbønner|hele bønner|espresso')
  },
  linser: {
    name: 'røde linser', unit: 'g', cat: 'kolonial', normal: [500, 20],
    match: word('linser|røde linser'),
    not: has('kontakt|chips|snack|pasta|suppe|grønne|beluga|puy')
  },
  gronne_linser: {
    name: 'grønne linser eller belugalinser', unit: 'g', cat: 'kolonial', normal: [400, 20],
    match: has('grønne linser|beluga ?linser|puy ?linser|linser,? grønne'),
    not: has('kontakt|chips|snack|pasta|suppe|salat')
  },
  porre: {
    name: 'porre', unit: 'stk', cat: 'gront', normal: [1, 6], gPerStk: 250,
    match: word('porre|porrer'),
    not: has('suppe|tærte|frost|farser')
  },
  graeskar: {
    name: 'græskar (hokkaido)', unit: 'stk', cat: 'gront', normal: [1, 20], gPerStk: 1200,
    match: has('hokkaido|græskar|butternut'),
    not: has('kerne|frø|hoved|lanterne|pynt|plys|hækle|stage|spøgelse|halloween|familie|ternet|suppe|mos|olie|chips|kage|figur|lys|dekoration|krus|skål')
  },
  rodbeder: {
    name: 'rødbeder', unit: 'g', cat: 'gront', normal: [1000, 15], gPerStk: 150,
    match: has('rødbede'),
    not: has('syltede|sukker|skiver|salat|chips|juice|saft|eddike|hummus|pesto|dip|glas|bøf|frikadel|carpaccio')
  },
  groenkaal: {
    name: 'grønkål', unit: 'g', cat: 'gront', normal: [300, 18], gPerStk: 300,
    match: has('grønkål'),
    not: has('salat|pesto|chips|frost|frossen|stuvet|skinke|glaseret|tærte|smoothie|juice')
  },
  aebler: {
    name: 'æbler', unit: 'stk', cat: 'gront', normal: [7, 18], gPerStk: 150,
    match: word('æble|æbler|madæbler|spiseæbler'),
    not: has('juice|most|gløgg|cider|eddike|kage|chips|tærte|mos|saft|grød|ringe|tørrede|(?<![a-zæøå])is(?![a-zæøå])|sodavand|marmelade|skiver|chutney|drik|snack|kiks')
  },
  citron: {
    name: 'citron', unit: 'stk', cat: 'gront', normal: [1, 4], gPerStk: 110,
    match: word('citron|citroner'),
    not: has('saft|vand|te|kage|peber|marmelade|is|sodavand|drik|tærte|curd|likør|øl|lemonade|marineret|kylling|med citron|rosmarin|yoghurt|cheasy|fromage')
  },
  lime: {
    name: 'lime', unit: 'stk', cat: 'gront', normal: [1, 4], gPerStk: 70,
    match: word('lime|limefrugt|limefrugter'),
    not: has('sodavand|vand|juice|saft|kondi|cola|øl|cider|chips|is|drik|sirup|7up|sprite|pepsi|mojito|tonic')
  },
  avocado: {
    name: 'avocado', unit: 'stk', cat: 'gront', normal: [1, 8], gPerStk: 170,
    match: has('avocado'),
    not: has('creme|dip|guacamole|olie|frost|frossen')
  },
  ingefaer: {
    name: 'frisk ingefær', unit: 'g', cat: 'gront', normal: [100, 6],
    match: has('ingefær'),
    not: has('shot|juice|kage|drik|te|øl|syltet|kiks|pulver|chokolade|bolsje|ale|lemonade|stødt')
  },
  mango: {
    name: 'mango', unit: 'stk', cat: 'gront', normal: [1, 10], gPerStk: 350,
    match: word('mango|mangoer'),
    not: has('juice|chutney|is|drik|smoothie|saft|lassi|dressing|tørret|sorbet|sodavand|naturens|pind')
  },
  krydderurter: {
    name: 'friske krydderurter', unit: 'stk', cat: 'gront', normal: [1, 14], label: 'bundt',
    match: has('(frisk|friske|potte).{0,15}(basilikum|koriander|persille|dild|purløg|krydderurt)|(basilikum|koriander|persille|dild|purløg) i potte|krydderurter|^(øko\\. )?(persille|dild|basilikum|koriander|purløg)( bredbl\\.?)?$'),
    not: has('tørret|pesto|frost|frossen|smør|salt|olie|rod')
  },
  frost_gront: {
    name: 'frosne grøntsager', unit: 'g', cat: 'frost', normal: [750, 18],
    match: has('wokgrøntsager|wokblanding|grøntsagsblanding|frosne grøntsager|grøntsager.{0,10}frost|harvest best grøntsager|wok ?mix'),
    not: has('suppe|lasagne|pizza|færdig')
  },

  // Kolonial & brød
  ris: {
    name: 'ris', unit: 'g', cat: 'kolonial', normal: [1000, 18],
    match: has('(?<![a-zæøå])ris(?![a-zæøå])|jasminris|basmatiris|parboiled|fuldkornsris|langkornet|risottoris'),
    not: has('risalamande|riskiks|à la|grød|blomkål|broccoli|papir|nudler|mel|chips|mælk|drik|kager|kiks|snack|vafler|crisp|cuisine|creme|risbar|riceup')
  },
  pasta: {
    name: 'pasta', unit: 'g', cat: 'kolonial', normal: [500, 12],
    match: has('(?<![a-zæøå])pasta(?![a-zæøå])|spaghetti|penne|fusilli|farfalle|tagliatelle|makaroni|rigatoni|fettuccine|linguine|skruer|pastaskruer|fuldkornspasta'),
    not: has('salat|sauce|pesto|færdigret|lasagne|tortellini|ravioli|fyldt|squash|suppe|snack|ret(?![a-zæøå])')
  },
  lasagneplader: {
    name: 'lasagneplader', unit: 'g', cat: 'kolonial', normal: [500, 16],
    match: has('lasagneplade|lasagnaplade'),
    not: null
  },
  nudler: {
    name: 'nudler', unit: 'g', cat: 'kolonial', normal: [250, 12],
    match: has('ægnudler|risnudler|udon|(?<![a-zæøå])nudler(?![a-zæøå])|hvedenudler|wok ?nudler'),
    not: has('instant|cup|kop|suppe|snack|mama|yum|squash|samyang|nissin|koka|indomie|shin|smag')
  },
  tortillas: {
    name: 'tortillas', unit: 'stk', cat: 'brod', normal: [8, 16], gPerStk: 40,
    match: has('tortilla|wraps'),
    not: has('chips|nachos|snack|crisps|pizza|færdig')
  },
  burgerboller: {
    name: 'burgerboller', unit: 'stk', cat: 'brod', normal: [4, 16], gPerStk: 65,
    match: has('burgerbolle|burgerbrød|briochebolle|hamburgerbolle|bøfbolle|briocheburger'),
    not: null
  },
  pita: {
    name: 'pitabrød', unit: 'stk', cat: 'brod', normal: [6, 14], gPerStk: 70,
    match: has('pita'),
    not: has('chips|snack')
  },
  rugbrod: {
    name: 'rugbrød', unit: 'g', cat: 'brod', normal: [1000, 25],
    match: has('rugbrød'),
    not: has('chips|kiks|sandwich|toast|bagemix|bland|boller|mel(?![a-zæøå])|pålæg|smørrebrød|crouton|snack')
  },
  pizzadej: {
    name: 'pizzadej', unit: 'g', cat: 'kolonial', normal: [400, 16],
    match: has('pizzadej|pizzabund|pizza dej'),
    not: null
  },
  tacokrydderi: {
    name: 'tacokrydderi', unit: 'g', cat: 'kolonial', normal: [28, 9],
    match: has('taco ?krydder|taco ?mix|taco seasoning|tacokrydderi|taco spice'),
    not: null
  },
  karrypasta: {
    name: 'rød karrypasta', unit: 'g', cat: 'kolonial', normal: [100, 16],
    match: has('karry ?pasta|curry ?paste|red curry|rød karry|green curry|grøn karry'),
    not: has('suppe|færdigret|thaibox|blanding|lækkert|mix|sauce')
  },
  pesto: {
    name: 'pesto', unit: 'g', cat: 'kolonial', normal: [190, 22],
    match: word('pesto|pesto genovese|pesto rosso'),
    not: null
  },

  // Basisvarer – ikke med i prisen, medmindre brugeren slår dem til
  salt: {
    name: 'salt', unit: 'g', cat: 'basis', normal: [1000, 8], staple: true,
    match: word('salt|havsalt|bordsalt|flagesalt|groft salt|fint salt'),
    not: has('chips|lår|stykke|kød|snack|mix|focaccia|nød|peanut|smør|mandler|lakrids|karamel|salty')
  },
  peber: {
    name: 'peber', unit: 'g', cat: 'basis', normal: [50, 18], staple: true,
    match: has('sort peber|peber,? sort|kværnet peber|peberkorn|stødt peber|hel peber'),
    not: has('sauce|skinke|bøf|salami|ost|mix|paté|pate|postej|grønne peber')
  },
  olie: {
    name: 'olie', unit: 'ml', cat: 'basis', normal: [1000, 30], staple: true,
    match: has('rapsolie|solsikkeolie|olivenolie|madolie'),
    not: has('krydder|oliven &|i olie|chili|hvidløg|spray|dressing|tun|sild|sardin')
  },
  hvedemel: {
    name: 'hvedemel', unit: 'g', cat: 'basis', normal: [1000, 10], staple: true,
    match: word('hvedemel|bage hvedemel'),
    not: has('fuldkorn|gluten')
  },
  sukker: {
    name: 'sukker', unit: 'g', cat: 'basis', normal: [1000, 12], staple: true,
    match: word('sukker|stødt melis|rørsukker|perlesukker'),
    not: has('u/sukker|m/sukker|uden sukker|vanilje|flormelis|farin|kandis|sukkerfri')
  },
  bouillon: {
    name: 'bouillon', unit: 'stk', cat: 'basis', normal: [12, 15], staple: true, label: 'terning', gPerStk: 10,
    match: has('bouillon'),
    not: has('suppe|ret|flydende|fond')
  },
  eddike: {
    name: 'eddike', unit: 'ml', cat: 'basis', normal: [500, 10], staple: true,
    match: has('eddike'),
    not: has('cider|balsam|vin|æble|sild|agurk|rødbede')
  },
  soja: {
    name: 'soja', unit: 'ml', cat: 'basis', normal: [150, 15], staple: true,
    match: has('soja ?sauce|sojasovs|soya ?sauce'),
    not: has('dressing|marinade')
  },
  honning: {
    name: 'honning', unit: 'g', cat: 'basis', normal: [450, 30], staple: true,
    match: has('honning'),
    not: has('melon|kyl|lårfilet|chili|sennep|dressing|kage|müsli|granola|yoghurt|skinke|marinade')
  },
  paprika: {
    name: 'paprika', unit: 'g', cat: 'basis', normal: [45, 10], staple: true,
    match: word('paprika|sød paprika|mild paprika|røget paprika'),
    not: has('chips|chorizo|pølse|ost|snack|m/')
  },
  spidskommen: { name: 'spidskommen', unit: 'g', cat: 'basis', normal: [33, 20], staple: true, match: has('spidskommen'), not: null },
  karry: {
    name: 'karry', unit: 'g', cat: 'basis', normal: [35, 11], staple: true,
    match: word('karry|karrypulver|currypulver|karry madras'),
    not: has('sild|salat|bidder|pasta|sauce|ketchup|dressing|kylling|ret|mayo|paste')
  },
  oregano: { name: 'oregano', unit: 'g', cat: 'basis', normal: [10, 7], staple: true, match: word('oregano'), not: has('øko') },
  laurbaer: { name: 'laurbærblade', unit: 'stk', cat: 'basis', normal: [20, 12], staple: true, match: word('laurbærblade|laurbær'), not: null },
  timian: { name: 'timian', unit: 'g', cat: 'basis', normal: [30, 8], staple: true, match: word('timian|tørret timian'), not: has('øko') },
  chili: {
    name: 'chiliflager', unit: 'g', cat: 'basis', normal: [40, 16], staple: true,
    match: has('chiliflager|chili flager|knust chili|chilipulver|cayenne'),
    not: null
  }
};
