module.exports = function(source) {
  // http://webpack.github.io/docs/how-to-write-a-loader.html#flag-itself-cacheable-if-possible
  this.cacheable && this.cacheable();
	// var callback = this.async();
  return source;
};
