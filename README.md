# diffsvn2git

[![Codacy Code Badge](https://api.codacy.com/project/badge/grade/ddb909b3f3ba4b21a20b8de2ae972215)](https://www.codacy.com/app/diffsvn2git)
[![Codacy Coverage Badge](https://api.codacy.com/project/badge/coverage/ddb909b3f3ba4b21a20b8de2ae972215)](https://www.codacy.com/app/nickrfer/diffsvn2git)
[![Circle CI](https://circleci.com/gh/nickrfer/diffsvn2git.svg?style=svg)](https://circleci.com/gh/nickrfer/diffsvn2git)
[![Dependency Status](https://dependencyci.com/github/nickrfer/diffsvn2git/badge)](https://dependencyci.com/github/nickrfer/diffsvn2git)

[![Dependency Status](https://david-dm.org/nickrfer/diffsvn2git.svg)](https://david-dm.org/nickrfer/diffsvn2git)
[![devDependency Status](https://david-dm.org/nickrfer/diffsvn2git/dev-status.svg)](https://david-dm.org/nickrfer/diffsvn2git#info=devDependencies)
[![npm](https://img.shields.io/npm/l/diffsvn2git.svg)]()

[![npm](https://img.shields.io/npm/v/diffsvn2git.svg)](https://www.npmjs.com/package/diffsvn2git)
[![Stories in Ready](https://badge.waffle.io/nickrfer/diffsvn2git.png?label=ready&title=Ready)](https://waffle.io/nickrfer/diffsvn2git)
[![Join the chat at https://gitter.im/diffsvn2git/Lobby](https://badges.gitter.im/diffsvn2git/Lobby.svg)](https://gitter.im/diffsvn2git/Lobby?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)


Nodejs lib to convert a svn commit revision to a git diff.

[![NPM](https://nodei.co/npm/diffsvn2git.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/diffsvn2git/)

## Distribution

* [Node Module](https://www.npmjs.org/package/diffsvn2git)

## Usage

```javascript
var DiffSvn2Git = require('diffsvn2git');
var diffSvn2Git = new DiffSvn2Git({
    // these parameters will be used by the svn spawn dependency.
    cwd: '/svn/awesome-repo/awesome-repo',
    username: 'awesome-user', // optional if authentication not required or is already saved
    password: 'pass', // optional if authentication not required or is already saved
    noAuthCache: true // optional, if true, username does not become the logged in user on the machine
});

// The parse method reads the repository and generates a git diff from the revision passed, or the last commit's revision
// if the revision parameter is not passed to the method. This method returns a Promise object.
diffSvn2Git.parse().then((patch) => {
    console.log(patch);
});
```
