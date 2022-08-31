/*
 * @Author: CKJiang 
 * @Date: 2022-08-31 20:05:00 
 * @Last Modified by:   CkJiang 
 * @Last Modified time: 2022-08-31 20:05:00 
 */

var options = {
    mode: 'all',
    cjs: {
        cache: true,
        extensions: false,
        interop: false,
        namedExports: true,
        paths: true,
        vars: true
    },
    await: false
};
var esm = require('esm');

var server = esm(module, options)('../app.js');

server.start();
