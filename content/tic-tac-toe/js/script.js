/* eslint-disable require-jsdoc */
// ------- container elements group -------
const gameBoardCont = document.getElementById('game-board');
const settingsCont = document.getElementById('settings-cont');
const subSettingsCont = document.getElementById('sub-settings-cont');
const gamerComputerModeCont =
  document.getElementById('gamer-computer-mode-cont');
const startNewLastGameCont =
  document.getElementById('start-new-last-game-cont');
const continueLastGameCont = document.getElementById('continue-last-game-cont');


// ------- control elements group -------
const startGameBtn = document.getElementById('start-game');
const startNewGameBtn = document.getElementById('start-new-game');
const continueLastGameBtn = document.getElementById('continue-last-game');
const settingsBtn = document.getElementById('settings-btn');
const reloadBtn = document.getElementById('reload-btn');
const boardSizeDropdown = document.getElementById('game-board-size');
const winningDropdown = document.getElementById('winning');
const gameModeDropdown = document.getElementById('game-mode');
const setGamerModeDropdown = document.getElementById('set-gamer-mode');
const firstMoveDropdown = document.getElementById('first-move');
const gameDifficultyDropdown = document.getElementById('game-difficulty');
const muteAllCheckbox = document.getElementById('mute-all');
const muteWinLoseTieCheckbox = document.getElementById('mute-win-lose-tie');
const backgroundImagesDropdown = document.getElementById('background-images');

// ------- sounds -------
const drawXSound = document.getElementById('draw-x-sound');
const drawOSound = document.getElementById('draw-o-sound');
const selectSound = document.getElementById('select-sound');
const gameWinSound = document.getElementById('game-win-sound');
const gameLoseSound = document.getElementById('game-lose-sound');
const gameTieSound = document.getElementById('game-tie-sound');
const drawLineSound = document.getElementById('draw-line-sound');

// ------- elements for indication -------
const tieElem = document.getElementById('tie-td');
const xWinElem = document.getElementById('x-wins-td');
const oWinElem = document.getElementById('o-wins-td');
const leftArrow = document.getElementById('arrow-left');
const rightArrow = document.getElementById('arrow-right');

const backgroundColor = document.querySelector(':root');
const backgroundBlur = document.getElementById('background-blur');
const settingsIcon = document.getElementById('settings-icon');
const reloadIcon = document.getElementById('reload-icon');

const boardMaxWidth = 700;
const maxDeviation = 50;
const minDeviation = 5;
const animationMaxDuration = 100;
const animationMinDuration = 50;
const gameMaxSize = 14;
const randomImgMaxCount = 6;
let game = {
  board: [],
  steps: [],
  size: 3,
  winning: 3,
  gamerXO: 'x',
  computerXO: 'o',
  currentQueue: 'x',
  gameQueue: 'x',
  stepsCount: 0,
  cageWidths: [],
  cageHeights: [],
  xWin: 0,
  oWin: 0,
  tie: 0,
  gameControl: {
    firstMove: 'x/o',
    gameMode: 'gamer-vs-computer',
    gamerXOMode: 'x',
    difficulty: 'easy',
    muteAll: false,
    muteWinLose: false,
    background: '0',
  }};
let isRunDrawSectionAnimation = true;
let isRunDrawXOAnimation = false;
let animationDuration = 100;
let prevueImg = 1;
let isMenuChange = true;
let isComputerQueue = true;
let allowGameToStart = true;

// -----------------------------START-------------------------------------------
startGameBtn.addEventListener('click', startGame);
startNewGameBtn.addEventListener('click', startNewGame);
continueLastGameBtn.addEventListener('click', continueLastGame);
boardSizeDropdown.addEventListener('change', () => {
  changeSizes(); createWinningElements();
});
winningDropdown.addEventListener('change', () =>
  game.winning = +winningDropdown.value);
gameModeDropdown.addEventListener('change', setGameMode);
settingsCont.addEventListener('change', playSelectSound);
gameBoardCont.addEventListener('click', startingGame);
settingsBtn.addEventListener('click', toggleSettingsContainer);
reloadBtn.addEventListener('click', restartGame);
subSettingsCont.addEventListener('change', subSettingsContChange);
settingsCont.addEventListener('change', settingsContChange);
backgroundImagesDropdown.addEventListener('change', changeBackgroundImage);


// set game-board Width and Height
gameBoardCont.style.width = boardMaxWidth + 'px';
gameBoardCont.style.height = boardMaxWidth + 'px';

createBoardSizeElements();
changeSizes();
createWinningElements();

if (localStorage.getItem('TicTacToe')) {
  continueLastGameCont.removeAttribute('hidden');
}

// -----------------functions---------------------
function startGame() {
  settingsCont.setAttribute('hidden', true);
  settingsCont.style.display = '';
  backgroundBlur.setAttribute('hidden', true);
  backgroundBlur.style.display = '';
  gameBoardCont.style.top = '0';
  startGameBtn.setAttribute('hidden', true);
  settingsIcon.removeAttribute('hidden');
  reloadIcon.removeAttribute('hidden');

  if (isMenuChange) {
    setGameQueue();
    setGamerXO();
    changeSizes();
    makeGameBoard();
    game.currentQueue = game.gameQueue;
    prevueImg = 1;
    game.stepsCount = 0;
    isRunDrawXOAnimation = false;
    isComputerQueue = true;
    allowGameToStart = true;
    isMenuChange = false;
    startGameBtn.innerHTML = 'back to board';
    doXWin(0);
    doOWin(0);
    doTie(0);
    setStressLevel(0);
    game.gameControl.firstMove = firstMoveDropdown.value;
    game.gameControl.gameMode = gameModeDropdown.value;
    game.gameControl.gamerXOMode = setGamerModeDropdown.value;
    game.gameControl.difficulty = gameDifficultyDropdown.value;
    game.gameControl.muteAll = muteAllCheckbox.checked;
    game.gameControl.muteWinLose = muteWinLoseTieCheckbox.checked;
    game.gameControl.background = backgroundImagesDropdown.value;
    localStorage.removeItem('TicTacToe');
    game.steps = [];
    startingGame(event);
  }
}

