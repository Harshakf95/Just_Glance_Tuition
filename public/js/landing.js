const menuButton = document.querySelector('.nav-toggle');
const navigation = document.querySelector('#primary-nav');

if (menuButton && navigation) {
  const closeMenu = () => {
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Open navigation');
    navigation.classList.remove('is-open');
  };

  menuButton.addEventListener('click', () => {
    const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', String(!isOpen));
    menuButton.setAttribute('aria-label', isOpen ? 'Open navigation' : 'Close navigation');
    navigation.classList.toggle('is-open', !isOpen);
  });

  navigation.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMenu();
  });
}

const contactEmail = 'hfattepur@gmail.com';

document.querySelectorAll('[data-program]').forEach((link) => {
  link.addEventListener('click', () => {
    const programSelect = document.querySelector('#admission-program');
    if (programSelect) programSelect.value = link.dataset.program;
  });
});

function openEnquiryEmail(form, subject) {
  const message = Array.from(new FormData(form), ([label, value]) => `${label}: ${value}`).join('\n');
  const mailto = `mailto:${contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
  const status = form.querySelector('[aria-live="polite"]');

  window.location.href = mailto;
  status.textContent = 'Your email app should open with the enquiry ready. Review it and press Send to submit.';
}

document.querySelector('#admission-form')?.addEventListener('submit', (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const program = form.querySelector('#admission-program').value;
  openEnquiryEmail(form, `Admission enquiry: ${program}`);
});

document.querySelector('#contact-form')?.addEventListener('submit', (event) => {
  event.preventDefault();
  openEnquiryEmail(event.currentTarget, 'Website enquiry - Just Glance Remote Tuition');
});
