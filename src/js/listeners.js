const capturingQueryParam = async () => {
  const queryParam = window.location.search;
  const urlParam = new URLSearchParams(queryParam);
  const code = urlParam.get('code');
  if (code) {
    try {
      let parsedData;
      const rawData = await fetch(`https://educateonline.edu.pe:8433/api/v1/wedding/invitation/${code}`);
      parsedData = await rawData.json();
           
      if (parsedData.length === 0) throw new Error();
      else sessionStorage.setItem('WEDDING_QR_CODE', JSON.stringify(parsedData));

      const sessionData = sessionStorage.getItem('WEDDING_QR_CODE');
      parsedData = JSON.parse(sessionData);
 
      return new Promise((resolve) => setTimeout(resolve, 1000, parsedData));
    } catch (_) {
      return new Promise((resolve) => setTimeout(resolve, 2000, false));
    }
  } else return new Promise((resolve) => setTimeout(resolve, 2000, false));
};

const mobileListener = () => {
  const flipbookContentRef = document.querySelector('.js-flipbook-content');
  const flipbookSize = flipbookContentRef.getBoundingClientRect();
  // eslint-disable-next-line no-undef
  $('.flipbook').turn('size', '200vw', flipbookSize.height);
};

const handleSetDigitFormat = (digit) => ((String(digit).length === 1) ? `0${digit}` : digit);

const counterListener = (stringDate = '2040-01-13T15:30:00') => {
  const dateTarget = new Date(stringDate.replace(/\s/, 'T')+'Z');
  // DOM REFERENCES
  const DOMSeconds = document.querySelector('.js-seconds');
  const DOMMinutes = document.querySelector('.js-minutes');
  const DOMHours = document.querySelector('.js-hours');
  const DOMDays = document.querySelector('.js-days');
  // TIME REFERENCES
  const milisecondsInASecond = 1000;
  const milisecondsInAMinute = milisecondsInASecond * 60;
  const milisecondsInAHour = milisecondsInAMinute * 60;
  const milisecondsInADay = milisecondsInAHour * 24;
  const processReference = () => {
    const now = new Date();
    const remainingTime = dateTarget - now;

    DOMDays.textContent = handleSetDigitFormat(
      Math.floor(remainingTime / milisecondsInADay),
    );
    DOMHours.textContent = handleSetDigitFormat(
      Math.floor((remainingTime % milisecondsInADay) / milisecondsInAHour),
    );
    DOMMinutes.textContent = handleSetDigitFormat(
      Math.floor((remainingTime % milisecondsInAHour) / milisecondsInAMinute),
    );
    DOMSeconds.textContent = handleSetDigitFormat(
      Math.floor((remainingTime % milisecondsInAMinute) / milisecondsInASecond),
    );
  };
  setInterval(processReference, milisecondsInASecond);
};

const hideLoaderListener = (callback) => {
  // animate__slow: 1s SPEED TIME
  document.querySelector('.js-loader').classList.add('animate__fadeOutDown');
  setTimeout(callback, 700);
};

const renderQRCode = (qrCodeRef) => {
  if (qrCodeRef) {
    document.querySelector('.js-qr-code').setAttribute('src', qrCodeRef[0].url);
    if (qrCodeRef[0].passes>0) {
      document.querySelector('.js-qr-passes').textContent = `(${qrCodeRef[0].passes}) ${(qrCodeRef[0].passes>1 ? 'Pases' : 'Pase')}`
    } else {
      document.querySelector('.js-qr-passes').textContent = `Sin pases`
    }
    ;
    setTimeout(() => {
      document.querySelector('.js-qr-loader').classList.add('is-hidden');
      document.querySelector('.js-qr-code').classList.remove('is-hidden');
      document.querySelector('.js-qr-passes').classList.remove('is-hidden');
      document.querySelector('.js-qr-code').addEventListener('click',
      () => {  
        const sessionData = sessionStorage.getItem('WEDDING_QR_CODE');
        const parsedData = JSON.parse(sessionData);
        openModal(parsedData);
        if (!parsedData[0].confirmed)
          confirmInvitation();
      }
    );
    }, 1000);
  } else document.querySelector('.js-qr-loader').classList.add('is-hidden');
};

const openModal = (parsedData) => {
  const modalRef = document.querySelector('.js-modal-target');
  modalRef.style.display = "flex";

  console.log(parsedData);
  if (parsedData[0].invitados.length>0) {
    const size =parsedData[0].invitados.length;
    const modaContent = document.querySelector('.js-modal-content');
    modaContent.style.height = (size >2)? '71%' : (size ==2)? '65%': '60%';
    
    const modabody = document.querySelector('.js-modal-body');
    modabody.style.height = (size >2)? '43%' : (size ==2)? '40%': '30%';
    
    let html = '';
    parsedData[0].invitados.forEach(invitado => {
      html += `<p class="c-modal__desc">${invitado.name} ${invitado.lastname}</p>`
      document.querySelector('.js-modal-desc').innerHTML = html;
    });

    if (!parsedData[0].confirmed){
      const modalFooter = document.querySelector('.js-modal-footer');
      modalFooter.innerHTML= `
       <img src="./assets/c4ec733bcb9e843c9c8a.svg" alt="Married names" style="margin-bottom: 1rem;" />
       <button  class="c-modal__button js-modal-confirm"> <span class="button__text">Confirmar asistencia </span></button>`;
      // modalFooter.innerHTML = html;
    } else {
      const modalFooter = document.querySelector('.js-modal-footer');
      modalFooter.innerHTML = `<img src="./assets/a3a3da7442f4b8f0fba9.svg" alt="Married names" style="margin-bottom: 1rem;" />`
    }
  } else {
    modalRef.style.display = "none";
  }
 
  modalRef.classList.add('is-active');
}

const confirmInvitation = () => {
  const modaButton = document.querySelector('.js-modal-confirm');
  modaButton.addEventListener("click", e => {
    modaButton.classList.add("button--loading");
    const sessionData = sessionStorage.getItem('WEDDING_QR_CODE');
    const parsedData = JSON.parse(sessionData);
    const idInvitation = parsedData[0].invited;
    const state = !parsedData[0].confirmed;
    saveInvitation(idInvitation, state);
  });
}

const saveInvitation = async (idInvitation, state) => {
  const rawData = await fetch(`https://educateonline.edu.pe:8433/api/v1/wedding/invitation/${idInvitation}/assistance/${state}`);
  const response = await rawData.json();
  
  const sessionData = sessionStorage.getItem('WEDDING_QR_CODE');
  const parsedData = JSON.parse(sessionData);
  parsedData[0].confirmed = state;
  console.log(parsedData[0]);
  console.log(state);
  sessionStorage.setItem('WEDDING_QR_CODE', JSON.stringify(parsedData));
  
  const modaButton = document.querySelector('.js-modal-confirm');
  modaButton.classList.remove("button--loading");

  if (parsedData[0].confirmed && response.success){
    const modalFooter = document.querySelector('.js-modal-footer');
    modalFooter.innerHTML = `<img src="./assets/a3a3da7442f4b8f0fba9.svg" alt="Married names" style="margin-bottom: 1rem;" />`;    
  }

}

export {
  capturingQueryParam,
  mobileListener,
  counterListener,
  hideLoaderListener,
  renderQRCode,
};
