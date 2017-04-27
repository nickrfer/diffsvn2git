import Client from 'svn-spawn';

export default class DiffSvn2Git {
  constructor(options) {
    this.client = new Client(options);
  }

  static svnLogToGitLog(svnlog) {
    const metainfo = svnlog[1].split(' | ');
    const subject = svnlog[2];
    const description = svnlog[3];

    const author = metainfo[1];
    const day = metainfo[2].split('(')[1];
    const time = metainfo[2].split(' ')[1];
    const offset = metainfo[2].split(' ')[2];

    let gitlog = `From: ${author} <${author}> \n`;
    gitlog += `Date: ${day} ${time} ${offset} \n`;
    gitlog += `Subject: [PATCH] ${subject} \n`;
    gitlog += `${description} \n`;
    return gitlog;
  }

  static svnDiffToGitDiff(svndiff) {
    let gitDiff = '';

    svndiff.forEach((line) => {
      if (line.startsWith('--- ')) {
        gitDiff += `--- a/${line.substring(4)} \n`;
      } else if (line.startsWith('+++ ')) {
        gitDiff += `+++ b/${line.substring(4)} \n`;
      } else {
        gitDiff += `${line} \n`;
      }
    });
    return gitDiff;
  }

  getInfoPromise() {
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

  getLogPromise(infoPromise) {
    return new Promise((resolve) => {
      infoPromise.then(() => {
        this.client.log([`-c ${this.rev}`], (err, data) => {
          let patch = null;

          if (data) {
            patch = DiffSvn2Git.svnLogToGitLog(data.split('\n'));
            patch += '---\n\n';
          } else {
            console.error(`Error while calling svn log: ${err}`);
          }
          resolve(patch);
        });
      });
    });
  }

  getDiffPromise(logPromise) {
    return new Promise((resolve) => {
      logPromise.then((patch) => {
        let generatedPatch = patch;
        this.client.cmd(['diff', `-c ${this.rev}`], (err, data) => {
          if (data) {
            generatedPatch += DiffSvn2Git.svnDiffToGitDiff(data.split('\n'));
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
    const infoPromise = this.getInfoPromise();

    // when get info returns, gets the log info from the last revision
    const logPromise = this.getLogPromise(infoPromise);

    // when get log returns, calls svn diff to finish building the patch info
    return this.getDiffPromise(logPromise);
  }

}
