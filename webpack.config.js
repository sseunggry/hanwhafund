const path = require('path');
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
  // scssEntries[name] = `./${file.replace(/^\.\//, '')}`;
	scssEntries[name] = path.resolve(__dirname, file);
});

const htmlPages = glob.sync('./src/pages/**/*.html');

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
		assetModuleFilename: (pathData) => {
      const filepath = path.dirname(pathData.filename).split('/').slice(1).join('/');
      return `${filepath}/[name][ext]`; // 예: src/assets/images/logo.png -> assets/images/logo.png
    },
  },
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
								// urlFilter: (attribute, value, resourcePath) => {
								// 	if (/\.(css|js)$/.test(value)) {
								// 		return false;
								// 	}
								// 	return true;
								// },
								urlFilter: (attribute, value) => !/\.(css|js)$/.test(value),
							},
							minimize: false,
							esModule: false,
							// attributes: false
            }
          },
					// {
					// 	loader: 'ejs-plain-loader',
					// 	options: {
					// 		async: true, // 비동기 지원 (optional)
					// 	}
					// }
          'ejs-plain-loader', // EJS를 순수 HTML로 변환
					// {
					// 	loader: 'ejs-plain-loader',
					// 	options: {
					// 		locals: {
					// 			// 모든 EJS 템플릿에 공통으로 적용될 변수
					// 			projectName: 'hwf',
					// 		}
					// 	}
					// }
        ]
      },
      {
        test: /\.scss$/,
        use: [
          // MiniCssExtractPlugin.loader,  // CSS 파일로 분리
					'style-loader',
          'css-loader',
          'sass-loader'
        ],
      },
			{
        test: /\.(png|jpe?g|gif|svg)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'assets/images/[name][ext]', // 이미지 파일 경로 지정
        },
      },
      {
        test: /\.(woff2?|ttf|eot|otf)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'assets/fonts/[name][ext]', // 폰트 파일 경로 지정
        },
      },
    ],
  },
  plugins: [
		new RemoveEmptyScriptsPlugin(),
    // new MiniCssExtractPlugin({
    //   filename: 'assets/css/[name].css',
    // }),
    // HTML로 생성
    ...htmlPages.map((file) => {
      const name = path.basename(file, '.html');
      return new HtmlWebpackPlugin({
        template: file,
        filename: `html/${name}.html`, // dist/pages/ 폴더 내에 출력
        inject: true,
				chunks: 'all',
        minify: false,
				// templateParameters: {
				// 	projectName: 'hwf',
				// },	
      });
    }),
    // img, fonts, js 폴더 그대로 복사 (src/assets -> dist/assets)
    new CopyWebpackPlugin({
      patterns: [
				{ from: 'src/assets/js', to: 'assets/js', noErrorOnMissing: true },
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
    open: ['/html/index.html'],
    hot: true,
		liveReload: true,
		// watchFiles: ['src/**/*'],
		watchFiles: ['src/**/*.{js,scss,html,ejs}'],
  },
  mode: isProduction ? 'production' : 'development',  // mode: 'development', // 배포시 'production'으로 변경
};