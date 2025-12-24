const path = require('path');
const fs = require('fs');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const glob = require('glob');
const RemoveEmptyScriptsPlugin = require('webpack-remove-empty-scripts');

const isProduction = process.env.NODE_ENV === 'production';

// 🔍 SCSS 엔트리 자동 수집
const scssEntries = {};
glob.sync('./src/assets/scss/*.scss').forEach((file) => {
  const name = path.basename(file, '.scss');
  scssEntries[name] = `./${file.replace(/^\.\//, '')}`;
	// scssEntries[name] = path.resolve(__dirname, file);
});

// const htmlPages = glob.sync('./src/pages/**/*.html');
const allHtmlPages = glob.sync('./src/{pages,guides}/**/*.html');
const generateConfig = (outputPath, publicPathVal, isRelative) => {
  return {
    entry: {
      ...scssEntries,
    },
    output: {
      path: outputPath,
      filename: 'assets/js/[name].js',
      publicPath: isRelative ? 'auto' : publicPathVal,
      clean: true, 
      assetModuleFilename: (pathData) => {
        const filepath = path.dirname(pathData.filename);
        const relativePath = path.relative(path.resolve(__dirname, 'src'), filepath);
        const normalizedPath = relativePath.replace(/\\/g, '/');
        return `${normalizedPath}/[name][ext]`;
      },
    },
    devtool: isProduction ? false : 'source-map',
    target: 'web',
    module: {
      rules: [
        {
          test: /\.(ejs|html)$/,
          use: [
            {
              loader: 'html-loader',
              options: {
                sources: {
                  urlFilter: (attribute, value) => !/\.(css|js)$/.test(value),
                },
                minimize: false,
                esModule: false,
              }
            },
            'ejs-plain-loader',
          ]
					// use: [
          //   {
          //     loader: 'ejs-compiled-loader',
          //     options: {
          //       htmlmin: false, // 압축 여부 (개발 중엔 false 추천)
          //       // compileDebug: true,
          //     }
          //   }
          // ]
        },
        {
          test: /\.scss$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
              options: isRelative ? { publicPath: '../../' } : {} 
            },
            {
              loader: 'css-loader',
              options: { sourceMap: true }
            },
            {
              loader: 'postcss-loader',
              options: { sourceMap: true }
            },
            {
              loader: 'sass-loader',
              options: { sourceMap: true }
            }
          ],
        },
        {
          test: /\.css$/i,
          use: ["style-loader", "css-loader", "postcss-loader"],
        },
        {
          test: /\.(png|jpe?g|gif|svg)$/i,
          type: 'asset/resource',
        },
        {
          test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
          type: 'asset/resource',
        },
        {
          test: /\.(woff2?|ttf|eot|otf)$/i,
          type: 'asset/resource',
        },
      ],
    },
    plugins: [
      new RemoveEmptyScriptsPlugin(),
      new MiniCssExtractPlugin({
        filename: 'assets/css/[name].css'
      }),
      // HTML 생성
      ...allHtmlPages.map((file) => {
        const relativePath = path.relative(path.resolve(__dirname, 'src'), file);
        let outputFilename = relativePath;

        if (relativePath.startsWith('pages' + path.sep)) {
          outputFilename = relativePath.replace('pages', 'html');
        }

				let rootPath = '';
        if (isRelative) {
          rootPath = path.relative(path.dirname(outputFilename), '.');
          rootPath = rootPath.replace(/\\/g, '/');
          
          if (rootPath !== '') {
            rootPath += '/';
          }
        } else {
          rootPath = '/';
        }

        return new HtmlWebpackPlugin({
          template: file,
          filename: outputFilename,
          inject: true,
          chunks: 'all',
          minify: isProduction ? {
            collapseWhitespace: false,
            keepClosingSlash: true,
          } : false,
          templateParameters: {
            fs: require('fs'),
            path: require('path'),
            __dirname: path.dirname(file),
						rootPath: rootPath,
          }
        });
      }),
      new CopyWebpackPlugin({
        patterns: [
          { from: 'src/assets/js', to: 'assets/js', noErrorOnMissing: true },
          { from: 'src/assets/css', to: 'assets/css', noErrorOnMissing: true },
          { from: 'src/guides/guide/assets',  to: 'guides/guide/assets', noErrorOnMissing: true },
          { from: 'src/guides/list',  to: 'guides/list', noErrorOnMissing: true },
        ],
      }),
    ],
    optimization: {
      minimize: false,
      minimizer: [
        new TerserPlugin({
          extractComments: false,
        }),
      ],
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
      extensions: ['.js', '.json', '.scss', '.pug'],
    },
    devServer: {
      static: {
        directory: outputPath, 
      },
      port: isRelative ? 4001 : 4000,
      open: isRelative ? false : ['/guides/index.html'],
      hot: true,
      liveReload: true,
      watchFiles: ['src/**/*.{js,scss,html,ejs}'],
    },
    mode: isProduction ? 'production' : 'development',
  };
};

const configDist = generateConfig(path.resolve(__dirname, 'dist'), '', true);
const configDev = generateConfig(path.resolve(__dirname, 'dist_dev'), '/', false);

module.exports = isProduction ? [configDist, configDev] : configDev;