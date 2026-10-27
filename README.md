# Mæt. – MVP (scrape-versionen)

Swipe dig til ugens aftensmad – bygget på **alle** ugens tilbudsaviser.

> **Denne version** henter alle kæders tilbud via Tjek/eTilbudsavis' API og REMA's webshop-API – bedste dækning og præcise priser, til test og demo.
> Versionen, der læser kædernes egne avis-PDF'er (tænkt til lancering), ligger i repoet [idebanken-mad-app-pdf-aviser](https://github.com/Aske0772/idebanken-mad-app-pdf-aviser).

1. Appen henter tilbudsaviserne fra 15 kæder og finder de madvarer, der kan bruges i opskrifter.
2. Den udregner, hvilke retter man kan lave af ugens tilbud, og gemmer dem i ugens database.
3. Du vælger dine butikker og swiper: højre = vil have, venstre = næste.
4. Vælg antal dage og personer → se prisen i alt og **pr. person pr. måltid**. Basisvarer (salt, peber, olie …) er ikke med, men kan slås til.
5. Ugen samles til én indkøbsliste, grupperet pr. butik.

Arbejdstitel: "Mæt". Navnet står i `web/index.html`, `web/public/manifest.webmanifest` og som `.brand` i komponenterne.

## Kom i gang

Kræver Node 22.5+ (bruger den indbyggede `node:sqlite`).

```bash
npm run setup
```

```bash
npm run dev
```

Åbn http://localhost:5173 – gerne i mobilvisning. Første gang henter serveren ugens tilbudsaviser (ca. 30–60 sek).

| Kommando | Hvad |
|---|---|
| `npm run dev` | API (port 8787) + web (port 5173) |
| `npm run refresh` | Hent tilbudsaviser og genberegn ugens retter |
| `npm test` | Server- og pristests |
| `npm run build && npm start` | Produktionsbuild serveret af API'et på port 8787 |
| `npm run export --prefix server -- <mappe>` | Hent ugens priser og skriv `week.json` + billeder til en mappe (statisk version) |

Miljøvariabler: `API_PORT` (8787), `LAT`/`LNG` (standard: København) til tilbud for et område, `DB_FILE`, `CONTACT_EMAIL` (kontakt i User-Agent, se [docs/datahentning.md](docs/datahentning.md)), `DISABLED_SOURCES` (nødbremse: `tjek`, `rema`, `lidl`), `REFRESH_HOURS` (standard 24). Til webbuildet: `BASE_PATH` (sti appen ligger under) og `VITE_WEEK_URL` (hent ugen fra en statisk fil i stedet for `/api/week`).

**GitHub Pages:** `.github/workflows/pages.yml` bygger en statisk version uden server: appen bygges med `BASE_PATH=/idebanken-mad-app/`, og ugens priser hentes i workflowet og lægges ved som `week.json`. Den kører ved hvert push til main og én gang i døgnet. Kræver, at Pages-kilden i repoets indstillinger står til "GitHub Actions".

## Sådan hænger det sammen

```
server/
  src/sources/http.js   én høflig HTTP-klient til alle kilder (User-Agent, pauser, blokering)
  src/sources/tjek.js   henter tilbud (eTilbudsavis' offentlige API) – kun fakta, førpris fra teksten
  src/sources/rema.js   REMA 1000's hyldepriser (eget webshop-API)
  src/sources/lidl.js   Lidls faste priser (lidl.dk)
  src/ingredients.js    ~70 ingredienser: enhed, normalpris, regex til at genkende tilbud
  src/match.js          tilbud → ingrediens, inkl. enhedsomregning (kg ↔ stk) og prisfornuftstjek
  src/recipes.js        34 egne opskrifter med "hero"-ingredienser
  src/week.js           ugens snapshot: tilbud, matches og retter → SQLite
  src/index.js          GET /api/week, POST /api/refresh, /images
web/
  src/lib/pricing.js    al prisberegning (hele pakker, billigste butik, delte varer)
  src/components/       Onboarding, SwipeView (fotokort), DishDetail (glaspanel), WeekView, ListView
```

**Hvilke retter vises?** En ret kommer i bunken, når mindst én af dens hero-ingredienser (fx kyllingebryst i kylling i karry) er på tilbud i en af dine butikker. Bunken sorteres efter pris pr. portion.

**Hvordan regnes prisen?** For hver ingrediens: mængde × personer × dage ÷ opskriftens portioner, altid købt i hele pakker. På indkøbslisten lægges mængderne sammen på tværs af retter, så to retter med løg deler ét net.

