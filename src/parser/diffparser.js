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

  createDiffPromise(infoPromise) {
    return new Promise((resolve) => {
      infoPromise.then(() => {
        this.client.cmd(['diff', '--git', '-x --ignore-space-change', `-c ${this.rev}`], (err, data) => {
          if (data) {
            resolve(data);
          } else {
            console.error(`Error while calling svn diff: ${err}`);
          }
        });
      });
    });
  }

  parse(rev = null) {
    this.rev = rev;
    // fetch the last revision on this repo if the options.rev was not passed
    const infoPromise = this.createInfoPromise();

    // when get info returns, calls svn diff to finish building the patch info
    return this.createDiffPromise(infoPromise);
  }
}