function startNewGame() {
  startNewLastGameCont.setAttribute('hidden', true);
  startGame();
}

function continueLastGame() {
  startNewLastGameCont.setAttribute('hidden', true);
  game = JSON.parse(localStorage.getItem('TicTacToe'));
  settingsIcon.removeAttribute('hidden');
  reloadIcon.removeAttribute('hidden');

  createBoardSizeElements();
  boardSizeDropdown.value = String(game.size);
  createWinningElements();
  firstMoveDropdown.value = game.gameControl.firstMove;
  gameModeDropdown.value = game.gameControl.gameMode;
  setGamerModeDropdown.value = game.gameControl.gamerXOMode;
  gameDifficultyDropdown.value = game.gameControl.difficulty;
  muteAllCheckbox.checked = game.gameControl.muteAll;
  muteWinLoseTieCheckbox.checked = game.gameControl.muteWinLose;
  backgroundImagesDropdown.value = game.gameControl.background;
  changeBackgroundImage();
  makeGameBoard();

  const temp = setInterval(() => {
    if (!isRunDrawSectionAnimation) {
      doXWin(game.xWin);
      doOWin(game.oWin);
      doTie(game.tie);
      setStressLevel();
      clearInterval(temp);
    }
  }, 100);
  isMenuChange = false;
}

function drawLastGameElements() {
  for (step of game.steps) {
    drawXODisableHover(game.board[step.row][step.col].cage, step.xO);
    game.board[step.row][step.col].xO = step.xO;
  }

  setCageHover(game.gamerXO, `${prevueImg}`);
}

function makeGameBoard() {
  reloadIcon.setAttribute('hidden', true);
  settingsIcon.setAttribute('hidden', true);
  gameBoardCont.innerHTML = '';
  createBoard();
  drawSections(game.size, boardMaxWidth, 10, gameBoardCont, 'h');
}

// create div elements(cages) and insert in game board
function createBoard() {
  const elemCount = game.size * game.size;

  game.board = [];

  for (let i = 0; i < game.size; i++) {
    const arr = new Array(game.size);

    game.board.push(arr);
  }

  for (let i = 0; i < elemCount; i++) {
    const row = Math.floor(i / game.size);
    const col = i % game.size;

    gameBoardCont.insertAdjacentHTML('beforeend', `<div style="width:
      ${game.cageWidths[i % game.size]}px; height:
      ${game.cageHeights[Math.floor(i / game.size)]}px;"data-row=
      "${Math.floor(i / game.size)}" data-col="${i % game.size}"></div>`);

    game.board[row][col] = {
      xO: '',
      cage: gameBoardCont.querySelector(`[data-row="${row}"][data-col=
        "${col}"]`),
      row: row,
      col: col,
    };
  }
}

// draw n sections
function drawSections(n, gameBoardSize, imgHeight, element, horVer) {
  isRunDrawSectionAnimation = true;
  removeCageHover();

  // const sectionSize = Math.round((gameBoardSize - (n * imgHeight)) / n);
  const currentPositionX = getPositions(game.cageWidths);
  const currentPositionY = getPositions(game.cageHeights);
  let random;
  let line;
  let position;
  let i = 0;

  element.style.animationDuration = String(animationDuration);

  if (horVer === 'h') {
    line = 'h-line';
    position = 'top';
  } else {
    line = 'v-line';
    position = 'left';
  }

  // draw n section and (n - 1) lines
  n--;

  drawSection();

  function getPositions(sizes) {
    const positions = [];
    let sum = 0;

    for (const pos of sizes) {
      sum += pos;
      positions.push(sum - 5);
    }

    return positions;
  }

  function drawSection() {
    // random position for background-image(source image has 12 different lines)
    random = Math.floor(Math.random() * 12);

    if (horVer === 'h') {
      element.insertAdjacentHTML('beforeend', `<img class=${line}
        src="./images/1px1px.png" alt="line" width="1px" height="1px" 
        style=${position}:${currentPositionY[i]}px>`);

      element.querySelector(`img[style="${position}:${currentPositionY[i]}px"]`)
          .style.backgroundPositionY =
          `-${random}0px`;
    } else {
      element.insertAdjacentHTML('beforeend', `<img class=${line}
        src="./images/1px1px.png" alt="line" width="1px" height="1px"
        style=${position}:${currentPositionX[i]}px>`);

      element.querySelector(`img[style="${position}:${currentPositionX[i]}px"]`)
          .style.backgroundPositionX = `${random}0px`;
    }

    if (++i < n) {
      setTimeout(drawSection, animationDuration);
      playDrawLineSound();

      // end of animation for drawing sections
      if (horVer === 'v' && i === n - 1) {
        setTimeout(() => {
          const imgArr = gameBoardCont.querySelectorAll('IMG');
          imgArr[imgArr.length - 1].addEventListener('animationend',
              drawSectionAnimationEnd);

          function drawSectionAnimationEnd() {
            isRunDrawSectionAnimation = false;
            imgArr[imgArr.length - 1].removeEventListener('animationend',
                drawSectionAnimationEnd);
            reloadIcon.removeAttribute('hidden');
            settingsIcon.removeAttribute('hidden');
            // if computer queue, remove gamer(x or o) hover
            if (gameModeDropdown.value === 'gamer-vs-computer' &&
                game.currentQueue === game.computerXO) {
              removeCageHover();
            } else {
              setCageHover(`${game.currentQueue}`, '1');
            }

            // -----------------------------
            if (localStorage.getItem('TicTacToe')) {
              drawLastGameElements();
            }
          }
        }, animationDuration + 1);

        // add class "cage" in board sections
        const divArr = gameBoardCont.querySelectorAll('div');
        divArr.forEach((div) => div.classList.add('cage'));
      }
    } else if (horVer === 'h') {
      // start drawing vertical lines when finished drawing horizontal lines
      setTimeout(() => drawSections(game.size, boardMaxWidth, 10,
          gameBoardCont, 'v'), animationDuration);
    }
  }
}

