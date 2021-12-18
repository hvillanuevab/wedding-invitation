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

    if (e.target.className.search('js-reception-address') != -1){
      const reception = window.open(
        "https://www.google.com.pe/maps/place/Recepciones+Chelito's/@-6.7974369,-79.8859302,20z/data=!4m13!1m7!3m6!1s0x904cfab6f26b6279:0xfb528ece1555cccd!2sPimentel!3b1!8m2!3d-6.8324793!4d-79.929616!3m4!1s0x904cef99e026f11f:0xe26e847681a647c0!8m2!3d-6.797416!4d-79.8857879?hl=es-419",
        '_blank');
      reception.focus();
    }
  });

  // document.querySelector('.js-modal-target')
  // const reception = window.open('https://www.youtube.com/watch?v=WX9g0pGliyA&list=RD5pCbFvon3Rs&index=3','_blank')
  // reception.focus();
};
setContentVariable(smallBp);
smallBp.addEventListener('change', setContentVariable);
window.addEventListener('resize', () => setContentVariable(smallBp));
