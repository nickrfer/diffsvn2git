exports.parse = function(options) {
  var Client = require('svn-spawn');
  var client = new Client({cwd: options.cwd, username: options.username, password: options.password, noAuthCache: options.noAuthCache});

  let rev = options.rev;

  function svnLogToGitLog(svnlog) {
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

  function svnDiffToGitDiff(svndiff) {
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

  // fetch the last revision on this repo if the options.rev was not passed
  let getInfoPromise = new Promise((resolve, reject) => {
    if (rev) {
      resolve();
    } else {
      client.getInfo((err, data) => {
        if (data) {
          rev = data.commit.$.revision;
        } else {
          console.error('Error while calling svn info: ' + err);
        }
        resolve();
      });
    }
  });

  // when get info returns, gets the log info from the last revision
  let getLogPromise = new Promise((resolve, reject) => {
    getInfoPromise.then(() => {
      client.log(['-c ' + rev], function(err, data) {
        var patch = null;

        if (data) {
          patch = svnLogToGitLog(data.split('\n'));
          patch += '---\n\n';
        } else {
          console.error('Error while calling svn log: ' + err);
        }
        resolve(patch);
      });
    });
  });

  // when get log returns, calls svn diff to finish building the patch info
  let getDiffPromise = new Promise((resolve, reject) => {
    getLogPromise.then((patch) => {
      client.cmd([
        'diff', '-c ' + rev
      ], function(err, data) {
        if (data) {
          patch += svnDiffToGitDiff(data.split('\n'));
        } else {
          console.error('Error while calling svn diff: ' + err);
        }
        resolve(patch);
      });
    });
  });

  return getDiffPromise;
};
