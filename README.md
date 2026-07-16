# Bonjour Mur Mur

Web app React/TypeScript per sbloccare una Polaroid al giorno durante il viaggio in Francia 2026.

## Installazione

```bash
npm install
```

## Avvio locale

```bash
npm run dev
```

## Build

```bash
npm run build
```

## Test e lint

```bash
npm run lint
npm run test
```

## Pubblicazione su GitHub Pages

Il progetto include `.github/workflows/deploy.yml`. Dopo il push su `main` o `master`, GitHub Actions compila e pubblica `dist` su Pages.

In `vite.config.ts` il `base` viene calcolato automaticamente da `GITHUB_REPOSITORY`. Se cambi nome repository, non serve modificare codice per GitHub Actions. In locale il `base` resta `/`.

## Modificare testi e giornate

I dati modificabili sono in:

- `public/data/settings.json`
- `public/data/trip.json`

I componenti React leggono questi file all'avvio e li validano con Zod. Se un campo obbligatorio manca, l'app mostra un errore invece di rompersi in modo silenzioso.

## Aggiungere fotografie

Metti le immagini in `public/images/`, preferibilmente WebP o AVIF. Aggiorna il campo `heroImage` della giornata:

```json
{
  "src": "/images/nome-file.webp",
  "alt": "Descrizione utile",
  "author": "Autore",
  "sourceName": "Wikimedia Commons",
  "sourceUrl": "https://...",
  "license": "CC BY-SA 4.0",
  "status": "ready"
}
```

Non usare hotlink. Se non hai una licenza chiara, lascia il placeholder con una nota esplicita per uso privato.

## Inserire hotel e indirizzi

In ogni giornata aggiorna `accommodation.name`, `accommodation.address`, `accommodation.checkIn` e `bookings`. Non inserire dati inventati: usa una nota chiara tipo `da completare con conferma prenotazione` finche non sono reali.

## Aggiornare soste di ricarica

Nei giorni di trasferimento modifica `route.segments`. Ogni segmento contiene distanza, tempo, percentuali stimate, sosta primaria, potenza, servizi e backup. Le percentuali sono stime: prima di partire va controllata la disponibilità live.

## Modalità admin

Apri la modalità anteprima con:

- pressione di 4 secondi sul titolo;
- `Shift + Alt + M`.

La password non è salvata in chiaro: viene confrontato l'hash SHA-256. Questa è una protezione dalla curiosità normale, non sicurezza informatica reale.

## Limiti della protezione

Le giornate future sono nascoste dall'interfaccia, ma i dati JSON sono pubblici perché GitHub Pages è statico. Per una sorpresa familiare va bene; per segreti veri no.

## Testare una data simulata

Entra in modalità admin, imposta data e ora, poi applica l'anteprima. Il badge `Modalità anteprima` indica che non stai usando la data reale.

## Service worker

La PWA usa `vite-plugin-pwa` con aggiornamento automatico. Dopo modifiche importanti fai una build pulita e, sul browser, aggiorna o rimuovi il service worker se vedi contenuti vecchi.

## Test manuali da fare prima della sorpresa

- desktop grande;
- laptop;
- iPhone;
- Android;
- modalità offline dopo primo caricamento;
- refresh di una pagina interna;
- installazione PWA;
- pubblicazione GitHub Pages;
- animazioni ridotte;
- password errata;
- password corretta.

## Dati da tenere vivi

I campi con note operative come `controllare live` indicano dati che cambiano spesso: orari, prezzi, colonnine, servizi, parcheggi, accessibilita e fotografie reali con licenza.
