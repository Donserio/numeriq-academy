// api/enquiry.js - Vercel Serverless Function
// Handles parent enquiry submissions, email alerts, and spam protection for NumerIQ Academy

const nodemailer = require('nodemailer');

const TARGET_NOTIFICATION_EMAIL = 'numeriq.academy@gmail.com';
const FOUNDER_WHATSAPP = '2348160298696';

module.exports = async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  try {
    const {
      parentName,
      parentEmail,
      parentPhone,
      learnerAge,
      subjects,
      timeZone,
      learningGoals,
      _gotcha // Honeypot field
    } = req.body || {};

    // 1. Honeypot check: If bot filled the hidden field, silently return success
    if (_gotcha) {
      console.warn('Bot submission blocked via honeypot:', { parentName, parentEmail });
      return res.status(200).json({ success: true, message: 'Enquiry received successfully.' });
    }

    // 2. Validate required inputs
    if (!parentName || !parentEmail || !parentPhone || !learnerAge) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields. Please fill in parent name, email, phone, and learner year.'
      });
    }

    const subjectList = Array.isArray(subjects) ? subjects.join(', ') : (subjects || 'Not specified');
    const submissionTime = new Date().toUTCString();

    // 3. Prepare Email Content
    const emailSubject = `🔔 New Enquiry: ${parentName} (${subjectList})`;
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 8px;">
        <div style="background-color: #1e3a8a; padding: 16px; border-radius: 6px; text-align: center; margin-bottom: 24px;">
          <h2 style="color: #ffffff; margin: 0; font-size: 20px;">NumerIQ Academy Enquiry</h2>
          <p style="color: #cbd5e1; margin: 4px 0 0; font-size: 13px;">Learning, Personalised. (academy.numeriq.space)</p>
        </div>

        <h3 style="color: #0f172a; margin-top: 0;">New Learner Consultation Request</h3>
        <p style="color: #475569; font-size: 14px;">A parent has submitted an enquiry through the landing page.</p>

        <table style="width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 14px;">
          <tr style="border-bottom: 1px solid #e2e8f0;">
            <td style="padding: 10px 0; font-weight: bold; color: #334155; width: 35%;">Parent / Guardian:</td>
            <td style="padding: 10px 0; color: #0f172a;">${parentName}</td>
          </tr>
          <tr style="border-bottom: 1px solid #e2e8f0;">
            <td style="padding: 10px 0; font-weight: bold; color: #334155;">Email Address:</td>
            <td style="padding: 10px 0; color: #0f172a;"><a href="mailto:${parentEmail}">${parentEmail}</a></td>
          </tr>
          <tr style="border-bottom: 1px solid #e2e8f0;">
            <td style="padding: 10px 0; font-weight: bold; color: #334155;">WhatsApp / Phone:</td>
            <td style="padding: 10px 0; color: #0f172a;">
              <a href="https://wa.me/${parentPhone.replace(/[^0-9]/g, '')}" target="_blank" style="color: #2563eb; font-weight: 600;">
                ${parentPhone} (Click to open WhatsApp)
              </a>
            </td>
          </tr>
          <tr style="border-bottom: 1px solid #e2e8f0;">
            <td style="padding: 10px 0; font-weight: bold; color: #334155;">Learner Year / Grade:</td>
            <td style="padding: 10px 0; color: #0f172a;">${learnerAge}</td>
          </tr>
          <tr style="border-bottom: 1px solid #e2e8f0;">
            <td style="padding: 10px 0; font-weight: bold; color: #334155;">Subject(s) Needed:</td>
            <td style="padding: 10px 0; color: #0f172a; font-weight: 600;">${subjectList}</td>
          </tr>
          <tr style="border-bottom: 1px solid #e2e8f0;">
            <td style="padding: 10px 0; font-weight: bold; color: #334155;">Family Time Zone:</td>
            <td style="padding: 10px 0; color: #0f172a;">${timeZone || 'Not specified'}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; font-weight: bold; color: #334155; vertical-align: top;">Current Goals / Struggles:</td>
            <td style="padding: 10px 0; color: #0f172a; line-height: 1.5;">${learningGoals ? learningGoals.replace(/\n/g, '<br>') : 'None provided'}</td>
          </tr>
        </table>

        <div style="background-color: #f8fafc; padding: 14px; border-radius: 6px; font-size: 12px; color: #64748b; margin-top: 24px;">
          Received at: ${submissionTime}<br>
          Direct Action: You can reply directly to this email or initiate a conversation via WhatsApp.
        </div>
      </div>
    `;

    let emailSent = false;

    // Check if Resend API key is present
    if (process.env.RESEND_API_KEY) {
      try {
        const resendRes = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            from: process.env.EMAIL_FROM || 'NumerIQ Academy <enquiries@numeriq.space>',
            to: [TARGET_NOTIFICATION_EMAIL],
            reply_to: parentEmail,
            subject: emailSubject,
            html: emailHtml
          })
        });
        if (resendRes.ok) {
          emailSent = true;
          console.log('Email delivered via Resend API.');
        } else {
          const errData = await resendRes.text();
          console.error('Resend API error:', errData);
        }
      } catch (resendErr) {
        console.error('Failed sending via Resend:', resendErr);
      }
    }

    // Check if Nodemailer (Gmail App Password / Custom SMTP) is configured
    if (!emailSent && process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      try {
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST || 'smtp.gmail.com',
          port: parseInt(process.env.SMTP_PORT || '465', 10),
          secure: process.env.SMTP_SECURE !== 'false',
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
          }
        });

        await transporter.sendMail({
          from: `"NumerIQ Academy" <${process.env.EMAIL_USER}>`,
          to: TARGET_NOTIFICATION_EMAIL,
          replyTo: parentEmail,
          subject: emailSubject,
          html: emailHtml
        });
        emailSent = true;
        console.log('Email delivered via Nodemailer SMTP.');
      } catch (smtpErr) {
        console.error('Failed sending via Nodemailer SMTP:', smtpErr);
      }
    }

    // 4. Optional CallMeBot WhatsApp ping to founder's phone
    if (process.env.CALLMEBOT_API_KEY) {
      try {
        const textMsg = encodeURIComponent(
          `🔔 *NumerIQ Academy Enquiry*\n` +
          `• *Parent:* ${parentName}\n` +
          `• *Phone:* ${parentPhone}\n` +
          `• *Subject:* ${subjectList}\n` +
          `• *Year:* ${learnerAge}\n` +
          `• *Zone:* ${timeZone}\n` +
          `• *Goals:* ${learningGoals || 'None'}`
        );
        const botUrl = `https://api.callmebot.com/whatsapp.php?phone=${FOUNDER_WHATSAPP}&text=${textMsg}&apikey=${process.env.CALLMEBOT_API_KEY}`;
        await fetch(botUrl);
      } catch (botErr) {
        console.error('CallMeBot notification error:', botErr);
      }
    }

    // Log the enquiry in Vercel function runtime logs
    console.log('Enquiry logged successfully:', {
      parentName,
      parentEmail,
      parentPhone,
      learnerAge,
      subjects: subjectList,
      timeZone,
      emailSent,
      timestamp: submissionTime
    });

    return res.status(200).json({
      success: true,
      message: 'Enquiry received successfully.',
      emailDelivered: emailSent
    });

  } catch (error) {
    console.error('Serverless enquiry handler exception:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while processing your enquiry. Please contact us directly via WhatsApp.'
    });
  }
};
