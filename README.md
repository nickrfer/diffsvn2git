
# diffsvn2git

[![Codacy Code Badge](https://api.codacy.com/project/badge/grade/8c7b41fac91c4adf9fcaad888bbddaca)](https://www.codacy.com/app/Codacy/diffsvn2git)
[![Circle CI](https://circleci.com/gh/nickrfer/diffsvn2git.svg?style=svg)](https://circleci.com/gh/nickrfer/diffsvn2git)
[![Dependency Status](https://dependencyci.com/github/nickrfer/diffsvn2git/badge)](https://dependencyci.com/github/nickrfer/diffsvn2git)
[![npm](https://img.shields.io/npm/v/diffsvn2git.svg)](https://www.npmjs.com/package/diffsvn2git)

[![Dependency Status](https://david-dm.org/nickrfer/diffsvn2git.svg)](https://david-dm.org/nickrfer/diffsvn2git)
[![devDependency Status](https://david-dm.org/nickrfer/diffsvn2git/dev-status.svg)](https://david-dm.org/nickrfer/diffsvn2git#info=devDependencies)
[![npm](https://img.shields.io/npm/l/diffsvn2git.svg)]()
[![Join the chat at https://gitter.im/diffsvn2git/Lobby](https://badges.gitter.im/diffsvn2git/Lobby.svg)](https://gitter.im/diffsvn2git/Lobby?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)


Nodejs lib to convert a svn commit revision to a git diff.

[![NPM](https://nodei.co/npm/diffsvn2git.png)](https://nodei.co/npm/diffsvn2git/)

## Distribution

* [Node Module](https://www.npmjs.org/package/diffsvn2git)

## Usage

```javascript
var diff = require('diffsvn2git');

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
