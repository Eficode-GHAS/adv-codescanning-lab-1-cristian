const { exec } = require('child_process');

function debugRunner(commandText) {
  return new Promise((resolve, reject) => {
    exec(commandText, (error, stdout) => {
      if (error) {
        reject(error);
        return;
      }

      resolve(stdout);
    });
  });
}

module.exports = { debugRunner };
