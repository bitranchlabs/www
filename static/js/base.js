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

waitFor('canvas').then((s) => init(s));
