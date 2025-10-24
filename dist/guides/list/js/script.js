const iaData = {
	init: () => {
		iaData.change();
		iaData.filterReset();
		iaData.selectRow();
		iaData.sort();
		iaData.option();
	},

	set: (tabId, dataObject) => {
		const $tableBodyContainer = $(`#${tabId} .data-body`);

		const tableStructure = `
      <table class="data-list">
        <caption class="sr-only">산출물 목록</caption>
        <colgroup>
          <col style="width: 5%;" />  
          <col style="width: 5%;" />  
          <col style="width: 4%;" />  
          <col style="width: 5%;" />  
          <col style="width: 11%;" /> 
          <col style="width: 11%;" /> 
          <col style="width: 4%;" />  
          <col style="width: auto;" />
          <col style="width: 5%;" /> 
          <col style="width: 11%;" /> 
          <col style="width: 4%;" />  
          <col style="width: 4%;" />  
          <col style="width: 20%;" /> 
        </colgroup>
        <thead>
          <tr>
            <th scope="col">생성일 <button type="button" class="data-sort">▼</button></th>
            <th scope="col">최종수정일 <button type="button" class="data-sort">▼</button></th>
            <th scope="col">category <button type="button" class="data-sort">▼</button></th>
            <th scope="col">Depth1 <button type="button" class="data-sort">▼</button></th>
            <th scope="col">Depth2 <button type="button" class="data-sort">▼</button></th>
            <th scope="col">Depth3 <button type="button" class="data-sort">▼</button></th>
            <th scope="col">페이지종류 <button type="button" class="data-sort">▼</button></th>
            <th scope="col">페이지명</th>
            <th scope="col">페이지ID</th>
            <th scope="col">링크</th>
            <th scope="col">관리자 <button type="button" class="data-sort">▼</button></th>
            <th scope="col">
              <select name="dataSortStatus" data-sort-name="status" title="진행상태">
                <option value="">상태</option>
              </select>
              <button type="button" class="data-sort">▼</button>
            </th>
            <th scope="col">메모 <button type="button" class="btn-memo-all">더보기</button></th>
          </tr>
        </thead>
        <tbody></tbody>
      </table>
    `;
		$tableBodyContainer.html(tableStructure);

		const $tbody = $(`#${tabId} .data-list tbody`);
		let tableRowsHTML = "";

		if (dataObject && dataObject.list && dataObject.list.length > 0) {
			$.each(dataObject.list, (index, item) => {
				let rowClass = "";
				if (item.status === "삭제") rowClass = "is-delete";

				let finalLink = item.link;
				if (!finalLink || finalLink === '#') {
					finalLink = item.pageID ? `../pages/${item.pageID}.html` : '-';
				}

				tableRowsHTML += `<tr class="${rowClass}">`;
				tableRowsHTML += `<td>${item.createDate || '-'}</td>`;
				tableRowsHTML += `<td>${item.modifyDate || '-'}</td>`;
				tableRowsHTML += `<td class="align-left">${item.category || '-'}</td>`;
				tableRowsHTML += `<td class="align-left">${item.depth1 || '-'}</td>`;
				tableRowsHTML += `<td class="align-left">${item.depth2 || '-'}</td>`;
				tableRowsHTML += `<td class="align-left">${item.depth3 || '-'}</td>`;
				tableRowsHTML += `<td>${item.pageType || '-'}</td>`;
				tableRowsHTML += `<td class="align-left">${item.pageName || '-'}</td>`;
				tableRowsHTML += `<td class="align-left">${item.pageID || '-'}</td>`;
				if (finalLink !== '-') {
					tableRowsHTML += `<td class="align-left"><a href="${finalLink}" target="_blank" title="새창열림">${finalLink}</a></td>`;
				} else {
					tableRowsHTML += `<td class="align-left">${finalLink}</td>`;
				}
				tableRowsHTML += `<td class="sort-admin">${item.isAdminLinked ? 'O' : 'X'}</td>`;
				tableRowsHTML += `<td class="sort-status">${item.status || '작업전'}</td>`;

				tableRowsHTML += `<td class="align-left">`;
				if (item.memo && item.memo.length > 0) {
					tableRowsHTML += `<ul class="note-list ${item.memo.length > 1 ? 'option-fold' : ''}">`;
					item.memo.forEach(function (memoItem) {
						tableRowsHTML += `<li>${memoItem.detail}</li>`;
					});
					tableRowsHTML += `</ul>`;
				}
				tableRowsHTML += `</td>`;
				tableRowsHTML += `</tr>`;
			});

			$tbody.html(tableRowsHTML);

			var $caption = $tableBodyContainer.find(".data-list caption");
			$caption.text(""); // 초기화
			$caption.each(function () {
				var hasThead = !!$(this).closest("table").find("> thead").length;
				var $th = $(this).closest("table").find("th");
				var thLength = $th.length;
				var i = 0;
				var captionText = "";
				if (hasThead) {
					$th = $(this).closest("table").find("> thead th");
					thLength = $th.length;
				}
				for (i = 0; i < thLength; i++) {
					const thText = $th.eq(i).clone().children('select, button').remove().end().text().trim();
					if (thText !== "") {
						captionText += thText;
					}
					if (i < thLength - 1) {
						captionText += ", ";
					}
				}
				$(this).text(captionText + " 정보입니다.");
			});

		} else {
			$tbody.html(`<tr class="nodata"><td colspan="12" class="align-center">데이터가 없습니다.</td></tr>`);
		}

		iaData.count(tabId);
		iaData.countAll(tabId);
	},

	option: () => {
		let statusOptions = "";
		$.each(
			[
				{ value: "작업전", text: "작업전" },
				{ value: "작업중", text: "작업중" },
				{ value: "완료", text: "완료" },
				{ value: "수정", text: "수정" },
				{ value: "삭제", text: "삭제" },
			],
			(idx, item) => {
				statusOptions += `<option value="${item.value}">${item.text}</option>`;
			}
		);
		$('.data-list thead select[data-sort-name="status"]').each(function () {
			if ($(this).find('option').length <= 1) { // 이미 옵션이 추가되지 않았다면
				$(this).append(statusOptions);
			}
		});
	},

	change: () => {
		$(document).on("change", ".data-list thead > tr > th select", function () {
			var tabId = $(this).closest(".tab-item").attr("id");
			if ($(this).val() === "") {
				$(this).closest("th").removeClass("is-active");
			} else {
				$(this).closest("th").addClass("is-active");
			}
			iaData.filter(tabId);
		});
	},

	filter: (tabId) => {
		const $selects = $(`#${tabId}`).find(".data-list thead > tr > th select");
		let selectedStatus = "";

		$selects.each(function () {
			const sortName = $(this).attr("data-sort-name");
			const value = $(this).val();
			if (sortName === "status") {
				selectedStatus = value;
			}
		});

		const $rows = $(`#${tabId}`).find(".data-list tbody > tr");

		$rows.each(function () {
			const statusValue = $(this).find(".sort-status").text();
			// const adminValue = $(this).find(".sort-admin").text(); // 관리자 필터 사용 시
			const showStatus = (selectedStatus === "" || selectedStatus === statusValue);
			// const showAdmin = (selectedAdmin === "" || selectedAdmin === adminValue);

			if (showStatus /*&& showAdmin*/) {
				$(this).removeClass("is-hide").show();
			} else {
				$(this).addClass("is-hide").hide();
			}
		});

		iaData.count(tabId);
	},

	filterReset: () => {
		$(".filter-reset").on("click", function () {
			const tabId = $(this).closest(".tab-item").attr("id");
			$(`#${tabId} .data-list thead > tr > th select`).val("").trigger("change");
			$(`#${tabId} .data-list thead > tr > th`).removeClass("is-sort");
			$(`#${tabId} .data-list thead > tr > th .data-sort`).text("▼").removeClass("desc asc");
		});
	},

	count: (tabId) => {
		let countPending = 0, countWorking = 0, countDone = 0, countModified = 0, countDeleted = 0;
		const $visibleRows = $(`#${tabId} .data-list tbody > tr:not(.nodata)`).not(".is-hide");
		const totalCount = $visibleRows.length;

		$visibleRows.each(function () {
			const status = $(this).find(".sort-status").text();
			switch (status) {
				case "작업전": countPending++; break;
				case "작업중": countWorking++; break;
				case "완료": countDone++; break;
				case "수정": countModified++; break;
				case "삭제": countDeleted++; break;
			}
		});

		const getPercent = (count) => (totalCount > 0 ? ((count / totalCount) * 100).toFixed(2) : 0);
		const countHTML = `
        Total: <strong class="fc-primary">${totalCount}</strong>,
        작업전: <strong class="fc-gray">${countPending}</strong> (${getPercent(countPending)}%),
        작업중: <strong class="fc-red">${countWorking}</strong> (${getPercent(countWorking)}%),
        수정: <strong class="fc-blue">${countModified}</strong> (${getPercent(countModified)}%),
        완료: <strong class="fc-green">${countDone}</strong> (${getPercent(countDone)}%),
        삭제: <strong class="fc-disabled">${countDeleted}</strong> (${getPercent(countDeleted)}%)
    `;

		$(`#${tabId} .title-h3 .count`).html(countHTML);

		if (totalCount === 0 && $(`#${tabId} .data-list tbody > .nodata`).length === 0) {
			$(`#${tabId} .data-list tbody`).html(
				`<tr class="nodata"><td colspan="12" class="align-center">데이터가 없습니다.</td></tr>`
			);
		} else if (totalCount > 0) {
			$(`#${tabId} .data-list tbody > .nodata`).remove();
		}
	},

	countAll: (tabId) => {
		const menuId = tabId + 'Menu';
		const $visibleRows = $(`#${tabId} .data-list tbody > tr:not(.nodata)`).not(".is-hide");
		$(`#${menuId} .tab-count`).text($visibleRows.length);
	},

	selectRow: () => {
		$(document).on("click", ".data-list tbody > tr:not(.nodata)", function () {
			$(this).toggleClass("is-active");
		});
	},

	sort: () => {
		$(document).on("click", ".data-list thead .data-sort", function () {
			const $th = $(this).closest("th");
			const columnIndex = $th.index(); // 관리자 연동 컬럼 인덱스 = 9
			const tabId = $(this).closest(".tab-item").attr("id");
			const $tbody = $(`#${tabId} .data-list tbody`);
			const $rows = $tbody.find('> tr:not(.nodata)').get();

			let sortDirection;
			if ($(this).hasClass("asc")) {
				$(this).removeClass("asc").addClass("desc").text("▼");
				sortDirection = -1;
			} else {
				$(this).removeClass("desc").addClass("asc").text("▲");
				sortDirection = 1;
			}
			$th.siblings().removeClass("is-sort").find(".data-sort").removeClass("asc desc").text("▼");
			$th.addClass("is-sort");

			$rows.sort(function (a, b) {
				let valueA = $(a).children("td").eq(columnIndex).text().toUpperCase();
				let valueB = $(b).children("td").eq(columnIndex).text().toUpperCase();

				// 생성일(0), 수정일(1)은 문자열로 비교
				// 관리자 연동(9, O/X)도 문자열로 비교

				if (valueA < valueB) return -sortDirection;
				if (valueA > valueB) return sortDirection;
				return 0;
			});

			$.each($rows, function (index, row) {
				$tbody.append(row);
			});
		});
	},
};

