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

module.exports = {
  entry: {
		// main: './src/style.js',
		...scssEntries,
	},  // 실제 JS 엔트리 파일
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'assets/js/[name].js',
		publicPath: '/',
    clean: true,
		// assetModuleFilename: (pathData) => {
    //   const filepath = path.dirname(pathData.filename).split('/').slice(1).join('/');
    //   return `${filepath}/[name][ext]`; // 예: src/assets/images/logo.png -> assets/images/logo.png
    // },
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
          'ejs-plain-loader', // EJS를 순수 HTML로 변환
        ]
      },
      {
        test: /\.scss$/,
        use: [
					MiniCssExtractPlugin.loader,
					// 'style-loader',
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
            }
          },
					{
						loader: 'postcss-loader',
						options: {
							sourceMap: true,
						}
					},
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
            }
          }
        ],
      },
			{
        test: /\.css$/i,
        use: [
          "style-loader",
          "css-loader",
          "postcss-loader",
        ],
      },
			{
        test: /\.(png|jpe?g|gif|svg)$/i,
        type: 'asset/resource',
        // generator: {
        //   filename: 'assets/images/[name][ext]', // 이미지 파일 경로 지정
        // },
      },
      {
        test: /\.(woff2?|ttf|eot|otf)$/i,
        type: 'asset/resource',
        // generator: {
				// 	filename: (pathData) => {
        //     const filepath = path.dirname(pathData.filename);
        //     const relativePath = path.relative(path.resolve(__dirname, 'src'), filepath);
        //     const normalizedPath = relativePath.replace(/\\/g, '/');
            
        //     return `${normalizedPath}/[name][ext]`;
        //   },
        //   // filename: 'assets/fonts/[name][ext]', // 폰트 파일 경로 지정
        // },
      },
    ],
  },
  plugins: [
		new RemoveEmptyScriptsPlugin(),
		new MiniCssExtractPlugin({
      filename: 'assets/css/[name].css'
    }),
    // HTML로 생성
    ...allHtmlPages.map((file) => {
      const relativePath = path.relative(path.resolve(__dirname, 'src'), file);
      let outputFilename = relativePath;

      if (relativePath.startsWith('pages' + path.sep)) {
        // const name = path.basename(file, '.html');
        // outputFilename = `html/${name}.html`;
				outputFilename = relativePath.replace('pages', 'html');
      }

      return new HtmlWebpackPlugin({
        template: file,
        filename: outputFilename, // 'html/index.html' 또는 'guides/resources/ele_badge.html'
        inject: true,
        chunks: 'all',
        // minify: false,
        minify: isProduction ? {
          collapseWhitespace: false, // 핵심: 공백과 줄바꿈을 제거합니다.
          keepClosingSlash: true,
          // removeComments: true,     // 주석을 제거합니다.
          // minifyJS: true,
          // minifyCSS: true,
        } : false,
        templateParameters: {
          fs: require('fs'),
          path: require('path'),
          __dirname: path.dirname(file),
        }
      });
    }),
    // img, fonts, js 폴더 그대로 복사 (src/assets -> dist/assets)
    new CopyWebpackPlugin({
      patterns: [
				{ from: 'src/assets/js', to: 'assets/js', noErrorOnMissing: true },
				{ from: 'src/assets/css', to: 'assets/css', noErrorOnMissing: true },
				{ from: 'src/guides/guide/assets',  to: 'guides/guide/assets', noErrorOnMissing: true },
				{ from: 'src/guides/list',  to: 'guides/list', noErrorOnMissing: true },
        // { from: 'src/assets/images', to: 'assets/images', noErrorOnMissing: true },
        // { from: 'src/assets/fonts', to: 'assets/fonts',  noErrorOnMissing: true },
      ],
    }),
  ],
	optimization: {
    minimize: false,
    minimizer: [
      new TerserPlugin({
        extractComments: false, // 라이선스 파일 추출 비활성화
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
      directory: path.resolve(__dirname, 'dist'),
    },
    port: 4000,
    // open: ['/html/index.html'],
    open: ['/guides/index.html'],
    hot: true,
		liveReload: true,
		// watchFiles: ['src/**/*'],
		watchFiles: ['src/**/*.{js,scss,html,ejs}'],
  },
  mode: isProduction ? 'production' : 'development',  // mode: 'development', // 배포시 'production'으로 변경
};