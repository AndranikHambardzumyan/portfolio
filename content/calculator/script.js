/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

let currentValue = '0';
let memValue; // Memorized value.
let mathOperation = '';

function print() {
  if (+currentValue > 999999999 || +currentValue < -999999999) {
    console.log(currentValue);
    document.getElementById('calcDisplay').value = 'Over Range';
    setTimeout(cleaner, 1000);
  } else {
    check();
    document.getElementById('calcDisplay').value = currentValue;
  }
} 

function check() { // check currentValue is in range?
  if (+currentValue >= 0 && currentValue[9] === '.') {
    currentValue = currentValue.slice(0, 9);
    return false;
  }

  if (currentValue.includes('.') && +currentValue >= 0) {
    currentValue = currentValue.slice(0, 10);
    return !(currentValue.length === 10);
  }

  if (+currentValue >= 0) {
    currentValue = currentValue.slice(0, 9);
    return !(currentValue.length === 9);
  }

  if (+currentValue < 0 && currentValue[10] === '.') {
    currentValue = currentValue.slice(0, 10);
    return false;
  }

  if (currentValue.includes('.') && +currentValue < 0) {
    currentValue = currentValue.slice(0, 11);
    return !(currentValue.length === 11);
  }

  if (+currentValue < 0) {
    currentValue = currentValue.slice(0, 10);
    return !(currentValue.length === 10);
  }
} 

function type(strNumber) { // input data - number, type -string.
  if (currentValue === '0') {
    currentValue = '';
  }
  
  if (check()) {
    currentValue += strNumber;
    print();
  }
} 

function typeDot() {
  if (currentValue === '0') {
    currentValue = '0.';
  }

  if (!currentValue.includes('.')) {
    type('.');
    print();
  }  

  print();
} 

function type0() {
  type('0');
} 

function type1() {
  type('1');
} 

function type2() {
  type('2');
} 

function type3() {
  type('3');
} 

function type4() {
  type('4');
} 

function type5() {
  type('5');
} 

function type6() {
  type('6');
} 

function type7() {
  type('7');
} 

function type8() {
  type('8');
} 

function type9() {
  type('9');
} 

function cleaner() {
  currentValue = '0';
  memValue = '0';
  print();
} 

function plusMinus() {
  if (currentValue[0] === '-') {
    currentValue = currentValue.slice(1, 10);
  } else {
    currentValue = '-' + currentValue;
  }

  print();
} 

function plus() {
  mathOperation = '+';
  memValue = currentValue;
  currentValue = '0';
} 

function minus() {
  mathOperation = '-';
  memValue = currentValue;
  currentValue = '0';
}

function division() {
  mathOperation = '/';
  memValue = currentValue;
  currentValue = '0';
}

function multiplication() {
  mathOperation = '*';
  memValue = currentValue;
  currentValue = '0';
}

function equal() {
  if (mathOperation === '+') {
    currentValue = '' + (+memValue + +currentValue);
    print();
  }

  if (mathOperation === '-') {
    currentValue ='' + (+memValue - +currentValue);
    print();
  }

  if (mathOperation === '/') {
    currentValue ='' + (+memValue / +currentValue);
    print();
  }

  if (mathOperation === '*') {
    currentValue = '' + (+memValue * +currentValue);
    print();
  }

  memValue = '0';
  mathOperation = '';
} 

print();
