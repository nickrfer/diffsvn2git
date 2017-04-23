exports.parse = function(options) {
  var Client = require('svn-spawn');
  var client = new Client(options);

  let lastRev;

  // fetch the last revision on this repo
  let getInfoPromise = new Promise((resolve, reject) => {
      client.getInfo((err, data) => {
          lastRev = data.commit.$.revision;
          resolve();
      });
  });

  let patch;
  // when get info returns, gets the log info from the last revision
  let getLogPromise = new Promise((resolve, reject) => {
      getInfoPromise.then(() => {
          client.log(['-c ' + lastRev], function(err, data) {
              patch = svnLogToGitLog(data.split('\n'));
              patch += "---\n\n";
              console.log(patch);
              resolve();
          });
      });
  });

  getLogPromise.then(() => {
      console.log('getLogPromise.then');
      client.cmd(['diff', '-c ' + lastRev], function(err, data) {
          patch += svnDiffToGitDiff(data.split('\n'));
          console.log(patch);
      });
  });

  function svnLogToGitLog(svnlog) {
      var metainfo = svnlog[1].split(" | ");
      var subject = svnlog[2];
      var description = svnlog[3];

      var author = metainfo[1];

      var day = metainfo[2].split("(")[1];
      var time = metainfo[2].split(" ")[1];
      var offset = metainfo[2].split(" ")[2];

      var gitlog = "From: " + author + " <" + author + ">" + "\n";
      gitlog += "Date: " + day + " " + time + " " + offset + "\n";
      gitlog += "Subject: [PATCH] " + subject + "\n";
      gitlog += description + "\n";
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
}