// ------- menu control -------
// TODO menu
function settingsContChange() {
  game.gameControl.firstMove = firstMoveDropdown.value;
  game.gameControl.gameMode = gameModeDropdown.value;
  game.gameControl.gamerXOMode = setGamerModeDropdown.value;
  game.gameControl.difficulty = gameDifficultyDropdown.value;
  game.gameControl.muteAll = muteAllCheckbox.checked;
  game.gameControl.muteWinLose = muteWinLoseTieCheckbox.checked;
  game.gameControl.background = backgroundImagesDropdown.value;

  localStorage.setItem('TicTacToe', JSON.stringify(game));
}

function subSettingsContChange() {
  isMenuChange = true;
  startGameBtn.innerHTML = 'restart';
}

function toggleSettingsContainer() {
  settingsCont.removeAttribute('hidden');
  settingsCont.style.display = 'inline-block';
  backgroundBlur.removeAttribute('hidden');
  backgroundBlur.style.display = 'inline-block';
  gameBoardCont.style.top = '-700px';
  startGameBtn.removeAttribute('hidden');
  settingsIcon.setAttribute('hidden', true);
  reloadIcon.setAttribute('hidden', true);
}

// change game.size and animationDuration
function changeSizes() {
  game.size = +boardSizeDropdown.value;
  animationDuration = animationMaxDuration - (game.size - 3) *
    (animationMaxDuration - animationMinDuration) / gameMaxSize - 3;
  game.cageWidths = calcCageSizes();
  game.cageHeights = calcCageSizes();

  function calcCageSizes() {
    let sizeArr = [];
    let currentDev;
    const cageSize = Math.floor(boardMaxWidth / game.size);
    const currentMaxDeviation = Math.round(maxDeviation - (game.size - 3) *
      (maxDeviation - minDeviation) / gameMaxSize - 3);
    let lastCageSize;

    do {
      sizeArr = [];

      for (let i = 0; i < game.size - 1; i++) {
        currentDev = (currentMaxDeviation / 2) -
          Math.floor(currentMaxDeviation * Math.random());
        sizeArr.push(cageSize + currentDev);
      }

      // the size of the last element is calculated so that
      // the total size is equal to boardMaxWidth
      lastCageSize = boardMaxWidth - sizeArr.reduce((sum, current) =>
        sum + current, 0);
      sizeArr.push(lastCageSize);
    } while (lastCageSize < cageSize * 0.85);

    return sizeArr;
  }
}

function createWinningElements() {
  winningDropdown.innerHTML = '';

  if (game.size < 6) {
    winningDropdown.insertAdjacentHTML('beforeend',
        `<option value="${game.size}">${game.size}&nbsp;</option>`);
    winningDropdown.value = String(game.size);
    game.winning = game.size;

    return;
  }

  if (game.winning < 6 && game.size > 5) {
    game.winning = 5;
  }

  for (let i = 5; i <= game.size; i++) {
    winningDropdown.insertAdjacentHTML('beforeend',
        `<option value="${i}">${i}&nbsp;</option>`);
  }

  winningDropdown.value = String(Math.min(game.winning, game.size));
  game.winning = +winningDropdown.value;
}

function createBoardSizeElements() {
  boardSizeDropdown.innerHTML = '';

  for (let i = 3; i <= gameMaxSize; i++) {
    boardSizeDropdown.insertAdjacentHTML('beforeend',
        `<option value="${i}">${i} X ${i}</option>`);
  }
}

function setGameMode() {
  if (gameModeDropdown.value === 'gamer-vs-computer') {
    gamerComputerModeCont.removeAttribute('hidden');
  }

  if (gameModeDropdown.value === 'gamer1-vs-gamer2') {
    gamerComputerModeCont.setAttribute('hidden', true);
  }
}

// TODO settings control -------
function changeBackgroundImage() {
  const arr = [
    {url: 'url(./images/background/chalk-board-green-1.jpg)', color: '#31614B'},
    {url: 'url(./images/background/chalk-board-green-2.jpg)', color: '#3a8b63'},
    {url: 'url(./images/background/chalk-board-green-3.jpg)', color: '#5d9d4f'},
    {url: 'url(./images/background/chalk-board-brown.jpg)', color: '#382222'},
    {url: 'url(./images/background/chalk-board-red.jpg)', color: '#da3434'},
    {url: 'url(./images/background/chalk-board-blue-1.jpg)', color: '#25457c'},
    {url: 'url(./images/background/chalk-board-blue-2.jpg)', color: '#2b497e'},
    {url: 'url(./images/background/chalk-board-blue-3.jpg)', color: '#1d5f8f'},
    {url: 'url(./images/background/chalk-board-blue-4.jpg)', color: '#22aee1'},
    {url: 'url(./images/background/chalk-board-black-1.jpg)', color: '#4a4a4a'},
    {url: 'url(./images/background/chalk-board-black-2.jpg)', color: '#2d383e'},
    {url: 'url(./images/background/chalk-board-black-3.jpg)', color: '#383e46'},
    {url: 'url(./images/background/chalk-board-black-4.jpg)', color: '#313131'},
  ];

  document.body.style.backgroundImage = arr[backgroundImagesDropdown.value].url;
  backgroundColor.style.setProperty('--chalk-board',
      `${arr[backgroundImagesDropdown.value].color}`);
}

