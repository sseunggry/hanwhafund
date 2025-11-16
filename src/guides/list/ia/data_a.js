const iaPageAData = {
	language: "ko",
	list: [
		// --- 메인 ---
		{ createDate: "",  modifyDate: "",  category: "메인", depth1: "",  depth2: "",  depth3: "-",  pageName: "메인",  pageType: "page",  pageID: "MA_01",  link: "", isAdminLinked: true,  status: "작업중",  memo: [] },
		{ createDate: "", modifyDate: "", category: "메인", depth1: "메인 공지 팝업", depth2: "", depth3: "-", pageName: "메인공지팝업", pageType: "popup", pageID: "MA_02P", link: "", isAdminLinked: false, status: "", memo: [], },
		{ createDate: "", modifyDate: "", category: "메인", depth1: "검색", depth2: "", depth3: "-", pageName: "검색", pageType: "popup", pageID: "MA_03P", link: "", isAdminLinked: false, status: "작업중", memo: [], },
		{ createDate: "", modifyDate: "", category: "메인", depth1: "", depth2: "검색 결과", depth3: "-", pageName: "검색결과", pageType: "page", pageID: "MA_03_01", link: "", isAdminLinked: false, status: "작업중", memo: [], },
		{ createDate: "", modifyDate: "", category: "메인", depth1: "", depth2: "검색 결과", depth3: "-", pageName: "검색결과 없음", pageType: "page", pageID: "MA_03_02", link: "", isAdminLinked: false, status: "작업중", memo: [], },
		{ createDate: "", modifyDate: "", category: "메인", depth1: "전체 메뉴", depth2: "", depth3: "-", pageName: "전체메뉴", pageType: "popup", pageID: "MA_04P", link: "", isAdminLinked: false, status: "", memo: [], },

		// --- 한화펀드 ---
		{ createDate: "", modifyDate: "", category: "한화펀드", depth1: "펀드찾기", depth2: "-", depth3: "-", pageName: "펀드찾기", pageType: "page", pageID: "FD_01", link: "", isAdminLinked: true, status: "작업중", memo: [], },
		{ createDate: "", modifyDate: "", category: "한화펀드", depth1: "펀드찾기", depth2: "펀드 상품 비교", depth3: "-", pageName: "펀드비교팝업", pageType: "popup", pageID: "FD_01_01P", link: "", isAdminLinked: false, status: "작업중", memo: [], },
		{ createDate: "", modifyDate: "", category: "한화펀드", depth1: "펀드찾기", depth2: "펀드 상세 ", depth3: "-", pageName: "펀드상품상세", pageType: "page", pageID: "FD_01_02", link: "", isAdminLinked: true, status: "완료", memo: [], },
		{ createDate: "", modifyDate: "", category: "한화펀드", depth1: "펀드찾기", depth2: "-", depth3: "일자별 기준가", pageName: "기준가팝업", pageType: "popup", pageID: "FD_01_02_01P", link: "", isAdminLinked: false, status: "완료", memo: [], },
		{ createDate: "", modifyDate: "", category: "한화펀드", depth1: "펀드찾기", depth2: "-", depth3: "클래스비교", pageName: "클래스비교팝업", pageType: "popup", pageID: "FD_01_02_02P", link: "", isAdminLinked: false, status: "완료", memo: [], },
		{ createDate: "", modifyDate: "", category: "한화펀드", depth1: "펀드찾기", depth2: "-", depth3: "자산운용보고서 다운로드", pageName: "자산운용보고서 다운로드 팝업", pageType: "popup", pageID: "FD_01_02_03P", link: "", isAdminLinked: false, status: "작업중", memo: [], },
		
		{ createDate: "", modifyDate: "", category: "한화펀드", depth1: "연금펀드", depth2: "개인연금", depth3: "-", pageName: "개인연금", pageType: "page", pageID: "FD_02_01", link: "", isAdminLinked: false, status: "", memo: [], },
		{ createDate: "", modifyDate: "", category: "한화펀드", depth1: "연금펀드", depth2: "퇴직연금", depth3: "-", pageName: "퇴직연금", pageType: "page", pageID: "FD_02_02", link: "", isAdminLinked: false, status: "", memo: [], },
		{ createDate: "", modifyDate: "", category: "한화펀드", depth1: "연금펀드", depth2: "TDF", depth3: "About TDF", pageName: "About TDF", pageType: "tab", pageID: "FD_02_03_01T", link: "", isAdminLinked: false, status: "", memo: [], },
		{ createDate: "", modifyDate: "", category: "한화펀드", depth1: "연금펀드", depth2: "-", depth3: "한화 LIIFEPLUS TDF 투자포인트", pageName: "TDF투자포인트", pageType: "tab", pageID: "FD_02_03_02T", link: "", isAdminLinked: false, status: "", memo: [], },

		// --- 인사이트 ---
		{ createDate: "", modifyDate: "", category: "인사이트", depth1: "공지 목록", depth2: "-", depth3: "-", pageName: "공지목록", pageType: "page", pageID: "IS_01", link: "", isAdminLinked: true, status: "완료", memo: [], },
		{ createDate: "", modifyDate: "", category: "인사이트", depth1: "공지 목록", depth2: "공지 상세", depth3: "-", pageName: "공지상세", pageType: "page", pageID: "IS_01_01", link: "", isAdminLinked: true, status: "완료", memo: [], },
		{ createDate: "", modifyDate: "", category: "인사이트", depth1: "투자정보 목록", depth2: "-", depth3: "-", pageName: "투자정보목록", pageType: "page", pageID: "IS_02", link: "", isAdminLinked: true, status: "완료", memo: [], },
		{ createDate: "", modifyDate: "", category: "인사이트", depth1: "투자정보 목록", depth2: "투자정보 상세", depth3: "-", pageName: "투자정보상세", pageType: "link", pageID: " -", link: "-", isAdminLinked: true, status: "완료", memo: [{detail: "외부링크"}], },
		{ createDate: "", modifyDate: "", category: "인사이트", depth1: "시황 목록", depth2: "-", depth3: "-", pageName: "시황목록", pageType: "page", pageID: "IS_03", link: "", isAdminLinked: true, status: "완료", memo: [], },
		{ createDate: "", modifyDate: "", category: "인사이트", depth1: "시황 목록", depth2: "시황 상세", depth3: "-", pageName: "시황상세", pageType: "page", pageID: "IS_03_01", link: "", isAdminLinked: true, status: "완료", memo: [], },
		{ createDate: "", modifyDate: "", category: "인사이트", depth1: "뉴스룸", depth2: "-", depth3: "-", pageName: "뉴스룸", pageType: "page", pageID: "IS_04", link: "", isAdminLinked: true, status: "완료", memo: [], },
		{ createDate: "", modifyDate: "", category: "인사이트", depth1: "FAQ", depth2: "-", depth3: "-", pageName: "FAQ", pageType: "page", pageID: "IS_05", link: "", isAdminLinked: true, status: "완료", memo: [], },

		// --- 공시 ---
		{ createDate: "", modifyDate: "", category: "공시", depth1: "전체 공시", depth2: "-", depth3: "-", pageName: "전체공시", pageType: "tab", pageID: "IF_01T", link: "", isAdminLinked: true, status: "완료", memo: [], },
		{ createDate: "", modifyDate: "", category: "공시", depth1: "전체 공시", depth2: "공시 상세", depth3: "-", pageName: "공시상세", pageType: "page", pageID: "IF_01_01", link: "", isAdminLinked: true, status: "완료", memo: [], },
		{ createDate: "", modifyDate: "", category: "공시", depth1: "펀드공시", depth2: "-", depth3: "-", pageName: "펀드공시", pageType: "tab", pageID: "IF_02T", link: "", isAdminLinked: true, status: "완료", memo: [], },
		{ createDate: "", modifyDate: "", category: "공시", depth1: "자산운용보고서", depth2: "-", depth3: "-", pageName: "자산운용보고서", pageType: "tab", pageID: "IF_03T", link: "", isAdminLinked: true, status: "삭제", memo: [], },
		{ createDate: "", modifyDate: "", category: "공시", depth1: "파생공시", depth2: "-", depth3: "-", pageName: "파생공시", pageType: "tab", pageID: "IF_04T", link: "", isAdminLinked: true, status: "삭제", memo: [], },
		{ createDate: "", modifyDate: "", category: "공시", depth1: "경영공시", depth2: "-", depth3: "-", pageName: "경영공시", pageType: "tab", pageID: "IF_03T", link: "", isAdminLinked: true, status: "완료", memo: [], },
		{ createDate: "", modifyDate: "", category: "공시", depth1: "리츠공시", depth2: "-", depth3: "-", pageName: "리츠공시", pageType: "tab", pageID: "IF_04T", link: "", isAdminLinked: true, status: "완료", memo: [], },
		{ createDate: "", modifyDate: "", category: "공시", depth1: "연금공시", depth2: "-", depth3: "-", pageName: "연금공시", pageType: "tab", pageID: "IF_05T", link: "", isAdminLinked: true, status: "완료", memo: [], },

		// --- 회사소개 ---
		{ createDate: "", modifyDate: "", category: "회사소개", depth1: "회사소개 ", depth2: "-", depth3: "-", pageName: "회사소개", pageType: "page", pageID: "CP_01", link: "", isAdminLinked: false, status: "", memo: [], },
		{ createDate: "", modifyDate: "", category: "회사소개", depth1: "주요 비즈니스", depth2: "PE", depth3: "-", pageName: "주요비즈니스PE", pageType: "tab", pageID: "CP_02_01T", link: "", isAdminLinked: true, status: "", memo: [], },
		{ createDate: "", modifyDate: "", category: "회사소개", depth1: "주요 비즈니스", depth2: "VC", depth3: "-", pageName: "주요비즈니스VC", pageType: "tab", pageID: "CP_02_02T", link: "", isAdminLinked: true, status: "", memo: [], },
		{ createDate: "", modifyDate: "", category: "회사소개", depth1: "주요 비즈니스", depth2: "FoFs", depth3: "-", pageName: "주요비즈니스FoFs", pageType: "tab", pageID: "CP_02_03T", link: "", isAdminLinked: true, status: "", memo: [], },
		{ createDate: "", modifyDate: "", category: "회사소개", depth1: "주요 비즈니스", depth2: "Real Asset", depth3: "-", pageName: "주요비즈니스realasset", pageType: "tab", pageID: "CP_02_04T", link: "", isAdminLinked: true, status: "", memo: [], },
		{ createDate: "", modifyDate: "", category: "회사소개", depth1: "주요 비즈니스", depth2: "ETF", depth3: "-", pageName: "주요비즈니스ETF", pageType: "tab", pageID: "CP_02_05T", link: "", isAdminLinked: true, status: "", memo: [], },
		{ createDate: "", modifyDate: "", category: "회사소개", depth1: "글로벌 네트워크", depth2: "싱가포르", depth3: "-", pageName: "글로벌네트워크_싱가포르", pageType: "tab", pageID: "CP_03_01T", link: "", isAdminLinked: true, status: "", memo: [], },
		{ createDate: "", modifyDate: "", category: "회사소개", depth1: "글로벌 네트워크", depth2: "미국", depth3: "-", pageName: "글로벌네트워크_미국", pageType: "tab", pageID: "CP_03_02T", link: "", isAdminLinked: true, status: "", memo: [], },
		{ createDate: "", modifyDate: "", category: "회사소개", depth1: "글로벌 네트워크", depth2: "아부다비", depth3: "-", pageName: "글로벌네트워크_아부다비", pageType: "tab", pageID: "CP_03_03T", link: "", isAdminLinked: true, status: "", memo: [], },
		{ createDate: "", modifyDate: "", category: "회사소개", depth1: "경영현황", depth2: "요약 연결포괄 손익계산서", depth3: "-", pageName: "연결포괄손익계산서", pageType: "tab", pageID: "CP_04_01T", link: "", isAdminLinked: true, status: "", memo: [], },
		{ createDate: "", modifyDate: "", category: "회사소개", depth1: "경영현황", depth2: "요약 연결재무상태표", depth3: "-", pageName: "연결재무상태표", pageType: "tab", pageID: "CP_04_02T", link: "", isAdminLinked: true, status: "", memo: [], },
		{ createDate: "", modifyDate: "", category: "회사소개", depth1: "위험관리", depth2: "멀티모니터링체계", depth3: "-", pageName: "멀티모니터링체계", pageType: "tab", pageID: "CP_05_01T", link: "", isAdminLinked: false, status: "", memo: [], },
		{ createDate: "", modifyDate: "", category: "회사소개", depth1: "위험관리", depth2: "리스크관리시스템", depth3: "-", pageName: "리스크관리시스템", pageType: "tab", pageID: "CP_05_02T", link: "", isAdminLinked: false, status: "", memo: [], },
		{ createDate: "", modifyDate: "", category: "회사소개", depth1: "위험관리", depth2: "컴플라이언스 시스템", depth3: "-", pageName: "컴플라이언스시스템", pageType: "tab", pageID: "CP_05_03T", link: "", isAdminLinked: false, status: "", memo: [], },
		{ createDate: "", modifyDate: "", category: "회사소개", depth1: "채용정보", depth2: "한화 인재상", depth3: "-", pageName: "한화인재상", pageType: "tab", pageID: "CP_06_01T", link: "", isAdminLinked: false, status: "", memo: [], },
		{ createDate: "", modifyDate: "", category: "회사소개", depth1: "채용정보", depth2: "한화의 핵심가치", depth3: "-", pageName: "한화의책심가치", pageType: "tab", pageID: "CP_06_02T", link: "", isAdminLinked: false, status: "", memo: [], },
		{ createDate: "", modifyDate: "", category: "회사소개", depth1: "오시는 길", depth2: "-", depth3: "-", pageName: "오시는길", pageType: "page", pageID: "CP_07", link: "", isAdminLinked: false, status: "", memo: [], },

		// --- Footer ---
		{ createDate: "", modifyDate: "", category: "Footer", depth1: "스튜어드십코드", depth2: "스튜어드십코드", depth3: "-", pageName: "스튜어드십코드", pageType: "tab", pageID: "FT_01_01T", link: "", isAdminLinked: true, status: "완료", memo: [], },
		{ createDate: "", modifyDate: "", category: "Footer", depth1: "스튜어드십코드", depth2: "의결권행사내역", depth3: "-", pageName: "의결권행사내역", pageType: "tab", pageID: "FT_01_02T", link: "", isAdminLinked: true, status: "완료", memo: [], },
		{ createDate: "", modifyDate: "", category: "Footer", depth1: "스튜어드십코드", depth2: "수탁자 책임 이행활동", depth3: "-", pageName: "수탁자책임이행활동", pageType: "tab", pageID: "FT_01_03T", link: "", isAdminLinked: true, status: "완료", memo: [], },
		{ createDate: "", modifyDate: "", category: "Footer", depth1: "개인정보처리방침", depth2: "-", depth3: "-", pageName: "개인정보처리방침", pageType: "page", pageID: "FT_02", link: "", isAdminLinked: false, status: "", memo: [], },
		{ createDate: "", modifyDate: "", category: "Footer", depth1: "신용정보활용체계", depth2: "-", depth3: "-", pageName: "신용정보활용체계", pageType: "page", pageID: "FT_03", link: "", isAdminLinked: false, status: "", memo: [], },
		{ createDate: "", modifyDate: "", category: "Footer", depth1: "고객정보취급방침", depth2: "-", depth3: "-", pageName: "고객정보취급방침", pageType: "page", pageID: "FT_04", link: "", isAdminLinked: false, status: "", memo: [], },
		{ createDate: "", modifyDate: "", category: "Footer", depth1: "윤리경영", depth2: "윤리경영", depth3: "-", pageName: "윤리경영", pageType: "tab", pageID: "FT_05_01T", link: "", isAdminLinked: false, status: "", memo: [], },
		{ createDate: "", modifyDate: "", category: "Footer", depth1: "윤리경영", depth2: "윤리헌장", depth3: "-", pageName: "윤리헌장", pageType: "tab", pageID: "FT_05_02T", link: "", isAdminLinked: false, status: "", memo: [], },
		{ createDate: "", modifyDate: "", category: "Footer", depth1: "윤리경영", depth2: "윤리행동지침", depth3: "-", pageName: "윤리행동지침", pageType: "tab", pageID: "FT_05_03T", link: "", isAdminLinked: false, status: "", memo: [], },
		{ createDate: "", modifyDate: "", category: "Footer", depth1: "윤리경영", depth2: "사이버신문고", depth3: "-", pageName: "사이버신문고", pageType: "tab", pageID: "FT_05_04T", link: "", isAdminLinked: false, status: "완료", memo: [], },
		{ createDate: "", modifyDate: "", category: "Footer", depth1: "이메일무단수집거부", depth2: "-", depth3: "-", pageName: "이메일무단수집거부", pageType: "popup", pageID: "FT_06P", link: "", isAdminLinked: false, status: "", memo: [], },
		{ createDate: "", modifyDate: "", category: "Footer", depth1: "법적고시", depth2: "-", depth3: "-", pageName: "법적고시", pageType: "popup", pageID: "FT_07P", link: "", isAdminLinked: false, status: "", memo: [], },
		{ createDate: "", modifyDate: "", category: "Footer", depth1: "보호금융상품등록", depth2: "-", depth3: "-", pageName: "보호금융상품등록", pageType: "page", pageID: "FT_08", link: "", isAdminLinked: false, status: "", memo: [], },
		{ createDate: "", modifyDate: "", category: "Footer", depth1: "금융소비자보호포탈", depth2: "금융소비자보호헌장", depth3: "-", pageName: "금융소비자보호헌장", pageType: "tab", pageID: "FT_09_01T", link: "", isAdminLinked: false, status: "", memo: [], },
		{ createDate: "", modifyDate: "", category: "Footer", depth1: "금융소비자보호포탈", depth2: "금융소비자보호체계", depth3: "-", pageName: "금융소비자보호체계", pageType: "tab", pageID: "FT_09_02T", link: "", isAdminLinked: false, status: "", memo: [], },
		{ createDate: "", modifyDate: "", category: "Footer", depth1: "금융소비자보호포탈", depth2: "고객의소리", depth3: "-", pageName: "고객의소리", pageType: "tab", pageID: "FT_09_03T", link: "", isAdminLinked: false, status: "", memo: [], },
		{ createDate: "", modifyDate: "", category: "Footer", depth1: "금융소비자보호포탈", depth2: "소비자권리 및 유익한 정보", depth3: "-", pageName: "소비자권리및유익한정보", pageType: "tab", pageID: "FT_09_04T", link: "", isAdminLinked: false, status: "", memo: [], },

		// --- 공통 ---
		{ createDate: "", modifyDate: "", category: "공통", depth1: "오류 안내", depth2: "-", depth3: "-", pageName: "오류 안내", pageType: "page", pageID: "CM_01", link: "", isAdminLinked: false, status: "", memo: [], },
	],
};