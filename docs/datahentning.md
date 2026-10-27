# Datahentning – regler, nødbremse og hvad der sker ved et påkrav

Skrevet 27.10.2026. Supplement til [kilder-pr-kaede.md](kilder-pr-kaede.md), som beskriver kilderne. Dette dokument beskriver, *hvordan* vi henter, så risikoen er lille, og hvad vi gør, hvis nogen beder os stoppe. Ikke juridisk rådgivning.

## Reglerne, som koden håndhæver

| Regel | Hvor | Hvad |
|---|---|---|
| Ærlig afsender | `server/src/sources/http.js` | Alle kald går gennem én klient med User-Agent `Maet/0.1 (+kontakt; prototype)`. Sæt `CONTACT_EMAIL`, så kontakten er en mailadresse og der sendes en `From`-header. Uden den peger kontakten på GitHub-repoet. |
| Få kald, med pause | `http.js`, `index.js`, `pages.yml` | Mindst 400 ms mellem kald til samme host (`FETCH_GAP_MS`). Hentning højst én gang i døgnet pr. kilde (`REFRESH_HOURS`, standard 24; Pages-workflowet kører 05:17 UTC). Udløbne tilbud forsvinder af sig selv via deres egne datoer, så daglig hentning er nok. |
| Stop når vi bliver bedt om det | `http.js`, `week.js` | Svarer en host 401, 403 eller 429, kastes `SourceBlockedError`, de resterende butikker fra samme kilde springes over, og kilden får 24 timers pause (`BLOCK_COOLDOWN_HOURS`). 429/503 prøves én gang igen efter `Retry-After`. |
| Ingen omgåelse | alle kilder | Ingen login, ingen tokens, ingen cookies, ingen robots-blokerede stier, ingen skift af IP eller User-Agent. |
| Kun fakta | `tjek.js`, `rema.js`, `lidl.js`, `week.js` | Gemmer varenavn, pakkestørrelse, pris, førpris og gyldighed. Billeder gemmes aldrig (`image` er altid null), og Tjeks reklametekst gemmes ikke. Teksten læses én gang for "Normalpris", "Før" eller "Spar X,-" (det tal skal efter prismærkningsreglerne være laveste pris de seneste 30 dage) og smides derefter væk. |
| Kun det, opskrifterne bruger | `week.js` | Tilbud uden ingrediens-match gemmes ikke. Appen viser aldrig en hel avis, kun varerne til en ret. |
| Appen dør ikke, når en kilde gør | `week.js` | En kilde, der fejler, blokerer eller er slået fra, beholder sidste gode priser. Ved ugeskift kopieres de priser, der stadig gælder, med over i den nye uge (`carryForward`). Hver kildes seneste status ligger i tabellen `source_runs` og sendes med som `sources` i `/api/week`. |

## Nødbremse

Slå en kilde fra uden at røre koden:

```bash
DISABLED_SOURCES=tjek npm start
```

Kildenavne: `tjek` (alle kæders aviser), `rema` (REMA's hyldepriser), `lidl` (Lidls faste priser). Flere adskilles med komma. En slukket kilde kaldes ikke, dens sidste gyldige priser bliver stående, og `errors` i payloaden siger "tjek: slået fra (DISABLED_SOURCES)". På GitHub Pages sættes variablen som repository variable og læses i workflowet.

## Hvis der kommer et brev

1. **Samme dag:** sæt `DISABLED_SOURCES` for den kilde brevet handler om, og deploy. Hentningen stopper med det samme. Appen kører videre på de priser, der allerede ligger i databasen, til de udløber.
2. **Svar inden fristen**, høfligt og kort: hvad vi hentede (kun fakta), hvor sjældent, at vi er stoppet, og at vi gerne vil tale om en aftale eller licens. Gem brevet og svaret.
3. **Slet ikke data i panik**, men hent ikke nyt. Bliver der bedt om sletning af det hentede, så slet rækkerne for den kilde i `offers` og `offer_matches`.
4. **Skift kilde.** Kædens egen kilde eller PDF (se kilder-pr-kaede.md), eller en licens. Kilderne er isoleret i `server/src/sources/`, så det er én fil pr. kilde.
5. **Før lancering:** advokat på modellen, og skriftlige aftaler med Tjek og/eller kæderne. Dette dokument viser, at vi har handlet forsigtigt, hvilket tæller hvis det nogensinde bliver en sag.

## Hvad der stadig er prototype

Tjek-kaldet er uden nøgle og mod Tjeks vilkår for systematisk hentning. Det er acceptabelt til test og demo med reglerne ovenfor, ikke til en app med brugere. REMA og Lidl er kædernes egne åbne kilder uden vilkår mod automatisk adgang, men ophavsretslovens § 71 (katalogbeskyttelse) kan stadig være relevant, så de samme regler gælder dér.
