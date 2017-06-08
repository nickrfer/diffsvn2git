import DiffParserUtil from '../parser/diffparser-util';

export default class DiffParser {
  constructor(client) {
    this.client = client;
  }

  createInfoPromise() {
    return new Promise((resolve) => {
      if (this.rev) {
        resolve();
      } else {
        this.client.getInfo((err, data) => {
          if (data) {
            this.rev = data.commit.$.revision;
          } else {
            console.error(`Error while calling svn info: ${err}`);
          }
          resolve();
        });
      }
    });
  }

  createLogPromise(infoPromise) {
    return new Promise((resolve) => {
      infoPromise.then(() => {
        this.client.log([`-c ${this.rev}`], (err, data) => {
          let patch = null;

          if (data) {
            patch = DiffParserUtil.svnLogToGitLog(data.split('\n'));
            patch += '---\n\n';
          } else {
            console.error(`Error while calling svn log: ${err}`);
          }
          resolve(patch);
        });
      });
    });
  }

  createDiffPromise(logPromise) {
    return new Promise((resolve) => {
      logPromise.then((patch) => {
        let generatedPatch = patch;
        this.client.cmd(['diff', `-c ${this.rev}`], (err, data) => {
          if (data) {
            generatedPatch += DiffParserUtil.svnDiffToGitDiff(data.split(/\r?\n/));
          } else {
            console.error(`Error while calling svn diff: ${err}`);
          }
          resolve(generatedPatch);
        });
      });
    });
  }

  parse(rev = null) {
    this.rev = rev;
    // fetch the last revision on this repo if the options.rev was not passed
    const infoPromise = this.createInfoPromise();

    // when get info returns, gets the log info from the last revision
    const logPromise = this.createLogPromise(infoPromise);

    // when get log returns, calls svn diff to finish building the patch info
    return this.createDiffPromise(logPromise);
  }
}