// --- 데이터 병합 및 각 탭에 데이터 설정 ---
// 주의: 모든 데이터 파일(iaPageAData1, iaPageAData2, ...)이 로드된 후 실행되어야 함
// 각 카테고리별 병합 예시 (모든 카테고리에 대해 필요)
/*
const iaPageAData = { list: [] };
if (typeof iaPageAData1 !== 'undefined') $.each(iaPageAData1.list, function () { iaPageAData.list.push(this); });
// if (typeof iaPageBData1 !== 'undefined') $.each(iaPageBData1.list, function () { iaPageAData.list.push(this); });

// 다른 카테고리 데이터도 병합 (예: iaPageBData, iaPageCData ...)
// const iaPageBData = { list: [] };
// if (typeof iaPageBData1 !== 'undefined') $.each(iaPageBData1.list, function () { iaPageBData.list.push(this); });
// ...

// 전체 데이터 병합 (모든 카테고리 병합)
const iaAllData = { list: [] };
if (iaPageAData && iaPageAData.list) $.each(iaPageAData.list, function () { iaAllData.list.push(this); });
// if (iaPageBData && iaPageBData.list) $.each(iaPageBData.list, function () { iaAllData.list.push(this); });
// ... (모든 카테고리 데이터 추가) ...
*/

// --- 각 탭별로 데이터 설정 함수 호출 ---
// $(document).ready(function () { // DOM 로드 후 실행 보장
// 	// 깊은 복사로 원본 데이터 유지
// 	const allData = JSON.parse(JSON.stringify(iaAllData || { list: [] }));
// 	iaData.set("tabAll", allData);

