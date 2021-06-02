// LCD elements
const lsdDigits = [
document.getElementById('lcd0'),
document.getElementById('lcd1'),
document.getElementById('lcd2'),
document.getElementById('lcd3'),
document.getElementById('lcd4'),
document.getElementById('lcd5')
];
// Control buttons
const btnOnOff = document.getElementById('btn-onOff');
const btnStart = document.getElementById('btn-start');
const btnStop = document.getElementById('btn-stop');

// fixing time list and interval list
const labelContainer = document.getElementById('label-container');
const listPanel = document.getElementById('list-panel-container');

let millisecond = 0;
let second = 0;
let minute = 0;
let dMsec = '00';
let dSec = '00';
let dMin = '00';
let numbersOnDisplay = [0, 0, 0, 0, 0, 0];
let startTime;
let timeoutID;
let state = false;
let displayTime;
let lineNumber = 0;
let fixedTimeArr = [];
let fixedIntervalArr = [];

generateDigitsForDisplay();

function stateToggle() {
  if (state) {
    clearTimeout(timeoutID);
    btnStart.removeAttribute('onmousedown', 'start()');
    btnStop.removeAttribute('onmousedown', 'stop()');
    btnStart.innerHTML = 'Start';
    btnStart.removeAttribute('onclick', 'restart()');
    btnStart.removeAttribute('onmousedown', 'fixingTime()');
    btnOnOff.classList.remove("on");
    btnOnOff.classList.add("off");
    btnStart.classList.remove("start-on");
    btnStart.classList.add("start-off");
    btnStop.classList.remove("stop-on");
    btnStop.classList.add("stop-off");

    // Turn off display digits
    for (let i = 0; i < 6; i++) {
      printLcdElement(lsdDigits[i], 'f', "#0f0", "#0a230a");
    }

    // Turn off display dots
    dotStateToggle(false, "#0f0", "#0a230a");
    setZeroAllData();
  } else {
    slowStart();
    setTimeout(() => btnStart.setAttribute('onmousedown', 'start()'), 2000);
    btnStop.setAttribute('onmousedown', 'stop()');
    btnOnOff.classList.remove("off");
    btnOnOff.classList.add("on");
    btnStart.classList.remove("start-off");
    btnStart.classList.add("start-on");
    btnStop.classList.remove("stop-off");
    btnStop.classList.add("stop-on");
    btnOnOff.removeAttribute('onclick');
    setTimeout(() => btnOnOff.setAttribute('onclick', 'stateToggle()'), 2300);
  }

  state = !state;
}

function slowStart() {
  let timeoutID;
  let green = 35;
  bro();

  function bro() {
    if (green === 255) {
      clearTimeout(timeoutID);
      return '';
    }

    green++;

    // Turn on display digits
    for (let i = 0; i < 6; i++) {
      printLcdElement(lsdDigits[i], '0', `rgb(10, ${green}, 10)`, "#0a230a");
    }

    // Turn on display dots
    dotStateToggle(true, `rgb(10, ${green}, 10)`, "#0a230a");
    timeoutID = setTimeout(bro, 7);
  }
}

function printTime() {
  const difTime = Date.now() - startTime;

  millisecond = difTime % 1000;

  dMsec = String(millisecond);

  if (dMsec.length === 1) {
    dMsec = '0' + dMsec;
  } else if (dMsec.length === 2) {
    dMsec = '0' + dMsec.slice(0, 1);
  } else {
    dMsec = dMsec.slice(0, 2);
  }
  
  second = (difTime - millisecond) / 1000;

  if (second >= 60) {
    minute = Math.trunc(second / 60);
    second = second % 60;
  }

  if (second < 10) {
    dSec = '0' + second;
  } else {
    dSec = '' + second;
  }

  if (minute < 10) {
    dMin = '0' + minute;
  } else {
    dMin = '' + minute;
  }

  displayTime = dMin + ":" + dSec + "." + dMsec;

  printLcdDisplay(dMin + dSec + dMsec, "#0f0", "#0a230a");
  // Stop the stopwatch after 99 minutes.
  checkTimeLimit();
  // Refreshes the display every 50 milliseconds
  timeoutID = setTimeout(printTime, 50);
}

function stop() {
  clearTimeout(timeoutID);

  if (btnStart.getAttribute('onmousedown') === 'fixingTime()') {
    btnStart.removeAttribute('onmousedown', 'fixingTime()');
    btnStart.innerHTML = 'Restart';
    btnStart.setAttribute('onclick', 'restart()');
  }
}

function start() {
  startTime = Date.now();
  printTime();
  btnStart.removeAttribute('onmousedown', 'start()');
  btnStart.innerHTML = 'Fixing';
  btnStart.setAttribute('onmousedown', 'fixingTime()');
} 

function restart() {
  btnStart.innerHTML = 'Start';
  btnStart.removeAttribute('onclick', 'restart()');
  btnStart.setAttribute('onmousedown', 'start()');
  setZeroAllData();
  // Turn on display digits
  for (let i = 0; i < 6; i++) {
    printLcdElement(lsdDigits[i], '0');
  }
}

function fixingTime() {
  fixedTimeArr.push(displayTime);

  const interval = calculateTimeInterval();

  fixedIntervalArr.push(interval);
  listPanel.insertAdjacentHTML('beforeend', `<div><div class="line-number-block">${++lineNumber}</div>&emsp;&emsp;${displayTime}&emsp;&emsp;${interval}</div>`)
  labelContainer.hidden = false;
}

