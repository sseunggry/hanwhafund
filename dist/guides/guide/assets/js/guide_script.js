$(document).ready(function () {
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