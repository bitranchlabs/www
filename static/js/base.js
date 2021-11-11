let State = {
  timePassed: 0,
  secondsPassed: 0,
  priorTimestamp: 0,
}
let canvas;
let context;

const BallSize = 10
const BallSpeed = 500;
const PaddleSpeed = 500;
const PaddleWidth = 10;
const PaddleHeight = 50;

const init = () => {
  canvas = document.getElementById('bg');
  canvas.width = document.body.clientWidth;
  canvas.height = document.body.clientHeight;
  if (canvas.getContext) {
    context = canvas.getContext('2d');
    startPong();
  }
}

const startPong = () => {
  canvas.style.background = '#39424E'
  let paddleStartY = canvas.height / 2
  let scoreXOffset = 150
  let scoreYOffset = 50

  State.paddle1 = {
    score: 0,
    scoreX: scoreXOffset,
    scoreY: canvas.height - scoreYOffset,
    x: 10,
    y: paddleStartY,
    height: PaddleHeight,
    width: PaddleWidth,
    ySpeed: 0,
  }

  State.paddle2 = {
    score: 0,
    scoreX: canvas.width - scoreXOffset,
    scoreY: canvas.height - scoreYOffset,
    x: canvas.width - 30,
    y: paddleStartY,
    height: PaddleHeight,
    width: PaddleWidth,
    ySpeed: 0,
  }
  State.ball = resetGame('left');

  window.requestAnimationFrame(loop);
}

const resetGame = (victor) => {
  if (victor == 'left') {
    return {
      x: State.paddle1.x + PaddleWidth + 1,
      y: State.paddle1.y + (PaddleHeight / 2),
      heigth: BallSize,
      width: BallSize,
      xSpeed: BallSpeed,
      ySpeed: BallSpeed,
    }
  } else if (victor == 'right') {
    return {
      x: State.paddle2.x - BallSize - 1,
      y: State.paddle2.y + (PaddleHeight / 2),
      heigth: BallSize,
      width: BallSize,
      xSpeed: -BallSpeed,
      ySpeed: -BallSpeed,
    }
  }
}

const clear = () => context.clearRect(0, 0, canvas.width, canvas.height);

const draw = () => {
  context.fillStyle = 'white';

  // Middle line
  context.beginPath();
  context.setLineDash([15, 20]);
  context.moveTo(canvas.width / 2, 30);
  context.lineTo(canvas.width / 2, canvas.height);
  context.strokeStyle = 'white';
  context.stroke();

  // Ball
  context.fillRect(State.ball.x, State.ball.y, State.ball.height, State.ball.width);

  // Left Paddle
  context.font = '200px uni-05-53';
  context.textBaseline = 'bottom';
  context.textAlign = 'left';
  context.fillRect(State.paddle1.x, State.paddle1.y, State.paddle1.width, State.paddle1.height);
  context.fillText(State.paddle1.score, State.paddle1.scoreX, State.paddle1.scoreY)

  // Right Paddle
  context.textAlign = 'right';
  context.fillRect(State.paddle2.x, State.paddle2.y, State.paddle2.width, State.paddle2.height);
  context.fillText(State.paddle2.score, State.paddle2.scoreX, State.paddle2.scoreY)
};

const updateBall = tick => {
  let xSpeed = State.ball.xSpeed;
  let ySpeed = State.ball.ySpeed;
  let width = State.ball.width;
  let height = State.ball.width;
  x = State.ball.x;
  y = State.ball.y;
  let p1 = State.paddle1;
  let p2 = State.paddle2;
  if (collided(x, y, width, height, p1.x, p1.y, p1.width, p1.height) || collided(x, y, width, height, p2.x, p2.y, p2.width, p2.height)) {
    xSpeed = xSpeed * -1
  } else if ((y + height) >= canvas.height || y < 0) {
    ySpeed = ySpeed * -1
  } else if (x < 0) {
    State.paddle2.score += 1;
    return resetGame('right');
  } else if ((x + width) > canvas.width) {
    State.paddle1.score += 1;
    return resetGame('left');
  }
  x = easeLinear(tick, x, xSpeed, 1.5);
  y = easeLinear(tick, y, ySpeed, 1.5);
 return {x: x, y: y, xSpeed: xSpeed, ySpeed: ySpeed, height: height, width: width}
}

const updatePaddle = (tick, paddle) => {
  let ball = State.ball;
  let middle = paddle.y + (paddle.height / 2);
  if (onSameSide(ball.x, paddle.x, canvas.width) && goingAway(ball.x, paddle.x, ball.xSpeed)) {
    paddle.ySpeed = 0;
  } else if (ball.y < middle) {
    paddle.ySpeed = PaddleSpeed * -1;
  } else if ( ball.y > middle) {
    paddle.ySpeed = PaddleSpeed;
  } else {
    paddle.ySpeed = 0;
  }
  if (paddle.y <= 0) {
    paddle.ySpeed = PaddleSpeed;
  } else if ((paddle.y + paddle.height) >= canvas.height) {
    paddle.ySpeed = PaddleSpeed * -1;
  }
  paddle.y = easeLinear(tick, paddle.y, paddle.ySpeed, 1.5);
  return paddle;
}

const update = tick => {
  State.timePassed += tick;
  State.ball = updateBall(tick);
  State.paddle1 = updatePaddle(tick, State.paddle1);
  State.paddle2 = updatePaddle(tick, State.paddle2);
};

const loop = timestamp => {
  // This is called being "dynamic"
  canvas.width = document.body.clientWidth;
  canvas.height = document.body.clientHeight;

  // Get the tick
  State.secondsPassed = (timestamp - State.priorTimestamp) / 1000;
  State.priorTimestamp = timestamp;
  let fps = Math.round(1 / State.secondsPassed);
  let tick = Math.min(State.secondsPassed, 0.1);

  let debug = true;
  if (debug) {
    context.font= '25px Arial';
    context.fillStyle = 'black';
    context.fillText("FPS: " + fps, canvas.width - 100, canvas.height - 100);
  }

  update(tick);
  clear();
  draw();
  window.requestAnimationFrame(loop);
}

const easeLinear = (t, b, c, d) => c * t / d + b;

const collided = (x1, y1, w1, h1, x2, y2, w2, h2) => {
  if (x2 > w1 + x1 || x1 > w2 + x2 || y2 > h1 + y1 || y1 > h2 + y2) {
    return false;
  }
  return true;
}

const onSameSide = (x1, x2, w) => {
  let half = w / 2;
  let quarter = half / 2;
  if (x1 > half && x2 > half) {
    return true;
  } else if (x1 < half && x2 < half) {
    return true;
  }
  return false;
}

const goingAway = (i, j, jSpeed) => {
  let diff = Math.abs(i - j);
  let futureDiff = Math.abs(i - (j + jSpeed));
  if (futureDiff < diff) {
    return true;
  }
  return false;
}
