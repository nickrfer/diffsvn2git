'use strict';
const Client = require('svn-spawn');

class DiffSvn2Git {

  constructor(options) {
    this.client = new Client(options);
  }

  static svnLogToGitLog(svnlog) {
    var metainfo = svnlog[1].split(' | ');
    var subject = svnlog[2];
    var description = svnlog[3];

    var author = metainfo[1];

    var day = metainfo[2].split('(')[1];
    var time = metainfo[2].split(' ')[1];
    var offset = metainfo[2].split(' ')[2];

    var gitlog = 'From: ' + author + ' <' + author + '>' + '\n';
    gitlog += 'Date: ' + day + ' ' + time + ' ' + offset + '\n';
    gitlog += 'Subject: [PATCH] ' + subject + '\n';
    gitlog += description + '\n';
    return gitlog;
  }

  static svnDiffToGitDiff(svndiff) {
    var gitDiff = '';

    svndiff.forEach((line) => {
      if (line.startsWith('--- ')) {
        gitDiff += '--- a/' + line.substring(4) + '\n';
      } else if (line.startsWith('+++ ')) {
        gitDiff += '+++ b/' + line.substring(4) + '\n';
      } else {
        gitDiff += line + '\n';
      }
    });
    return gitDiff;
  }

  getInfoPromise() {
    return new Promise((resolve, reject) => {
      if (this.rev) {
        resolve();
      } else {
        this.client.getInfo((err, data) => {
          if (data) {
            this.rev = data.commit.$.revision;
          } else {
            console.error('Error while calling svn info: ' + err);
          }
          resolve();
        });
      }
    });
  }

  getLogPromise(infoPromise) {
    return new Promise((resolve, reject) => {
      infoPromise.then(() => {
        this.client.log(['-c ' + this.rev], function(err, data) {
          var patch = null;

          if (data) {
            patch = DiffSvn2Git.svnLogToGitLog(data.split('\n'));
            patch += '---\n\n';
          } else {
            console.error('Error while calling svn log: ' + err);
          }
          resolve(patch);
        });
      });
    });
  };

  getDiffPromise(logPromise) {
    return new Promise((resolve, reject) => {
      logPromise.then((patch) => {
        this.client.cmd([
          'diff', '-c ' + this.rev
        ], function(err, data) {
          if (data) {
            patch += DiffSvn2Git.svnDiffToGitDiff(data.split('\n'));
          } else {
            console.error('Error while calling svn diff: ' + err);
          }
          resolve(patch);
        });
      });
    });
  }

  parse(rev = null) {
    this.rev = rev;
    // fetch the last revision on this repo if the options.rev was not passed
    let infoPromise = this.getInfoPromise();

    // when get info returns, gets the log info from the last revision
    let logPromise = this.getLogPromise(infoPromise);

    // when get log returns, calls svn diff to finish building the patch info
    return this.getDiffPromise(logPromise);
  }

}

module.exports = DiffSvn2Git;
