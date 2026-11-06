#!/bin/bash
# One run: creates a Twilio API key only for trydenttcleaning.ca lead texts and
# stores it in the Vercel project (Preview and Production). The key secret goes
# straight from Twilio into Vercel and is never printed. Revoke the key in
# Twilio (Account > API keys) to cut the site off without touching anything else.
# LEAD_SMS_TO is NOT set here, so no text goes out until it is.
set -euo pipefail

ENVF="/Users/elliottcuthbert/Documents/Premmisus/Mafia/.env.local"
cd "/Users/elliottcuthbert/Documents/Premmisus/Clients/Trydentt/Trydentt-Live"
source ~/.nvm/nvm.sh >/dev/null && nvm use 20.20.1 >/dev/null

read_env() { grep -E "^$1=" "$ENVF" | head -1 | cut -d= -f2- | tr -d "\"' \r"; }
SID=$(read_env TWILIO_ACCOUNT_SID)
TOK=$(read_env TWILIO_AUTH_TOKEN)
[ -n "$SID" ] && [ -n "$TOK" ] || { echo "Twilio login not found in Mafia .env.local"; exit 1; }

TMP=$(mktemp); trap 'rm -f "$TMP"' EXIT
curl -s -X POST "https://api.twilio.com/2010-04-01/Accounts/$SID/Keys.json" \
  -u "$SID:$TOK" --data-urlencode "FriendlyName=trydenttcleaning-site lead alerts" -o "$TMP"
field() { python3 -c "import json,sys; print(json.load(open(sys.argv[1])).get(sys.argv[2]) or '')" "$TMP" "$1"; }
KEY_SID=$(field sid)
KEY_SECRET=$(field secret)
[ -n "$KEY_SID" ] && [ -n "$KEY_SECRET" ] || { echo "Twilio did not create the key: $(field message)"; exit 1; }
echo "Created Twilio key ${KEY_SID:0:8}..."

add() {
  for target in preview production; do
    if printf '%s' "$2" | vercel env add "$1" "$target" --force >/dev/null 2>&1; then
      echo "  $1 saved for $target"
    else
      echo "  $1 FAILED for $target"; exit 1
    fi
  done
}
add TWILIO_ACCOUNT_SID "$SID"
add TWILIO_API_KEY_SID "$KEY_SID"
add TWILIO_API_KEY_SECRET "$KEY_SECRET"
add LEAD_SMS_FROM "+15487617171"
echo "Done. No texts go out until LEAD_SMS_TO is set."
