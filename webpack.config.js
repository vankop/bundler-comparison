module.exports = {
	entry: './index.js',
	output: {
		path: require('path').resolve('results'),
		filename: 'webpack.js',
		iife: false
	},
	module: {
		rules: [
			{
				type: "javascript/esm"
			}
		]
	},
	optimization: {
		minimizer: [
			new Terser({
				terserOptions: {
					compress: {
						passes: 2
					}
				}
			})
		]
	},
	devtool: 'source-map',
	mode: 'production'
};
