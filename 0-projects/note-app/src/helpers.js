const print = require('./colors.js');
const fs = require('fs');

const readDataFromFile = () => {
  try {
    const dataJSON = fs.readFileSync('src/data.json').toString();
    const data = JSON.parse(dataJSON);
    return data;
  } catch {
    print('Error while reading file!', 'error');
  }
};

const saveDataToFile = (data) => {
  try {
    fs.writeFileSync('src/data.json', JSON.stringify(data));
    print('Data saved!', 'success');
  } catch {
    print('Error while writing file!', 'error');
  }
};

const getNote = (title) => {
  const data = readDataFromFile();
  const note = data[title];
  if (!note) {
    print('This not not exists!', 'error');
    return;
  }

  return note;
};

const addNoteConfig = {
  title: {
    default: `Note title ${new Date().toISOString()}`,
    type: 'string',
  },
  body: {
    demandOption: true,
    type: 'string',
  },
};

const accessNoteConfig = {
  title: {
    demandOption: true,
    type: 'string',
  },
};

const addNote = (argv) => {
  const data = readDataFromFile();
  if (data.hasOwnProperty(argv.title)) {
    print('This note exists!', 'error');
    return;
  }
  data[argv.title] = {
    title: argv.title,
    body: argv.body,
  };
  saveDataToFile(data);
};

const removeNote = (argv) => {
  const data = readDataFromFile();
  if (!data.hasOwnProperty(argv.title)) {
    print('This note not exists!', 'error');
    return;
  }
  delete data[argv.title];
  print('Note Deleted!', 'success');
  saveDataToFile(data);
};

const readNote = (argv) => {
  const note = getNote(argv.title);
  if (note) {
    print(`**** ${note.title} ****`, 'warning');
    print(`${note.body}`, 'success');
  }
};

const listNotes = () => {
  const data = readDataFromFile();
  let i = 1;
  print('***** NOTES *****', 'success');
  for (let item in data) {
    print(`${i}. ${item}`);
    i++;
  }
};

module.exports = {
  addNoteConfig,
  accessNoteConfig,
  listNotes,
  addNote,
  removeNote,
  readNote,
};
