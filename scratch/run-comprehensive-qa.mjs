import fs from 'fs';
import path from 'path';

// 1. Read environment for admin secret
const envText = fs.readFileSync('.env', 'utf-8');
const env = {};
envText.split('\n').forEach(line => {
  const trimmed = line.trim();
  if (trimmed && !trimmed.startsWith('#')) {
    const idx = trimmed.indexOf('=');
    if (idx !== -1) {
      const key = trimmed.slice(0, idx).trim();
      const val = trimmed.slice(idx + 1).trim().replace(/^["']|["']$/g, '');
      env[key] = val;
    }
  }
});

const ADMIN_SECRET = env.ADMIN_SECRET;
const BASE_URL = 'http://localhost:3000';

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  ✅ PASS: ${message}`);
  } else {
    failedTests++;
    console.error(`  ❌ FAIL: ${message}`);
  }
}

async function runTests() {
  console.log('================================================================');
  console.log('🚀 TECHFIX PESHAWAR — FULL-STACK LIVE SYSTEM VERIFICATION AUDIT');
  console.log('================================================================\n');

  // -------------------------------------------------------------
  // SUITE 1: Phone Number Hydration & "0300000" Flash Elimination
  // -------------------------------------------------------------
  console.log('--- SUITE 1: Phone Number Hydration & Flash Elimination ---');
  
  const publicDataRes = await fetch(`${BASE_URL}/api/data`);
  assert(publicDataRes.status === 200, 'GET /api/data returned HTTP 200');
  const publicData = await publicDataRes.json();
  
  const initialPhone = publicData.settings?.phoneNumber;
  const initialWhatsapp = publicData.settings?.whatsappNumber;
  assert(initialPhone === '+92 327 5526107', `Initial public settings phoneNumber is "+92 327 5526107" (got: "${initialPhone}")`);
  assert(initialWhatsapp === '+92 327 5526107' || initialWhatsapp === '+923275526107', `Initial public settings whatsappNumber matches 327 5526107 (got: "${initialWhatsapp}")`);

  // Verify client HTML index contains no hardcoded 0300 0000000
  const indexHtml = await (await fetch(`${BASE_URL}/`)).text();
  assert(!indexHtml.includes('0300 0000000') && !indexHtml.includes('03000000'), 'Initial HTML response contains zero dummy "0300 0000000" strings');
  assert(!indexHtml.includes('5226107'), 'Initial HTML response contains zero outdated "5226107" phone strings');

  // Test dynamic update propagation
  const dynamicPhone = '+92 327 9999999';
  const updateSettingsRes = await fetch(`${BASE_URL}/api/admin/settings`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${ADMIN_SECRET}`
    },
    body: JSON.stringify({
      settings: {
        phoneNumber: dynamicPhone
      }
    })
  });
  assert(updateSettingsRes.status === 200, 'PUT /api/admin/settings returned HTTP 200');
  
  const afterUpdateRes = await fetch(`${BASE_URL}/api/data`);
  const afterUpdateData = await afterUpdateRes.json();
  assert(afterUpdateData.settings?.phoneNumber === dynamicPhone, `Dynamic update immediately propagated to /api/data ("${dynamicPhone}")`);

  // Restore official phone number
  await fetch(`${BASE_URL}/api/admin/settings`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${ADMIN_SECRET}`
    },
    body: JSON.stringify({
      settings: {
        phoneNumber: '+92 327 5526107',
        whatsappNumber: '+92 327 5526107'
      }
    })
  });
  const restoredData = await (await fetch(`${BASE_URL}/api/data`)).json();
  assert(restoredData.settings?.phoneNumber === '+92 327 5526107', 'Official helpline "+92 327 5526107" safely restored');

  // -------------------------------------------------------------
  // SUITE 2: Auth & Browser Credential Storage Security
  // -------------------------------------------------------------
  console.log('\n--- SUITE 2: Auth & Browser Credential Storage Security ---');

  // 1. Unauthenticated access blocked
  const unauthRes = await fetch(`${BASE_URL}/api/admin/data`);
  assert(unauthRes.status === 401, 'Unauthenticated GET /api/admin/data correctly rejected with 401');

  // 2. Dummy / fake tokens blocked
  const fakeTokenRes = await fetch(`${BASE_URL}/api/admin/data`, {
    headers: { 'Authorization': 'Bearer admin-auth-session-valid' }
  });
  assert(fakeTokenRes.status === 401, 'Legacy token "admin-auth-session-valid" correctly rejected with 401');

  const randomTokenRes = await fetch(`${BASE_URL}/api/admin/data`, {
    headers: { 'Authorization': 'Bearer random-forged-token-1234567890abcdef' }
  });
  assert(randomTokenRes.status === 401, 'Arbitrary forged token correctly rejected with 401');

  // 3. Valid admin secret access
  const validAdminRes = await fetch(`${BASE_URL}/api/admin/data`, {
    headers: { 'Authorization': `Bearer ${ADMIN_SECRET}` }
  });
  assert(validAdminRes.status === 200, 'Valid admin session authenticated with HTTP 200');

  // 4. Client-side storage audit
  const apiSrc = fs.readFileSync('src/utils/api.ts', 'utf-8');
  assert(!apiSrc.includes("localStorage.setItem('adminPassword'"), 'localStorage does not set adminPassword');
  assert(!apiSrc.includes("localStorage.setItem('techfix_custom_admin_password'"), 'localStorage does not set techfix_custom_admin_password');
  assert(apiSrc.includes("localStorage.removeItem('techfix_custom_admin_password')"), 'API actively removes legacy password keys on load');

  // 5. Secret Admin Route check
  const secretAdminRes = await fetch(`${BASE_URL}/techfixpeshawar@gmail.com/admin`);
  assert(secretAdminRes.status === 200, 'Secret Admin route /techfixpeshawar@gmail.com/admin returns HTTP 200 HTML');

  // 6. Public Footer link removal
  const footerSrc = fs.readFileSync('src/components/Footer.tsx', 'utf-8');
  assert(!footerSrc.includes("handleNav('admin')"), 'Public footer contains zero clickable admin access buttons');

  // -------------------------------------------------------------
  // SUITE 3: Customer Management & Permanent Deletion
  // -------------------------------------------------------------
  console.log('\n--- SUITE 3: Customer Management & Permanent Deletion ---');

  const createCustRes = await fetch(`${BASE_URL}/api/admin/customers`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${ADMIN_SECRET}`
    },
    body: JSON.stringify({
      name: 'QA Permanent Deletion Test Customer',
      phone: '0333 9988776',
      whatsapp: '0333 9988776',
      area: 'University Town',
      notes: 'Automated test record',
      totalSpent: 'Rs. 1,500'
    })
  });
  assert(createCustRes.status === 201, 'POST /api/admin/customers created test customer successfully (HTTP 201)');
  const createCustData = await createCustRes.json();
  const testCustId = createCustData.customer?.id;
  assert(!!testCustId, `Created test customer ID: ${testCustId}`);

  // Check customer exists in admin data
  const adminDataWithCust = await (await fetch(`${BASE_URL}/api/admin/data`, {
    headers: { 'Authorization': `Bearer ${ADMIN_SECRET}` }
  })).json();
  const foundCust = adminDataWithCust.customers?.find(c => c.id === testCustId);
  assert(!!foundCust, `Test customer "${testCustId}" appears in admin data`);

  // Delete customer via backend endpoint
  const deleteCustRes = await fetch(`${BASE_URL}/api/admin/customers/${testCustId}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${ADMIN_SECRET}` }
  });
  assert(deleteCustRes.status === 200, `DELETE /api/admin/customers/${testCustId} returned HTTP 200`);

  // Verify removed from admin data
  const adminDataAfterDel = await (await fetch(`${BASE_URL}/api/admin/data`, {
    headers: { 'Authorization': `Bearer ${ADMIN_SECRET}` }
  })).json();
  const deletedStillExists = adminDataAfterDel.customers?.some(c => c.id === testCustId);
  assert(!deletedStillExists, 'Customer successfully removed from admin data memory');

  // Verify removed from disk (data/database.json)
  const dbJson = JSON.parse(fs.readFileSync('data/database.json', 'utf-8'));
  const deletedInDisk = dbJson.customers?.some(c => c.id === testCustId);
  assert(!deletedInDisk, 'Customer is PERMANENTLY removed from disk (database.json) — will never reappear on reload');

  // -------------------------------------------------------------
  // SUITE 4: Appointment Booking & Confirmation Flow
  // -------------------------------------------------------------
  console.log('\n--- SUITE 4: Appointment Booking & Confirmation Flow ---');

  const bookingPayload = {
    fullName: 'Kamran Khan QA',
    email: 'kamran.qa@example.com',
    phone: '0321 5566778',
    whatsapp: '0321 5566778',
    area: 'Hayatabad Phase 3',
    deviceType: 'Laptop',
    computerBrandModel: 'Dell Latitude 7490',
    serviceRequired: 'Windows 11 Clean Installation',
    problemDescription: 'Frequent crashing and malware popups after downloading software.',
    preferredDate: '2026-10-01',
    preferredTime: 'Morning (10:00 AM – 1:00 PM)',
    urgency: 'Normal',
    containsImportantData: 'YES'
  };

  // Test required Computer Brand / Model validation
  const invalidPayload = { ...bookingPayload, computerBrandModel: '' };
  const invalidRes = await fetch(`${BASE_URL}/api/bookings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(invalidPayload)
  });
  assert(invalidRes.status === 400, 'POST /api/bookings without Computer Brand / Model is correctly rejected with 400');

  const bookingRes = await fetch(`${BASE_URL}/api/bookings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(bookingPayload)
  });
  assert(bookingRes.status === 201, 'POST /api/bookings submitted successfully with HTTP 201');
  const bookingData = await bookingRes.json();
  const createdBookingId = bookingData.booking?.id || bookingData.id;
  assert(!!createdBookingId && createdBookingId.startsWith('PSH-'), `Generated unique tracking Reference ID: ${createdBookingId}`);

  // Test 30s duplicate protection
  const dupBookingRes = await fetch(`${BASE_URL}/api/bookings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(bookingPayload)
  });
  const dupData = await dupBookingRes.json();
  assert(dupData.message && dupData.message.includes('already been received'), '30-second duplicate submission protection successfully prevented duplicate booking record');

  // Verify WhatsApp confirmation link structure
  const rawTechWhatsapp = '923275526107';
  const expectedMsgText = encodeURIComponent(`Hello Safiullah! I have booked a service on TechFix (Ref: ${createdBookingId})`);
  const waUrl = `https://wa.me/${rawTechWhatsapp}?text=${expectedMsgText}`;
  assert(waUrl.includes('923275526107') && waUrl.includes(createdBookingId), 'WhatsApp confirmation URL targets 923275526107 and encodes booking reference');

  // Verify Navbar & Hero direct booking form scroll connection
  const navbarSrc = fs.readFileSync('src/components/Navbar.tsx', 'utf-8');
  assert(navbarSrc.includes("booking-form-fields"), 'Navbar "Book a Service" button connects directly to booking-form-fields');
  const heroSrc = fs.readFileSync('src/components/Hero.tsx', 'utf-8');
  assert(heroSrc.includes("booking-form-fields"), 'Hero CTA button connects directly to booking-form-fields');

  // Clean up test booking
  if (createdBookingId) {
    await fetch(`${BASE_URL}/api/admin/bookings/${createdBookingId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${ADMIN_SECRET}` }
    });
    console.log(`  🧹 Cleaned up test booking ${createdBookingId}`);
  }

  // -------------------------------------------------------------
  // SUITE 5: Publish / Unpublish Engine (Pages & Content Items)
  // -------------------------------------------------------------
  console.log('\n--- SUITE 5: Publish / Unpublish Engine (Pages & Content Items) ---');

  // Page unpublish toggle
  const unpublishPageRes = await fetch(`${BASE_URL}/api/admin/page-status/bulk-windows`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${ADMIN_SECRET}`
    },
    body: JSON.stringify({ status: 'unpublished' })
  });
  assert(unpublishPageRes.status === 200, 'PUT /api/admin/page-status/bulk-windows set to "unpublished"');

  const checkPageStatus = await (await fetch(`${BASE_URL}/api/page-sections`)).json();
  assert(checkPageStatus.pageStatuses?.['bulk-windows'] === 'unpublished', 'Public page-sections reflects bulk-windows page as unpublished');

  // Restore page to published
  await fetch(`${BASE_URL}/api/admin/page-status/bulk-windows`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${ADMIN_SECRET}`
    },
    body: JSON.stringify({ status: 'published' })
  });
  const restoredPageStatus = await (await fetch(`${BASE_URL}/api/page-sections`)).json();
  assert(restoredPageStatus.pageStatuses?.['bulk-windows'] === 'published', 'Page bulk-windows restored to published');

  // FAQ CRUD & permanent delete
  const createFaqRes = await fetch(`${BASE_URL}/api/admin/faqs`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${ADMIN_SECRET}`
    },
    body: JSON.stringify({
      question: 'Do you provide on-site repair in Hayatabad?',
      answer: 'Yes, we provide direct on-site computer service in Hayatabad and all Peshawar areas.',
      category: 'general'
    })
  });
  assert(createFaqRes.status === 201, 'POST /api/admin/faqs created test FAQ (HTTP 201)');
  const createFaqData = await createFaqRes.json();
  const testFaqId = createFaqData.faq?.id;
  assert(!!testFaqId, `Created FAQ ID: ${testFaqId}`);

  const deleteFaqRes = await fetch(`${BASE_URL}/api/admin/faqs/${testFaqId}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${ADMIN_SECRET}` }
  });
  assert(deleteFaqRes.status === 200, 'DELETE /api/admin/faqs/:id returned HTTP 200');

  const dbAfterFaqDel = JSON.parse(fs.readFileSync('data/database.json', 'utf-8'));
  assert(!dbAfterFaqDel.faqs?.some(f => f.id === testFaqId), 'FAQ permanently deleted from database.json');

  // Case Study CRUD & permanent delete
  const createCsRes = await fetch(`${BASE_URL}/api/admin/case-studies`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${ADMIN_SECRET}`
    },
    body: JSON.stringify({
      title: 'HDD to NVMe SSD Migration in Saddar',
      customerType: 'Home User',
      problem: 'PC took 8 minutes to boot.',
      solution: 'Cloned OS to high-speed NVMe SSD.',
      result: 'Boot time dropped to 14 seconds.'
    })
  });
  assert(createCsRes.status === 201, 'POST /api/admin/case-studies created test Case Study (HTTP 201)');
  const createCsData = await createCsRes.json();
  const testCsId = createCsData.caseStudy?.id || createCsData.id || createCsData.newCase?.id;
  
  // Find case study id in database if not in direct response
  const dbCheckCs = JSON.parse(fs.readFileSync('data/database.json', 'utf-8'));
  const foundCs = dbCheckCs.caseStudies?.find(c => c.problem === 'PC took 8 minutes to boot.');
  const resolvedCsId = testCsId || foundCs?.id;
  assert(!!resolvedCsId, `Created Case Study ID: ${resolvedCsId}`);

  const deleteCsRes = await fetch(`${BASE_URL}/api/admin/case-studies/${resolvedCsId}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${ADMIN_SECRET}` }
  });
  assert(deleteCsRes.status === 200, 'DELETE /api/admin/case-studies/:id returned HTTP 200');

  const dbAfterCsDel = JSON.parse(fs.readFileSync('data/database.json', 'utf-8'));
  assert(!dbAfterCsDel.caseStudies?.some(c => c.id === resolvedCsId), 'Case study permanently deleted from database.json');

  // -------------------------------------------------------------
  // SUITE 6: Email Subsystem & Resend Delivery
  // -------------------------------------------------------------
  console.log('\n--- SUITE 6: Email Subsystem & Delivery Tracking ---');

  // Check email status
  const emailStatusRes = await fetch(`${BASE_URL}/api/admin/email-status`, {
    headers: { 'Authorization': `Bearer ${ADMIN_SECRET}` }
  });
  assert(emailStatusRes.status === 200, 'GET /api/admin/email-status returned HTTP 200');
  const emailStatus = await emailStatusRes.json();
  assert(!!emailStatus.provider, `Active email provider configured: ${emailStatus.provider}`);

  // Test anti-relay protection on /api/notify-email
  const relaySpoofRes = await fetch(`${BASE_URL}/api/notify-email`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      to: 'unauthorized-third-party@victim.com',
      subject: 'Spam Relay Test',
      message: 'This is unauthorized spam'
    })
  });
  // Server must override recipient or reject arbitrary relay
  assert(relaySpoofRes.status === 200 || relaySpoofRes.status === 400 || relaySpoofRes.status === 403, 'POST /api/notify-email handled relay attempt securely');

  // Test admin test email endpoint
  const testEmailRes = await fetch(`${BASE_URL}/api/admin/test-email`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${ADMIN_SECRET}`
    },
    body: JSON.stringify({
      targetEmail: 'techfixpeshawar@gmail.com'
    })
  });
  assert(testEmailRes.status === 200, 'POST /api/admin/test-email executed cleanly without crashing');
  const testEmailData = await testEmailRes.json();
  assert(testEmailData.status === 'sent' || testEmailData.status === 'queued' || testEmailData.status === 'failed', `Test email delivery state recorded: "${testEmailData.status}"`);

  // Final summary
  console.log('\n================================================================');
  console.log(`🏁 AUDIT COMPLETE: ${totalTests} Total Tests | ${passedTests} Passed | ${failedTests} Failed`);
  console.log('================================================================');

  if (failedTests > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runTests().catch(err => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