// 	const pageAData = JSON.parse(JSON.stringify(iaPageAData || { list: [] }));
// 	iaData.set("tabPageA", pageAData);
// 	if (typeof iaPageAData1 !== 'undefined') { // 개별 데이터 파일별 탭 설정
// 		const pageAData1 = JSON.parse(JSON.stringify(iaPageAData1));
// 		iaData.set("tabPageA1", pageAData1);
// 	}
// 	if (typeof iaPageBData1 !== 'undefined') { // 개별 데이터 파일별 탭 설정
// 		const pageBData1 = JSON.parse(JSON.stringify(iaPageBData1));
// 		iaData.set("tabPageB1", pageBData1);
// 	}

// 	// --- 초기화 실행 ---
// 	iaData.init();   // 테이블 필터링, 정렬 등 기능 초기화 (옵션 설정 포함)
// 	iaMemo.init();   // 메모 더보기/닫기 기능 초기화
// 	commUiFnTab.init(); // 탭 기능 초기화
// });


// --- IA 메모 관련 객체 및 초기화 ---
const iaMemo = {
	init: () => {
		iaMemo.toggle();
		iaMemo.all();
	},
	toggle: () => {
		$(document).on("click", ".data-list tbody > tr > td .note-list.option-fold", function () {
			$(this).toggleClass("is-open");
		});
	},
	all: () => {
		$(".btn-memo-all").each(function () {
			$(this).on("click", function () {
				const tabId = $(this).closest(".tab-item").attr("id");
				const $memoLists = $(`#${tabId} .data-list tbody > tr > td .note-list.option-fold`);
				if ($(this).hasClass("is-open")) {
					$(this).removeClass("is-open").text("더보기");
					$memoLists.removeClass("is-open");
				} else {
					$(this).addClass("is-open").text("닫기");
					$memoLists.addClass("is-open");
				}
			});
		});
	},
};

