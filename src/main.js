import 'animate.css';
import './scss/styles.scss';

import {
  capturingQueryParam,
  counterListener,
  hideLoaderListener,
  mobileListener,
  renderQRCode,
} from './js/listeners';

import HTMLDesktopTemplate from './templates/swiper-desktop.template.html';
import HTMLLoaderTemplate from './templates/loader.template.html';
import HTMLMobileTemplate from './templates/flipbook-mobile.template.html';
import flipbookInitializer from './js/flipbook-initializer';
import swiperInitializer from './js/swiper-initializer';

const smallBp = matchMedia('(min-width: 576px)');
const setContentVariable = async (mql) => {
  document.querySelector('.js-main-content').innerHTML = HTMLLoaderTemplate;
  if (mql.matches) { // GREATHER THAN 576px
    const qrCode = await capturingQueryParam();
    hideLoaderListener(() => {
      document.querySelector('.js-main-content').innerHTML = HTMLDesktopTemplate;
      swiperInitializer();
      counterListener('2022-02-05T14:00:00');
      // INSERTING QR CODE IN THE DOM
      renderQRCode(qrCode);
    });
  } else { // LOWER THAN 576px
    const qrCode = await capturingQueryParam();
    hideLoaderListener(() => {
      document.querySelector('.js-main-content').innerHTML = HTMLMobileTemplate;
      flipbookInitializer();
      mobileListener(); // TO RESIZE FIPBOOK
      counterListener('2022-02-05T14:00:00');
      // INSERTING QR CODE IN THE DOM
      renderQRCode(qrCode);
    });
  }

  document.addEventListener("click", e => {
    if (e.target.className === "c-modal js-modal-target is-active") {
      const modalRef = document.querySelector('.js-modal-target');
      modalRef.style.display = "none";
    }

  });
};
setContentVariable(smallBp);
smallBp.addEventListener('change', setContentVariable);
window.addEventListener('resize', () => setContentVariable(smallBp));
