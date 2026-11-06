// Trydentt Cleaning: website lead intake.
//
// trydenttcleaning.ca/api/lead posts every form lead here. This script writes
// it to the Residential or Commercial tab of this spreadsheet and emails
// homes@ from homes@'s own address (Reply goes straight to the customer when
// they left an email). The text alert is sent by the website, not from here,
// so the owner still hears about a lead if this script fails.
//
// Runs as homes@trydenttbuildingservices.com (web app, "Execute as: Me").
// Built 2026-11-06 to replace GoHighLevel for Trydentt Cleaning.

const SECRET = '__SECRET__';
const SHEET_ID = '__SHEET_ID__';
const ALERT_TO = 'homes@trydenttbuildingservices.com';
const TZ = 'America/Toronto';

const TABS = ['Residential', 'Commercial'];
const HEADERS = ['Received', 'Status', 'Name', 'Phone', 'Email', 'Service', 'Postal Code', 'Address',
  'Estimate', 'Details', 'Source', 'Page', 'UTM', 'Lead ID', 'Notes'];
const STATUSES = ['New', 'Called', 'Quoted', 'Booked', 'Not a fit'];
const COL = { received: 1, phone: 4, email: 5, source: 11, leadId: 14 };

// The same person pressing submit twice inside this window is one lead.
const REPEAT_WINDOW_MS = 15 * 60 * 1000;

function doPost(e) {
  let body;
  try {
    body = JSON.parse(e.postData.contents);
  } catch (err) {
    return json({ ok: false, error: 'bad json' });
  }
  if (!body || body.secret !== SECRET) return json({ ok: false, error: 'unauthorized' });

  // One writer at a time, so a double submit cannot pass the duplicate check twice.
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(25000)) return json({ ok: false, error: 'busy, retry' });
  try {
    if (body.type === 'lead') return json(recordLead(body.lead || {}));
    if (body.type === 'ping') return json({ ok: true, pong: true });
    return json({ ok: false, error: 'unknown type' });
  } catch (err) {
    return json({ ok: false, error: String((err && err.message) || err) });
  } finally {
    lock.releaseLock();
  }
}

function doGet() {
  return json({ ok: true, service: 'trydentt-cleaning lead intake' });
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

function recordLead(lead) {
  const name = String(lead.name || '').trim();
  if (!name) return { ok: false, error: 'lead has no name' };

  const book = SpreadsheetApp.openById(SHEET_ID);
  const tabName = TABS.indexOf(lead.tab) !== -1 ? lead.tab : 'Residential';
  const sheet = ensureTab(book, tabName);

  const repeat = findRepeat(sheet, lead);
  if (repeat) return { ok: true, duplicate: true, tab: tabName, row: repeat };

  const row = [
    new Date(),            // A Received
    'New',                 // B Status
    name,                  // C Name
    lead.phone || '',      // D Phone
    lead.email || '',      // E Email
    lead.service || '',    // F Service
    lead.postalCode || '', // G Postal Code
    lead.address || '',    // H Address
    lead.estimate || '',   // I Estimate
    lead.details || '',    // J Details
    lead.source || '',     // K Source
    lead.page || '',       // L Page
    lead.utm || '',        // M UTM
    lead.eventId || '',    // N Lead ID
    '',                    // O Notes (theirs)
  ].map(safe);
  sheet.appendRow(row);
  const at = sheet.getLastRow();
  sheet.getRange(at, COL.received).setNumberFormat('yyyy-mm-dd h:mm am/pm');

  notifyLead(book, sheet, tabName, lead, at);
  return { ok: true, duplicate: false, tab: tabName, row: at };
}

// Same Lead ID, or the same phone or email from the same form inside the window.
function findRepeat(sheet, lead) {
  const last = sheet.getLastRow();
  if (last < 2) return 0;
  const start = Math.max(2, last - 49);
  const values = sheet.getRange(start, 1, last - start + 1, HEADERS.length).getValues();
  const phone = digits(lead.phone);
  const email = String(lead.email || '').trim().toLowerCase();
  const now = Date.now();
  for (let i = values.length - 1; i >= 0; i--) {
    const r = values[i];
    if (lead.eventId && String(r[COL.leadId - 1]) === String(lead.eventId)) return start + i;
    const when = r[COL.received - 1] instanceof Date ? r[COL.received - 1].getTime() : 0;
    if (now - when > REPEAT_WINDOW_MS) continue;
    const samePerson = (phone && digits(r[COL.phone - 1]) === phone) ||
      (email && String(r[COL.email - 1]).trim().toLowerCase() === email);
    if (samePerson && String(r[COL.source - 1]) === String(lead.source || '')) return start + i;
  }
  return 0;
}

function notifyLead(book, sheet, tabName, lead, row) {
  const what = lead.service || tabName + ' cleaning';
  const subject = 'New website lead: ' + lead.name + ' (' + what + ')';
  const lines = [
    'A new ' + tabName.toLowerCase() + ' lead came in on trydenttcleaning.ca.',
    '',
    'Name: ' + lead.name,
    lead.phone ? 'Phone: ' + lead.phone : '',
    lead.email ? 'Email: ' + lead.email : '',
    'Service: ' + what,
    lead.postalCode ? 'Postal code: ' + lead.postalCode : '',
    lead.address ? 'Address: ' + lead.address : '',
    lead.estimate ? 'Estimate shown: ' + lead.estimate : '',
    lead.details ? 'Details: ' + lead.details : '',
    '',
    'Form: ' + (lead.source || 'website'),
    lead.page ? 'Page: ' + lead.page : '',
    '',
    'Saved in the ' + tabName + ' tab, row ' + row + ':',
    book.getUrl() + '#gid=' + sheet.getSheetId(),
    lead.email ? '\nPress Reply to answer ' + lead.name + ' directly.' : '',
  ];
  const options = { name: 'Trydentt Website' };
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(lead.email || ''))) options.replyTo = lead.email;
  try {
    MailApp.sendEmail(ALERT_TO, subject, lines.filter((l) => l !== '').join('\n'), options);
  } catch (err) {
    console.error('email failed: ' + err);
  }
}

// Creates the tab with its header, frozen top row and Status dropdown if it is missing.
function ensureTab(book, name) {
  let sheet = book.getSheetByName(name);
  if (sheet) return sheet;
  sheet = book.insertSheet(name);
  sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]).setFontWeight('bold');
  sheet.setFrozenRows(1);
  const rule = SpreadsheetApp.newDataValidation().requireValueInList(STATUSES, true).setAllowInvalid(false).build();
  sheet.getRange(2, 2, sheet.getMaxRows() - 1, 1).setDataValidation(rule);
  return sheet;
}

// Run once from the editor after the Sheet is created: tabs, timezone, and the empty default tab removed.
function setup() {
  const book = SpreadsheetApp.openById(SHEET_ID);
  book.setSpreadsheetTimeZone(TZ);
  TABS.forEach((t) => ensureTab(book, t));
  const stray = book.getSheetByName('Sheet1');
  if (stray && book.getSheets().length > TABS.length) book.deleteSheet(stray);
  return { ok: true, tabs: book.getSheets().map((s) => s.getName()), timeZone: book.getSpreadsheetTimeZone() };
}

function digits(v) {
  return String(v || '').replace(/\D/g, '').replace(/^1(?=\d{10}$)/, '');
}

// Text a customer types that starts with = + - @ is stored as text, never run as a formula.
function safe(v) {
  return typeof v === 'string' && /^[=+\-@]/.test(v) ? "'" + v : v;
}
