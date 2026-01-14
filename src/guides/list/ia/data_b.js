const iaPageBData = {
	language: "en",
	list: [
		// --- 메인 ---
		{ createDate: "2025-12-18",  modifyDate: "2026-01-15",  category: "Main", depth1: "",  depth2: "",  depth3: "-",  pageName: "메인",  pageType: "page",  pageID: "EN_MA_01",  link: "", isAdminLinked: true,  status: "완료",  memo: [{detail: '2026-01-15: 글로벌네트워크 subsidiary 텍스트 삭제'}, {detail: `2026-01-09: 마크업 추가`}, {detail: `2026-01-08: 마크업 수정`}, {detail: `2026-01-05: 클래스 삭제`}, {detail: `2025-12-30: 메인비주얼 a태그 추가`}, { detail: '2025-12-23: 글로벌네트워크 - 텍스트 수정' }] },

		// --- Our Business ---
		{ createDate: "2026-01-09", modifyDate: "2026-01-15", category: "Our Business", depth1: "What we do", depth2: "-", depth3: "-", pageName: "What we do", pageType: "page", pageID: "EN_BS_01", link: "", isAdminLinked: true, status: "완료", memo: [{detail: '2026-01-15: 마크업 수정'}]},
		{ createDate: "2026-01-15", modifyDate: "", category: "Our Business", depth1: "News Room ", depth2: "-", depth3: "-", pageName: "News Room", pageType: "page", pageID: "EN_BS_02", link: "", isAdminLinked: true, status: "완료", memo: []},

		// --- Our Company ---
		{ createDate: "2025-12-23", modifyDate: "2026-01-15", category: "Our Company", depth1: "Our Company ", depth2: "-", depth3: "-", pageName: "회사소개", pageType: "page", pageID: "EN_CP_01", link: "", isAdminLinked: true, status: "완료", memo: [{detail: `2026-01-15: 마크업 수정`}, {detail: `2026-01-08: 마크업 수정`}, {detail: `2026-01-05: 텍스트 수정`}], },
		{ createDate: "2025-12-18", modifyDate: "", category: "Our Company", depth1: "Management Status", depth2: "Summary of Consolidated Statement of Comprehensive Income", depth3: "-", pageName: "요약 연결포괄 손익계산서", pageType: "tab", pageID: "EN_CP_02_01", link: "", isAdminLinked: false, status: "완료", memo: [], },
		{ createDate: "2025-12-18", modifyDate: "2025-12-24", category: "Our Company", depth1: "-", depth2: "Summary of Consolidated Statement of Financial Position", depth3: "-", pageName: "요약 연결재무상태표", pageType: "tab", pageID: "EN_CP_02_02", link: "", isAdminLinked: false, status: "완료", memo: [{detail: `2025-12-24: 테이블 th scope="row" -> td로 변경`}], },
		{ createDate: "2025-12-18", modifyDate: "2026-01-05", category: "Our Company", depth1: "The Hanwha Finance", depth2: "-", depth3: "-", pageName: "한화금융", pageType: "page", pageID: "EN_CP_03", link: "", isAdminLinked: true, status: "완료", memo: [{detail: `2026-01-05: 클래스 및 마크업 수정`}, { detail: '영문 only' }], },
		{ createDate: "2025-12-18", modifyDate: "2026-01-07", category: "Our Company", depth1: "Multi-monitoring system", depth2: "", depth3: "-", pageName: "운용모니터링 체계", pageType: "tab", pageID: "EN_CP_04_01T", link: "", isAdminLinked: false, status: "완료", memo: [{detail: '2026-01-07: pageId 값 변경'}], },
		{ createDate: "2025-12-18", modifyDate: "2026-01-07", category: "Our Company", depth1: "Risk management system", depth2: "-", depth3: "-", pageName: "리스크 관리", pageType: "tab", pageID: "EN_CP_04_02T", link: "", isAdminLinked: false, status: "완료", memo: [{detail: '2026-01-07: pageId 값 변경'}], },
		{ createDate: "2025-12-18", modifyDate: "2026-01-07", category: "Our Company", depth1: "Compliance system", depth2: "-", depth3: "-", pageName: "내부통제 점검체계", pageType: "tab", pageID: "EN_CP_04_03T", link: "", isAdminLinked: false, status: "완료", memo: [{detail: '2026-01-07: pageId 값 변경'}], },

		// --- Risk Management ---
		{ createDate: "2025-12-18", modifyDate: "", category: "Risk Management", depth1: "Multi-monitoring system", depth2: "", depth3: "-", pageName: "운용모니터링 체계", pageType: "tab", pageID: "EN_RM_01", link: "", isAdminLinked: false, status: "삭제", memo: [], },
		{ createDate: "2025-12-18", modifyDate: "", category: "Risk Management", depth1: "Risk management system", depth2: "-", depth3: "-", pageName: "리스크 관리", pageType: "tab", pageID: "EN_RM_02", link: "", isAdminLinked: false, status: "삭제", memo: [], },
		{ createDate: "2025-12-18", modifyDate: "", category: "Risk Management", depth1: "Compliance system", depth2: "-", depth3: "-", pageName: "내부통제 점검체계", pageType: "tab", pageID: "EN_RM_03", link: "", isAdminLinked: false, status: "삭제", memo: [], },

		// --- Global Network ---
		{ createDate: "2025-12-18", modifyDate: "2026-01-14", category: "Global Network", depth1: "-", depth2: "-", depth3: "-", pageName: "글로벌네트워크", pageType: "page", pageID: "EN_GN_01", link: "", isAdminLinked: false, status: "완료", memo: [{detail: '2026-01-14: subsidiary 텍스트 삭제'}, {detail: `2026-01-05: 클래스 삭제`}, { detail: '2025-12-23: 텍스트 수정' }], },

		// --- Contact Us ---
		{ createDate: "2025-12-18", modifyDate: "2026-01-12", category: "Contact Us", depth1: "-", depth2: "-", depth3: "-", pageName: "오시는 길", pageType: "page", pageID: "EN_CU_01", link: "", isAdminLinked: false, status: "완료", memo: [{ detail: '2026-01-12: 버튼명 수정' }, { detail: '2025-12-30: 텍스트 수정' }], },

		// --- Site Map ---
		{ createDate: "2025-12-18", modifyDate: "2026-01-06", category: "Site Map", depth1: "-", depth2: "-", depth3: "-", pageName: "전체메뉴", pageType: "popup", pageID: "EU_SM_01", link: "", isAdminLinked: false, status: "완료", memo: [{detail: `2026-01-06: 텍스트 수정`}], },
	],
};