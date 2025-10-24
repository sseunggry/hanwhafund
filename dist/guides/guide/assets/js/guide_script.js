// $(document).ready(function () {
  
//   // --- EJS 렌더링 후 지저분한 HTML 공백을 정리하는 기능 ---
//   $(".hls_preview").each(function () {
//     const $preview = $(this);
//     const $group = $preview.closest('.group');
//     const $targetCodeBlock = $group.find(".hls.language-html").eq(0);
    
//     let previewHtml = $preview.html();
//     if (!previewHtml || !$targetCodeBlock.length) return;

//     // 1. 렌더링된 HTML의 앞/뒤 공백 및 줄바꿈을 모두 제거
//     previewHtml = previewHtml.trim(); 

//     const lines = previewHtml.split('\n');
//     let minIndent = Infinity; // 최소 들여쓰기 값

//     // 2. 가장 적게 들여쓰기 된 라인의 공백 수(minIndent)를 찾음
//     // (단, 비어있는 줄은 무시)
//     lines.forEach(line => {
//       const trimmedLine = line.trim();
//       if (trimmedLine !== '') { // 빈 줄이 아닐 때만
//         const currentIndent = (line.match(/^\s*/) || [''])[0].length;
//         if (currentIndent < minIndent) {
//           minIndent = currentIndent;
//         }
//       }
//     });

//     // 3. (안전장치) 만약 모든 줄이 비어있었다면, minIndent는 0
//     if (minIndent === Infinity) {
//       minIndent = 0;
//     }

//     let finalCode = '';

//     // 4. 모든 라인에서 minIndent만큼의 공백을 제거
//     finalCode = lines.map(line => {
//         // 빈 줄은 그대로 두고, 나머지 줄은 들여쓰기 제거
//         return line.trim() === '' ? '' : line.substring(minIndent);
//         // return line.substring(minIndent);
//       })
//       .join('\n')
//       .replace(/=""/g, ''); // 불필요한 빈 속성 제거

//     // 5. <pre><code> 태그에 정리된 코드를 텍스트로 삽입
//     $targetCodeBlock.text(finalCode);

//     // 6. Prism.js 하이라이팅
//     if (typeof Prism !== 'undefined' && typeof Prism.highlightElement === 'function') {
//       try {
//         Prism.highlightElement($targetCodeBlock.get(0));
//       } catch (e) {
//         console.warn("Prism.js highlighting failed.", e);
//       }
//     }
//   });

//   // --- 코드 토글 버튼 기능 (유지) ---
//   $(".btn-code-toggle").on("click", function () {
//     const $button = $(this);
//     const $group = $button.closest('.group');
//     const $codeWrap = $group.find('.hls-wrap');

//     if ($codeWrap.length) {
//       $codeWrap.toggleClass('is-fold');
      
//       const isFolded = $codeWrap.hasClass('is-fold');
//       $button.find('span').text(isFolded ? 'View Code' : 'Hide Code');
//     }
//   });

// });

// guide_script.js

// $(document).ready(function () {
//   /**
//    * HTML 문자열을 2-space 들여쓰기로 포맷팅하는 함수
//    * @param {string} html - 원본 HTML 문자열
//    * @param {string} [indentString='  '] - 들여쓰기에 사용할 문자(열)
//    * @returns {string} - 포맷팅된 HTML 문자열
//    */
//   function formatHtml(html, indentString = '  ') {
//     let indentLevel = 0;
//     let formatted = '';
//     // HTML5에서 사용되는 대표적인 단일 태그(Void Elements) 목록
//     const voidElements = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr']);

//     // 1. 태그 사이의 공백을 표준화하고, 태그별로 라인을 분리합니다.
//     const lines = html
//       .trim()
//       .replace(/>\s+</g, '><') // 태그 사이 공백 제거
//       .replace(/(>)(<)/g, '$1\n$2') // 태그-태그 사이에 줄바꿈 삽입
//       .split('\n'); // 줄바꿈으로 분리

//     lines.forEach(line => {
//       const trimmedLine = line.trim();
//       if (!trimmedLine) return; // 빈 줄 무시

//       // 태그 이름 추출 (예: <div class) -> "div"
//       const tagName = (trimmedLine.match(/<([^\s>]+)/) || [])[1];

//       // 2. 닫는 태그: 들여쓰기 레벨을 "먼저" 감소
//       // (예외: <p>Hello</p> 처럼 한 줄에 여닫는 태그가 모두 있는 경우는 제외)
//       if (trimmedLine.startsWith('</') && !(trimmedLine.startsWith('<') && trimmedLine.includes('</'))) {
//         indentLevel--;
//       }

//       // 3. 현재 라인 추가 (현재 indentLevel 적용)
//       // 음수 indentLevel 방지
//       formatted += indentString.repeat(Math.max(0, indentLevel)) + trimmedLine + '\n';

//       // 4. 여는 태그: 들여쓰기 레벨 증가
//       // (단, 닫는 태그, 주석, void 태그, 셀프 클로징 태그, 한 줄에 여닫는 태그가 모두 있는 경우는 제외)
//       if (trimmedLine.startsWith('<') &&
//           !trimmedLine.startsWith('</') &&      // 닫는 태그 아님
//           !trimmedLine.startsWith('<!') &&      // 주석/DOCTYPE 아님
//           !trimmedLine.endsWith('/>') &&        // 명시적 셀프클로징 아님
//           !voidElements.has(tagName) &&         // void element 아님
//           !(trimmedLine.includes('</') && trimmedLine.match(/<.*>/g).length > 1) // <p>text</p> 같은 라인 아님
//          ) {
//         indentLevel++;
//       }
//     });