// ------- draw x or o(random image), hover(random image) -------
// TODO drawXO
function drawXO(selected, xO) {
  const randomImg = Math.ceil(Math.random() * randomImgMaxCount);

  isRunDrawXOAnimation = true;
  selected.addEventListener('animationend', drawXOAnimationEnd);

  if (xO === 'x') {
    playDrawXSound();
    selected.classList.add('cage-x');
    selected.style.backgroundImage = `url(./images/x${prevueImg}.png)`;
  } else {
    playDrawOSound();
    selected.classList.add('cage-o');
    selected.style.backgroundImage = `url(./images/o${prevueImg}.png)`;
  }

  removeCageHover();

  function drawXOAnimationEnd() {
    isRunDrawXOAnimation = false;
    selected.removeEventListener('animationend', drawXOAnimationEnd);

    if (xO === 'x') {
      setCageHover('o', randomImg);
    } else {
      setCageHover('x', randomImg);
    }
  }

  prevueImg = randomImg;
}

// TODO drawXODisableHover
// for edit
function drawXODisableHover(selected, xO) {
  const randomImg = Math.ceil(Math.random() * randomImgMaxCount);

  isRunDrawXOAnimation = true;
  selected.addEventListener('animationend', drawXOAnimationEnd);

  if (xO === 'x') {
    playDrawXSound();
    selected.classList.add('cage-x');
    selected.style.backgroundImage = `url(./images/x${prevueImg}.png)`;
  } else {
    playDrawOSound();
    selected.classList.add('cage-o');
    selected.style.backgroundImage = `url(./images/o${prevueImg}.png)`;
  }

  removeCageHover();

  function drawXOAnimationEnd() {
    isRunDrawXOAnimation = false;
    selected.removeEventListener('animationend', drawXOAnimationEnd);
  }

  prevueImg = randomImg;
}

function removeCageHover() {
  if (document.querySelector('style')) {
    document.querySelector('style').innerHTML = '';
  }
}

function setGamerXO() {
  if (setGamerModeDropdown.value === 'x') {
    game.gamerXO = 'x';
    game.computerXO = 'o';
  } else {
    game.gamerXO = 'o';
    game.computerXO = 'x';
  }

  setCageHover(game.gamerXO, '1');
}

function setCageHover(xO, img) {
  if (isRunDrawSectionAnimation) {
    setTimeout(() => setCageHover(xO, img), 100);
  } else {
    const css = `.cage:hover{ background-size: 80% 80%;
      background-image: url(./images/${xO}h${img}.png);
      background-repeat: no-repeat;
      background-position: center;}`;
    const style = document.createElement('style');

    if (style.styleSheet) {
      style.styleSheet.cssText = css;
    } else {
      style.appendChild(document.createTextNode(css));
    }

    if (!document.querySelector('style')) {
      document.getElementsByTagName('head')[0].appendChild(style);
    } else {
      document.querySelector('style').innerHTML = css;
    }
  }
}

// ------- Game starting section -------
// TODO startingGame
function startingGame(event) {
  // selected cage
  const selected = event?.target;

  // Gamer1 vs Gamer2
  if (gameModeDropdown.value === 'gamer1-vs-gamer2' && allowGameToStart) {
    if (selected &&
      !selected.classList.contains('cage-x') &&
      !selected.classList.contains('cage-o') &&
      !selected.firstElementChild &&
      selected.tagName !== 'IMG' &&
      !isRunDrawSectionAnimation &&
      !isRunDrawXOAnimation) {
      drawXO(selected, game.currentQueue);
      game.board[selected.dataset.row][selected.dataset.col].xO =
        game.currentQueue;
      game.steps.push(game.board[selected.dataset.row][selected.dataset.col]);
      game.stepsCount++;
      toggleCurrentQueue();

      setStressLevel();
      // TODO game end 1
      if (gameWinOrDraw()) {
        allowGameToStart = false;
        setTimeout(restartGame, 2000);
        return;
      }

      localStorage.setItem('TicTacToe', JSON.stringify(game));
    }
  }

  // gamer-vs-computer
  if (gameModeDropdown.value === 'gamer-vs-computer' && allowGameToStart) {
    // Gamer Queue
    if (game.currentQueue === game.gamerXO &&
      selected &&
      !selected.classList.contains('cage-x') &&
      !selected.classList.contains('cage-o') &&
      !selected.firstElementChild &&
      selected.tagName !== 'IMG' &&
      !isRunDrawSectionAnimation &&
      !isRunDrawXOAnimation &&
      isComputerQueue) {
      drawXODisableHover(selected, game.gamerXO);
      game.board[selected.dataset.row][selected.dataset.col].xO = game.gamerXO;
      game.steps.push(game.board[selected.dataset.row][selected.dataset.col]);
      game.stepsCount++;
      toggleCurrentQueue();
      isComputerQueue = true;

      setStressLevel();
      // TODO game end 2
      if (gameWinOrDraw()) {
        allowGameToStart = false;
        setTimeout(restartGame, 2000);
        return;
      }

      localStorage.setItem('TicTacToe', JSON.stringify(game));
    }

    // Computer Queue
    if (game.currentQueue === game.computerXO && isComputerQueue) {
      isComputerQueue = false;
      removeCageHover();
      setTimeout(computerQueue, 250);

      function computerQueue() {
        if (isRunDrawSectionAnimation) {
          setTimeout(computerQueue, 5);
        } else {
          const rowCol = generateLogicStep(game.board,
              game.computerXO, game.gamerXO);
          const elem = game.board[rowCol[0]][rowCol[1]].cage;

          drawXO(elem, game.computerXO);
          game.board[rowCol[0]][rowCol[1]].xO = game.computerXO;
          game.steps.push(game.board[rowCol[0]][rowCol[1]]);
          game.stepsCount++;
          toggleCurrentQueue();
          isComputerQueue = true;

          setStressLevel();
          // TODO game end 3
          if (gameWinOrDraw()) {
            allowGameToStart = false;
            setTimeout(restartGame, 2000);

            return;
          }

          localStorage.setItem('TicTacToe', JSON.stringify(game));
        }
      }
    }
  }
}

