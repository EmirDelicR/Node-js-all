```js
const fs = require('fs');
/** Write to file and overwrite */
fs.writeFileSync('notes.txt', 'This file is node file.');
/** Append to file */
fs.appendFileSync('notes.txt', '\nThis is the second line!');

/** Import file */
/** utils.js */
console.log('From utils.js');
const name = 'Test Name';

const add = (a, b) => {
  return a + b;
};

module.exports = {
  name,
  add,
};
/** app.js */
const utils = require('./utils.js');
console.log(utils.name);
console.log(utils.add(2, 3));

/** Work with npm modules */
// npm i validator
const validator = require('validator');

console.log(validator.isEmail('test@gmail.com'));

/** Print in color */
/** Color.js */
const colors = {
  Reset: '\x1b[0m',

  FgRed: '\x1b[31m',
  FgGreen: '\x1b[32m',
  FgYellow: '\x1b[33m',

  BgRed: '\x1b[41m',
  BgGreen: '\x1b[42m',
  BgYellow: '\x1b[43m',
};

const print = (text, type) => {
  switch (type) {
    case 'error':
      console.log(colors.FgRed, text);
      break;
    case 'warning':
      console.log(colors.FgYellow, text);
      break;
    case 'success':
      console.log(colors.FgGreen, text);
      break;

    default:
      console.log(colors.Reset, text);
      break;
  }
};

module.exports = print;

const print = require('./colors.js');
print('Some data!', 'success');
```

```js
/** access arguments */
// in terminal: node app.js SomeVariable
console.log(process.argv);
```
