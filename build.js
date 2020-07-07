const fs = require('fs');
const child_process = require('child_process');
const util = require('util');
const pb = require('pretty-bytes');

const exec = util.promisify(child_process.exec);

const bar = (p) => {
	return Array(Math.floor(p * 25)).fill('▉').join('');
};

async function main() {
	const sizes = {
		rollup: null,
		webpack: null,
		parcel: null
	};

	await exec('npx rollup -c');
	sizes.rollup = fs.statSync('results/rollup.js').size;
	console.log(`rollup: ${pb(sizes.rollup)}`);

	await exec('npx webpack');
	sizes.webpack = fs.statSync('results/webpack.js').size;
	console.log(`webpack: ${pb(sizes.webpack)}`);

	await exec('npx parcel build index.js --dist-dir results --no-scope-hoist');
	await fs.renameSync("results/index.js", "results/parcel.js");
	await fs.renameSync("results/index.js.map", "results/parcel.js.map");
	sizes.parcel = fs.statSync('results/parcel.js').size;
	console.log(`parcel: ${pb(sizes.parcel)}`);

	await exec('npx esbuild --format=esm --outfile=results/esbuild.js --bundle --minify index.js');
	sizes.esbuild = fs.statSync('results/esbuild.js').size;
	console.log(`esbuild: ${pb(sizes.esbuild)}`);

	const max_size = Math.max(...Object.values(sizes));

	const results = `
|         | output size                                           |
|---------|-------------------------------------------------------|
| rollup  | ${bar(sizes.rollup / max_size)} ${pb(sizes.rollup)}   |
| webpack | ${bar(sizes.webpack / max_size)} ${pb(sizes.webpack)} |
| parcel  | ${bar(sizes.parcel / max_size)} ${pb(sizes.parcel)}   |
| esbuild  | ${bar(sizes.esbuild / max_size)} ${pb(sizes.esbuild)}   |
`.trim();

	const README = fs.readFileSync('README.md', 'utf-8').replace(/<!-- START -->[\s\S]+<!-- END -->/m, `<!-- START -->\n${results}\n<!-- END -->`);
	fs.writeFileSync('README.md', README);

	console.log(`wrote results to README.md`);
}

main();