//     return formatted.trim(); // 마지막 줄바꿈 제거
//   }

//   // --- EJS 렌더링 후 지저분한 HTML 공백을 정리하는 기능 ---
//   $(".hls_preview").each(function () {
//     const $preview = $(this);
//     const $group = $preview.closest('.group');
//     const $targetCodeBlock = $group.find(".hls.language-html").eq(0);

//     let previewHtml = $preview.html();
//     if (!previewHtml || !$targetCodeBlock.length) return;

//     // 1. [수정됨] 완성된 formatHtml 함수를 호출하여 코드를 예쁘게 정렬합니다.
//     let finalCode = formatHtml(previewHtml);

//     // 2. 불필요한 빈 속성 제거 (선택 사항)
//     finalCode = finalCode.replace(/=""/g, '');

//     // 3. <pre><code> 태그에 정리된 코드를 텍스트로 삽입
//     $targetCodeBlock.text(finalCode);

//     // 4. Prism.js 하이라이팅
//     if (typeof Prism !== 'undefined' && typeof Prism.highlightElement === 'function') {
//       try {
//         Prism.highlightElement($targetCodeBlock.get(0));
//       } catch (e) {
//         console.warn("Prism.js highlighting failed.", e);
//       }
//     }
//   });

//   // --- 코드 토글 버튼 기능 (유지) ---
//   $(".btn-code-toggle").on("click", function () {
//     const $button = $(this);
//     const $group = $button.closest('.group');
//     const $codeWrap = $group.find('.hls-wrap');

//     if ($codeWrap.length) {
//       $codeWrap.toggleClass('is-fold');

//       const isFolded = $codeWrap.hasClass('is-fold');
//       $button.find('span').text(isFolded ? 'View Code' : 'Hide Code');
//     }
//   });
// });

$(document).ready(function () {
  /**
   * HTML 문자열을 2-space 들여쓰기로 포맷팅하는 함수 (수정된 버전)
   * @param {string} html - 원본 HTML 문자열
   * @param {string} [indentString='  '] - 들여쓰기에 사용할 문자(열)
   * @returns {string} - 포맷팅된 HTML 문자열
   */
  function formatHtml(html, indentString = '  ') {
    let indentLevel = 0;
    let formatted = '';
    // HTML5에서 사용되는 대표적인 단일 태그(Void Elements) 목록
    const voidElements = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr']);

    // 1. [핵심 수정] 모든 태그 앞뒤로 줄바꿈을 추가하여 태그와 텍스트를 완전히 분리
    const lines = html
      .trim()
      .replace(/</g, '\n<')  // 모든 '<' 태그 앞에 줄바꿈 추가
      .replace(/>/g, '>\n'); // 모든 '>' 태그 뒤에 줄바꿈 추가

    // 2. 줄바꿈으로 분리하여 각 라인을 처리
    lines.split('\n').forEach(line => {
      const trimmedLine = line.trim();
      if (!trimmedLine) return; // 빈 줄(공백) 무시

      const tagName = (trimmedLine.match(/<([^\s>]+)/) || [])[1];

      // 3. 닫는 태그: 들여쓰기 레벨을 "먼저" 감소
      if (trimmedLine.startsWith('</')) {
        indentLevel--;
      }

      // 4. 현재 라인 추가 (현재 indentLevel 적용)
      // 음수 indentLevel 방지
      formatted += indentString.repeat(Math.max(0, indentLevel)) + trimmedLine + '\n';

      // 5. 여는 태그: 들여쓰기 레벨 증가 (단, 닫는 태그, 주석, void 태그 제외)
      if (trimmedLine.startsWith('<') &&
          !trimmedLine.startsWith('</') &&      // 닫는 태그 아님
          !trimmedLine.startsWith('<!') &&      // 주석/DOCTYPE 아님
          !trimmedLine.endsWith('/>') &&        // 명시적 셀프클로징 아님
          !voidElements.has(tagName)          // void element 아님
         ) {
        indentLevel++;
      }
    });

    return formatted.trim(); // 마지막 줄바꿈 제거
  }

  // --- EJS 렌더링 후 지저분한 HTML 공백을 정리하는 기능 ---
  $(".hls_preview").each(function () {
    const $preview = $(this);
    const $group = $preview.closest('.group');
    const $targetCodeBlock = $group.find(".hls.language-html").eq(0);

    let previewHtml = $preview.html();
    if (!previewHtml || !$targetCodeBlock.length) return;

    // 1. 수정된 formatHtml 함수를 호출하여 코드를 예쁘게 정렬
    let finalCode = formatHtml(previewHtml);

    // 2. 불필요한 빈 속성 제거 (선택 사항)
    finalCode = finalCode.replace(/=""/g, '');

    // 3. <pre><code> 태그에 정리된 코드를 텍스트로 삽입
    $targetCodeBlock.text(finalCode);

    // 4. Prism.js 하이라이팅
    if (typeof Prism !== 'undefined' && typeof Prism.highlightElement === 'function') {
      try {
        Prism.highlightElement($targetCodeBlock.get(0));
      } catch (e) {
        console.warn("Prism.js highlighting failed.", e);
      }
    }
  });

  // --- 코드 토글 버튼 기능 (유지) ---
  $(".btn-code-toggle").on("click", function () {
    const $button = $(this);
    const $group = $button.closest('.group');
    const $codeWrap = $group.find('.hls-wrap');

    if ($codeWrap.length) {
      $codeWrap.toggleClass('is-fold');

      const isFolded = $codeWrap.hasClass('is-fold');
      $button.find('span').text(isFolded ? 'View Code' : 'Hide Code');
    }
  });
});