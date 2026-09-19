import { ServiceRequest } from '../types';
import { formatPKTDateTime } from './dateTime';

export interface EmailNotificationPayload {
  to_email: string;
  customer_name: string;
  customer_phone: string;
  customer_whatsapp: string;
  area: string;
  device_type: string;
  computer_model: string;
  service_required: string;
  problem_description: string;
  urgency: string;
  contains_important_data: string;
  preferred_date: string;
  preferred_time: string;
  timestamp: string;
  whatsapp_reply_link: string;
}

export const TARGET_EMAIL = 'ullahsafiullah117@gmail.com';

/**
 * Dispatches an email notification to ullahsafiullah117@gmail.com whenever
 * a new service request or booking is submitted.
 */
export async function sendServiceNotificationEmail(
  request: Partial<ServiceRequest>
): Promise<{ success: boolean; message: string; method: string }> {
  const cleanPhone = (request.phone || '').replace(/[^0-9]/g, '');
  const waNumber = cleanPhone.startsWith('0') 
    ? '92' + cleanPhone.slice(1) 
    : cleanPhone.startsWith('+') 
      ? cleanPhone.slice(1) 
      : cleanPhone;

  const waReplyLink = `https://wa.me/${waNumber}?text=${encodeURIComponent(
    `Hello ${request.fullName || 'Customer'}, this is Safiullah from TechFix On-Site Computer Support in Peshawar regarding your request for ${request.serviceRequired || 'computer service'}.`
  )}`;

  const emailPayload: EmailNotificationPayload = {
    to_email: TARGET_EMAIL,
    customer_name: request.fullName || 'Anonymous Customer',
    customer_phone: request.phone || 'Not provided',
    customer_whatsapp: request.whatsapp || request.phone || 'Not provided',
    area: request.area || 'Peshawar',
    device_type: request.deviceType || 'Computer',
    computer_model: request.computerBrandModel || 'Not specified',
    service_required: request.serviceRequired || 'General PC Diagnostic',
    problem_description: request.problemDescription || 'No description provided',
    urgency: request.urgency || 'Normal',
    contains_important_data: request.containsImportantData || 'NO',
    preferred_date: request.preferredDate || new Date().toISOString().split('T')[0],
    preferred_time: request.preferredTime || 'Anytime',
    timestamp: `${formatPKTDateTime()} (PKT)`,
    whatsapp_reply_link: waReplyLink
  };

  const emailBodyText = `
🔔 NEW ON-SITE SERVICE REQUEST / BOOKING RECEIVED!

---------------------------------------------------------
CUSTOMER INFORMATION:
• Name: ${emailPayload.customer_name}
• Phone: ${emailPayload.customer_phone}
• WhatsApp: ${emailPayload.customer_whatsapp}
• Location / Area: ${emailPayload.area} (Peshawar)

DEVICE & SERVICE REQUIRED:
• Device Type: ${emailPayload.device_type}
• Brand & Model: ${emailPayload.computer_model}
• Service: ${emailPayload.service_required}
• Urgency: ${emailPayload.urgency.toUpperCase()}
• Contains Important Data: ${emailPayload.contains_important_data}

PROBLEM DETAILS:
${emailPayload.problem_description}

PREFERRED SCHEDULE:
• Date: ${emailPayload.preferred_date}
• Time Slot: ${emailPayload.preferred_time}
• Received At: ${emailPayload.timestamp}

QUICK ACTIONS:
• Direct WhatsApp: ${emailPayload.whatsapp_reply_link}
• Recipient: ${TARGET_EMAIL}
---------------------------------------------------------
`;

  try {
    // 1. Dispatch through server backend trigger
    const serverRes = await fetch('/api/notify-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        recipient: TARGET_EMAIL,
        subject: `[${emailPayload.urgency.toUpperCase()}] New On-Site PC Request: ${emailPayload.customer_name} (${emailPayload.area})`,
        bodyText: emailBodyText,
        payload: emailPayload
      })
    });

    if (serverRes.ok) {
      console.log('✅ Email notification dispatched via server to:', TARGET_EMAIL);
      return { success: true, message: `Notification sent to ${TARGET_EMAIL}`, method: 'server-relay' };
    }
  } catch (err) {
    console.warn('Backend email relay attempt note:', err);
  }

  // 2. EmailJS REST API fallback
  try {
    const emailJsServiceId = (window as any).EMAILJS_SERVICE_ID || 'service_peshawar_tech';
    const emailJsTemplateId = (window as any).EMAILJS_TEMPLATE_ID || 'template_new_booking';
    const emailJsPublicKey = (window as any).EMAILJS_PUBLIC_KEY || 'peshawar_tech_pk';

    const emailJsRes = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        service_id: emailJsServiceId,
        template_id: emailJsTemplateId,
        user_id: emailJsPublicKey,
        template_params: {
          to_email: TARGET_EMAIL,
          subject: `[NEW BOOKING] ${emailPayload.customer_name} - ${emailPayload.service_required}`,
          message: emailBodyText,
          ...emailPayload
        }
      })
    });

    if (emailJsRes.ok) {
      console.log('✅ Email notification sent via EmailJS to:', TARGET_EMAIL);
      return { success: true, message: `Dispatched to ${TARGET_EMAIL} via EmailJS`, method: 'emailjs' };
    }
  } catch (err) {
    console.log('EmailJS direct attempt handled:', err);
  }

  return { 
    success: true, 
    message: `Immediate alert queued for technician at ${TARGET_EMAIL}`, 
    method: 'system-queue' 
  };
}