function toggleCurrentQueue() {
  if (game.currentQueue === 'x') {
    game.currentQueue = 'o';
  } else {
    game.currentQueue = 'x';
  }
}

function toggleGameQueue() {
  if (firstMoveDropdown.value === 'x/o') {
    if (game.gameQueue === 'x') {
      game.gameQueue = 'o';
    } else {
      game.gameQueue = 'x';
    }
  }
}

// setGameQueue
function setGameQueue() {
  if (firstMoveDropdown.value === 'x/o') {
    game.gameQueue = 'x';
  } else {
    game.gameQueue = firstMoveDropdown.value;
  }
}

// TODO restart
function restartGame() {
  changeSizes();
  makeGameBoard();
  toggleGameQueue();
  game.currentQueue = game.gameQueue;
  prevueImg = 1;
  game.stepsCount = 0;
  isRunDrawXOAnimation = false;
  isComputerQueue = true;
  allowGameToStart = true;
  localStorage.removeItem('TicTacToe');
  // -----------------
  game.steps = [];
  setStressLevel(0);
  startingGame(event);
}

// TODO sounds -------
function playDrawXSound() {
  drawXSound.muted = muteAllCheckbox.checked;
  drawXSound.currentTime = 0;
  drawXSound.play();
}

function playDrawOSound() {
  drawOSound.muted = muteAllCheckbox.checked;
  drawOSound.currentTime = 0;
  drawOSound.volume = 0.3;
  drawOSound.play();
}

function playSelectSound() {
  selectSound.muted = muteAllCheckbox.checked;
  selectSound.currentTime = 0;
  selectSound.play();
}

function playGameWinSound() {
  gameWinSound.muted = muteAllCheckbox.checked ||
    muteWinLoseTieCheckbox.checked;
  gameWinSound.currentTime = 0;
  gameWinSound.volume = 0.3;
  gameWinSound.play();
}

function playGameLoseSound() {
  gameLoseSound.muted = muteAllCheckbox.checked ||
    muteWinLoseTieCheckbox.checked;
  gameLoseSound.currentTime = 0;
  gameLoseSound.volume = 0.3;
  gameLoseSound.play();
}

function playGameTieSound() {
  gameTieSound.muted = muteAllCheckbox.checked ||
    muteWinLoseTieCheckbox.checked;
  gameTieSound.currentTime = 0;
  gameTieSound.volume = 0.3;
  gameTieSound.play();
}

function playDrawLineSound() {
  drawLineSound.muted = muteAllCheckbox.checked;
  drawLineSound.currentTime = 0;
  drawOSound.volume = 1;
  drawLineSound.play();
}

function doXWin(n) {
  if (n !== undefined) {
    game.xWin = n;
    xWinElem.innerHTML = String(n);
  } else {
    game.xWin++;
    xWinElem.innerHTML = String(game.xWin);
  }
}

function doOWin(n) {
  if (n !== undefined) {
    game.oWin = n;
    oWinElem.innerHTML = String(n);
  } else {
    game.oWin++;
    oWinElem.innerHTML = String(game.oWin);
  }
}

function doTie(n) {
  if (n !== undefined) {
    game.tie = n;
    tieElem.innerHTML = String(n);
  } else {
    game.tie++;
    tieElem.innerHTML = String(game.tie);
  }
}

