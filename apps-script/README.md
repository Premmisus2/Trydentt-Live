# Trydentt Cleaning lead Sheet (Apps Script)

Every website form posts to `/api/lead`. When `TC_SHEET_WEBHOOK_URL` and
`TC_SHEET_WEBHOOK_SECRET` are set in Vercel, the route sends each lead here.
This script writes the row (Residential or Commercial tab) and emails
homes@ from homes@'s own address. The text alert comes from the website, so it
still goes out if this script is down.

The Sheet and the script belong to homes@trydenttbuildingservices.com, inside
Trydentt's own Google Workspace. Premmisus has editor access only.

## Set up (once)

1. As homes@: create the spreadsheet "Trydentt Cleaning Leads" and a script
   project for it.
2. Upload `Code.gs` and `appsscript.json` with `__SECRET__` and `__SHEET_ID__`
   filled in. Fill them in at upload time only; the secret never goes in git or chat.
3. Run `setup()` once: it sets the Sheet timezone to America/Toronto, creates
   both tabs (bold frozen header, Status dropdown) and removes the empty Sheet1.
4. Deploy as a web app: Execute as Me, access Anyone. Open the `/exec` link
   once as homes@ and click Allow. Until then every call gets a 403.
5. Put the `/exec` URL and the secret in Vercel as `TC_SHEET_WEBHOOK_URL` and
   `TC_SHEET_WEBHOOK_SECRET`. `GET /api/lead` should then show `"sheet": true`.

## Updating the script

Create a new version, then point the SAME deployment at it. A new deployment
gets a new `/exec` URL and the website would keep posting to the old one.

## What it guards against

- Double submits: same Lead ID, or the same phone or email from the same form
  within 15 minutes, is answered `duplicate: true` and the site sends no second text.
- Two leads at once: a script lock, one writer at a time.
- Formula injection: text starting with = + - @ is stored as text.
