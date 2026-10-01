# QA Services

A one-page static site for two independent QA risk-review services:

- **Critical User Flow Testing** — from $750, base scope 2–3 business days
- **QA Process & Test Coverage Audit** — from $1,200, base scope about 5 business days

Listed prices are starting prices for the base scope. The final fixed quote is agreed by scope and documented in the Invoice.

The page is a service offering, not a personal portfolio. It is plain HTML, CSS, and small client-side scripts. There is no application backend, analytics, or build step.

## Preview locally

Serve the folder with a local web server:

```bash
python3 -m http.server 8080
```

Then visit `http://localhost:8080`.

## Page structure

1. Hero
2. Two service choices (question above each card)
3. A centered enquiry dialog opened by **Select**

## Enquiries

The enquiry form posts directly to FormSubmit in a hidden response frame. It does not use `mailto:` and does not require a configured desktop mail client.

The public FormSubmit alias generated during activation is stored once in `script.js` as `FORM_TOKEN`. The destination Gmail address is not embedded in the page source.

Flow:

1. Click **Select** on a service.
2. Enter a required email and an optional comment.
3. Click **Request this service**.
4. The browser POSTs the selected service, contact email and comment to FormSubmit.
5. The dialog switches to a simple success state.

The visitor email is sent as the reply-to address so the enquiry can be answered directly.

### First-use activation

FormSubmit requires the destination mailbox to confirm the form once. Activate the form from the email sent to the destination mailbox, then verify a second test submission is delivered successfully.

## Production checks

1. Confirm the FormSubmit alias remains active and a test enquiry reaches the destination mailbox.
2. Verify Reply uses the visitor email.
3. Keep the canonical URLs and `og:url` aligned with `https://qa-audits.com/`.
4. Re-check the Calendly service mapping after changing service options.
5. If the enquiry destination changes, regenerate/configure the corresponding FormSubmit alias rather than embedding a private mailbox address in the page.

## Static deployment

Any static host works, for example:

- GitHub Pages
- Netlify
- Cloudflare Pages
- any web server that serves `index.html`, `styles.css`, and `script.js`

The repository includes `CNAME` for the production domain `qa-audits.com`.
