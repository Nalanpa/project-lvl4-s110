import path from 'path';
import webpack from 'webpack';

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
        use: ['style-loader', 'css-loader', 'postcss-loader'],
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
      // {
      //   test: /\.(jpe?g|png|gif|svg)$/i,
      //   use: [
      //     'file-loader?name=[name].[ext]',
      //     'image-webpack-loader?{mozjpeg: {progressive: true,},gifsicle:
      // {interlaced: false,},optipng: {optimizationLevel: 4,},pngquant:
      // {quality: "75-90", speed: 3,},}',
      //   ],
      // },
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
