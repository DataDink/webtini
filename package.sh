browserify MinimalBinder.js -o minimal.js -t [ babelify --presets [ @babel/preset-env ] --plugins [ @babel/plugin-transform-class-properties ] ]
browserify StandardBinder.js -o standard.js -t [ babelify --presets [ @babel/preset-env ] --plugins [ @babel/plugin-transform-class-properties ] ]
