import { NextRequest } from 'next/server';
import { requireRole, apiSuccess, apiError, ApiError } from '@/lib/auth';
import prisma from '@/lib/db';
import { sendEmail } from '@/lib/services/mailer';
import { renderVars } from '@/lib/services/emailContent.defaults';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://wwtrail.com';

// POST /api/v2/admin/outreach-templates/test  (ADMIN)
// Renders the CURRENT editor content with real event/competition data and
// sends it to a destination email, so an admin can preview what organizers
// would actually receive. Subject is prefixed with [PRUEBA].
export async function POST(request: NextRequest) {
  try {
    await requireRole(request, 'ADMIN');
    const { language = 'ES', subject, htmlBody, eventId, competitionId, to } = await request.json();

    if (!to || !subject || !htmlBody) {
      throw new ApiError('to, subject and htmlBody are required', 400);
    }

    let eventName = '';
    let competitionName = '';

    if (competitionId) {
      const comp = await prisma.competition.findUnique({
        where: { id: competitionId },
        select: { name: true, event: { select: { name: true } } },
      });
      if (comp) {
        competitionName = comp.name;
        eventName = comp.event?.name || '';
      }
    }
    if (!eventName && eventId) {
      const ev = await prisma.event.findUnique({ where: { id: eventId }, select: { name: true } });
      eventName = ev?.name || '';
    }

    const vars: Record<string, string | number> = {
      eventName: eventName || 'Evento de ejemplo',
      competitionName: competitionName || 'Competición de ejemplo',
      days: 30,
      link: `${APP_URL}/${String(language).toLowerCase()}/organizer/events`,
    };

    const renderedSubject = renderVars(subject, vars);
    const html = renderVars(htmlBody, vars);

    await sendEmail({ to, subject: `[PRUEBA] ${renderedSubject}`, html });

    return apiSuccess({ sent: true, to });
  } catch (error) {
    return apiError(error);
  }
}
