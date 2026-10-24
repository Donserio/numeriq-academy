# NumerIQ Academy Website

> **Brand Line:** "Learning, Personalised."  
> **Target Domain:** `academy.numeriq.space`  
> **Root Domain:** `numeriq.space`  
> **Contact WhatsApp:** `+234 816 029 8696`  
> **Notification Email:** `numeriq.academy@gmail.com`

---

## Overview

This repository contains the official landing page and parent consultation funnel for **NumerIQ Academy**, built according to the **NumerIQ Academy Brand, Purpose & Operating Blueprint**.

It is constructed with clean, semantic **HTML5, CSS3, and JavaScript**, paired with a native **Vercel Serverless API Route (`/api/enquiry`)** for instant email and WhatsApp lead delivery.

---

## Project Structure

```
├── index.html          # Semantic page structure & SVG iconography
├── styles.css          # Brand design system, Inter typography & responsive grid
├── script.js           # Navigation, FAQ accordion, dynamic pre-selection & API submission
├── favicon.svg         # Crisp SVG brand mark & browser icon
├── package.json        # Dependencies for Vercel serverless function (nodemailer)
├── api/
│   └── enquiry.js      # Native Vercel serverless function (Email dispatch & spam filter)
└── README.md           # Documentation and configuration guide
```

---

## Form Submission & Email Delivery Setup

When a parent submits an enquiry, the site:
1. Validates the submission and passes the spam honeypot check.
2. Posts the data to `/api/enquiry`.
3. Dispatches an email notification to **`numeriq.academy@gmail.com`**.
4. Immediately presents the parent with a 1-click **"Chat With Us on WhatsApp Now"** button pre-filled with their details (`+234 816 029 8696`).

### Connecting Email in Vercel Settings

To enable automated email delivery to `numeriq.academy@gmail.com`, you can use either **Gmail SMTP** or **Resend**:

#### Option A: Gmail SMTP (Recommended & Free)
In your **Vercel Dashboard** $\to$ **Your Project** $\to$ **Settings** $\to$ **Environment Variables**, add:
1. `EMAIL_USER` = `numeriq.academy@gmail.com`
2. `EMAIL_PASS` = *Your 16-character Google App Password*  
   *(To get an App Password: Go to your Google Account $\to$ Security $\to$ 2-Step Verification $\to$ App Passwords $\to$ Create one for "NumerIQ Website").*

#### Option B: Resend (Alternative Free Tier)
1. Sign up at [resend.com](https://resend.com) (free 3,000 emails/month).
2. In Vercel Environment Variables, add:
   - `RESEND_API_KEY` = `re_...`
   - `EMAIL_FROM` = `enquiries@numeriq.space` (once domain is verified in Resend)

---

## Production Features Added

- **Native Vercel Serverless Route (`api/enquiry.js`)**: Secure, automated dispatch without exposing credentials.
- **Honeypot Spam Defense**: Silent trap that discards bot-generated spam submissions.
- **Floating WhatsApp Widget**: Persistent button with tooltip across all pages linking directly to `+234 816 029 8696`.
- **OpenGraph & Twitter Meta Tags**: High-resolution preview titles, descriptions, and icon for WhatsApp and social sharing.
- **Child Safeguarding & Privacy Policy Modal**: Formalized statement accessible from the footer and enquiry form.
- **Brand SVG Favicon**: Clean, vector-sharp icon on modern browsers.