// TODO game logic-------------------------------------------
function getSelectedCages(board, item) {
  const allSelectedCages = [];
  let inverseItem = 'o';

  if (item === 'o') {
    inverseItem = 'x';
  }
  // get all selected cages in rows
  function getAllSelectedCagesGroup(board, item, rowCol, orientation) {
    const sellCages = [];
    const sellCagesAddInfo = [];

    for (hCages of board) {
      const arr = [];

      for (cage of hCages) {
        if (cage.xO === item) {
          const subArr = arr[arr?.length - 1];

          if (subArr &&
            Math.abs(cage[rowCol] - subArr[subArr.length - 1][rowCol]) === 1) {
            subArr.push(cage);
          } else {
            arr.push([cage]);
          }
        }
      }

      if (orientation === 'diagonal2') {
        arr.forEach((item) => item.reverse());
      }

      if (arr.length !== 0) {
        sellCages.push(...arr);
      }
    }
    // add additional information about the position
    // of the group of cages in the board
    sellCages.forEach(function(cages) {
      let checked = true;
      const obj = {
        cages: cages,
        posInfo: [],
        orientation: orientation,
      };

      // check the left side
      const firstCageCol = cages[0].col;
      const firstCageRow = cages[0].row;

      for (let i = 1; i <= game.winning; i++) {
        let elem;

        if (orientation === 'horizontal') {
          elem = game.board[firstCageRow]?.[firstCageCol - i];
        }

        if (orientation === 'vertical') {
          elem = game.board[firstCageRow - i]?.[firstCageCol];
        }

        if (orientation === 'diagonal1') {
          elem = game.board[firstCageRow - i]?.[firstCageCol - i];
        }

        if (orientation === 'diagonal2') {
          elem = game.board[firstCageRow + i]?.[firstCageCol - i];
        }

        if (elem === undefined || elem.xO === inverseItem) {
          break;
        }

        if (obj.posInfo[0]) {
          obj.posInfo[0] = ++obj.posInfo[0];
        } else {
          obj.posInfo[0] = 1;
        }
      }
      // check the right side
      const lastCageCol = cages[cages.length - 1].col;
      const lastCageRow = cages[cages.length - 1].row;

      for (let i = 1; i <= game.winning; i++) {
        let elem;

        if (orientation === 'horizontal') {
          elem = game.board[lastCageRow]?.[lastCageCol + i];
        }

        if (orientation === 'vertical') {
          elem = game.board[lastCageRow + i]?.[lastCageCol];
        }

        if (orientation === 'diagonal1') {
          elem = game.board[lastCageRow + i]?.[lastCageCol + i];
        }

        if (orientation === 'diagonal2') {
          elem = game.board[lastCageRow - i]?.[lastCageCol + i];
        }

        if (elem === undefined || elem.xO === inverseItem) {
          break;
        }

        if (obj.posInfo[0] && checked) {
          if (obj.posInfo[1]) {
            obj.posInfo[1] = ++obj.posInfo[1];
          } else {
            obj.posInfo[1] = 1;
          }
        } else {
          if (obj.posInfo[0]) {
            obj.posInfo[0] = ++obj.posInfo[0];
          } else {
            checked = false;
            obj.posInfo[0] = 1;
          }
        }
      }

      // add in cages group weight property
      if (obj.posInfo.length === 0 ||
        (obj.posInfo.reduce((a, b) =>
          a + b, 0) + obj.cages.length) < game.winning) {
        obj.weight = 0;
      } else {
        obj.weight = obj.cages.length * 10;
      }
      // game over
      if (obj.cages.length >= game.winning) {
        obj.weight = obj.cages.length * 10;
      }

      if (obj.posInfo[0] &&
        obj.cages.length + obj.posInfo[0] >= game.winning) {
        obj.weight += 1;
      }

      if (obj.posInfo[1] &&
        obj.cages.length + obj.posInfo[1] >= game.winning) {
        obj.weight += 1;
      }

      sellCagesAddInfo.push(obj);
    });

    return sellCagesAddInfo;
  }

  // get board transpose array
  function getBoardTransposeArray(board) {
    const transpose = [];

    for (let i = 0; i < board.length; i++) {
      const tmp = [];

      for (let j = 0; j < board.length; j++) {
        tmp.push(board[j][i]);
      }

      transpose.push(tmp);
    }

    return transpose;
  }

  // get diagonal-1(top,left-bottom,right) selected cages
  function getBoardDiagonal1Array(board) {
    let win = game.winning;
    let sI = board.length - game.winning;
    const diagonalArr = [];

    for (let j = sI; j >= 0; j--) {
      const arr = [];

      for (let i = 0; i < win; i++) {
        arr.push(board[sI + i][i]);
      }

      sI--;
      win++;
      diagonalArr.push(arr);
    }

    sI++;
    win = board.length - 1;

    if (win < board.length) {
      for (let j = 0; j < board.length - game.winning; j++) {
        const arr = [];

        sI++;
        win--;

        for (let i = 0; i <= win; i++) {
          arr.push(board[i][sI + i]);
        }

        diagonalArr.push(arr);
      }
    }
    return diagonalArr;
  }

  // get diagonal-2(top,right-bottom,left) selected cages
  function getBoardDiagonal2Array(board) {
    let win = game.winning;
    let sI = board.length - game.winning;
    const diagonalArr = [];

    for (let j = sI; j >= 0; j--) {
      const arr = [];

      for (let i = 0; i < win; i++) {
        arr.push(board[i][win - 1 - i]);
      }

      win++;
      diagonalArr.push(arr);
    }

    sI = 1;
    win = game.winning;

    if (win < board.length) {
      win = board.length - 1;

      for (let j = 0; j < board.length - game.winning; j++) {
        const arr = [];

        for (let i = 0; i < win; i++) {
          arr.push(board[i + sI][board.length - i - 1]);
        }

        win--;
        sI++;
        diagonalArr.push(arr);
      }
    }
    return diagonalArr;
  }

  // horizontal selected cages
  allSelectedCages.push(...getAllSelectedCagesGroup(board,
      item, 'col', 'horizontal'));
  // get vertical selected cages
  allSelectedCages.push(...getAllSelectedCagesGroup(
      getBoardTransposeArray(board), item, 'row', 'vertical'));
  // get diagonal1 selected cages
  allSelectedCages.push(...getAllSelectedCagesGroup(
      getBoardDiagonal1Array(board), item, 'col', 'diagonal1'));
  // get diagonal2 selected cages
  allSelectedCages.push(...getAllSelectedCagesGroup(
      getBoardDiagonal2Array(board), item, 'col', 'diagonal2'));
  return allSelectedCages;
}

// --------------------------------------------------------------------------
function setStressLevel(n) {
  if (n === 0) {
    leftArrow.style.bottom = '-10px';
    rightArrow.style.bottom = '-10px';
  } else {
    const xCagesState = getSelectedCages(game.board, 'x');
    const oCagesState = getSelectedCages(game.board, 'o');

    let xCagesMaxWeight = Math.floor(xCagesState.reduce((acc, item) =>
      Math.max(acc, item.weight), 0) / 10);

    let oCagesMaxWeight = Math.floor(oCagesState.reduce((acc, item) =>
      Math.max(acc, item.weight), 0) / 10);

    let max = game.winning - 1;

    if (game.size > 5) {
      max = game.winning - 2;

      if (xCagesMaxWeight === max) {
        xCagesMaxWeight = max - 0.2;
      }

      if (oCagesMaxWeight === max) {
        oCagesMaxWeight = max - 0.2;
      }
    }

    if (xCagesMaxWeight > max) {
      xCagesMaxWeight = max;
    }

    if (oCagesMaxWeight > max) {
      oCagesMaxWeight = max;
    }

    // scale range -10px...233px
    const step = Math.round(243 / max);

    leftArrow.style.bottom = (step * xCagesMaxWeight - 10) + 'px';
    rightArrow.style.bottom = (step * oCagesMaxWeight - 10) + 'px';
  }
}

