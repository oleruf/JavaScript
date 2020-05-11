const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const isProd = process.env.NODE_ENV === 'production'
const isDev = !isProd

const filename = (ext) => (isDev ? `bandle.${ext}` : `bandle.[hash].${ext}`)

const jsLoader = () => {
  const loaders = [
    {
      loader: 'babel-loader',
      options: {
        presets: ['@babel/preset-env'],
        plugins: ['@babel/plugin-proposal-class-properties'],
      },
    },
  ]
  if (isDev) {
    loaders.push('eslint-loader')
  }
  return loaders
}
module.exports = {
  context: path.resolve(__dirname, 'src'),
  mode: 'development',
  entry: ['@babel/polyfill', './index.js'],

  output: {
    // Вызываем функцию которая в зависимости от текущего режима разработки
    // включает или отключает hash в названии файла
    filename: filename('js'),

    // Путь - куда переном файл
    path: path.resolve(__dirname, 'dist'),
  },

  resolve: {
    extensions: ['.js'],
    // setting short path
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@core': path.resolve(__dirname, 'src/core'),
    },
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: 'index.html',
      minify: {
        // В зависимости от режима разработки удаляем комментарии или нет
        removeComments: isProd,
        // В зависимости от режима разработки минифицируем файл или нет
        collapseWhitespace: isProd,
      },
    }),
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      // Вызываем функцию которая в зависимости от текущего режима разработки
      // включает или отключает hash в названии файла
      filename: filename('css'),
    }),
    new CopyPlugin([
      {
        from: path.resolve(__dirname, 'src/favicon.ico'),
        to: path.resolve(__dirname, 'dist'),
      },
    ]),
  ],

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: jsLoader(),
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          {
            // Creates `style` nodes from JS strings
            // 'style-loader',
            loader: MiniCssExtractPlugin.loader,
            options: {
              hmr: isDev,
              reloadAll: true,
            },
          },
          // Translates CSS into CommonJS
          'css-loader',
          // Compiles Sass to CSS
          'sass-loader',
        ],
      },
    ],
  },

  // Если режим разработки включаем source-map в противном случае нет
  devtool: isDev ? 'source-map' : false,

  devServer: {
    port: 3000,
    hot: isDev,
  },
}
