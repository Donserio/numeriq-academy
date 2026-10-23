# NumerIQ Academy Website

> **Brand Line:** "Learning, Personalised."  
> **Target Domain:** `academy.numeriq.space`  
> **Root Domain:** `numeriq.space`

---

## Overview

This repository contains the official landing page and parent sign-up funnel for **NumerIQ Academy**, built according to the **NumerIQ Academy Brand, Purpose & Operating Blueprint**.

It is constructed with clean, semantic **HTML5, CSS3, and JavaScript**, ensuring:
- Blazing fast load times with zero heavy framework bloat.
- Seamless responsiveness across mobile devices, tablets, laptops, and desktop displays.
- Cross-border positioning specifically catering to families across the **UK, USA, and Canada**.
- Adherence to brand guidelines: calm, dignified, encouraging tone, zero false urgency, and strict child privacy respect.

---

## Structure

```
├── index.html       # Semantic page structure & SVG iconography
├── styles.css       # Brand design system, Inter typography & responsive grid
├── script.js        # Mobile navigation, FAQ accordion, dynamic pre-selection & form handling
└── README.md        # Documentation and deployment guide
```

---

## Features & Sections

1. **Brand Header**:
   - Modern brand logo styling with elevated **IQ** styling and clear navigation.
2. **Hero Section**:
   - Tagline: *"Learning, Personalised."*
   - Subtitle emphasizing individual learning pace and diagnostic teaching.
   - Dual Call-to-Actions (*"Book a Free Consultation"* and *"Explore Programmes"*).
   - Trust highlights (UK GCSE/Year 5–12 & US/Canada Grade equivalents, diagnostic-led, transparent reports).
3. **Targeted Programmes**:
   - **Mathematics** (Year 5–12 / GCSE / Grades 5–12): Foundational diagnostic gap closing, step-by-step problem solving, deliberate practice.
   - **Arabic Language**: Structured starting levels, vocabulary, grammar, reading fluency.
   - **Qur’an Reading**: Paced, respectful, Tajweed rules and phonetic accuracy.
4. **The NumerIQ Method**:
   - 4-step learning cycle: *01. Understand -> 02. Diagnose -> 03. Teach & Practise -> 04. Adapt & Report*.
5. **The NumerIQ Difference ("Understanding Before Appearance")**:
   - Side-by-side comparison illustrating why NumerIQ differs from generic worksheet-driven tutoring.
   - Reassurance on child psychological safety, dignity, and independence.
6. **Cross-Border Trust & Safeguarding**:
   - Time-zone flexibility across UK (GMT/BST), US Eastern/Central/Pacific, Canada, and West Africa.
   - Child safety and privacy protections.
   - No lock-in contracts.
7. **Parent Sign-up & Consultation Form**:
   - Captures parent name, email, WhatsApp/phone number, learner age/grade, subject(s) of interest, family time zone, and learner struggles/goals.
   - Instant confirmation with personalized feedback.
   - Direct WhatsApp reach-out button.
8. **Parent FAQ Accordion**:
   - Addresses live lesson format, time zones, diagnostics, reporting, sibling enrolments, and honest expectations.

---

## Previewing Locally

You can open `index.html` directly in any web browser, or serve it using any lightweight server:

```powershell
# Using Python (built-in):
python -m http.server 8000

# Or using Node (npx serve):
npx serve .
```

Then visit `http://localhost:8000` in your browser.

---

## Domain Setup (`academy.numeriq.space`)

To point your domain `academy.numeriq.space` to this site:
1. In your DNS provider for `numeriq.space`, add a **CNAME** or **A** record:
   - **Host / Subdomain:** `academy`
   - **Value / Target:** Point to your web host (e.g., GitHub Pages, Cloudflare Pages, Netlify, Vercel, or cPanel/shared hosting).
2. Upload these files (`index.html`, `styles.css`, `script.js`) to the root of that subdomain.