function gameWinOrDraw() {
  const draw = game.stepsCount === game.size * game.size;
  const xCagesState = getSelectedCages(game.board, 'x');
  const oCagesState = getSelectedCages(game.board, 'o');

  function checkGameEnd(arr) {
    for (subArr of arr) {
      if (subArr.cages.length >= game.winning) {
        return subArr;
      }
    }
  }

  const xWin = checkGameEnd(xCagesState)?.cages;
  const oWin = checkGameEnd(oCagesState)?.cages;

  if (xWin) {
    for (cage of xWin) {
      game.board[cage.row][cage.col].cage.classList.add('winners');
    }

    if (gameModeDropdown.value === 'gamer-vs-computer') {
      if (game.gamerXO === 'x') {
        playGameWinSound();
      } else {
        playGameLoseSound();
      }
    } else {
      playGameWinSound();
    }

    setTimeout(doXWin, 2000);

    return true;
  }

  if (oWin) {
    for (cage of oWin) {
      game.board[cage.row][cage.col].cage.classList.add('winners');
    }

    if (gameModeDropdown.value === 'gamer-vs-computer') {
      if (game.gamerXO === 'x') {
        playGameLoseSound();
      } else {
        playGameWinSound();
      }
    } else {
      playGameWinSound();
    }

    setTimeout(doOWin, 2000);

    return true;
  }

  if (draw) {
    playGameTieSound();
    setTimeout(doTie, 2000);

    return true;
  }

  return false;
}

