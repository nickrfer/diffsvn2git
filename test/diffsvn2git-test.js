var assert = require('assert');
var DiffSvn2Git = require('../src/diffsvn2git.js');
var workingPath = __dirname.join('/tmp/copy');

var diffSvn2git = new DiffSvn2Git({cwd: workingPath});

describe('diffsvn2git', function() {
  describe('parse', function() {
    it('should parse svn revision diff to git diff', function() {
      var parsePromise = diffSvn2git.parse();

      parsePromise.then((patch) => {
        assert(patch != null);
      });
    });
  });
});
