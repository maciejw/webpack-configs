'use strict';

const path = require('path');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const resolve = require('resolve');
const WebpackBar = require('webpackbar');
const PnpWebpackPlugin = require('pnp-webpack-plugin');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const InlineChunkHtmlPlugin = require('react-dev-utils/InlineChunkHtmlPlugin');
const TerserPlugin = require('terser-webpack-plugin');

const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const safePostCssParser = require('postcss-safe-parser');
const ManifestPlugin = require('webpack-manifest-plugin');
const InterpolateHtmlPlugin = require('react-dev-utils/InterpolateHtmlPlugin');
const WorkboxWebpackPlugin = require('workbox-webpack-plugin');
const ModuleScopePlugin = require('react-dev-utils/ModuleScopePlugin');

const ModuleNotFoundPlugin = require('react-dev-utils/ModuleNotFoundPlugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin-alt');
const typescriptFormatter = require('react-dev-utils/typescriptFormatter');

const paths = require('./config/paths');
const getClientEnvironment = require('./config/env');

const publicPath = paths.servedPath;
const shouldUseSourceMap = process.env.GENERATE_SOURCEMAP !== 'false';
const shouldInlineRuntimeChunk = process.env.INLINE_RUNTIME_CHUNK !== 'false';
const publicUrl = publicPath.slice(0, -1);
const env = getClientEnvironment(publicUrl);

if (env.stringified['process.env'].NODE_ENV !== '"production"') {
  throw new Error('Production builds must have NODE_ENV=production.');
}

const cssRegex = /\.global\.css$/;
const cssModuleRegex = /\.css$/;

const webcomponentsjs = './node_modules/@webcomponents/webcomponentsjs';

const loaderUtils = require('loader-utils');

function getCSSModuleLocalIdent(context, localIdentName, localName, options) {
  const fileNameOrFolder = context.resourcePath.match(/index\.(css)$/)
    ? '[folder]'
    : '[name]';

  const hash = loaderUtils.getHashDigest(
    context.resourcePath + localName,
    'md5',
    'base64',
    5,
  );

  const className = loaderUtils.interpolateName(
    context,
    fileNameOrFolder + '_' + localName + '__' + hash,
    options,
  );

  return className;
}

function getStyleLoaders(cssOptions, preProcessor) {
  const loaders = [
    {
      loader: MiniCssExtractPlugin.loader,
    },
    {
      loader: require.resolve('css-loader'),
      options: cssOptions,
    },
    {
      loader: require.resolve('postcss-loader'),
      options: {
        ident: 'postcss',
        plugins: () => [
          require('postcss-custom-properties')({
            customProperties: {},
          }),
          require('postcss-custom-media')({
            customMedia: {},
          }),
          require('postcss-import'),
          require('postcss-import'),
          require('postcss-flexbugs-fixes'),
          require('postcss-preset-env')({
            autoprefixer: {
              flexbox: 'no-2009',
            },
            stage: 3,
          }),
        ],
        sourceMap: shouldUseSourceMap,
      },
    },
    preProcessor && {
      loader: require.resolve(preProcessor),
      options: {
        sourceMap: shouldUseSourceMap,
      },
    },
  ].filter(Boolean);

  return loaders;
}

