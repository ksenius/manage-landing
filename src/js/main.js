function showPopupNav() {
  const hamburgerButton = document.querySelector('.js-hamburger-button');
  const closeButton = document.querySelector('.js-close-button');
  const popupNav = document.querySelector('.js-popup-nav');

  const hiddenButtonClass = 'header__menu-button_hidden';
  const popupActiveClass = 'popup-nav_active';

  hamburgerButton.addEventListener('click', (event) => {
    popupNav.classList.add(popupActiveClass);

    event.currentTarget.classList.add(hiddenButtonClass);
    closeButton.classList.remove(hiddenButtonClass);

    document.body.style.overflowY = 'hidden';
  });

  closeButton.addEventListener('click', (event) => {
    popupNav.classList.remove(popupActiveClass);

    event.currentTarget.classList.add(hiddenButtonClass);
    hamburgerButton.classList.remove(hiddenButtonClass);

    document.body.style.overflowY = '';
  });
}

const glideOptions = {
  type: 'carousel',
  autoplay: 3000,
  hoverpause: true,
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
  showPopupNav();

  new Glide('.js-carousel', glideOptions).mount();
});