function calculateTimeInterval() {
  if (fixedTimeArr.length === 1) {
    return '00:00.00'
  } 

  const strTime = fixedTimeArr[fixedTimeArr.length - 2];
  let intMSec = dMsec - strTime.slice(6, 8);
  let intSec = dSec - strTime.slice(3, 5);
  let intMin = dMin - strTime.slice(0, 2);

  if (intMSec < 0) {
    intSec = intSec - 1;
    intMSec = 100 + +dMsec - strTime.slice(6, 8);
  }

  if (intMSec < 10)  {
    intMSec = '0' + intMSec;
  }

  if (intSec < 10)  {
    intSec = '0' + intSec;
  }

  if (intMin < 10)  {
    intMin = '0' + intMin;
  }

  return `${intMin}:${intSec}.${intMSec}`;
}

// stop the stopwatch after 99 minutes.
function checkTimeLimit() {
  if (minute === 99) {
    stop();
  }

  setTimeout(checkTimeLimit, 30000);
}

function setZeroAllData() {
  lineNumber = 0;
  listPanel.innerHTML = '';
  labelContainer.hidden = true;
  fixedTimeArr = [];
  fixedIntervalArr = [];
  millisecond = 0;
  second = 0;
  minute = 0;
}

function generateDigitsForDisplay() {
  let small;

  for (let i = 0; i < 6; i++) {
    if (i === 5) {
      small = 's'
    } else {
      small = ''
    }

    document.getElementById(`lcd${i}`).innerHTML = `
    <div class="${small}h e0 ${small}h11"></div>
    <div class="${small}h e1 ${small}h12"></div>
    <div class="${small}v e12 ${small}v11"></div>
    <div class="${small}v e13 ${small}v12"></div>
    <div class="${small}v e2 ${small}v21"></div>
    <div class="${small}v e3 ${small}v22"></div>
    <div class="${small}h e4 ${small}h21"></div>
    <div class="${small}h e5 ${small}h22"></div>
    <div class="${small}v e10 ${small}v11"></div>
    <div class="${small}v e11 ${small}v12"></div>
    <div class="${small}v e6 ${small}v21"></div>
    <div class="${small}v e7 ${small}v22"></div>
    <div class="${small}h e8 ${small}h21"></div>
    <div class="${small}h e9 ${small}h22"></div>`;
  }
}

// Toggle of states for dots in display
function dotStateToggle(state, colorOn, colorOff) {
  const dot1 = document.getElementById('dot1');
  const dot2 = document.getElementById('dot2');
  const dot3 = document.getElementById('dot3');

  if (state) {
    // turn on dot.
    dot1.style.backgroundColor = colorOn;
    dot2.style.backgroundColor = colorOn;
    dot3.style.backgroundColor = colorOn;
  } else { 
    // turn off dot.
    dot1.style.backgroundColor = colorOff;
    dot2.style.backgroundColor = colorOff;
    dot3.style.backgroundColor = colorOff;
  }
}

function printLcdElement(elem, num, colorOn = "#0f0", colorOff = "#0a230a") {
  /* The state each of the 14 elements, for displaying 
  digits from 0 ... 9, or off mode*/
  let elementsState = [];

  switch (num) {
    case 'f':
      elementsState = [false, false, false, false, false, false, false, false, false, false, false, false, false, false];
      break;
    case '0':
      elementsState = [true, true, true, true, false, false, true, true, true, true, true, true, true, true];
      break;
    case '1':
      elementsState = [false, false, true, true, false, false, true, true, false, false, false, false, false, false];
      break;
    case '2':
      elementsState = [true, true, true, true, true, true, false, false, true, true, true, true, false, false];
      break;
    case '3':
      elementsState = [true, true, true, true, true, true, true, true, true, true, false, false, false, false];
      break;
    case '4':
      elementsState = [false, false, true, true, true, true, true, true, false, false, false, false, true, true];
      break;
    case '5':
      elementsState = [true, true, false, false, true, true, true, true, true, true, false, false, true, true];
      break;
    case '6':
      elementsState = [true, true, false, false, true, true, true, true, true, true, true, true, true, true];
      break;
    case '7':
      elementsState = [true, true, true, true, false, false, true, true, false, false, false, false, false, false];
      break;
    case '8':
      elementsState = [true, true, true, true, true, true, true, true, true, true, true, true, true, true];
      break;
    case '9':
      elementsState = [true, true, true, true, true, true, true, true, true, true, false, false, true, true];
      break;
  }

  for (let i = 0; i < 14; i++) {
      elem.querySelector(`.e${i}`).style.color = elementsState[i] ? colorOn : colorOff;
  }
}

function printLcdDisplay(str, colorOn = "#0f0", colorOff = "#0a230a") {
  printLcdElement(lsdDigits[5], str[5], colorOn, colorOff);

  // If str[i] has changed, refresh lsdDigits[i] element. 
  for (let i = 4; i > -1; i--) {
    if (str[i] - numbersOnDisplay[i]) {
      printLcdElement(lsdDigits[i], str[i], colorOn, colorOff);
      numbersOnDisplay[i] = str[i];
    } else {
      return;
    }
  }
}