/** @type {import('webpack').Configuration} */
const config = {
  mode: env.raw.NODE_ENV,
  devtool: 'source-map',
  entry: path.resolve('./src/index.tsx'),
  resolve: {
    modules: [
      'node_modules',
      ...process.env.NODE_PATH.split(path.delimiter).filter(Boolean),
    ],
    extensions: paths.moduleFileExtensions.map(ext => `.${ext}`),
    plugins: [
      PnpWebpackPlugin,
      new ModuleScopePlugin(paths.appSrc, [paths.appPackageJson]),
    ],
  },
  resolveLoader: {
    plugins: [PnpWebpackPlugin.moduleLoader(module)],
  },
  module: {
    strictExportPresence: true,
    rules: [
      {
        test: /\.(ts|tsx)$/,
        enforce: 'pre',
        use: [
          {
            loader: require.resolve('tslint-loader'),
            options: {
              emitErrors: true,
              typecheck: false,
            },
          },
        ],
      },
      {
        oneOf: [
          {
            test: [/\.(bmp|gif|jpe?g|png)$/],
            loader: require.resolve('url-loader'),
            options: {
              limit: 10000,
              name: 'static/media/[name].[hash:8].[ext]',
            },
          },
          {
            test: /\.svg$/,
            use: [
              { loader: require.resolve('@svgr/webpack') },
              { loader: require.resolve('url-loader') },
            ],
          },
          {
            test: /\.(ts|tsx)$/,
            use: [
              { loader: require.resolve('cache-loader') },
              {
                loader: require.resolve('thread-loader'),
                options: {
                  // there should be 1 cpu for the fork-ts-checker-webpack-plugin
                  workers: require('os').cpus().length - 1,
                },
              },
              {
                loader: require.resolve('ts-loader'),
                options: {
                  transpileOnly: true,
                  happyPackMode: true,
                },
              },
              { loader: path.resolve(__dirname, './minify-lit-html-template') },
            ],
          },
          {
            test: /\.js$/,
            exclude: /node_modules\/(?!(@webcomponents\/shadycss|lit-html|@polymer)\/).*/,
            use: [
              { loader: require.resolve('cache-loader') },
              {
                loader: require.resolve('thread-loader'),
                options: {
                  // there should be 1 cpu for the fork-ts-checker-webpack-plugin
                  workers: require('os').cpus().length - 1,
                },
              },
              {
                loader: require.resolve('ts-loader'),
                options: {
                  transpileOnly: true,
                  happyPackMode: true,
                },
              },
            ],
          },
          {
            test: cssRegex,
            exclude: cssModuleRegex,
            loader: getStyleLoaders({
              importLoaders: 1,
              sourceMap: shouldUseSourceMap,
            }),
            sideEffects: true,
          },
          {
            test: cssModuleRegex,
            loader: getStyleLoaders({
              importLoaders: 1,
              sourceMap: shouldUseSourceMap,
              modules: true,
              camelCase: true,
              getLocalIdent: getCSSModuleLocalIdent,
            }),
          },
          {
            loader: require.resolve('file-loader'),
            exclude: [/\.(js|mjs|jsx|ts|tsx)$/, /\.html$/, /\.json$/],
            options: {
              name: 'static/media/[name].[hash:8].[ext]',
            },
          },
        ],
      },
    ],
  },
  output: {
    path: paths.appBuild,
    filename: 'static/js/[name].[chunkhash:8].js',
    chunkFilename: 'static/js/[name].[chunkhash:8].chunk.js',
    publicPath: publicPath,
    devtoolModuleFilenameTemplate: info =>
      path
        .relative(paths.appSrc, info.absoluteResourcePath)
        .replace(/\\/g, '/'),
  },
  plugins: [
    new CleanWebpackPlugin([paths.appBuild], { verbose: true }),
    new CopyWebpackPlugin([
      {
        from: path.resolve(`${webcomponentsjs}/webcomponents-*.{js,map}`),
        to: path.join(paths.appBuild, 'static/js/vendor'),
        flatten: true,
      },
      {
        from: path.resolve(`${webcomponentsjs}/bundles/*.{js,map}`),
        to: path.join(paths.appBuild, 'static/js/vendor/bundles'),
        flatten: true,
      },
      {
        from: path.resolve(`${webcomponentsjs}/custom-elements-es5-adapter.js`),
        to: path.join(paths.appBuild, 'static/js/vendor'),
        flatten: true,
      },
    ]),
    new WebpackBar({ profile: false }),
    new HtmlWebpackPlugin({
      inject: true,
      template: paths.appHtml,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true,
      },
    }),
    shouldInlineRuntimeChunk &&
      new InlineChunkHtmlPlugin(HtmlWebpackPlugin, [/runtime~.+[.]js/]),
    new InterpolateHtmlPlugin(HtmlWebpackPlugin, env.raw),
    new ModuleNotFoundPlugin(paths.appPath),
    new webpack.DefinePlugin(env.stringified),
    new MiniCssExtractPlugin({
      filename: 'static/css/[name].[contenthash:8].css',
      chunkFilename: 'static/css/[name].[contenthash:8].chunk.css',
    }),

    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),

    new ForkTsCheckerWebpackPlugin({
      typescript: resolve.sync('typescript', {
        basedir: paths.appNodeModules,
      }),
      async: false,
      checkSyntacticErrors: true,
      tsconfig: paths.appTsConfig,
      compilerOptions: {
        module: 'esnext',
        moduleResolution: 'node',
        resolveJsonModule: true,
        isolatedModules: false,
        noEmit: true,
        jsx: 'preserve',
      },
      reportFiles: [
        '**',
        '!**/*.json',
        '!**/__tests__/**',
        '!**/?(*.)(spec|test).*',
        '!src/setupProxy.js',
        '!src/setupTests.*',
      ],
      watch: paths.appSrc,
      silent: true,
      formatter: typescriptFormatter,
    }),
  ].filter(Boolean),
  optimization: {
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          parse: {
            // we want terser to parse ecma 8 code. However, we don't want it
            // to apply any minfication steps that turns valid ecma 5 code
            // into invalid ecma 5 code. This is why the 'compress' and 'output'
            // sections only apply transformations that are ecma 5 safe
            // https://github.com/facebook/create-react-app/pull/4234
            ecma: 8,
          },
          compress: {
            ecma: 5,
            warnings: false,
            // Disabled because of an issue with Uglify breaking seemingly valid code:
            // https://github.com/facebook/create-react-app/issues/2376
            // Pending further investigation:
            // https://github.com/mishoo/UglifyJS2/issues/2011
            comparisons: false,
            // Disabled because of an issue with Terser breaking valid code:
            // https://github.com/facebook/create-react-app/issues/5250
            // Pending futher investigation:
            // https://github.com/terser-js/terser/issues/120
            inline: 2,
          },
          mangle: {
            safari10: true,
          },
          output: {
            ecma: 5,
            comments: false,
            // Turned on because emoji and regex is not minified properly using default
            // https://github.com/facebook/create-react-app/issues/2488
            ascii_only: true,
          },
        },
        // Use multi-process parallel running to improve the build speed
        // Default number of concurrent runs: os.cpus().length - 1
        parallel: true,
        // Enable file caching
        cache: true,
        sourceMap: shouldUseSourceMap,
      }),
      new OptimizeCSSAssetsPlugin({
        cssProcessorOptions: {
          parser: safePostCssParser,
          map: shouldUseSourceMap
            ? {
                // `inline: false` forces the sourcemap to be output into a
                // separate file
                inline: false,
                // `annotation: true` appends the sourceMappingURL to the end of
                // the css file, helping the browser find the sourcemap
                annotation: true,
              }
            : false,
        },
      }),
    ],
    // Automatically split vendor and commons
    // https://twitter.com/wSokra/status/969633336732905474
    // https://medium.com/webpack/webpack-4-code-splitting-chunk-graph-and-the-splitchunks-optimization-be739a861366
    splitChunks: {
      chunks: 'all',
      name: true,
    },

    // Keep the runtime chunk seperated to enable long term caching
    // https://twitter.com/wSokra/status/969679223278505985
    runtimeChunk: true,
  },
  stats: 'minimal',
};

module.exports = config;
