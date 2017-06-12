#!/bin/bash

BASEDIR=$(cd "$(dirname "$0")"; pwd)
rm -rf $BASEDIR/test/tmp/*
mkdir $BASEDIR/test/tmp/repo
svn checkout http://svn.code.sf.net/p/codeblocks/code/trunk/src/base/ $BASEDIR/tmp/repo
