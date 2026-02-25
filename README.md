# Demo Service-Portal

Trainings-App fuer die Cypress E2E-Schulung.

## Quickstart

```bash
npm install
```

### Modus A: Mit MSW (ohne API-Server)

```bash
# .env.development in client/ sollte enthalten: VITE_API_MOCKING=on
npm run dev:client
```

App laeuft auf **http://localhost:5173**.

### Modus B: Mit echtem API-Server

```bash
# .env.development in client/ setzen: VITE_API_MOCKING=off
npm run dev
```

- Frontend: **http://localhost:5173**
- API: **http://localhost:3001**

## Credentials

| Rolle    | E-Mail              | Passwort   |
|----------|---------------------|------------|
| Citizen  | citizen@example.com | password   |
| Officer  | officer@example.com | password   |

## Fehler-/Delay-Simulation

### Per Header (aus Cypress-Tests)

```ts
cy.intercept('GET', '**/programs*', (req) => {
  req.headers['x-sim-error'] = '500';
}).as('programsFail');
```

### Per Query (manuelle Demos)

```
http://localhost:5173/programs?__error=500&__delay=250
```

## Projektstruktur

```
demo-service-portal/
├── client/          # Vite + React + TypeScript
├── api/             # Express Fake-API (Port 3001)
├── EXERCISES.md     # Uebungsaufgaben (Core + Advanced)
└── INSTRUCTOR_NOTES.md  # Bug-Landkarte fuer Trainer
```
