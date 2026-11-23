# Mondkalender & Ritual-Planer

Next.js-Projekt für Vercel. Anmeldung per E-Mail-Link, 3 Gratis-Vorschläge, danach Token kaufen.

## Die Reihenfolge (Schritt für Schritt, nichts überspringen)

### 1. GitHub
1. Konto auf github.com anlegen, oben rechts + > New repository, Name z. B. `mondkalender`, Create.
2. Auf der neuen Seite "uploading an existing file" anklicken.
3. ZIP entpacken und den **Inhalt** des Ordners (`app`, `lib`, `package.json` ...) in das Fenster ziehen, nicht die ZIP selbst. Unten "Commit changes".

### 2. Vercel (KI und Token-Speicher)
1. Auf vercel.com mit GitHub anmelden, "Add New > Project", das Repository importieren.
2. Vor dem Deploy bei Environment Variables eintragen:
   - `ANTHROPIC_API_KEY` = dein Key aus der Anthropic Console
   - `ADMIN_KEY` = ein langes, selbst ausgedachtes Passwort (damit holst du deine Kontaktliste)
3. Deploy. Danach im Projekt: Storage > Upstash Redis hinzufügen (kostenloser Plan reicht) und mit dem Projekt verbinden. Vercel trägt die Zugangsdaten selbst ein.
4. Danach `SITE_URL` eintragen: deine Adresse wie im Browser, ohne Schrägstrich am Ende (z. B. `https://mondkalender.vercel.app`).
5. Deployments > die oberste Zeile > "Redeploy", damit die neuen Werte gelten.

### 3. Resend (damit der Login-Link per E-Mail ankommt)
1. Konto auf resend.com anlegen.
2. Domains > Add Domain: deine Domain eintragen (z. B. `seelenmanifestation-blog.de`) und die angezeigten DNS-Einträge bei deinem Domain-Anbieter eintragen. Warten, bis "Verified" dasteht.
3. API Keys > Create: Key kopieren und bei Vercel als `RESEND_API_KEY` eintragen.
4. `EMAIL_FROM` eintragen, z. B. `Mondkalender <login@seelenmanifestation-blog.de>`.
5. Redeploy. Danach einmal selbst anmelden und den Link aus der Mail testen.

### 3b. GetResponse (damit die Leute deinen Newsletter bekommen)
1. In GetResponse: Integrationen und API > API > API-Key erzeugen und kopieren, bei Vercel als `GETRESPONSE_API_KEY` eintragen.
2. Die Listen-ID (heißt dort `campaignId`) der Liste, in die die Kontakte sollen: steht in den Einstellungen der Liste. Bei Vercel als `GETRESPONSE_CAMPAIGN_ID` eintragen.
3. Wichtig: Prüfe in den Einstellungen dieser Liste, ob eine eigene Bestätigungs-Mail von GetResponse an ist. Dann bekommen die Leute nach unserem Login-Link noch eine zweite Bestätigung. Das ist rechtlich die vorsichtigste Variante, aber eine Hürde mehr. Lässt du sie aus, zählt unser Link als Bestätigung. Das entscheidest du mit deinem Rechtstext.
4. Redeploy. Wer den Link in der Login-Mail anklickt und dem Newsletter zugestimmt hat, steht danach automatisch in der Liste. Die E-Mails danach schickt GetResponse (Automation oder Autoresponder auf dieser Liste).

### 4. Stripe (erst wenn 1 bis 3 laufen)
1. Konto auf stripe.com. Dashboard > Entwickler > API-Schlüssel: den geheimen Schlüssel als `STRIPE_SECRET_KEY` eintragen. Zum Testen den Testmodus nehmen (Schlüssel beginnt mit `sk_test_`), bezahlt wird mit der Testkarte 4242 4242 4242 4242.
2. Entwickler > Webhooks > Endpunkt hinzufügen: `https://DEINE-ADRESSE/api/stripe-webhook`, Ereignis `checkout.session.completed`. Das Signing-Secret (beginnt mit `whsec_`) als `STRIPE_WEBHOOK_SECRET` eintragen.
3. Redeploy, im Testmodus einmal komplett durchkaufen. Erst dann auf den Live-Schlüssel wechseln.

## Deine Kontaktliste
Aufruf im Browser: `https://DEINE-ADRESSE/api/leads?key=DEIN_ADMIN_KEY`. Es lädt eine Tabelle (CSV) mit E-Mail, Anmeldedatum, Einwilligung samt Nachweis und der Spalte "GetResponse" (ja = in die Liste übertragen). Nur Personen mit "ja" darfst du anschreiben.

## Einstellen, was du verkaufst
In `lib/config.js`: Anzahl Gratis-Token, Pakete und Preise (in Cent), Preis-Hinweis, Link zur Datenschutzerklärung und ein optionaler Text auf der Stripe-Bezahlseite.

## Lokal testen
```
npm install
cp .env.example .env.local
npm run dev
```
Ohne Zugangsdaten läuft lokal ein Speicher im Arbeitsspeicher, und der Login-Link erscheint direkt im Anmeldefenster.

## Grenzen
- Wer mehrere E-Mail-Adressen nutzt, bekommt mehrfach Gratis-Token.
- Impressum, Datenschutz, AGB und Widerrufshinweis fehlen in diesem Projekt und müssen auf die Seite.
