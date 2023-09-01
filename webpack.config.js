const path = require('path');

module.exports = {
  mode: "development",
  entry: './src/entry.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist/webpack'),
  },
  optimization: {
    minimize: false,
    concatenateModules: false
  },
  // devtools: ""
};