// .prettierrc.js
module.exports = {
  // 전역 Prettier 설정
  htmlWhitespaceSensitivity: 'css',
  tabWidth: 2,
  useTabs: false,

  /**
   * 💡 바로 여기가 핵심입니다!
   * 사용할 플러그인 목록을 직접 지정하여,
   * Prettier가 자동으로 찾지 못하는 문제를 해결합니다.
   */
  plugins: ['prettier-plugin-ejs'],

  overrides: [
    {
      files: 'src/pages/**/*.html',
      options: {
        parser: 'ejs',
      },
    },
  ],
};