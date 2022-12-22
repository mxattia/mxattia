#!/bin/sh
echo "Converting process"
echo $1
echo $2
echo `ffmpeg $1`
rm -rf $2