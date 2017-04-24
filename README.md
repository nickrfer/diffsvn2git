
# nodejs-svn-git-diff

[![Codacy Code Badge](https://api.codacy.com/project/badge/grade/8c7b41fac91c4adf9fcaad888bbddaca)](https://www.codacy.com/app/Codacy/nodejs-svn-git-diff)
[![Circle CI](https://circleci.com/gh/nickrfer/nodejs-svn-git-diff.svg?style=svg)](https://circleci.com/gh/nickrfer/nodejs-svn-git-diff)
[![Dependency Status](https://dependencyci.com/github/nickrfer/nodejs-svn-git-diff/badge)](https://dependencyci.com/github/nickrfer/nodejs-svn-git-diff)
[![npm](https://img.shields.io/npm/v/nodejs-svn-git-diff.svg)](https://www.npmjs.com/package/nodejs-svn-git-diff)

[![Dependency Status](https://david-dm.org/nickrfer/nodejs-svn-git-diff.svg)](https://david-dm.org/nickrfer/nodejs-svn-git-diff)
[![devDependency Status](https://david-dm.org/nickrfer/nodejs-svn-git-diff/dev-status.svg)](https://david-dm.org/nickrfer/nodejs-svn-git-diff#info=devDependencies)
[![npm](https://img.shields.io/npm/l/nodejs-svn-git-diff.svg)]()
[![Join the chat at https://gitter.im/nodejs-svn-git-diff/Lobby](https://badges.gitter.im/nodejs-svn-git-diff/Lobby.svg)](https://gitter.im/nodejs-svn-git-diff/Lobby?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)


Nodejs lib to convert a svn commit revision to a git diff.

[![NPM](https://nodei.co/npm/nodejs-svn-git-diff.png)](https://nodei.co/npm/nodejs-svn-git-diff/)

## Distribution

* [Node Module](https://www.npmjs.org/package/nodejs-svn-git-diff)

## Usage

```javascript
var diff = require('nodejs-svn-git-diff');

// Call parse method passing a json with the following attributes which will be used by the spawn-svn lib, except
// for the rev attribute. This method returns a Promise object.
var diffPromise = diff.parse({
    cwd: '/svn/awesome-repo/awesome-repo',
    username: 'awesome-user', // optional if authentication not required or is already saved
    password: 'pass', // optional if authentication not required or is already saved
    noAuthCache: true, // optional, if true, username does not become the logged in user on the machine
    rev: 750 // optional, if not informed, the code will retrieve the repository's last revision
});

// waits for the Promise object to return, and logs the patch generated.
diffPromise.then((patch) => {
  console.log(patch);
});
```
