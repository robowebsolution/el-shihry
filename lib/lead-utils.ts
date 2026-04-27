import type { Locale } from '@/lib/site-content';
import { getWhatsAppUrl, siteConfig } from '@/lib/site-config';

type LeadMessageInput = {
  email?: string;
  interest?: string;
  locale: Locale;
  message?: string;
  name?: string;
  phone?: string;
  source: string;
};

export function buildLeadMessage({
  email,
  interest,
  locale,
  message,
  name,
  phone,
  source,
}: LeadMessageInput) {
  const labels =
    locale === 'ar'
      ? {
          email: 'البريد',
          interest: 'الاهتمام',
          message: 'الرسالة',
          name: 'الاسم',
          phone: 'الهاتف',
          source: 'المصدر',
        }
      : {
          email: 'Email',
          interest: 'Interest',
          message: 'Message',
          name: 'Name',
          phone: 'Phone',
          source: 'Source',
        };

  const lines = [
    `${siteConfig.name}`,
    `${labels.source}: ${source}`,
    name ? `${labels.name}: ${name}` : '',
    phone ? `${labels.phone}: ${phone}` : '',
    email ? `${labels.email}: ${email}` : '',
    interest ? `${labels.interest}: ${interest}` : '',
    message ? `${labels.message}: ${message}` : '',
  ].filter(Boolean);

  return lines.join('\n');
}

export function openLeadWhatsApp(input: LeadMessageInput) {
  if (typeof window === 'undefined') {
    return;
  }

  const url = getWhatsAppUrl(buildLeadMessage(input));
  window.open(url, '_blank', 'noopener,noreferrer');
}
