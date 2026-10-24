/**
 * NumerIQ Academy - Interactive Scripts
 * "Learning, Personalised." | academy.numeriq.space
 */

const FOUNDER_WHATSAPP_NUMBER = '2348160298696';

document.addEventListener('DOMContentLoaded', () => {
  // 1. Set current year in footer
  const yearEl = document.getElementById('currentYear');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // 2. Mobile navigation menu toggle
  const mobileToggle = document.getElementById('mobileToggle');
  const navLinks = document.getElementById('navLinks');

  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });

    // Close menu when clicking any nav link
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
      });
    });
  }

  // 3. FAQ Accordion functionality
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const trigger = item.querySelector('.faq-trigger');
    if (trigger) {
      trigger.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        // Close all
        faqItems.forEach(i => i.classList.remove('active'));
        // Toggle clicked
        if (!isActive) {
          item.classList.add('active');
        }
      });
    }
  });

  // 4. Quick subject pre-selection from programme cards
  const programmeButtons = document.querySelectorAll('[data-subject]');
  programmeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const subject = btn.getAttribute('data-subject');
      if (subject === 'Mathematics') {
        const chk = document.getElementById('checkMaths');
        if (chk) chk.checked = true;
      } else if (subject === 'Arabic Language') {
        const chk = document.getElementById('checkArabic');
        if (chk) chk.checked = true;
      } else if (subject === "Qur'an Reading") {
        const chk = document.getElementById('checkQuran');
        if (chk) chk.checked = true;
      }
    });
  });

  // 5. Child Safeguarding & Privacy Modal
  const privacyModal = document.getElementById('privacyModal');
  const openPrivacyLink = document.getElementById('openPrivacyPolicyLink');
  const footerSafeguardingLink = document.getElementById('footerSafeguardingLink');
  const closePrivacyModal = document.getElementById('closePrivacyModal');

  function openModal(e) {
    if (e) e.preventDefault();
    if (privacyModal) privacyModal.classList.add('active');
  }

  function closeModal() {
    if (privacyModal) privacyModal.classList.remove('active');
  }

  if (openPrivacyLink) openPrivacyLink.addEventListener('click', openModal);
  if (footerSafeguardingLink) footerSafeguardingLink.addEventListener('click', openModal);
  if (closePrivacyModal) closePrivacyModal.addEventListener('click', closeModal);

  if (privacyModal) {
    privacyModal.addEventListener('click', (e) => {
      if (e.target === privacyModal) closeModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });

  // 6. Parent Enquiry Form Submission with Vercel API & WhatsApp Hand-off
  const enquiryForm = document.getElementById('parentEnquiryForm');
  const submitBtn = document.getElementById('submitBtn');
  const errorBanner = document.getElementById('formErrorBanner');
  const successBox = document.getElementById('formSuccessMessage');
  const successSummary = document.getElementById('successSummary');
  const successWhatsAppBtn = document.getElementById('successWhatsAppBtn');
  const resetBtn = document.getElementById('resetFormBtn');

  if (enquiryForm && successBox) {
    enquiryForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (errorBanner) {
        errorBanner.style.display = 'none';
        errorBanner.textContent = '';
      }

      // Check honeypot
      const honeypot = enquiryForm.querySelector('input[name="_gotcha"]');
      if (honeypot && honeypot.value.trim() !== '') {
        console.warn('Spam trap triggered.');
        return;
      }

      // Validate selected subjects
      const checkedSubjects = Array.from(
        enquiryForm.querySelectorAll('input[name="subjects"]:checked')
      ).map(cb => cb.value);

      if (checkedSubjects.length === 0) {
        if (errorBanner) {
          errorBanner.textContent = 'Please select at least one subject of interest (Mathematics, Arabic Language, or Qur’an Reading).';
          errorBanner.style.display = 'block';
        } else {
          alert('Please select at least one subject of interest.');
        }
        return;
      }

      const parentName = document.getElementById('parentName').value.trim();
      const parentEmail = document.getElementById('parentEmail').value.trim();
      const parentPhone = document.getElementById('parentPhone').value.trim();
      const learnerAge = document.getElementById('learnerAge').value;
      const timeZone = document.getElementById('timeZone').value;
      const goals = document.getElementById('learningGoals').value.trim();

      const payload = {
        parentName,
        parentEmail,
        parentPhone,
        learnerAge,
        subjects: checkedSubjects,
        timeZone,
        learningGoals: goals,
        _gotcha: honeypot ? honeypot.value : ''
      };

      // Set Loading State
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Submitting Your Enquiry...';
      }

      try {
        const response = await fetch('/api/enquiry', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });

        const result = await response.json().catch(() => ({}));

        if (!response.ok && !result.success) {
          throw new Error(result.message || 'Server returned an error');
        }

        // Display personalized success message
        successSummary.innerHTML = `
          Thank you, <strong>${escapeHtml(parentName)}</strong>! We have received your consultation request for <strong>${escapeHtml(checkedSubjects.join(', '))}</strong> (${escapeHtml(learnerAge)}).
          <br><br>
          We have sent your details to <strong>numeriq.academy@gmail.com</strong>. You will also hear from us within 24 hours on WhatsApp (<strong>${escapeHtml(parentPhone)}</strong>) or email.
        `;

        // Configure direct WhatsApp continuation link
        if (successWhatsAppBtn) {
          const waMessage = encodeURIComponent(
            `Hello NumerIQ Academy! I just submitted an enquiry on your website.\n\n` +
            `• Parent: ${parentName}\n` +
            `• Learner Stage: ${learnerAge}\n` +
            `• Subject(s): ${checkedSubjects.join(', ')}\n` +
            `• Time Zone: ${timeZone}\n` +
            (goals ? `• Needs/Goals: ${goals}` : '')
          );
          successWhatsAppBtn.href = `https://wa.me/${FOUNDER_WHATSAPP_NUMBER}?text=${waMessage}`;
        }

        enquiryForm.style.display = 'none';
        successBox.style.display = 'block';

        // Scroll to success screen
        successBox.scrollIntoView({ behavior: 'smooth', block: 'center' });

      } catch (err) {
        console.error('Submission error:', err);

        // Fallback: Still display success and guide the parent to WhatsApp directly
        successSummary.innerHTML = `
          Thank you, <strong>${escapeHtml(parentName)}</strong>! Your details have been captured.
          <br><br>
          To ensure we connect right away without any email delay, please tap the button below to message our lead tutor directly on WhatsApp.
        `;

        if (successWhatsAppBtn) {
          const waMessage = encodeURIComponent(
            `Hello NumerIQ Academy! I am enquiring for my child.\n\n` +
            `• Parent: ${parentName}\n` +
            `• Learner Stage: ${learnerAge}\n` +
            `• Subject(s): ${checkedSubjects.join(', ')}\n` +
            `• Time Zone: ${timeZone}\n` +
            (goals ? `• Notes: ${goals}` : '')
          );
          successWhatsAppBtn.href = `https://wa.me/${FOUNDER_WHATSAPP_NUMBER}?text=${waMessage}`;
        }

        enquiryForm.style.display = 'none';
        successBox.style.display = 'block';
        successBox.scrollIntoView({ behavior: 'smooth', block: 'center' });

      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Submit Enquiry & Schedule Call';
        }
      }
    });

    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        enquiryForm.reset();
        enquiryForm.style.display = 'block';
        successBox.style.display = 'none';
        if (errorBanner) errorBanner.style.display = 'none';
      });
    }
  }

  // Helper function to escape HTML
  function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>'"]/g, 
      tag => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;'
      }[tag] || tag)
    );
  }
});
