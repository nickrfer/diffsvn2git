import assert from 'assert';
import path from 'path';
import { describe, it } from 'mocha';
import DiffSvn2Git from '../src/diffsvn2git';

const workingPath = path.resolve('test/tmp/repo');
const diffSvn2git = new DiffSvn2Git({ cwd: workingPath });

describe('diffsvn2git', () => {
  describe('parse', () => {
    it('should parse svn revision diff to git diff', () => {
      return diffSvn2git.parse().then((patch) => {
        console.log(patch);
        assert(patch != null);
      });
    });
  });
});
