var path = require('path');
var FlowtypePlugin = require('../plugin');

module.exports = {
	entry: './entry.js',
	output: {
		path: path.join(__dirname, 'out'),
		filename: 'bundle.js'
	},
	module: {
		preLoaders: [
			{ test: /\.js$/, loader: path.join(__dirname, '..') }
		],
		loaders: [
	    { test: /\.js$/, loader: 'babel' }
	  ]
	},
	plugins: [
		new FlowtypePlugin({failOnError: true, checkAll: true})
	]
};
