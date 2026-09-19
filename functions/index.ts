import { onDocumentCreated } from "firebase-functions/v2/firestore";
import { getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import * as nodemailer from "nodemailer";

// Lazy initialize Firebase Admin
const DATABASE_ID = process.env.FIRESTORE_DATABASE_ID || "ai-studio-peshawaronsitete-70e75457-6a23-4284-84ee-9bd0ef9c4555";
const app = getApps().length ? getApps()[0] : initializeApp();
const adminDb = DATABASE_ID && DATABASE_ID !== "(default)"
  ? getFirestore(app, DATABASE_ID)
  : getFirestore(app);

export const TARGET_NOTIFICATION_EMAIL = process.env.NOTIFICATION_EMAIL || "ullahsafiullah117@gmail.com";

/**
 * Configure Nodemailer transporter with environment variable support or fallback
 */
function createEmailTransporter() {
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 587;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

  if (smtpHost && smtpUser && smtpPass) {
    return nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: {
        user: smtpUser,
        pass: smtpPass
      }
    });
  }

  // Fallback to jsonTransport / simulated logger for development & test environments
  return nodemailer.createTransport({
    jsonTransport: true
  });
}

/**
 * Build rich HTML email template with all request details
 */
function buildEmailContent(docId: string, data: any, collectionName: string) {
  const customerName = data.fullName || data.name || data.customerName || "Valued Customer";
  const phone = data.phone || data.phoneNumber || "Not provided";
  const whatsapp = data.whatsapp || data.phone || "Not provided";
  const customerEmail = data.email || data.customerEmail || "";
  const area = data.area || data.location || "Peshawar";
  const address = data.address || "On-site / Home / Office";
  const deviceType = data.deviceType || "Computer / Laptop";
  const model = data.computerBrandModel || data.model || "Not specified";
  const service = data.serviceRequired || data.serviceTitle || "PC Diagnostic & Repair";
  const problem = data.problemDescription || data.problem || "No description provided";
  const urgency = (data.urgency || "Normal").toUpperCase();
  const importantData = data.containsImportantData || "NO";
  const preferredDate = data.preferredDate || "Earliest available";
  const preferredTime = data.preferredTime || "Anytime";
  const status = data.status || "NEW";
  const createdAt = data.createdAt || new Date().toISOString();

  // WhatsApp reply link
  const cleanPhone = phone.replace(/[^0-9]/g, "");
  const waNumber = cleanPhone.startsWith("0")
    ? "92" + cleanPhone.slice(1)
    : cleanPhone.startsWith("+")
      ? cleanPhone.slice(1)
      : cleanPhone;

  const whatsappReplyLink = `https://wa.me/${waNumber}?text=${encodeURIComponent(
    `Hello ${customerName}, this is Safiullah from TechFix Peshawar regarding your ${service} request (${docId}).`
  )}`;

  const subject = `[${urgency}] New ${collectionName === "bookings" ? "Booking" : "Service Request"}: ${customerName} (${area})`;

  const textBody = `
=====================================================
🔔 NEW ${collectionName.toUpperCase()} RECEIVED!
=====================================================

Reference ID: ${docId}
Received At: ${createdAt}
Status: ${status}

CUSTOMER DETAILS:
- Name: ${customerName}
- Phone: ${phone}
- WhatsApp: ${whatsapp}
- Email: ${customerEmail || "Not provided"}
- Neighborhood / Area: ${area} (Peshawar)
- Street / Address: ${address}

DEVICE & SERVICE REQUIRED:
- Device Type: ${deviceType}
- Brand & Model: ${model}
- Service Needed: ${service}
- Urgency: ${urgency}
- Contains Important Data: ${importantData}

PROBLEM DESCRIPTION:
${problem}

PREFERRED SCHEDULE:
- Date: ${preferredDate}
- Time Window: ${preferredTime}

DIRECT TECHNICIAN ACTION:
- WhatsApp Chat: ${whatsappReplyLink}
- Destination Email: ${TARGET_NOTIFICATION_EMAIL}
=====================================================
`;

  const htmlBody = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0f172a; color: #f8fafc; margin: 0; padding: 24px; }
    .container { max-width: 600px; margin: 0 auto; background-color: #1e293b; border-radius: 12px; border: 1px solid #334155; overflow: hidden; }
    .header { background: linear-gradient(135deg, #1d4ed8, #2563eb); padding: 24px; color: white; }
    .badge { display: inline-block; padding: 4px 10px; border-radius: 9999px; font-size: 12px; font-weight: bold; background: rgba(255,255,255,0.2); }
    .urgent { background-color: #ef4444; color: white; }
    .body { padding: 24px; }
    .section { margin-bottom: 20px; }
    .section-title { font-size: 13px; text-transform: uppercase; letter-spacing: 0.05em; color: #94a3b8; margin-bottom: 8px; font-weight: 600; }
    .row { display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px solid #334155; }
    .label { color: #94a3b8; font-size: 14px; }
    .value { font-weight: 600; color: #f1f5f9; font-size: 14px; text-align: right; }
    .problem-box { background: #090d16; border: 1px solid #334155; padding: 14px; border-radius: 8px; font-size: 14px; color: #e2e8f0; line-height: 1.5; margin-top: 8px; }
    .btn { display: inline-block; padding: 12px 20px; background-color: #10b981; color: white; text-decoration: none; border-radius: 8px; font-weight: bold; margin-top: 16px; text-align: center; }
    .footer { padding: 16px 24px; background-color: #090d16; font-size: 12px; color: #64748b; text-align: center; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <span class="badge ${urgency === 'URGENT' ? 'urgent' : ''}">${urgency} PRIORITY</span>
      <h2 style="margin: 8px 0 0 0; font-size: 20px;">New ${collectionName === 'bookings' ? 'On-Site Booking' : 'Service Request'}</h2>
      <p style="margin: 4px 0 0 0; font-size: 13px; opacity: 0.85;">ID: ${docId} | Received: ${new Date(createdAt).toLocaleString('en-PK', { timeZone: 'Asia/Karachi' })}</p>
    </div>
    <div class="body">
      <div class="section">
        <div class="section-title">Customer Information</div>
        <div class="row"><span class="label">Customer Name</span><span class="value">${customerName}</span></div>
        <div class="row"><span class="label">Phone</span><span class="value">${phone}</span></div>
        <div class="row"><span class="label">WhatsApp</span><span class="value">${whatsapp}</span></div>
        ${customerEmail ? `<div class="row"><span class="label">Customer Email</span><span class="value"><a href="mailto:${customerEmail}" style="color: #60a5fa; text-decoration: none;">${customerEmail}</a></span></div>` : ''}
        <div class="row"><span class="label">Area</span><span class="value">${area} (Peshawar)</span></div>
        ${address !== 'On-site / Home / Office' ? `<div class="row"><span class="label">Address</span><span class="value">${address}</span></div>` : ''}
      </div>

      <div class="section">
        <div class="section-title">Diagnostic & Hardware Details</div>
        <div class="row"><span class="label">Device Type</span><span class="value">${deviceType}</span></div>
        <div class="row"><span class="label">Brand & Model</span><span class="value">${model}</span></div>
        <div class="row"><span class="label">Service Required</span><span class="value">${service}</span></div>
        <div class="row"><span class="label">Contains Sensitive/Important Data</span><span class="value" style="color: ${importantData === 'YES' ? '#fbbf24' : '#94a3b8'};">${importantData}</span></div>
        <div class="row"><span class="label">Preferred Schedule</span><span class="value">${preferredDate} (${preferredTime})</span></div>
      </div>

      <div class="section">
        <div class="section-title">Reported Problem Description</div>
        <div class="problem-box">${problem}</div>
      </div>

      <a href="${whatsappReplyLink}" class="btn" target="_blank">Chat with Customer on WhatsApp</a>
    </div>
    <div class="footer">
      Peshawar On-Site Computer Support • Notification sent directly to ${TARGET_NOTIFICATION_EMAIL}
    </div>
  </div>
</body>
</html>
`;

  return { subject, textBody, htmlBody };
}

/**
 * Cloud Function Trigger for new documents in 'serviceRequests' collection
 */
export const onServiceRequestCreated = onDocumentCreated(
  "serviceRequests/{requestId}",
  async (event) => {
    const snapshot = event.data;
    if (!snapshot) {
      console.log("No data associated with event");
      return;
    }

    const docId = event.params.requestId;
    const data = snapshot.data();
    console.log(`[TRIGGER: serviceRequests] New request created: ${docId}`, data);

    const { subject, textBody, htmlBody } = buildEmailContent(docId, data, "serviceRequests");
    const transporter = createEmailTransporter();

    try {
      const info = await transporter.sendMail({
        from: `"Peshawar Tech Support System" <alerts@peshawar-techsupport.pk>`,
        to: TARGET_NOTIFICATION_EMAIL,
        subject,
        text: textBody,
        html: htmlBody
      });

      console.log(`[EMAIL DISPATCH SUCCESS] Triggered email for ${docId} to ${TARGET_NOTIFICATION_EMAIL}`, info.messageId || info);

      // Audit log in Firestore
      await adminDb.collection("activityLogs").add({
        action: "Email Alert Sent",
        details: `Cloud Function triggered notification for serviceRequest ${docId} to ${TARGET_NOTIFICATION_EMAIL}`,
        requestId: docId,
        collection: "serviceRequests",
        timestamp: new Date().toISOString(),
        user: "Firebase Cloud Function"
      });
    } catch (error) {
      console.error(`[EMAIL DISPATCH ERROR] Failed to send email for request ${docId}:`, error);
    }
  }
);

/**
 * Cloud Function Trigger for new documents in 'bookings' collection
 */
export const onBookingCreated = onDocumentCreated(
  "bookings/{bookingId}",
  async (event) => {
    const snapshot = event.data;
    if (!snapshot) {
      console.log("No data associated with event");
      return;
    }

    const docId = event.params.bookingId;
    const data = snapshot.data();
    console.log(`[TRIGGER: bookings] New booking created: ${docId}`, data);

    const { subject, textBody, htmlBody } = buildEmailContent(docId, data, "bookings");
    const transporter = createEmailTransporter();

    try {
      const info = await transporter.sendMail({
        from: `"Peshawar Tech Support System" <alerts@peshawar-techsupport.pk>`,
        to: TARGET_NOTIFICATION_EMAIL,
        subject,
        text: textBody,
        html: htmlBody
      });

      console.log(`[EMAIL DISPATCH SUCCESS] Triggered email for booking ${docId} to ${TARGET_NOTIFICATION_EMAIL}`, info.messageId || info);

      // Audit log in Firestore
      await adminDb.collection("activityLogs").add({
        action: "Email Alert Sent",
        details: `Cloud Function triggered notification for booking ${docId} to ${TARGET_NOTIFICATION_EMAIL}`,
        bookingId: docId,
        collection: "bookings",
        timestamp: new Date().toISOString(),
        user: "Firebase Cloud Function"
      });
    } catch (error) {
      console.error(`[EMAIL DISPATCH ERROR] Failed to send email for booking ${docId}:`, error);
    }
  }
);
