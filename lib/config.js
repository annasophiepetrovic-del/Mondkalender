// Alles, was du am Verkauf einstellen willst, steht hier.

// So viele Durchgänge schenkst du jedem Gerät zum Start.
export const FREE_TOKENS = 3;

// Pakete im Kaufdialog. "cents" ist der Preis in Cent, den die Kundin zahlt.
// 99 Cent pro Token: 5 Token = 495, 10 Token = 990.
// Ein Beispiel mit anderem Preis: { id: "p10", tokens: 10, cents: 100 } wären 1,00 € für 10 Token.
export const PAKETE = [
  { id: "p5", tokens: 5, cents: 495 },
  { id: "p10", tokens: 10, cents: 990 },
];

// Steht im Kaufdialog hinter dem Preis. Für Endkundinnen in Deutschland sind
// Preise normalerweise Bruttopreise ("inkl. MwSt."). Bitte rechtlich prüfen.
export const PREIS_HINWEIS = "inkl. MwSt.";

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
