/**
 * Using yargs to process arguments from command line
 * npm i yargs
 */
const yargs = require('yargs');
const helpers = require('./helpers.js');

/** Add note */
yargs
  .command('add', 'Add new note!', helpers.addNoteConfig, helpers.addNote)
  .example(`node $0 add --title="Test" --body="Test"`)
  .command(
    'remove',
    'Remove note!',
    helpers.accessNoteConfig,
    helpers.removeNote
  )
  .example(`node $0 remove --title="Test"`)
  .command('read', 'Read note!', helpers.accessNoteConfig, helpers.readNote)
  .example(`node $0 read --title="Test"`)
  .command('list', 'List notes!', {}, helpers.listNotes)
  .example(`node $0 list`);

yargs.parse();
