import assert from 'assert';
import path from 'path';
import { describe, it } from 'mocha';
import DiffSvn2Git from '../src/diffsvn2git';

const workingPath = path.resolve('test/tmp/repo');
const diffSvn2Git = new DiffSvn2Git({ cwd: workingPath });

describe('diffsvn2git', () => {
  describe('listRevisionsByDate', () => {
    it('should list the svn working copy revisions by the date informed', () => {
      return diffSvn2Git.listRevisionsByDate('2015-04-12').then((revisions) => {
        console.log(revisions);
        assert(revisions != null);
      });
    });
  });

  describe('parse', () => {
    it('should parse svn revision diff to git diff', () => {
      return diffSvn2Git.parse().then((patch) => {
        console.log(patch);
        assert(patch != null);
      });
    });
  });
});
