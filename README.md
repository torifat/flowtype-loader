# flowtype-loader

[Flow](https://flowtype.org/) loader for [webpack](https://webpack.js.org/)

## Install

```sh
$ npm install --save-dev flowtype-loader
```

OR, for lazy people like me:

```sh
$ npm i -D flowtype-loader
```

## Usage

In your webpack `2.X` configuration:

```js
var FlowtypePlugin = require('flowtype-loader/plugin');

module.exports = {
  // ...
  module: {
    rules: [
      {test: /\.js$/, loader: 'flowtype-loader', enforce: 'pre', exclude: /node_modules/},
    ]
  },
  plugins: [
    new FlowtypePlugin()
    // new FlowtypePlugin({cwd: '/path/'})
    // new FlowtypePlugin({failOnError: true})
  ]
  // ...
}
```

If you are using webpack `1.x`:

```js
var FlowtypePlugin = require('flowtype-loader/plugin');

module.exports = {
  // ...
  module: {
    preLoaders: [
      {test: /\.js$/, loader: "flowtype", exclude: /node_modules/}
    ]
  },
  plugins: [
    new FlowtypePlugin()
    // new FlowtypePlugin({cwd: '/path/'})
    // new FlowtypePlugin({failOnError: true})
  ]
  // ...
}
```
