node test.js
rm -rf ./docs
mkdir ./docs
sh document.sh
node package.js
cp -r ./packages/* ./docs
cp -r ./test/test-results.html ./docs