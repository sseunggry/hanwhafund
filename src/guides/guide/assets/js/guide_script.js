$(document).ready(function () {
	//코드 프리뷰(`.hls_preview`) 내용을 코드 블록(`.hls`)에 복사하고 하이라이팅하는 기능
	$(".hls_preview").each(function (index) {
		const previewHtml = $(this).html(); // Preview 영역의 내부 HTML 가져오기
		const $targetCodeBlock = $(".hls").eq(index); // 코드를 표시할 해당 code 태그 찾기

		if (previewHtml && $targetCodeBlock.length > 0) {
			const lines = previewHtml.split('\n');
			let minIndent = null;

			// 최소 들여쓰기 찾기
			lines.forEach(line => {
				if (line.trim() !== '') {
					const currentIndent = (line.match(/^\s*/) || [''])[0].length;
					if (minIndent === null || currentIndent < minIndent) {
						minIndent = currentIndent;
					}
				}
			});

			// 최소 들여쓰기만큼 제거하고 앞뒤 공백/빈 속성 제거
			const finalCode = lines.map(line => {
				if (line.trim() === '') return ''; // 빈 줄은 비우기
				return (minIndent !== null && minIndent >= 0) ? line.substring(minIndent) : line;
			})
				.join('\n') // 줄바꿈으로 합치기
				.trim()     // 앞뒤 공백 제거
				.replace(/=""/g, ''); // 빈 속성 제거

			// 코드를 code 태그 안에 텍스트로 삽입 (HTML 이스케이프 처리됨)
			$targetCodeBlock.text(finalCode);

			// --- Prism.js 하이라이팅 실행 ---
			if (typeof Prism !== 'undefined' && typeof Prism.highlightElement === 'function') {
				try {
					Prism.highlightElement($targetCodeBlock.get(0));
				} catch (e) {
					console.error(`Prism.highlightElement failed for block ${index}:`, e);
				}
			} else if (index === 0) { // 경고는 한 번만 출력
				console.warn("Prism.js or Prism.highlightElement function not found.");
			}
		} else {
			if (index === 0) { // 경고는 한 번만 출력
				console.warn("Could not find matching .hls_preview or .hls elements for code highlighting.");
			}
		}
	});

	// --- 기존 폴드 버튼 기능 (유지) ---
	$(".btn[data-btn='fold']").bind("click", function () {
		$(this).closest("div.btn-wrap").next(".fui-src-fold").toggleClass("is-fold");
	});

});