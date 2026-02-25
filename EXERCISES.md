# Uebungsaufgaben – Demo Service-Portal

## Voraussetzungen

- App laeuft lokal (`npm run dev:client` oder `npm run dev`)
- Cypress ist installiert (`npx cypress open`)
- `baseUrl` in `cypress.config.ts` zeigt auf `http://localhost:5173`

---

## Paket 1: Smoke-Tests (Core)

> Ziel: Grundlegende Navigation und Seitenstruktur absichern.

### Aufgabe 1.1 – Startseite laden

Schreibe einen Test, der prueft:
- `cy.visit('/')` laedt erfolgreich
- `data-testid="landing-page"` ist sichtbar
- Der App-Titel enthaelt "Service"

**Selektoren:** `app-title`, `landing-page`

### Aufgabe 1.2 – Navigation zu Programme

Schreibe einen Test, der prueft:
- Klick auf "Programme" im Menue
- URL wechselt zu `/programs`
- `data-testid="programs-page"` ist sichtbar
- Nav-Link traegt Klasse `app-nav-link--active`

**Selektoren:** `nav-link-programs`, `programs-page`

### Aufgabe 1.3 – 404-Seite

Schreibe einen Test, der prueft:
- `cy.visit('/gibts-nicht')` zeigt die 404-Seite
- `data-testid="not-found-page"` ist sichtbar
- Text "404" ist enthalten

**Selektoren:** `not-found-page`

---

## Paket 2: Selektoren & Assertions (Core)

> Ziel: Stabile Selektoren und verschiedene Assertion-Varianten ueben.

### Aufgabe 2.1 – Programm-Karten zaehlen

Pruefe, dass die Programmliste mindestens 1 Karte (`program-card`) anzeigt.

**Hint:** `should('have.length.at.least', 1)`

### Aufgabe 2.2 – Kategorie pruefen

Pruefe, dass mindestens eine Programm-Karte die Kategorie "Beratung" enthaelt.

**Hint:** `cy.contains('[data-testid=program-card]', 'Beratung')`

### Aufgabe 2.3 – Nav-Status nach Navigation

Navigiere zu Programme, dann zurueck zur Startseite. Pruefe:
- Auf `/programs`: Nav-Link hat `app-nav-link--active`
- Auf `/`: Nav-Link hat die Klasse **nicht** mehr

**Selektoren:** `nav-link-programs`, `nav-link-home`

---

## Paket 3: Netzwerk-Intercepts (Core)

> Ziel: `cy.intercept()` und `cy.wait()` sicher einsetzen.

### Aufgabe 3.1 – Programmliste abfangen

Registriere einen Intercept auf `GET /programs`, warte darauf und pruefe:
- Statuscode ist 200 (oder 304)
- Danach sind Karten sichtbar

```ts
cy.intercept('GET', '**/programs*').as('getPrograms')
cy.visit('/programs')
cy.wait('@getPrograms').its('response.statusCode').should('be.oneOf', [200, 304])
```

### Aufgabe 3.2 – Fehler simulieren (500)

Nutze Header-Injection, um einen 500-Fehler beim Laden der Programme zu erzwingen:
- `req.headers['x-sim-error'] = '500'`
- Pruefe, dass `[role=alert]` sichtbar wird

### Aufgabe 3.3 – Latenz simulieren

Erzwinge kuenstliche Latenz:
- `req.headers['x-sim-delay'] = '800'`
- Pruefe, dass der Spinner (`data-testid="spinner"`) erscheint und wieder verschwindet

---

## Paket 4: Login & Auth-Flows (Core)

> Ziel: Formulare testen und Fehlerzustaende pruefen.

### Aufgabe 4.1 – Erfolgreicher Login

Logge dich mit `citizen@example.com` / `password` ein und pruefe:
- Redirect zur Startseite
- Nav zeigt "Neuer Antrag" statt "Login"

### Aufgabe 4.2 – Fehlerhafter Login

Versuche Login mit falschen Daten und pruefe:
- Error-Banner (`data-testid="login-error"`) erscheint
- Text enthaelt "Ungueltige"

### Aufgabe 4.3 – Bug finden: Error klebt

Fuehre nacheinander einen fehlerhaften und einen erfolgreichen Login durch.
Was passiert mit dem Error-Banner? Schreibe einen Test, der dieses Verhalten nachweist.

**Tipp:** Dies ist ein bewusst eingebauter Bug!

---

## Paket 5: Fehler-Szenarien (Core)

> Ziel: Edge-Cases und Fehlerpfade systematisch testen.

### Aufgabe 5.1 – Backoffice ohne Login

Rufe `/backoffice/applications` ohne Login auf.
Pruefe, dass ein Redirect auf `/login` stattfindet.

