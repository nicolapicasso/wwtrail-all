// lib/services/emailContent.defaults.ts
// Default content for the outreach emails, in all 6 languages, using {{var}}
// placeholders so the same strings power both runtime sending and the editable
// backoffice templates. A DB override (OutreachEmailTemplate) takes precedence;
// otherwise these defaults are used.

export type OutreachTemplateType = 'WELCOME' | 'REMINDER' | 'MAGAZINE';
export type Lang = 'ES' | 'EN' | 'IT' | 'CA' | 'FR' | 'DE';

export const OUTREACH_TYPES: OutreachTemplateType[] = ['WELCOME', 'REMINDER', 'MAGAZINE'];
export const OUTREACH_LANGS: Lang[] = ['ES', 'EN', 'IT', 'CA', 'FR', 'DE'];

/** Variables each template type accepts (shown in the editor). */
export const TEMPLATE_VARIABLES: Record<OutreachTemplateType, string[]> = {
  WELCOME: ['eventName', 'link'],
  REMINDER: ['eventName', 'competitionName', 'days', 'link'],
  MAGAZINE: ['eventName', 'competitionName', 'link'],
};

/** Replace {{key}} occurrences with values (missing keys become ''). */
export function renderVars(str: string, vars: Record<string, string | number>): string {
  return str.replace(/\{\{\s*(\w+)\s*\}\}/g, (_, k) => {
    const v = vars[k];
    return v === undefined || v === null ? '' : String(v);
  });
}

/** WWTRAIL-branded HTML shell around a heading/body/CTA. */
export function emailShell(heading: string, body: string, ctaLabel: string, ctaLink: string, foot: string): string {
  return `<!doctype html><html><body style="margin:0;background:#f4f5f7;font-family:Helvetica,Arial,sans-serif;color:#1b2023">
  <div style="max-width:560px;margin:24px auto;background:#fff;border-radius:12px;overflow:hidden;border:1px solid #e4e7eb">
    <div style="background:#0E612F;padding:20px 28px"><span style="color:#fff;font-weight:800;font-size:18px;letter-spacing:.02em">WWTRAIL</span></div>
    <div style="padding:28px">
      <h1 style="margin:0 0 12px;font-size:20px;color:#0f1315">${heading}</h1>
      <p style="margin:0 0 20px;font-size:15px;line-height:1.6;color:#3a4147">${body}</p>
      <a href="${ctaLink}" style="display:inline-block;background:#B66916;color:#fff;text-decoration:none;font-weight:700;font-size:15px;padding:12px 22px;border-radius:8px">${ctaLabel}</a>
      <p style="margin:24px 0 0;font-size:12px;color:#8b95a0">${foot}</p>
    </div>
  </div></body></html>`;
}

// Content parts per type/lang. Bodies use {{placeholders}}.
type Parts = { subject: string; heading: string; body: string; cta: string; foot: string };