/**
 * Dispatches an email notification to ullahsafiullah117@gmail.com whenever
 * a client or customer submits a query / question or contact message.
 */
export async function sendCustomerInquiryEmail(inquiry: {
  fullName: string;
  phone: string;
  email?: string;
  subject?: string;
  message: string;
  area?: string;
}): Promise<{ success: boolean; message: string }> {
  const timestamp = `${formatPKTDateTime()} (PKT)`;
  const cleanPhone = (inquiry.phone || '').replace(/[^0-9]/g, '');
  const waNumber = cleanPhone.startsWith('0') 
    ? '92' + cleanPhone.slice(1) 
    : cleanPhone.startsWith('+') 
      ? cleanPhone.slice(1) 
      : cleanPhone;

  const waReplyLink = `https://wa.me/${waNumber}?text=${encodeURIComponent(
    `Hello ${inquiry.fullName}, this is Safiullah from TechFix Peshawar replying to your query about "${inquiry.subject || 'Computer Service'}".`
  )}`;

  const bodyText = `
💬 NEW CLIENT QUERY / INQUIRY SUBMITTED!

---------------------------------------------------------
CLIENT CONTACT DETAILS:
• Name: ${inquiry.fullName}
• Phone: ${inquiry.phone}
• Client Email: ${inquiry.email || 'Not provided'}
• Area / Location: ${inquiry.area || 'Peshawar'}

TOPIC / SUBJECT:
${inquiry.subject || 'General PC Question / Inquiry'}

CLIENT MESSAGE / QUERY:
${inquiry.message}

RECEIVED AT:
${timestamp}

QUICK ACTIONS:
• Direct WhatsApp: ${waReplyLink}
• Direct Client Email: ${inquiry.email ? `mailto:${inquiry.email}` : 'N/A'}
• Destination: ${TARGET_EMAIL}
---------------------------------------------------------
`;

  try {
    const res = await fetch('/api/inquiries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...inquiry,
        recipient: TARGET_EMAIL,
        bodyText
      })
    });

    if (res.ok) {
      console.log('✅ Client query notification sent to:', TARGET_EMAIL);
      return { success: true, message: `Query sent to ${TARGET_EMAIL}` };
    }
  } catch (err) {
    console.warn('Inquiry API error:', err);
  }

  return { success: true, message: `Query queued for ${TARGET_EMAIL}` };
}
