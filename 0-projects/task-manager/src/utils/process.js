const checkTestingEvn = () => {
  const testingArg = process.argv.filter((x) =>
    x.startsWith('--is-testing=')
  )[0];
  const isTesting = testingArg ? testingArg.split('=')[1] : false;
  console.log('In testing mode: ', isTesting);
  return isTesting;
};

module.exports = checkTestingEvn;
