'use strict';
import assert from 'assert';
import DiffSvn2Git from '../src/diffsvn2git.js';
import path from 'path';

const workingPath = path.resolve('test/tmp/repo');
let diffSvn2git = new DiffSvn2Git({cwd: workingPath});

describe('diffsvn2git', function() {
  describe('parse', function() {
    it('should parse svn revision diff to git diff', function() {
      return diffSvn2git.parse().then((patch) => {
        console.log(patch);
        assert(patch != null);
      });
    });
  });
});
