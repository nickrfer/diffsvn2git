'use strict';
const Client = require('svn-spawn');

var DiffSvn2GitModule = function() {};
module.exports = DiffSvn2GitModule;

class DiffSvn2Git {

  constructor(options) {
    this.client = new Client({cwd: options.cwd, username: options.username, password: options.password, noAuthCache: options.noAuthCache});
  }

  svnLogToGitLog(svnlog) {
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

  svnDiffToGitDiff(svndiff) {
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

  getInfoPromise(rev) {
    return new Promise((resolve, reject) => {
      if (rev) {
        resolve();
      } else {
        this.client.getInfo((err, data) => {
          if (data) {
            rev = data.commit.$.revision;
          } else {
            console.error('Error while calling svn info: ' + err);
          }
          resolve();
        });
      }
    });
  }

  getLogPromise(rev, infoPromise) {
    return new Promise((resolve, reject) => {
      infoPromise.then(() => {
        this.client.log(['-c ' + rev], function(err, data) {
          var patch = null;

          if (data) {
            patch = this.svnLogToGitLog(data.split('\n'));
            patch += '---\n\n';
          } else {
            console.error('Error while calling svn log: ' + err);
          }
          resolve(patch);
        });
      });
    });
  };

  getDiffPromise(rev, logPromise) {
    return new Promise((resolve, reject) => {
      logPromise.then((patch) => {
        this.client.cmd([
          'diff', '-c ' + rev
        ], function(err, data) {
          if (data) {
            patch += this.svnDiffToGitDiff(data.split('\n'));
          } else {
            console.error('Error while calling svn diff: ' + err);
          }
          resolve(patch);
        });
      });
    });
  }

  parse(rev) {
    // fetch the last revision on this repo if the options.rev was not passed
    let infoPromise = this.getInfoPromise(rev);

    // when get info returns, gets the log info from the last revision
    let logPromise = this.getLogPromise(rev, infoPromise);

    // when get log returns, calls svn diff to finish building the patch info
    return this.getDiffPromise(rev, logPromise);
  }

}

module.exports.DiffSvn2Git = DiffSvn2Git;
