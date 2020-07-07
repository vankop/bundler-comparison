module.exports = {
	entry: './index.js',
	output: {
		path: require('path').resolve('results'),
		filename: 'webpack.js',
		libraryTarget: 'commonjs'
	},
	module: {
		rules: [
			{
				type: "javascript/esm"
			}
		]
	},
	devtool: 'source-map',
	mode: 'production'
};