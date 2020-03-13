function togglePopupNav() {
  const hamburgerButton = document.querySelector('.js-hamburger-button');
  const closeButton = document.querySelector('.js-close-button');
  const popupNav = document.querySelector('.js-popup-nav');

  const hiddenButtonClass = 'header__menu-button_hidden';
  const popupActiveClass = 'popup-nav_active';

  let popupState = popupNav.dataset.state;

  function togglePopupAndButtons(event) {
    const button = event.currentTarget;

    button.classList.add(hiddenButtonClass);

    if (popupState === 'closed') {
      button.nextElementSibling.classList.remove(hiddenButtonClass);
      document.body.style.overflowY = 'hidden';
      popupState = 'open';
    } else {
      button.previousElementSibling.classList.remove(hiddenButtonClass);
      document.body.style.overflowY = '';
      popupState = 'closed';
    }

    popupNav.classList.toggle(popupActiveClass);
  }

  function closePopup() {
    if (popupState === 'open') {
      hamburgerButton.classList.remove(hiddenButtonClass);
      closeButton.classList.add(hiddenButtonClass);
      popupNav.classList.remove(popupActiveClass);
      document.body.style.overflowY = '';
      popupState = 'closed';
    }
  }

  hamburgerButton.addEventListener('click', (event) => {
    togglePopupAndButtons(event);
  });

  closeButton.addEventListener('click', (event) => {
    togglePopupAndButtons(event);
  });

  popupNav.addEventListener('click', (event) => {
    if (event.target === popupNav) {
      closePopup();
    }
  });

  window.addEventListener('resize', () => {
    if (document.documentElement.clientWidth >= 1000) {
      closePopup();
    }
  });
}

function validateSubscriptionForm() {
  const form = document.forms.subscription;
  const input = form.elements['user-email'];
  const error = form.querySelector('.js-form-error');

  const inputErrorClass = 'form__input_error';

  function setError() {
    input.classList.add(inputErrorClass);
    error.innerHTML = 'Please insert a valid email';
  }

  function removeError() {
    input.classList.remove(inputErrorClass);
    error.innerHTML = '';
  }

  form.addEventListener('submit', (event) => {
    if (!input.validity.valid) {
      event.preventDefault();
      setError();
      // input.value = '';
      input.focus();
    }
  });

  input.addEventListener('blur', () => {
    removeError();
  });
}

const glideOptions = {
  type: 'carousel',
  autoplay: 4000,
  hoverpause: true,
  animationDuration: 1000,
  gap: 30,
  peek: -120,
  perView: 3,
  breakpoints: {
    999: {
      perView: 2,
      gap: 25,
      peek: 25,
    },
    767: {
      perView: 1,
      gap: 25,
      peek: 25,
    },
  },
  classes: {
    activeNav: 'testimonials__bullet_active',
  },
};

document.addEventListener('DOMContentLoaded', () => {
  togglePopupNav();
  validateSubscriptionForm();

  const testimonialsCarousel = new Glide('.js-carousel', glideOptions);

  testimonialsCarousel.on('mount.after', () => {
    const slides = document.querySelectorAll('.glide__slide');

    slides.forEach((slide) => {
      const isClone = slide.classList.contains('glide__slide--clone');

      if (isClone) {
        slide.setAttribute('aria-hidden', true);
      }
    });
  });

  testimonialsCarousel.mount();
});
