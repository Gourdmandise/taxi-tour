import nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';
import type { AppointmentRequest, ContactRequest, QuoteRequest } from '../types/forms.js';

type Payload = ContactRequest | QuoteRequest | AppointmentRequest;

export class NotificationService {
  private readonly transporter: Transporter | null;

  constructor() {
    const host = process.env.SMTP_HOST;
    const port = Number(process.env.SMTP_PORT || '587');
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    if (host && user && pass) {
      this.transporter = nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: { user, pass },
      });
      return;
    }

    this.transporter = null;
  }

  async send(type: 'contact' | 'quote' | 'appointment', payload: Payload): Promise<void> {
    const adminEmail = process.env.ADMIN_EMAIL;
    const fromEmail = process.env.FROM_EMAIL || 'no-reply@taxi-slx.local';

    if (!this.transporter || !adminEmail) {
      console.info(`[${type.toUpperCase()}]`, JSON.stringify(payload, null, 2));
      return;
    }

    const subject = this.buildSubject(type, payload);
    const text = this.buildText(type, payload);

    await this.transporter.sendMail({
      from: fromEmail,
      to: adminEmail,
      replyTo: 'email' in payload && payload.email ? payload.email : fromEmail,
      subject,
      text,
    });
  }

  private buildSubject(type: 'contact' | 'quote' | 'appointment', payload: Payload): string {
    const name = `${payload.firstName} ${payload.lastName}`.trim();

    if (type === 'contact') {
      return `Taxi SLX - Nouveau message de contact - ${name}`;
    }

    if (type === 'quote') {
      return `Taxi SLX - Nouvelle demande de devis - ${name}`;
    }

    return `Taxi SLX - Nouveau rendez-vous - ${name}`;
  }

  private buildText(type: 'contact' | 'quote' | 'appointment', payload: Payload): string {
    const lines: string[] = [
      `Nom: ${payload.firstName} ${payload.lastName}`.trim(),
      `Téléphone: ${payload.phone}`,
    ];

    if ('email' in payload && payload.email) {
      lines.push(`E-mail: ${payload.email}`);
    }

    if (type === 'contact') {
      const contactPayload = payload as ContactRequest;
      lines.push(`Objet: ${contactPayload.subject}`);
      lines.push('Message:');
      lines.push(contactPayload.message);
    }

    if (type === 'quote') {
      const quotePayload = payload as QuoteRequest;
      lines.push(`Départ: ${quotePayload.departure}`);
      lines.push(`Arrivée: ${quotePayload.arrival}`);
      lines.push(`Passagers: ${quotePayload.passengers}`);
      lines.push(`Type de trajet: ${quotePayload.tripType}`);
      if (quotePayload.note) {
        lines.push('Notes:');
        lines.push(quotePayload.note);
      }
    }

    if (type === 'appointment') {
      const appointmentPayload = payload as AppointmentRequest;
      lines.push(`Date: ${appointmentPayload.selectedDateLabel}`);
      lines.push(`Heure: ${appointmentPayload.selectedSlot}`);
      lines.push(`Objet: ${appointmentPayload.subject}`);
      if (appointmentPayload.notes) {
        lines.push('Notes:');
        lines.push(appointmentPayload.notes);
      }
    }

    return lines.join('\n');
  }
}
