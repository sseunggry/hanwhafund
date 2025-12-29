// $(document).ready(function () {
//   /**
//    * HTML 문자열을 2-space 들여쓰기로 포맷팅하는 함수 (수정된 버전)
//    * @param {string} html - 원본 HTML 문자열
//    * @param {string} [indentString='  '] - 들여쓰기에 사용할 문자(열)
//    * @returns {string} - 포맷팅된 HTML 문자열
//    */
//   function formatHtml(html, indentString = '  ') {
//     let indentLevel = 0;
//     let formatted = '';
//     // HTML5에서 사용되는 대표적인 단일 태그(Void Elements) 목록
//     const voidElements = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr']);

//     // 1. [핵심 수정] 모든 태그 앞뒤로 줄바꿈을 추가하여 태그와 텍스트를 완전히 분리
//     const lines = html
//       .trim()
//       .replace(/</g, '\n<')  // 모든 '<' 태그 앞에 줄바꿈 추가
//       .replace(/>/g, '>\n'); // 모든 '>' 태그 뒤에 줄바꿈 추가

//     // 2. 줄바꿈으로 분리하여 각 라인을 처리
//     lines.split('\n').forEach(line => {
//       const trimmedLine = line.trim();
//       if (!trimmedLine) return; // 빈 줄(공백) 무시

//       const tagName = (trimmedLine.match(/<([^\s>]+)/) || [])[1];

//       // 3. 닫는 태그: 들여쓰기 레벨을 "먼저" 감소
//       if (trimmedLine.startsWith('</')) {
//         indentLevel--;
//       }

//       // 4. 현재 라인 추가 (현재 indentLevel 적용)
//       // 음수 indentLevel 방지
//       formatted += indentString.repeat(Math.max(0, indentLevel)) + trimmedLine + '\n';

//       // 5. 여는 태그: 들여쓰기 레벨 증가 (단, 닫는 태그, 주석, void 태그 제외)
//       if (trimmedLine.startsWith('<') &&
//           !trimmedLine.startsWith('</') &&      // 닫는 태그 아님
//           !trimmedLine.startsWith('<!') &&      // 주석/DOCTYPE 아님
//           !trimmedLine.endsWith('/>') &&        // 명시적 셀프클로징 아님
//           !voidElements.has(tagName)          // void element 아님
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

//     // 1. 수정된 formatHtml 함수를 호출하여 코드를 예쁘게 정렬
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
   * HTML 문자열을 2-space 들여쓰기로 포맷팅하는 함수 (인라인 요소 한 줄 처리 버전)
   * @param {string} html - 원본 HTML 문자열
   * @param {string} [indentString='  '] - 들여쓰기에 사용할 문자(열)
   * @returns {string} - 포맷팅된 HTML 문자열
   */
  function formatHtml(html, indentString = '  ') {
    let indentLevel = 0;
    let formatted = '';

    // HTML5 단일 태그 (Void Elements)
    const voidElements = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr']);
    
    // [수정] 한 줄로 처리할 인라인(또는 유사 인라인) 태그 목록
    // 필요에 따라 'a', 'strong', 'em' 등을 추가할 수 있습니다.
    const inlineElements = new Set(['span', 'p', 'a', 'strong', 'em', 'b', 'i', 'code']);

    //  정규식을 사용하여 HTML을 태그와 텍스트 노드로 "토큰화"
    const tokens = html.trim().match(/(<[^>]+>|[^<]+)/g) || [];

    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i].trim();
      if (!token) continue;

      const isTag = token.startsWith('<');
      
      // --- 1. 텍스트 노드 처리 ---
      if (!isTag) {
        // 텍스트 노드는 단순히 들여쓰기 후 추가
        formatted += indentString.repeat(Math.max(0, indentLevel)) + token + '\n';
        continue;
      }

      // --- 2. 태그 노드 처리 ---
      const tagNameMatch = token.match(/<([^\s>]+)/);
      const tagName = tagNameMatch ? tagNameMatch[1] : null;
      const isClosingTag = token.startsWith('</');
      const isVoid = voidElements.has(tagName) || token.endsWith('/>');

      // 인라인 "한 줄" 처리 로직
      let isSimpleInline = false;
      if (!isClosingTag && !isVoid && inlineElements.has(tagName)) {
        const nextToken = (tokens[i + 1] || "").trim();
        const afterNextToken = (tokens[i + 2] || "").trim();

        // (다음 토큰이 텍스트) 이고 (그다음 토큰이 짝이 맞는 닫는 태그) 이면
        if (nextToken && !nextToken.startsWith('<') &&
            afterNextToken && afterNextToken === `</${tagName}>`) {
          isSimpleInline = true;
        }
      }

      // --- 3. 출력 및 들여쓰기 적용 ---

      // 3a. 닫는 태그는 먼저 들여쓰기 감소
      if (isClosingTag) {
        indentLevel--;
      }

      // 3b. 현재 들여쓰기 적용
      formatted += indentString.repeat(Math.max(0, indentLevel));

      // 3c. "단순 인라인" 패턴 처리
      if (isSimpleInline) {
        formatted += token + tokens[i + 1].trim() + tokens[i + 2].trim() + '\n';
        i += 2; 
      } 
      // 3d. "일반" 태그 처리
      else {
        formatted += token + '\n';
        if (!isClosingTag && !isVoid) {
          indentLevel++;
        }
      }
    }
    return formatted.trim();
  }

  // --- 렌더링 후 지저분한 HTML 공백을 정리하는 기능 ---
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