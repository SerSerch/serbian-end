const path = require('path'),
  fs = require('fs'),
  HTMLplugin = require('html-webpack-plugin'),
  MiniCssExtractPlugin = require('mini-css-extract-plugin'),
  UglifyJsPlugin = require('uglifyjs-webpack-plugin'),
  OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const isDevelopment = process.env.NODE_ENV === 'development';
const PAGES_DIR = path.join(__dirname, 'src', 'pages');
const PAGES = fs.readdirSync(PAGES_DIR).filter(fileName => fileName.endsWith('.html'))

module.exports = {
  entry: {
    main: path.resolve(__dirname, 'src', 'index.js'),
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/',
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
      watch: true,
    },
    watchFiles: ['src/**/*'],
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.(svg|gif|png|jpe?g)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'img',
            }
          },
        ]
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          isDevelopment ? 'style-loader' : MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: {
              sourceMap: true,
            },
          },
          'postcss-loader',
          {
            loader: "sass-loader",
            options: {
              sourceMap: true,
            },
          },
        ],
      },
    ]
  },
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: true,
      }),
      new OptimizeCSSAssetsPlugin({}),
    ],
  },
  plugins: [
    ...PAGES.map(page => new HTMLplugin ({
      template: path.resolve(__dirname, 'src', 'pages', page),
      filename: `${page}`,
      minify: false,
      inject: false,
    })),
    new MiniCssExtractPlugin({
      filename: 'style.css',
    }),
  ],
};