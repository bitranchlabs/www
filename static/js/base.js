import { start } from "./pong.js";

const waitFor = async selector => {
  while (document.querySelector(selector) == null) {
    await new Promise(r => requestAnimationFrame(r));
  }
  return document.querySelector(selector);
}

const init = canvas => {
  canvas.width = document.body.clientWidth;
  canvas.height = document.body.clientHeight;
  if (canvas.getContext) {
    let context = canvas.getContext('2d');
    start(canvas, context);
  }
}

const themeSwitch = document.querySelector('.theme-switch');
themeSwitch.checked = localStorage.getItem('switchedTheme') === 'true';

themeSwitch.addEventListener('change', e => {
  if(e.currentTarget.checked === true) {
    localStorage.setItem('switchedTheme', 'true');
  } else {
    localStorage.removeItem('switchedTheme');
  }
});

waitFor('canvas').then((s) => init(s));
