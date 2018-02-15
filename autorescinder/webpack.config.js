module.exports = {
  entry: ['./index.js'],
  output: {
    filename: 'bundle.js',
  },
  target: 'node',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
    ],
  },
}
