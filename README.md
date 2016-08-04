# flowtype-loader
[Flow](https://flowtype.org/) loader for [webpack](https://webpack.github.io/)

## Install

```sh
$ npm install --save-dev flowtype-loader
```

OR, for lazy people like me:

```sh
$ npm i -D flowtype-loader
```

## Usage

In your webpack configuration

```js
module.exports = {
  // ...
  module: {
    preLoaders: [
      {test: /\.js$/, loader: "flowtype", exclude: /node_modules/}
    ]
  }
  // ...
}
```

## TODO

- [ ] Fix performance issue (parse flow output once)
