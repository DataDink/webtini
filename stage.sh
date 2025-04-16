rm -rf ./docs
mkdir ./docs

mkdir ./docs/tests
node test.js ./docs/tests/results.html

mkdir ./docs/documentation
node document.js ./docs/documentation

mkdir ./docs/packages
node package.js ./docs/packages

cp -rf ./web/* ./docs/
cp -rf README.md ./docs/
