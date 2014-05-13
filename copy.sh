#!/bin/sh

choice=""

echo
echo "Select component to copy"
echo "1) scg"
echo "2) scs"
echo "3) html"
echo "4) github"
echo "---"

read component

target='../sc-web/static/components/'
rel_source_file='static/components/'
source_path=''

case $component in
        '1') source_path='scg/';;
        '2') source_path='scs/';;
	'3') source_path='html/';;
	'4') source_path='github/';;
        *)   echo "You have selected unknown component to copy";;
esac

echo "copy $source_path$rel_source_file to $target"

cp -rf $source_path$rel_source_file* $target