const CONTENT: Record<OutreachTemplateType, Record<Lang, Parts>> = {
  WELCOME: {
    ES: { subject: 'Gestiona “{{eventName}}” en WWTRAIL', heading: 'Tu evento ya está en WWTRAIL', body: 'Hemos incorporado <strong>{{eventName}}</strong> a WWTRAIL. Te invitamos a acceder para revisar y mantener actualizada la información de tu evento y sus competiciones.', cta: 'Acceder y configurar mi contraseña', foot: 'Si no esperabas este correo, puedes ignorarlo. El enlace caduca en 30 días.' },
    EN: { subject: 'Manage “{{eventName}}” on WWTRAIL', heading: 'Your event is now on WWTRAIL', body: "We've added <strong>{{eventName}}</strong> to WWTRAIL. You're invited to sign in and keep your event and its races up to date.", cta: 'Sign in and set my password', foot: "If you weren't expecting this email you can ignore it. The link expires in 30 days." },
    IT: { subject: 'Gestisci “{{eventName}}” su WWTRAIL', heading: 'Il tuo evento è ora su WWTRAIL', body: 'Abbiamo aggiunto <strong>{{eventName}}</strong> a WWTRAIL. Ti invitiamo ad accedere per mantenere aggiornate le informazioni del tuo evento e delle sue gare.', cta: 'Accedi e imposta la password', foot: 'Se non ti aspettavi questa email, ignorala pure. Il link scade tra 30 giorni.' },
    CA: { subject: 'Gestiona “{{eventName}}” a WWTRAIL', heading: 'El teu esdeveniment ja és a WWTRAIL', body: 'Hem incorporat <strong>{{eventName}}</strong> a WWTRAIL. Et convidem a accedir per mantenir actualitzada la informació del teu esdeveniment i les seves competicions.', cta: 'Accedir i configurar la contrasenya', foot: "Si no esperaves aquest correu, pots ignorar-lo. L'enllaç caduca en 30 dies." },
    FR: { subject: 'Gérez « {{eventName}} » sur WWTRAIL', heading: 'Votre événement est désormais sur WWTRAIL', body: 'Nous avons ajouté <strong>{{eventName}}</strong> à WWTRAIL. Nous vous invitons à vous connecter pour tenir à jour les informations de votre événement et de ses courses.', cta: 'Se connecter et définir mon mot de passe', foot: "Si vous n'attendiez pas cet e-mail, ignorez-le. Le lien expire dans 30 jours." },
    DE: { subject: '„{{eventName}}“ auf WWTRAIL verwalten', heading: 'Deine Veranstaltung ist jetzt auf WWTRAIL', body: 'Wir haben <strong>{{eventName}}</strong> zu WWTRAIL hinzugefügt. Wir laden dich ein, dich anzumelden und die Informationen deiner Veranstaltung und ihrer Wettkämpfe aktuell zu halten.', cta: 'Anmelden und Passwort festlegen', foot: 'Falls du diese E-Mail nicht erwartet hast, ignoriere sie einfach. Der Link läuft in 30 Tagen ab.' },
  },
  REMINDER: {
    ES: { subject: 'Faltan {{days}} días para {{competitionName}} — actualiza tus datos', heading: '{{competitionName}} se acerca', body: 'Tu prueba <strong>{{competitionName}}</strong> de <strong>{{eventName}}</strong> se celebra dentro de unos <strong>{{days}} días</strong>. Entra en WWTRAIL para revisar y actualizar la información (fecha, distancias, inscripción, imágenes…).', cta: 'Actualizar mi evento', foot: 'Recibes este aviso como organizador en WWTRAIL.' },
    EN: { subject: '{{days}} days to {{competitionName}} — update your details', heading: '{{competitionName}} is coming up', body: 'Your race <strong>{{competitionName}}</strong> of <strong>{{eventName}}</strong> takes place in about <strong>{{days}} days</strong>. Sign in to WWTRAIL to review and update its info (date, distances, registration, images…).', cta: 'Update my event', foot: 'You receive this as an organizer on WWTRAIL.' },
    IT: { subject: 'Mancano {{days}} giorni a {{competitionName}} — aggiorna i dati', heading: '{{competitionName}} si avvicina', body: 'La tua gara <strong>{{competitionName}}</strong> di <strong>{{eventName}}</strong> si terrà tra circa <strong>{{days}} giorni</strong>. Accedi a WWTRAIL per rivedere e aggiornare le informazioni.', cta: 'Aggiorna il mio evento', foot: 'Ricevi questo avviso come organizzatore su WWTRAIL.' },
    CA: { subject: 'Falten {{days}} dies per a {{competitionName}} — actualitza les dades', heading: "{{competitionName}} s'acosta", body: "La teva prova <strong>{{competitionName}}</strong> de <strong>{{eventName}}</strong> se celebra d'aquí a uns <strong>{{days}} dies</strong>. Entra a WWTRAIL per revisar i actualitzar la informació.", cta: 'Actualitzar el meu esdeveniment', foot: 'Reps aquest avís com a organitzador a WWTRAIL.' },
    FR: { subject: '{{days}} jours avant {{competitionName}} — mettez à jour vos infos', heading: '{{competitionName}} approche', body: 'Votre course <strong>{{competitionName}}</strong> de <strong>{{eventName}}</strong> a lieu dans environ <strong>{{days}} jours</strong>. Connectez-vous à WWTRAIL pour vérifier et mettre à jour les informations.', cta: 'Mettre à jour mon événement', foot: "Vous recevez ceci en tant qu'organisateur sur WWTRAIL." },
    DE: { subject: 'Noch {{days}} Tage bis {{competitionName}} — Daten aktualisieren', heading: '{{competitionName}} steht bevor', body: 'Dein Rennen <strong>{{competitionName}}</strong> von <strong>{{eventName}}</strong> findet in etwa <strong>{{days}} Tagen</strong> statt. Melde dich bei WWTRAIL an, um die Infos zu prüfen und zu aktualisieren.', cta: 'Meine Veranstaltung aktualisieren', foot: 'Du erhältst dies als Veranstalter auf WWTRAIL.' },
  },
  MAGAZINE: {
    ES: { subject: 'Comparte con el Magazine de WWTRAIL: fotos, resultados y crónica de {{competitionName}}', heading: '¿Cómo fue {{competitionName}}?', body: 'Desde el <strong>Magazine de WWTRAIL</strong> nos encantaría publicar tu edición de <strong>{{competitionName}}</strong> ({{eventName}}). Envíanos <strong>lo que tengas</strong>: galería de fotos, resultados y una pequeña crónica.', cta: 'Enviar material al Magazine', foot: 'Puedes responder a este correo con el material o usar el enlace.' },
    EN: { subject: 'Share with WWTRAIL Magazine: photos, results and report of {{competitionName}}', heading: 'How did {{competitionName}} go?', body: 'The <strong>WWTRAIL Magazine</strong> would love to feature your <strong>{{competitionName}}</strong> ({{eventName}}). Send us <strong>whatever you have</strong>: a photo gallery, results and a short report.', cta: 'Send material to the Magazine', foot: 'You can reply to this email with the material or use the link.' },
    IT: { subject: 'Condividi con il Magazine di WWTRAIL: foto, risultati e cronaca di {{competitionName}}', heading: "Com'è andata {{competitionName}}?", body: 'Il <strong>Magazine di WWTRAIL</strong> vorrebbe raccontare la tua <strong>{{competitionName}}</strong> ({{eventName}}). Inviaci <strong>quello che hai</strong>: galleria foto, risultati e una breve cronaca.', cta: 'Invia materiale al Magazine', foot: 'Puoi rispondere a questa email con il materiale o usare il link.' },
    CA: { subject: 'Comparteix amb el Magazine de WWTRAIL: fotos, resultats i crònica de {{competitionName}}', heading: 'Com va anar {{competitionName}}?', body: "Des del <strong>Magazine de WWTRAIL</strong> ens encantaria publicar la teva <strong>{{competitionName}}</strong> ({{eventName}}). Envia'ns <strong>el que tinguis</strong>: galeria de fotos, resultats i una petita crònica.", cta: 'Enviar material al Magazine', foot: "Pots respondre aquest correu amb el material o fer servir l'enllaç." },
    FR: { subject: 'Partagez avec le Magazine WWTRAIL : photos, résultats et compte-rendu de {{competitionName}}', heading: "Comment s'est passé {{competitionName}} ?", body: 'Le <strong>Magazine WWTRAIL</strong> aimerait mettre en avant votre <strong>{{competitionName}}</strong> ({{eventName}}). Envoyez-nous <strong>ce que vous avez</strong> : galerie photo, résultats et un court compte-rendu.', cta: 'Envoyer au Magazine', foot: 'Vous pouvez répondre à cet e-mail avec le matériel ou utiliser le lien.' },
    DE: { subject: 'Teile mit dem WWTRAIL-Magazine: Fotos, Ergebnisse und Bericht von {{competitionName}}', heading: 'Wie lief {{competitionName}}?', body: 'Das <strong>WWTRAIL-Magazine</strong> würde deine <strong>{{competitionName}}</strong> ({{eventName}}) gerne vorstellen. Schick uns <strong>was du hast</strong>: Fotogalerie, Ergebnisse und einen kurzen Bericht.', cta: 'Material ans Magazine senden', foot: 'Du kannst auf diese E-Mail mit dem Material antworten oder den Link nutzen.' },
  },
};

/** Default {subject, htmlBody} (with {{placeholders}}) for a type + language. */
export function defaultTemplate(type: OutreachTemplateType, lang: Lang): { subject: string; htmlBody: string } {
  const p = CONTENT[type][lang] || CONTENT[type].EN;
  return { subject: p.subject, htmlBody: emailShell(p.heading, p.body, p.cta, '{{link}}', p.foot) };
}
