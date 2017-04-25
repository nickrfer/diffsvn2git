const assert = require('assert');
const DiffSvn2Git = require('../src/diffsvn2git.js');
const path = require('path');
const workingPath = path.resolve().join('/tmp/copy');

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