function generateLogicStep(board, computer, gamer) {
  const computerCages = getSelectedCages(board, computer);
  const gamerCages = getSelectedCages(board, gamer);
  // console.log('gamerCages', gamerCages)

  if (computerCages.length === 0 &&
      gamerCages.length === 0) {
    // first step
    if (game.winning >= game.size / 2) {
      const rowCol = Math.ceil(game.size / 2) - 1;

      return [rowCol, rowCol];
    } else {
      const priorityArea = game.size - 2 * game.winning;
      const row = Math.ceil(game.winning + priorityArea * Math.random()) - 1;
      const col = Math.ceil(game.winning + priorityArea * Math.random()) - 1;

      return [row, col];
    }
  } else {
    const computerAllSteps = [];
    const gamerAllSteps = [];

    function getCagesMaxWeight(cages) {
      const maxWeight = cages.reduce((acc, cage) =>
        Math.max(acc, cage.weight), 0);

      const maxWeightCagesGroup = cages.filter(function(cage) {
        // TODO if logic dose not work delete this
        const temp = cage.weight % 10;

        if (temp === 1) {
          return cage.weight === maxWeight ||
          cage.weight === maxWeight - 1;
        }

        if (temp === 2) {
          return (cage.weight === maxWeight) ||
            (cage.weight === maxWeight - 1) ||
            (cage.weight === maxWeight - 2);
        }
        // -----------------------------------------
        return cage.weight === maxWeight;
      });

      const maxWeights = [];
      maxWeightCagesGroup.forEach((elem) => maxWeights.push(elem.weight));
      maxWeights.sort(function(a, b) {
        return b - a;
      });

      return maxWeights;
    }

    function calcBoardWeight(cages) {
      return cages.reduce((acc, cage) => acc += cage.weight, 0);
    }

    function calcStepInfo(cage, xO, arr) {
      if (cage.xO === '') {
        // add element
        cage.xO = xO;
        // get new board
        const cages = getSelectedCages(board, xO);
        // remove element
        cage.xO = '';
        // add max weights

        arr.push({
          row: cage.row,
          col: cage.col,
          weights: getCagesMaxWeight(cages),
          boardWeight: calcBoardWeight(cages),
          cagesCount: cages.length,
        });
      }
    }
    // calculate all steps for computer and gamer
    board.forEach((row) => row.forEach((cage) =>
      calcStepInfo(cage, computer, computerAllSteps)));

    board.forEach((row) => row.forEach((cage) =>
      calcStepInfo(cage, gamer, gamerAllSteps)));
    // ---------------------------------------------------

    const compEffStep = findStep(computerAllSteps);
    const gamerEffStep = findStep(gamerAllSteps);
    const compMaxWeights = getMaxWeights(computerAllSteps);
    const gamerMaxWeights = getMaxWeights(gamerAllSteps);
    // console.log('compEffStep', compEffStep)
    // console.log('gamerEffStep', gamerEffStep)


    function getMaxWeights(steps) {
      const maxWeight = steps.reduce((acc, step) =>
        Math.max(acc, step.weights[0]), 0);

      const maxWeightSteps = steps.filter(function(step) {
        return step.weights[0] === maxWeight;
      });

      maxWeightSteps.sort(function(a, b) {
        return b.weights.length - a.weights.length;
      });

      return maxWeightSteps[0].weights;
    }

    function findStep(steps) {
      if (game.size === 3) {
        let temp = 0;
        board.forEach((arr) => arr.forEach(function(cage) {
          if (cage.xO === '') {
            temp++;
          }
        }));

        if (temp === 6 &&
           ((game.board[0][0].xO !== '' &&
             game.board[1][1].xO !== '' &&
             game.board[2][2].xO !== '') ||
            (game.board[0][2].xO !== '' &&
             game.board[1][1].xO !== '' &&
             game.board[2][0].xO !== ''))) {
          if (game.board[0][0].xO === '') {
            return [0, 0];
          }
          if (game.board[0][2].xO === '') {
            return [0, 2];
          }
          if (game.board[2][2].xO === '') {
            return [2, 2];
          }
          if (game.board[2][0].xO === '') {
            return [2, 0];
          }
        }
      }

      if (gameDifficultyDropdown.value === 'hard') {
        return hardStep(steps);
      }

      if (gameDifficultyDropdown.value === 'medium') {
        const random = Math.floor(10 * Math.random());
        if (game.size === 3) {
          if (random > 7) {
            return generateRandomStep(board);
          }
          return hardStep(steps);
        }

        // set game difficulty level
        if (random > 7) {
          return mediumStep(steps);
        }

        return hardStep(steps);
      }

      if (gameDifficultyDropdown.value === 'easy') {
        const random = Math.floor(10 * Math.random());
        if (game.size === 3) {
          if (random > 5) {
            return generateRandomStep(board);
          }
          return hardStep(steps);
        }

        // set game difficulty level
        if (random > 7) {
          return easyStep(steps);
        }
        return mediumStep(steps);
      }

      function hardStep(steps) {
        const maxWeight = steps.reduce((acc, step) =>
          Math.max(acc, step.weights[0]), 0);

        const effectiveSteps1 = steps.filter(function(step) {
          return step.weights[0] === maxWeight;
        });

        if (effectiveSteps1.length === 1) {
          return [effectiveSteps1[0].row, effectiveSteps1[0].col];
        }
        // ------------------------------------------------------
        const weightArrMaxLength = effectiveSteps1.reduce((acc, step) =>
          Math.max(acc, step.weights.length), 1);

        const effectiveSteps2 = effectiveSteps1.filter(function(step) {
          return step.weights.length === weightArrMaxLength;
        });

        if (effectiveSteps2.length === 1) {
          return [effectiveSteps2[0].row, effectiveSteps2[0].col];
        }
        // ------------------------------------------------------
        const maxBoardWeight = effectiveSteps2.reduce((acc, step) =>
          Math.max(acc, step.boardWeight), 0);

        const effectiveSteps3 = effectiveSteps2.filter(function(step) {
          return step.boardWeight === maxBoardWeight;
        });

        if (effectiveSteps3.length === 1) {
          return [effectiveSteps3[0].row, effectiveSteps3[0].col];
        }
        // ------------------------------------------------------
        const minCagesCount = effectiveSteps3.reduce((acc, step) =>
          Math.min(acc, step.cagesCount), effectiveSteps3[0].cagesCount);

        const effectiveSteps4 = effectiveSteps2.filter(function(step) {
          return step.cagesCount === minCagesCount;
        });

        if (effectiveSteps4.length === 1) {
          return [effectiveSteps4[0].row, effectiveSteps4[0].col];
        }

        const randomStep = Math.floor(effectiveSteps4.length * Math.random());
        return [effectiveSteps4[randomStep].row,
          effectiveSteps4[randomStep].col];
      }

      function mediumStep(steps) {
        const maxWeight = steps.reduce((acc, step) =>
          Math.max(acc, step.weights[0]), 0);

        const steps1 = steps.filter(function(step) {
          return step.weights[0] === maxWeight - 1;
        });

        if (steps1.length !== 0) {
          const randomStep = Math.floor(steps1.length * Math.random());

          return [steps1[randomStep].row, steps1[randomStep].col];
        }

        return hardStep(steps);
      }

      function easyStep(steps) {
        const maxWeight = steps.reduce((acc, step) =>
          Math.max(acc, step.weights[0]), 0);

        const steps1 = steps.filter(function(step) {
          return step.weights[0] === maxWeight - 2;
        });

        if (steps1.length !== 0) {
          const randomStep = Math.floor(steps1.length * Math.random());

          return [steps1[randomStep].row, steps1[randomStep].col];
        }

        return mediumStep(steps);
      }

      function generateRandomStep(arr) {
        let row = Math.floor(Math.random() * game.size);
        let col = Math.floor(Math.random() * game.size);

        do {
          row = Math.floor(Math.random() * game.size);
          col = Math.floor(Math.random() * game.size);
        } while (arr[row][col].xO !== '');

        return [row, col];
      }
    }

    // game wining step
    if (compMaxWeights[0] >= game.winning * 10) {
      console.log('game wining step');
      return [compEffStep[0], compEffStep[1]];
    }

    // computer final attack step
    if ((compMaxWeights[0] >= (game.winning - 1) * 10) &&
            gamerMaxWeights[0] < game.winning * 10) {
      console.log('computer final attack step');
      return [compEffStep[0], compEffStep[1]];
    }

    // dangerous-1 situation for computer
    if (gamerMaxWeights[0] >= (game.winning - 1) * 10) {
      console.log('dangerous-1 situation for computer');
      return [gamerEffStep[0], gamerEffStep[1]];
    }

    // dangerous-2 situation for computer
    if ((gamerMaxWeights[0] >= (game.winning - 2) * 10) &&
        gamerAllSteps[0].weights.length > 1) {
      console.log('dangerous-2 situation for computer');
      return [gamerEffStep[0], gamerEffStep[1]];
    }

    // computer aggressive attack step
    if ((compMaxWeights[0] >= (game.winning - 2) * 10) &&
        compMaxWeights[0] >=
            gamerMaxWeights[0]) {
      console.log('computer aggressive attack step');
      return [compEffStep[0], compEffStep[1]];
    }

    // dangerous-3 situation for computer
    if (gamerMaxWeights[0] >= (game.winning - 2) * 10) {
      console.log('dangerous-3 situation for computer');
      return [gamerEffStep[0], gamerEffStep[1]];
    }

    // computer passive attack step
    if (compMaxWeights[0] >=
          gamerMaxWeights[0]) {
      console.log('computer passive attack step');
      return [compEffStep[0], compEffStep[1]];
    }


    console.log('last, gamer step');
    return [gamerEffStep[0], gamerEffStep[1]];
    // return generateRandomStep(board);
  }
}
