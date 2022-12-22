#!/bin/sh
echo $1
ls $1 | grep "-" | awk '{print "file "$0,"\r\n"}' > $1/$2.txt
cd $1
echo `ffmpeg -y -f concat -i $2.txt -c copy $2t.mp4`
rm -rf $(ls | grep '-')
echo ` ffmpeg -i $2t.mp4 -loglevel error -preset slow -codec:a libfdk_aac -b:a 128k -codec:v libx264 -pix_fmt yuv420p -b:v 1000k -minrate 500k -maxrate 2000k -bufsize 2000k -vf scale=854:480 $2.mp4`
rm -rf $(ls | grep 't.mp4')
rm -rf $(ls | grep '.txt')