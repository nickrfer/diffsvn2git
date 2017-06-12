#!/bin/bash

BASEDIR=$(cd "$(dirname "$0")"; pwd)
rm -rf $BASEDIR/tmp/*
mkdir $BASEDIR/tmp/repo
svn checkout http://svn.code.sf.net/p/codeblocks/code/trunk/src/base/ $BASEDIR/tmp/repo
