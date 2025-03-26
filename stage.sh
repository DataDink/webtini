rm -rf ./web
mkdir ./web
node package.js
sh document.sh
cp -r ./docs/* ./web
cp -r ./packages/* ./web
cp -r ./binders/* ./web