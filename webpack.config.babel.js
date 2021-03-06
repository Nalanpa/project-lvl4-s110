import path from 'path';
import webpack from 'webpack';
import autoprefixer from 'autoprefixer';

export default () => ({
  entry: {
    app: ['./client'],
    vendor: ['babel-polyfill', 'jquery', 'jquery-ujs', 'bootstrap'],
  },
  output: {
    path: path.join(__dirname, 'public', 'assets'),
    filename: 'application.js',
    publicPath: '/assets/',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
      {
        test: /\.css$/,
        use: [
          { loader: 'style-loader' },
          { loader: 'css-loader' },
          {
            loader: 'postcss-loader',
            options: {
              plugins: () => [autoprefixer],
            },
          },
        ],
      },
      {
        test: /\.pug$/,
        loaders: [
          'html-loader',
          'pug-html-loader?{"pretty":true,"exports":false}',
        ],
        include: ['./client/icons'],
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        use: [
          'file-loader?name=[name].[ext]',
          // {
          //   loader: 'img-loader',
          //   options: {
          //     enabled: process.env.NODE_ENV === 'production',
          //     gifsicle: {
          //       interlaced: false,
          //     },
          //     mozjpeg: {
          //       progressive: true,
          //       arithmetic: false,
          //     },
          //     optipng: false,
          //     pngquant: {
          //       floyd: 0.5,
          //       speed: 2,
          //     },
          //     svgo: {
          //       plugins: [
          //         { removeTitle: true },
          //         { convertPathData: false },
          //       ],
          //     },
          //   },
          // },
        ],
      },
    ],
  },
  plugins: [
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery',
    }),
    new webpack.optimize.CommonsChunkPlugin({
      // This name 'vendor' ties into the entry definition
      name: 'vendor',
      // We don't want the default vendor.js name
      filename: 'vendor.js',
      // Passing Infinity just creates the commons chunk, but moves no modules into it.
      // In other words, we only put what's in the vendor entry definition in vendor-bundle.js
      minChunks: Infinity,
    }),
  ],
});
