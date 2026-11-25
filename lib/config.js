// Alles, was du am Verkauf einstellen willst, steht hier.

// So viele Durchgänge schenkst du jedem Gerät zum Start.
export const FREE_TOKENS = 3;

// Pakete im Kaufdialog. "cents" ist der Preis in Cent, den die Kundin zahlt.
// Ein Paket: 10 Token für 4,99 € (499 Cent), einmalig, die Token verfallen nicht.
// Ein Beispiel mit anderem Preis: { id: "p10", tokens: 10, cents: 100 } wären 1,00 € für 10 Token.
export const PAKETE = [
  { id: "p10", tokens: 10, cents: 499 },
];

// Steht im Kaufdialog hinter dem Preis. Kleinunternehmerin nach § 19 UStG:
// keine Umsatzsteuer ausgewiesen. Bitte rechtlich prüfen.
export const PREIS_HINWEIS = "Kein Ausweis der Umsatzsteuer gemäß § 19 UStG";

// Steht im Fuß der Stripe-Rechnung (Kleinunternehmerregelung).
export const RECHNUNG_FUSS = "Kein Ausweis der Umsatzsteuer, da Kleinunternehmer gemäß § 19 UStG.";

// Kurzer Text auf der Stripe-Bezahlseite über dem Bezahlen-Button.
// Leer lassen ("") zeigt keinen Text. Bitte rechtlich prüfen und an deine AGB anpassen.
export const HINWEIS_CHECKOUT = "";

// Lead-Magnet-Modell: true = Wer die Gratis-Token will, muss dem Newsletter zustimmen.
// false = das Häkchen ist freiwillig, das Tool lässt sich auch ohne Newsletter testen.
// Rechtlich ist "true" ein Graubereich (Kopplung). Bitte mit deinem Rechtstext klären.
export const NEWSLETTER_PFLICHT = true;

// Genau dieser Text steht neben dem Häkchen und wird bei jeder Anmeldung als Nachweis mitgespeichert.
// Wenn du ihn änderst, gilt der neue Text für alle künftigen Anmeldungen.
export const NEWSLETTER_TEXT =
  "Ja, ich möchte den Newsletter mit Impulsen zu Mond, Ritualen und Manifestation per E-Mail bekommen. Abmelden kann ich mich jederzeit mit einem Klick.";

// Link zu deiner Datenschutzerklärung. Wird im Anmeldefenster angezeigt, wenn er gefüllt ist.
// Beispiel: "https://seelenmanifestation-blog.de/datenschutz"
export const DATENSCHUTZ_URL = "";
