const jumpSound = document.getElementById('jump-sound');
const clickSound = document.getElementById('click-sound');
const gameOverSound = document.getElementById('game-over-sound');
const gameWinnerSound = document.getElementById('game-winner-sound');
const click = document.getElementById('click');
const btnPause = document.getElementById('pause-btn');
const btnMute = document.getElementById('mute');
const clickCountElement = document.getElementById('clicks-count');
const failedCountElement = document.getElementById('failed-count');
const progress = document.getElementById('progress');
let xMax = window.innerWidth - click.offsetWidth;
// menuHight=50px
let yMax = window.innerHeight - click.offsetHeight - 50; 
let jumpsCount = 0;
let clicksCount = 0;
let failedClickCount = 0;
let interval = 2000;
let countOfClicksToWin = 10;
let timerId;
let startCountingClicks = false;
let isMuted = false;
let isPaused = false;
let isGameStarted = false;

goToStartPosition(xMax, yMax);

function goToStartPosition(xMax, yMax) {
  click.style.left = xMax / 2 + 'px';
  click.style.top = yMax / 2 + 'px';
}

// jump to a random position in this range
function randomPosition(xMax, yMax, muteJumpSound = true) {
  let x = Math.floor( Math.random() * xMax ) + 'px';
  let y = Math.floor( Math.random() * yMax ) + 'px';

  if (startCountingClicks) {
    ++jumpsCount;
  }

  if (!isGameStarted) {
    countOfClicksToWin = clicksMax();
    progress.max = countOfClicksToWin;
    isGameStarted = true;
  }

  progress.value = String(clicksCount);
  failedClickCount = jumpsCount - clicksCount;

  if (gameOver() || winner()) {
    click.style.visibility = "hidden";
    return 0;
  }

  if (muteJumpSound) {
    playJumpSound();
  } 

  failedCountElement.innerHTML = String(failedClickCount);
  click.style.left = x;
  click.style.top = y;
  startCountingClicks = true;
  timerId = setTimeout(randomPosition, interval, xMax, yMax)
}

function pause() {
  clearTimeout(timerId);
  startCountingClicks = false;

  if (isPaused) {
    btnPause.innerHTML = 'Pause'
  } else if (!isPaused) {
    btnPause.innerHTML = 'Paused'
  }

  isPaused = true;
}

function restart() {
  document.querySelector('.div-winner')?.remove();
  document.querySelector('.div-game-over')?.remove();
  click.style.visibility = "visible";
  failedClickCount = 0;
  failedCountElement.innerHTML = 0;
  progress.value = '0';
  jumpsCount = 0;
  clicksCount = 0;
  interval = 2000;
  clickCountElement.innerHTML = 0;
  startCountingClicks = false;
  isGameStarted = false;
  clearTimeout(timerId);
  goToStartPosition(xMax, yMax);
  isPaused = false;
  btnPause.innerHTML = 'Pause';
}

function clickMe() {
  if (startCountingClicks) {
    clickCountElement.innerHTML = String(++clicksCount);
  }

  clearTimeout(timerId);
  randomPosition(xMax, yMax, false);
  playClickSound();
  isPaused = false;
  btnPause.innerHTML = 'Pause';

  if (countOfClicksToWin === 10) {
    interval -= 115;
  }

  if (countOfClicksToWin === 20) {
    interval -= 60;
  }

  if (countOfClicksToWin === 40) {
    interval -= 30;
  }
}

function playClickSound() {
  clickSound.muted = isMuted;
  clickSound.currentTime = 0;
  clickSound.play();
} 

function playJumpSound() {
  jumpSound.muted = isMuted;
  jumpSound.currentTime = 0;
  jumpSound.play();
} 

function playGameOverSound() {
  gameOverSound.muted = isMuted;
  gameOverSound.currentTime = 0;
  gameOverSound.play();
} 

function playGameWinnerSound() {
  gameWinnerSound.muted = isMuted;
  gameWinnerSound.currentTime = 0;
  gameWinnerSound.play();
} 

// disable button pressing by 'enter' key
function keyDownHandler(event) {
  event.preventDefault()
}

function allMute() {
  if (isMuted) {
    btnMute.innerHTML = '<i class="fas fa-volume-up"></i>'
  } else if (!isMuted) {
    btnMute.innerHTML = '<i class="fas fa-volume-mute"></i>'
  }

  isMuted = !isMuted;
}

function clicksMax() {
  if (document.querySelector(".input-radio-10").checked) {
    return 10;
  }

  if (document.querySelector(".input-radio-20").checked) {
    return 20;
  }

  if (document.querySelector(".input-radio-40").checked) {
    return 40;
  }
}

function gameOver() {
  if ((countOfClicksToWin === 10 && failedClickCount === 2) ||
      (countOfClicksToWin === 20 && failedClickCount === 3) || 
      (countOfClicksToWin === 40 && failedClickCount === 5)) { 
        let div = document.createElement('div');

        div.className = "div-game-over";
        div.innerHTML = "GAME <br> OVER";
        document.querySelector('.game-zone').prepend(div);
        div.style.left = (window.innerWidth - 300) / 2 + 'px';
        div.style.top = (window.innerHeight - 300) / 2 + 'px';
        playGameOverSound();
        setTimeout(restart, 3000);
    return true;
  }

  return false;
}

function winner() {
  if ((countOfClicksToWin === 10 && clicksCount === 10) ||
      (countOfClicksToWin === 20 && clicksCount === 20) || 
      (countOfClicksToWin === 40 && clicksCount === 40)) { 
        let div = document.createElement('div');

        div.className = "div-winner";
        div.innerHTML = "CONGRATULATION <br> YOU WIN";
        document.querySelector('.game-zone').prepend(div);
        div.style.left = (window.innerWidth - 700) / 2 + 'px';
        div.style.top = (window.innerHeight - 300) / 2 + 'px';
        playGameWinnerSound();
        setTimeout(restart, 4000);
    return true;
  }

  return false;
}