### Aufgabe 5.2 – Bug finden: returnTo geht verloren

Rufe `/backoffice/applications` ohne Login auf, logge dich dann als Officer ein.
Wo landet man? Schreibe einen Test, der den erwarteten Redirect-Pfad prueft.

**Tipp:** Achte auf den `returnTo`-Parameter in der URL!

### Aufgabe 5.3 – Filter-Edgecase finden

Teste den Programmfilter mit:
1. Einem einzelnen Buchstaben ("I")
2. Leerzeichen vor/nach dem Suchbegriff (" Beratung ")

Was passiert? Schreibe Tests fuer beide Faelle.

---

## Paket 6: Advanced – Bugs finden UND fixen

> Diese Aufgaben sind fuer Fortgeschrittene. Ziel: Bug per Test nachweisen, dann im App-Code fixen.

### Aufgabe 6.1 – Double-Submit verhindern

**Szenario:** Fulle das Antragsformular aus und klicke den Submit-Button zweimal schnell hintereinander.

1. Schreibe einen Intercept-Test, der zaehlt, wie oft `POST /applications` aufgerufen wird
2. Der Test sollte nachweisen, dass zwei Requests feuern
3. **Fix:** Aendere `NewApplicationPage.tsx` so, dass der Button waehrend des Submits disabled ist

**Hints:**
- `cy.get('@alias.all').should('have.length', 1)`
- `.dblclick()` simuliert den Doppelklick

### Aufgabe 6.2 – Stale-Data in der Liste

**Szenario:** Aendere den Status eines Antrags im Backoffice-Detail. Navigiere zurueck zur Liste.

1. Pruefe, ob die Liste den neuen Status zeigt
2. Der Test sollte zeigen, dass die Liste veraltet ist
3. **Fix:** Sorge dafuer, dass die Liste nach der Rueckkehr neu geladen wird

**Hints:**
- Navigiere mit `cy.get('[data-testid=nav-link-backoffice]').click()` zurueck
- Idee: Key auf der Route oder `useEffect` mit Dependency

### Aufgabe 6.3 – Race-Condition in der Suche

**Szenario:** Tippe schnell "Be", warte kurz, dann "Beratung". Nutze `x-sim-delay`, um den ersten Request kuenstlich zu verlangsamen.

1. Pruefe, ob die Ergebnisse zum letzten Suchbegriff passen
2. Der Test sollte zeigen, dass die verzoegerte Antwort die neueren Ergebnisse ueberschreibt
3. **Fix:** Implementiere einen `AbortController`, der alte Requests bei neuem Input abbricht

**Hints:**
- Zwei separate Intercepts mit unterschiedlichen URL-Patterns und Delays
- Die Reihenfolge der `cy.wait()`-Aufrufe ist hier entscheidend

---

## Referenz: Wichtige Selektoren

| Element          | data-testid              |
|------------------|--------------------------|
| App Shell        | `app-shell`              |
| Header           | `app-header`             |
| Titel            | `app-title`              |
| Navigation       | `app-nav`                |
| Nav: Start       | `nav-link-home`          |
| Nav: Programme   | `nav-link-programs`      |
| Nav: Login       | `nav-link-login`         |
| Nav: Neuer Antrag| `nav-link-new-application`|
| Nav: Backoffice  | `nav-link-backoffice`    |
| Logout-Button    | `logout-button`          |
| Landing Page     | `landing-page`           |
| Programs Page    | `programs-page`          |
| Login Page       | `login-page`             |
| 404 Page         | `not-found-page`         |
| Programm-Karte   | `program-card`           |
| Filter-Feld      | `filter-input`           |
| Ergebnis-Bereich | `results`                |
| Spinner          | `spinner`                |
| Error-Banner     | `error-banner`           |
| Login: E-Mail    | `login-email`            |
| Login: Passwort  | `login-password`         |
| Login: Submit    | `login-submit`           |
| Login: Error     | `login-error`            |
| Antrags-Zeile    | `application-row`        |
| Status-Aendern   | `change-status`          |
| Toast            | `toast`                  |

## Referenz: Routen

| Route                        | Seite               | Auth?   |
|------------------------------|----------------------|---------|
| `/`                          | Startseite           | Nein    |
| `/programs`                  | Programme            | Nein    |
| `/login`                     | Login                | Nein    |
| `/applications/new`          | Neuer Antrag         | Citizen |
| `/applications/:id`          | Antrags-Detail       | Citizen |
| `/backoffice/applications`   | Backoffice-Liste     | Officer |
| `/backoffice/applications/:id`| Backoffice-Detail   | Officer |
| `/*`                         | 404                  | Nein    |