**Hvor kommer priserne fra?** Kun priser, der gælder lige nu (startet og ikke udløbet), bruges. I prioriteret rækkefølge:

| Kilde | Hvad | Vises som |
|---|---|---|
| `tilbud` | Ugens avis (gælder ≤ 14 dage) i dine butikker | "Netto · tilbud til fre. 30.10" |
| `fast` | Langvarige katalogpriser i dine butikker (fx Lidls Madværket) | "Lidl · fast pris" |
| `hylde` | REMA 1000's og Lidls hyldepriser: hele REMA's sortiment fra deres webshop-API, og Lidls faste hverdagspriser fra lidl.dk (Hverdagsfavoritter og Madværket – kun ca. 40 varer, mest brød, pålæg og sild) | "REMA 1000 · hyldepris" |
| `reference` | REMA's eller Lidls hyldepris, når du ikke handler i den kæde | "vejledende" + "ca." |
| `estimate` | Eget skøn – kun hvis ingen rigtig pris findes | "anslået pris" + "ca." |

Kun `tilbud` afgør, hvilke retter der kommer i bunken. Vejledende/anslåede beløb vises separat ("heraf ca. 113 kr …"), så brugeren ved præcis, hvad der er sikkert.

**Friskhed:** serveren henter alt igen højst én gang i døgnet (`REFRESH_HOURS`, standard 24) og ved ugeskift, og tjekker hver time om det er tid. Udløbne tilbud forsvinder af sig selv via deres datoer. En kilde, der fejler eller blokerer, beholder sine sidste gyldige priser, også over et ugeskift. Appen henter nye priser, når den åbnes igen, og hvert 15. minut. "Priser opdateret i dag kl. 10.35" står på uge- og indkøbssiden.

**Billeder:** Læg `<opskrift-id>.jpg|webp|png` i `server/data/images/`, så bruges de automatisk. Indtil da tegner appen en farvet tallerken pr. ret. Prompts til AI-genererede close-up-fotos (Nano Banana Pro via Figma Weave) ligger i `server/data/image-prompts.json`.

**Kort og detaljer:** Swipe-kortet viser kun det, der afgør et swipe: foto, titel, tid, pris pr. portion og ugens tilbud. Et tryk på kortet åbner detaljevisningen med dage/personer, pris, basisvarer og fanerne Ingredienser og Opskrift. Hjertet gemmer retten under fanen "Gemte". "Erstat" lader den nye ret tage pladsen for en ret i ugen (den overtager dens dage og personer, og den gamle kommer tilbage i bunken); når ugen ville gå over 7 aftener, er "Erstat en ret" hovedknappen.

## Datakilde – vigtigt

Tilbuddene hentes fra Tjek's (eTilbudsavis') offentlige API uden nøgle, og hyldepriser fra REMA 1000's offentlige webshop-API og Lidls produktsider på lidl.dk. Det er fint til en prototype, men **ikke** til en app i drift: få en licens (Tjek sælger API-adgang) eller aftaler med kæderne, før appen udgives – eller brug PDF-avis-versionen. Kilden er isoleret i `server/src/sources/`, så den kan skiftes ud. Se [docs/kilder-pr-kaede.md](docs/kilder-pr-kaede.md) for hver kædes egne kilder, og [docs/datahentning.md](docs/datahentning.md) for reglerne vi henter efter (ærlig User-Agent, højst én hentning i døgnet, kun fakta, automatisk pause ved blokering, nødbremsen `DISABLED_SOURCES` og hvad vi gør ved et påkrav).

## Mambeno-analysen

Se [docs/mambeno-analyse.md](docs/mambeno-analyse.md): hvad REA fandt på mambeno.dk, hvilke features vi tog med, og hvad vi gør anderledes.

## Til native app

Web-appen er bygget mobil-først, så den kan pakkes med [Capacitor](https://capacitorjs.com) uden omskrivning: `npm i @capacitor/core @capacitor/cli`, `npx cap init`, `npx cap add ios android`, og peg `webDir` på `web/dist`. API'et skal så køre på en server.

## Næste skridt

- Flere opskrifter (eller AI-genererede ud fra ugens tilbud)
- Rigtige billeder pr. ret
- Brugerkonti og deling af indkøbsliste i familien
- Madpakker, tilbagevendende varer, print af ugeplan
- Ugentlig automatisk opdatering (cron) i stedet for ved første kald
