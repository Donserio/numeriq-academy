/**
 * NumerIQ Academy - Interactive Scripts
 * "Learning, Personalised." | academy.numeriq.space
 */

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

  // 5. Parent Enquiry Form Submission
  const enquiryForm = document.getElementById('parentEnquiryForm');
  const successBox = document.getElementById('formSuccessMessage');
  const successSummary = document.getElementById('successSummary');
  const resetBtn = document.getElementById('resetFormBtn');

  if (enquiryForm && successBox) {
    enquiryForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Check that at least one subject is checked
      const checkedSubjects = Array.from(
        enquiryForm.querySelectorAll('input[name="subjects"]:checked')
      ).map(cb => cb.value);

      if (checkedSubjects.length === 0) {
        alert('Please select at least one subject of interest (Mathematics, Arabic Language, or Qur’an Reading).');
        return;
      }

      const parentName = document.getElementById('parentName').value.trim();
      const parentEmail = document.getElementById('parentEmail').value.trim();
      const parentPhone = document.getElementById('parentPhone').value.trim();
      const learnerAge = document.getElementById('learnerAge').value;
      const timeZone = document.getElementById('timeZone').value;
      const goals = document.getElementById('learningGoals').value.trim();

      // Display friendly personalized confirmation
      successSummary.innerHTML = `
        Thank you, <strong>${escapeHtml(parentName)}</strong>! We have recorded your enquiry for <strong>${escapeHtml(checkedSubjects.join(', '))}</strong> (${escapeHtml(learnerAge)}). 
        <br><br>
        A member of the NumerIQ Academy team will contact you via WhatsApp (<strong>${escapeHtml(parentPhone)}</strong>) or email within 24 hours to coordinate an introductory consultation.
      `;

      enquiryForm.style.display = 'none';
      successBox.style.display = 'block';

      // Log enquiry data for operational review
      console.log('NumerIQ Academy Enquiry Submitted:', {
        parentName,
        parentEmail,
        parentPhone,
        learnerAge,
        subjects: checkedSubjects,
        timeZone,
        goals,
        timestamp: new Date().toISOString()
      });
    });

    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        enquiryForm.reset();
        enquiryForm.style.display = 'block';
        successBox.style.display = 'none';
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
