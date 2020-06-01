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
