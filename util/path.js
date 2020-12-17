// const rootDir = require('../util/path');
// 使用 res.sendFile(path.join(rootDir,'views','shop.html'));
// 使用 res.status(404).sendFile(path.join(__dirname,'views','404.html'));
// 使用 res.sendFile(path.join(rootDir,'views','add-product.html'));

const path = require('path');

module.exports = path.dirname(require.main.filename);