# QA Services

A one-page static site for two fixed-price QA services:

- **Critical User Flow Testing** ($750, 2–3 business days)
- **QA Process & Test Coverage Audit** ($1,200, about 5 business days)

The page is a service offering, not a personal portfolio. It is plain HTML, CSS, and a small script. There is no application backend, analytics, or build step.

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

## Before public launch

1. Confirm the FormSubmit activation email.
2. Verify a second test enquiry reaches the destination mailbox and that Reply uses the visitor email.
3. Set a canonical URL in `index.html` (commented placeholder in `<head>`).
4. Optionally set `og:url` to the live origin.
5. Replace the temporary Gmail destination with a dedicated service/domain mailbox when available and regenerate/configure the corresponding FormSubmit alias.

## Static deployment

Any static host works, for example:

- GitHub Pages
- Netlify
- Cloudflare Pages
- any web server that serves `index.html`, `styles.css`, and `script.js`

No domain or host is configured in this repository.