// --- 탭 기능 및 기타 UI ---
const commUiFnSetVH = () => {
	const vh = window.innerHeight * 0.01;
	document.documentElement.style.setProperty('--vh', `${vh}px`);
};

const commUiFnTab = {
	init: () => {
		commUiFnTab.select();
	},
	select: () => {
		// GNB 메뉴 항목(li)에 직접 이벤트 리스너 추가
		$('.ia-page .ia-list-header .ia-gnb .gnb-dep1 > li').on('click', function (e) {
			const $clickedLi = $(this);
			// aria-controls 속성 또는 ID 규칙으로 타겟 탭 ID 결정
			const targetTabId = $clickedLi.find('a').attr('aria-controls') || $clickedLi.attr('id').replace('Menu', '');

			if (!targetTabId || !$('#' + targetTabId).length) { // 유효한 탭 ID가 없으면 중단
				console.warn(`Target tab content #${targetTabId} not found.`);
				return;
			}

			// GNB 메뉴 활성화 상태 업데이트
			$clickedLi.siblings().removeClass('is-active');
			$clickedLi.addClass('is-active');

			// 탭 콘텐츠 활성화 상태 업데이트
			$('.ia-page .tab-list .tab-item').removeClass('is-active')
				.attr('aria-hidden', 'true').attr('tabindex', '-1');
			$('#' + targetTabId).addClass('is-active')
				.attr('aria-hidden', 'false').attr('tabindex', '0');

			// 모바일 메뉴 닫기 (선택 사항)
			$('.top-head').removeClass('active');
		});

		// 초기 로딩 시 탭 활성화 ('전체' 탭 우선)
		const $initialTabMenu = $('#tabAllMenu').length ? $('#tabAllMenu') : $('.ia-page .ia-list-header .ia-gnb .gnb-dep1 > li:first-child');
		if ($initialTabMenu.length) {
			// click() 대신 직접 클래스 추가 및 콘텐츠 표시 (무한 루프 방지)
			const initialTabId = $initialTabMenu.find('a').attr('aria-controls') || $initialTabMenu.attr('id').replace('Menu', '');
			if (initialTabId && $('#' + initialTabId).length) {
				$initialTabMenu.siblings().removeClass('is-active');
				$initialTabMenu.addClass('is-active');
				$('.ia-page .tab-list .tab-item').removeClass('is-active').attr('aria-hidden', 'true').attr('tabindex', '-1');
				$('#' + initialTabId).addClass('is-active').attr('aria-hidden', 'false').attr('tabindex', '0');
			}
		}
	}
};

