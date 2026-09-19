import { formatPKTDateTime } from './dateTime';

/**
 * Formats WhatsApp URL with international phone and pre-filled message.
 * Normalizes Pakistani local phone numbers (03xx...) to 923xx...
 */
export function getWhatsAppLink(phone: string, message: string): string {
  let cleanPhone = (phone || '').replace(/[^0-9]/g, '');
  if (cleanPhone.startsWith('0')) {
    cleanPhone = '92' + cleanPhone.slice(1);
  } else if (!cleanPhone.startsWith('92') && cleanPhone.length === 10) {
    cleanPhone = '92' + cleanPhone;
  }
  const encodedText = encodeURIComponent(message);
  return `https://wa.me/${cleanPhone}?text=${encodedText}`;
}

/**
 * Generates initial customer WhatsApp booking inquiry message (Public form)
 */
export function generateBookingWhatsAppMessage(booking: {
  fullName: string;
  phone: string;
  area: string;
  deviceType: string;
  computerBrandModel?: string;
  serviceRequired: string;
  problemDescription: string;
  urgency?: string;
  containsImportantData?: string;
  id?: string;
}): string {
  return `Hello, I need on-site computer support in Peshawar.

Reference ID: ${booking.id || 'New Request'}
Customer: ${booking.fullName}
Area: ${booking.area}
Device: ${booking.deviceType} ${booking.computerBrandModel ? `(${booking.computerBrandModel})` : ''}
Service: ${booking.serviceRequired}
Urgency: ${booking.urgency || 'Normal'}
Contains Important Data: ${booking.containsImportantData || 'NO'}

Problem Description:
${booking.problemDescription}

Please let me know when you can visit. Thank you!`;
}

/**
 * Generates Initial Lead / Inquiry Contact Message (Admin -> Customer)
 * Starts with Assalam-o-Alaikum and includes all customer-selected details.
 */
export function generateInquiryWhatsAppMessage(inquiry: {
  id?: string;
  fullName?: string;
  name?: string;
  email?: string;
  phone?: string;
  whatsapp?: string;
  subject?: string;
  service?: string;
  budget?: string;
  area?: string;
  message?: string;
  createdAt?: string | number | Date;
  preferredDate?: string;
  preferredTime?: string;
  deviceType?: string;
  computerBrandModel?: string;
}): string {
  const customerName = inquiry.fullName || inquiry.name || 'Customer';
  const service = inquiry.subject || inquiry.service || 'Computer Troubleshooting';
  const phone = inquiry.phone || inquiry.whatsapp || 'Not provided';
  const email = inquiry.email || 'Not provided';
  const budget = inquiry.budget || 'Pending On-Site Inspection (From Rs. 500)';
  const area = inquiry.area || 'Peshawar';
  const problem = inquiry.message || 'General service inquiry';
  const submittedTime = inquiry.createdAt ? formatPKTDateTime(inquiry.createdAt) : formatPKTDateTime(new Date());

  return `Assalam-o-Alaikum ${customerName}!
You submitted an inquiry on our website (TechFix Peshawar).

📋 *INQUIRY / SERVICE REQUEST DETAILS*
----------------------------------------
*Subject / Service Requested:* ${service}
*Client Name:* ${customerName}
*Email:* ${email}
*Phone / WhatsApp:* ${phone}
*Budget / Quote:* ${budget}
*Location / Area:* ${area}
*Submitted Time:* ${submittedTime} (PKT, UTC+5)

*Message & Problem Description:*
${problem}
----------------------------------------
This is Safiullah from TechFix Peshawar following up on your request. How can I assist you today?`;
}

/**
 * Generates Appointment Scheduled & Confirmed WhatsApp Message (Admin -> Customer)
 * Formatted matching the official appointment confirmation receipt.
 */
export function generateConfirmationWhatsAppMessage(
  booking: {
    id?: string;
    fullName?: string;
    phone?: string;
    whatsapp?: string;
    area?: string;
    serviceRequired?: string;
    deviceType?: string;
    computerBrandModel?: string;
    preferredDate?: string;
    preferredTime?: string;
    scheduledTime?: string;
    urgency?: string;
    containsImportantData?: string;
    hasImportantData?: boolean;
    createdAt?: string | number | Date;
    problemDescription?: string;
    adminNotes?: string;
  },
  confirmedSlotInput?: string,
  customNotes?: string
): string {
  const customerName = booking.fullName || 'Customer';
  const refId = booking.id || 'PSH-CONFIRMED';
  const confirmedSlot = confirmedSlotInput || booking.scheduledTime || (
    booking.preferredDate 
      ? `${booking.preferredDate} (${booking.preferredTime || 'Morning (10:00 AM – 1:00 PM)'})`
      : 'Tomorrow (Morning (10:00 AM – 1:00 PM))'
  );
  const area = booking.area || 'Peshawar';
  const phone = booking.phone || 'Not provided';
  const wa = booking.whatsapp || booking.phone || 'Not provided';
  const service = booking.serviceRequired || 'On-Site Computer Support';
  const device = `${booking.deviceType || 'Computer'} ${booking.computerBrandModel ? `(${booking.computerBrandModel})` : ''}`.trim();
  const prefSchedule = booking.preferredDate 
    ? `${booking.preferredDate} (${booking.preferredTime || 'As Requested'})`
    : (booking.preferredTime || 'As Requested');
  const urgency = (booking.urgency || 'NORMAL').toUpperCase();
  const importantData = booking.containsImportantData || (booking.hasImportantData ? 'YES' : 'NO');
  const submittedTime = booking.createdAt ? formatPKTDateTime(booking.createdAt) : formatPKTDateTime(new Date());
  const jobNotes = customNotes || booking.adminNotes || booking.problemDescription || 'Diagnosed on-site / System inspection';

  return `*✓ APPOINTMENT SCHEDULED & CONFIRMED*
*TechFix Peshawar • On-Site Service Confirmed*
_Computer Science & Hardware Specialist • Direct Doorstep Support_

Assalam-o-Alaikum *${customerName}*,

*TECHNICIAN ARRIVAL CONFIRMATION*
Your scheduled appointment is confirmed! Our technician will arrive at:
📅 *Confirmed Schedule:* ${confirmedSlot}
📍 *Service Area:* ${area} (Peshawar)

*BOOKING DETAILS*
🏷️ *Booking Reference ID:* ${refId}
*Status:* CONFIRMED
*Customer:* ${customerName}
*Primary Phone:* ${phone}
*WhatsApp:* ${wa}
*Area / Sector:* ${area} (Peshawar)
*Service Required:* ${service}
*Device & Model:* ${device}
*Preferred Schedule:* ${prefSchedule}
*Confirmed Schedule:* ${confirmedSlot}
*Urgency:* ${urgency}
*Important Data:* ${importantData}
*Submitted Time:* ${submittedTime} (PKT)

*DIAGNOSED PROBLEM / JOB NOTES:*
${jobNotes}
----------------------------------------
📞 Call / WhatsApp: 0344 0940443
TechFix Peshawar • Doorstep Computer Repair & Troubleshooting`;
}

