const babel = require('babel-core');
const types = require('babel-types');

const beeuiPlugin = require('./../lib/index.js');

const visitor = beeuiPlugin({types});

const code = `import { Select, Pagination } from '@dp/bee-ui';`;

const result = babel.transform(code, {
    plugins: [visitor]
});

console.log(result.code);