// 모바일 메뉴 토글
const mobBtnMenu = document.querySelectorAll(".btn-mobilemenu");
mobBtnMenu.forEach(function (button) {
	button.addEventListener("click", function () {
		let topHead = document.querySelector(".top-head");
		// 'is-active' 클래스를 사용하거나 기존 'active' 클래스 사용
		topHead.classList.toggle("active");
		// `.item` 요소에 `is-active` 클래스 토글 (CSS에서 `.top-head.active .item` 또는 `.top-head .item.is-active` 스타일 정의 필요)
		topHead.querySelector('.item')?.classList.toggle('is-active');
	});
});

$(document).ready(function () {
	console.log("Document ready, setting individual tab data...");

	// !!! 중요: 아래 코드는 HTML에 해당 데이터 파일들이 로드된 경우에만 동작합니다. !!!
	// --- tabPageA 카테고리 ---
	if (typeof iaPageAData !== 'undefined') {
		iaData.set("tabPageA", JSON.parse(JSON.stringify(iaPageAData)));
	} else {
		console.warn("iaPageAData not found, skipping tabPageA");
		iaData.set("tabPageA", { list: [] }); // 데이터 없어도 테이블 구조는 생성 (선택사항)
	}

	// --- tabPageB 카테고리 ---
	if (typeof iaPageBData !== 'undefined') {
		iaData.set("tabPageB", JSON.parse(JSON.stringify(iaPageBData)));
	} else {
		console.warn("iaPageBData not found, skipping tabPageB");
		iaData.set("tabPageB", { list: [] });
	}

	// --- 다른 모든 카테고리 (C ~ Z, X) 에 대한 if 블록 추가 ---
	// 예:
	// if (typeof iaPageCData1 !== 'undefined') {
	//     iaData.set("tabPageC1", JSON.parse(JSON.stringify(iaPageCData1)));
	// } else {
	//     console.warn("iaPageCData1 not found, skipping tabPageC1");
	//     iaData.set("tabPageC1", { list: [] });
	// }
	// ...

	// --- 초기화 실행 (데이터 설정 완료 후) ---
	iaData.init();   // 테이블 필터링, 정렬 등 기능 초기화 (옵션 설정 포함)
	iaMemo.init();   // 메모 더보기/닫기 기능 초기화
	commUiFnTab.init(); // 탭 기능 초기화 (첫 번째 유효한 탭을 활성화하도록 내부 로직 확인 필요)
});

// VH 설정은 즉시 실행 및 리사이즈 이벤트 리스너 추가
commUiFnSetVH();
window.addEventListener('resize', commUiFnSetVH);