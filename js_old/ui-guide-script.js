"use strict";

// s : function
(function () {
  // global
  const pathParts = window.location.pathname.split("/");
  const currentDir = pathParts.slice(-2, -1)[0];
  const currentPage = pathParts.slice(-1)[0].replace(".html", "");
  const menuData = [
    // 시작하기
    {
      category: "시작하기",
      dir: "outline",
      type: "main-link",
      // type: "main-toggle",
      // type: "main-toggle-lv2",
      sub: [
        { name: "KRDS 시작하기", file: "outline_01", type: "link" },
        { name: "디자이너", file: "outline_02", type: "link" },
        { name: "개발자", file: "outline_03", type: "link" },
        { name: "정부관계자", file: "outline_04", type: "link" },
        { name: "리소스 다운로드", file: "outline_05", type: "link" },
      ],
    },
    // 디자인 스타일
    {
      category: "디자인 스타일",
      dir: "style",
      type: "main-link",
      // type: "main-toggle",
      sub: [
        { name: "디자인 스타일 소개", file: "style_01", type: "link" },
        { name: "색상", file: "style_02", type: "link" },
        { name: "서체", file: "style_03", type: "link" },
        { name: "형태", file: "style_04", type: "link" },
        { name: "배치", file: "style_05", type: "link" },
        { name: "아이콘", file: "style_06", type: "link" },
        { name: "디자인토큰", file: "style_07", type: "link" },
      ],
    },
    // 컴포넌트
    {
      category: "컴포넌트",
      dir: "component",
      type: "main-link",
      // type: "main-toggle",
      // type: "main-toggle-lv2",
      class: "exception-case",
      sub: [
        { name: "컴포넌트 소개", file: "component_summary", type: "link" },
        {
          name: "아이덴티티",
          file: "component_02_01",
          type: "toggle",
          sub: [
            { name: "공식 배너 (Masthead)", file: "component_02_01", type: "link" },
            { name: "운영기관 식별자 (Identifier)", file: "component_02_02", type: "link" },
            { name: "헤더 (Header)", file: "component_02_03", type: "link" },
            { name: "푸터 (Footer)", file: "component_02_04", type: "link" },
            { name: "스플래시 스크린(Splash screen)", file: "component_02_05", type: "link" },
          ],
        },
        {
          name: "탐색",
          file: "component_03_01",
          type: "toggle",
          sub: [
            { name: "건너뛰기 링크 (Skip link)", file: "component_03_01", type: "link" },
            { name: "메인 메뉴 (Main menu)", file: "component_03_02", type: "link" },
            { name: "브레드크럼 (Breadcrumb)", file: "component_03_03", type: "link" },
            { name: "사이드 메뉴 (Side navigation)", file: "component_03_04", type: "link" },
            { name: "콘텐츠 내 탐색 (In-page navigation)", file: "component_03_05", type: "link" },
            { name: "페이지네이션 (Pagination)", file: "component_03_06", type: "link" },
            { name: "탭바 (Tab bar)", file: "component_03_07", type: "link" },
          ],
        },
        {
          name: "레이아웃 및 표현",
          file: "component_04_01",
          type: "toggle",
          sub: [
            { name: "구조화 목록 (Structured list)", file: "component_04_01", type: "link" },
            { name: "긴급 공지 (Critical alerts)", file: "component_04_02", type: "link" },
            { name: "달력 (Calendar)", file: "component_04_03", type: "link" },
            { name: "디스클로저 (Disclosure)", file: "component_04_04", type: "link" },
            { name: "모달 (Modal)", file: "component_04_05", type: "link" },
            { name: "배지 (Badge)", file: "component_04_06", type: "link" },
            { name: "아코디언 (Accordion)", file: "component_04_07", type: "link" },
            { name: "이미지 (Image)", file: "component_04_08", type: "link" },
            { name: "캐러셀 (Carousel)", file: "component_04_09", type: "link" },
            { name: "탭 (Tab)", file: "component_04_10", type: "link" },
            { name: "표 (Table)", file: "component_04_11", type: "link" },
          ],
        },
        {
          name: "액션",
          file: "component_05_01",
          type: "toggle",
          sub: [
            { name: "링크 (Link)", file: "component_05_01", type: "link" },
            { name: "버튼 (Button)", file: "component_05_02", type: "link" },
          ],
        },
        {
          name: "선택",
          file: "component_06_01",
          type: "toggle",
          sub: [
            { name: "라디오 버튼 (Radio button)", file: "component_06_01", type: "link" },
            { name: "체크박스 (Checkbox)", file: "component_06_02", type: "link" },
            { name: "셀렉트 (Select)", file: "component_06_03", type: "link" },
            { name: "태그 (Tag)", file: "component_06_04", type: "link" },
            { name: "글자크기조정 (Adjust font size)", file: "component_06_05", type: "link" },
            { name: "고대비 모드 (High contrast mode)", file: "component_06_06", type: "link" },
            { name: "언어 설정 (Language)", file: "component_06_07", type: "link" },
          ],
        },
        {
          name: "피드백",
          file: "component_07_01",
          type: "toggle",
          sub: [
            { name: "단계 표시기 (Step indicator)", file: "component_07_01", type: "link" },
            { name: "스피너 (Spinner)", file: "component_07_02", type: "link" },
          ],
        },
        {
          name: "도움",
          file: "component_08_01",
          type: "toggle",
          sub: [
            { name: "도움 패널 (Help panel)", file: "component_08_01", type: "link" },
            { name: "따라하기 패널 (Tutorial panel)", file: "component_08_02", type: "link" },
            { name: "맥락적 도움말 (Contextual help)", file: "component_08_03", type: "link" },
            { name: "코치마크 (Coach mark)", file: "component_08_04", type: "link" },
          ],
        },
        {
          name: "입력",
          file: "component_09_01",
          type: "toggle",
          sub: [
            { name: "날짜 입력 필드 (Date input)", file: "component_09_01", type: "link" },
            { name: "텍스트 영역 (Textarea)", file: "component_09_02", type: "link" },
            { name: "텍스트 입력 필드 (Text input)", file: "component_09_03", type: "link" },
            { name: "파일 업로드 (File upload)", file: "component_09_04", type: "link" },
          ],
        },
      ],
    },
    // 기본 패턴
    {
      category: "기본 패턴",
      dir: "global",
      type: "main-link",
      // type: "main-toggle",
      sub: [
        { name: "기본 패턴 소개", file: "global_summary", type: "link" },
        { name: "개인 식별 정보 입력", file: "global_01", type: "link" },
        { name: "도움", file: "global_02", type: "link" },
        { name: "동의", file: "global_03", type: "link" },
        { name: "목록 탐색", file: "global_04", type: "link" },
        { name: "사용자 피드백", file: "global_05", type: "link" },
        { name: "상세 정보 확인", file: "global_06", type: "link" },
        { name: "오류", file: "global_07", type: "link" },
        { name: "입력폼", file: "global_08", type: "link" },
        { name: "첨부파일", file: "global_09", type: "link" },
        { name: "필터링·정렬", file: "global_10", type: "link" },
        { name: "확인", file: "global_11", type: "link" },
      ],
    },
    // 서비스 패턴
    {
      category: "서비스 패턴",
      dir: "service",
      type: "main-link",
      // type: "main-toggle",
      // type: "main-toggle-lv2",
      class: "exception-case",
      sub: [
        { name: "서비스 패턴 소개", file: "service_summary", type: "link" },
        {
          name: "방문",
          file: "service_01_01",
          type: "toggle",
          sub: [
            { name: "개요", file: "service_01_01", type: "link" },
            { name: "방문", file: "service_01_02", type: "link" },
          ],
        },
        {
          name: "검색",
          file: "service_02_01",
          type: "toggle",
          sub: [
            { name: "개요", file: "service_02_01", type: "link" },
            { name: "검색 기능 찾기", file: "service_02_02", type: "link" },
            { name: "검색어 입력", file: "service_02_03", type: "link" },
            { name: "검색 결과 확인", file: "service_02_04", type: "link" },
            { name: "상세 검색", file: "service_02_05", type: "link" },
            { name: "검색 결과 이용", file: "service_02_06", type: "link" },
            { name: "재검색", file: "service_02_07", type: "link" },
            { name: "검색 종료", file: "service_02_08", type: "link" },
          ],
        },
        {
          name: "로그인",
          file: "service_03_01",
          type: "toggle",
          sub: [
            { name: "개요", file: "service_03_01", type: "link" },
            { name: "로그인 기능 찾기", file: "service_03_02", type: "link" },
            { name: "로그인 안내", file: "service_03_03", type: "link" },
            { name: "로그인 방식 확인/선택", file: "service_03_04", type: "link" },
            { name: "로그인 정보 입력", file: "service_03_05", type: "link" },
            { name: "로그인 완료", file: "service_03_06", type: "link" },
            { name: "서비스 이용", file: "service_03_07", type: "link" },
            { name: "로그아웃", file: "service_03_08", type: "link" },
          ],
        },
        {
          name: "신청",
          file: "service_04_01",
          type: "toggle",
          sub: [
            { name: "개요", file: "service_04_01", type: "link" },
            { name: "신청 대상 탐색", file: "service_04_02", type: "link" },
            { name: "서비스 정보 확인", file: "service_04_03", type: "link" },
            { name: "유의 사항/자격 확인", file: "service_04_04", type: "link" },
            { name: "신청서 작성", file: "service_04_05", type: "link" },
            { name: "확인/확정", file: "service_04_06", type: "link" },
            { name: "완료", file: "service_04_07", type: "link" },
            { name: "신청 결과 확인", file: "service_04_08", type: "link" },
          ],
        },
        {
          name: "정책 정보 확인",
          file: "service_05_01",
          type: "toggle",
          sub: [
            { name: "개요", file: "service_05_01", type: "link" },
            { name: "정책 탐색", file: "service_05_02", type: "link" },
            { name: "정보 확인", file: "service_05_03", type: "link" },
            { name: "정책 자료 탐색", file: "service_05_04", type: "link" },
          ],
        },
      ],
    },
    // 알림마당
    {
      category: "알림마당",
      dir: "community",
      type: "main-toggle",
      sub: [
        { name: "새소식", file: "community_01", type: "link" },
        { name: "자주 하는 질문", file: "community_02", type: "link" },
        { name: "적용사례", file: "community_03", type: "link" },
        { name: "자료실", file: "community_04", type: "link" },
        { name: "문의하기", file: "community_05", type: "link" },
      ],
    },
    // KRDS 소개
    {
      category: "KRDS 소개",
      dir: "utility",
      type: "main-link",
      sub: [
        { name: "KRDS 소개", file: "utility_01", type: "link" },
        { name: "디자인 원칙", file: "utility_02", type: "link" },
        { name: "네이밍 원칙", file: "utility_03", type: "link" },
        { name: "디지털 포용", file: "utility_04", type: "link" },
        { name: "이용안내", file: "utility_05", type: "link" },
        { name: "저작권", file: "utility_06", type: "link" },
      ],
    },
  ];

  // getMenuItem
  const getMenuItem = (dir, file) => {
    for (const menu of menuData) {
      if (menu.dir === dir) {
        for (const item of menu.sub) {
          if (item.file === file && !item.sub) {
            return { depth1: menu.category, depth2: item.name, suffix: "" };
          } else if (item.sub) {
            for (const subitem of item.sub) {
              if (subitem.file === file) {
                return { depth1: menu.category, depth2: subitem.name, suffix: item.name };
              }
            }
          }
        }
      }
    }
    return { depth1: "", depth2: "", suffix: "" };
  };
  const { depth1, depth2, suffix } = getMenuItem(currentDir, currentPage);

  // updateTitle
  const updateTitle = () => {
    if (!depth1 && !depth2 && !suffix) {
      // document.title = "KRDS";
    } else {
      document.title = `${depth2} | ${depth1}${suffix ? ` - ${suffix}` : ""} - KRDS`;
    }
  };

  // initGnb
  const initGnb = (data) => {
    const menu = document.querySelector(".krds-gnb:not(.sample) .gnb-menu");
    if (!menu) return;

    // index 페이지
    const isIndexPage = window.location.pathname.split("/").pop() === "index.html";
    const basePath = isIndexPage ? "./" : "../";

    // index 링크 설정
    const logoLink = document.querySelector(".g-wrap #header .logo a");
    logoLink.setAttribute("href", `${basePath}index.html`);

    let list = [];

    const createMenu = (data) => {
      if (data.type === "main-link") {
        return `<li><a href="${basePath}${data.dir}/${data.sub[0].file}.html" class="gnb-main-trigger is-link" data-trigger="gnb" data-dir="${data.dir}">${data.category}</a></li>`;
      } else if (data.type === "main-toggle") {
        return `
        <li>
          <button type="button" class="gnb-main-trigger" data-trigger="gnb" data-dir="${data.dir}">${data.category}</button>
          <div class="gnb-toggle-wrap">
            <div class="gnb-main-list">
              <div class="gnb-sub-list single-list">
                <div class="gnb-sub-content">
                  <h2 class="sub-title"><span>${data.category}</span></h2>
                  <ul>
                    ${data.sub.map((subData) => createSubMenu(subData, data.dir)).join("")}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </li>
        `;
      } else if (data.type === "main-toggle-lv2") {
        return `
        <li>
          <button type="button" class="gnb-main-trigger" data-trigger="gnb" data-dir="${data.dir}">${data.category}</button>
          <div class="gnb-toggle-wrap">
            <div class="gnb-main-list" data-has-submenu="true">
              <ul>
                ${data.sub.map((subData) => createSubMenuLv2(subData, data.dir)).join("")}
              </ul>
            </div>
          </div>
        </li>
        `;
      } else if (data.type === "main-hide") {
        return "";
      }
    };
    const createSubMenu = (subData, dir) => {
      return `<li><a href="${basePath}${dir}/${subData.file}.html">${subData.name}</a></li>`;
    };
    const createSubMenuLv2 = (subData, dir) => {
      if (subData.type === "link") {
        return `
        <li>
          <a href="${basePath}${dir}/${subData.file}.html" class="gnb-sub-trigger" data-trigger="gnb">
            ${subData.name}
            <i class="svg-icon ico-angle right"></i>
          </a>
        </li>
        `;
      } else if (subData.type === "toggle") {
        return `
        <li>
          <button type="button" class="gnb-sub-trigger" data-trigger="gnb">${subData.name}</button>
          <div class="gnb-sub-list">
            <div class="gnb-sub-content">
              <h2 class="sub-title"><span>${subData.name}</span></h2>
              <ul>
                ${subData.sub.map((subDatalv3) => createSubMenuLv3(subDatalv3, dir)).join("")}
              </ul>
            </div>
          </div>
        </li>
        `;
      }
    };
    const createSubMenuLv3 = (subDatalv3, dir) => {
      if (subDatalv3.type === "link") {
        return `<li><a href="${basePath}${dir}/${subDatalv3.file}.html">${subDatalv3.name}</a></li>`;
      }
    };

    data.forEach((item) => list.push(createMenu(item)));
    menu.innerHTML = list.join("");
  };
  // initGnbMobile
  const initGnbMobile = (data) => {
    const gnb = document.querySelector(".krds-gnb-mobile:not(.sample) .gnb-menu");
    if (!gnb) return;

    // index 페이지
    const isIndexPage = window.location.pathname.split("/").pop() === "index.html";
    const basePath = isIndexPage ? "./" : "../";

    const mainMenu = gnb.querySelector(".menu-wrap > ul");
    const subMenu = gnb.querySelector(".submenu-wrap");

    let list = [];
    let listsub = [];

    const createMenu = (data) => {
      return `<li><a href="#mGnb-${data.dir}" class="gnb-main-trigger">${data.category}</a></li>`;
    };
    const createSubMenu = (data) => {
      return ` 
      <div class="gnb-sub-list" id="mGnb-${data.dir}">
        <h2 class="sub-title">${data.category}</h2>
        <ul>
          ${data.sub.map((subData) => createSubMenuLv2(subData, data.dir)).join("")}
        </ul>
      </div>
      `;
    };
    const createSubMenuLv2 = (subData, dir) => {
      if (subData.type === "link") {
        return `<li><a href="${basePath}${dir}/${subData.file}.html" class="gnb-sub-trigger">${subData.name}</a></li>`;
      } else if (subData.type === "toggle") {
        return `
        <li>
          <a href="${basePath}${dir}/${subData.file}.html" class="gnb-sub-trigger">${subData.name}</a>
          <ul class="sub-ul">
            ${subData.sub.map((subDatalv3) => createSubMenuLv3(subDatalv3, dir)).join("")}
          </ul>
        </li>
        `;
      }
    };
    const createSubMenuLv3 = (subDatalv3, dir) => {
      if (subDatalv3.type === "link") {
        return `<li><a href="${basePath}${dir}/${subDatalv3.file}.html" class="subm">${subDatalv3.name}</a></li>`;
      }
    };

    data.forEach((item) => list.push(createMenu(item)));
    data.forEach((item) => listsub.push(createSubMenu(item)));
    mainMenu.innerHTML = list.join("");
    subMenu.innerHTML = listsub.join("");
  };

  // initLnb
  const initLnb = (data) => {
    const menuWrap = document.querySelector(".krds-lnb:not(.sample)");
    if (!menuWrap) return;

    const title = menuWrap.querySelector(".lnb-tit");
    const menu = menuWrap.querySelector(".lnb-list");
    let list = [];

    const filterByCategory = (data, category) => {
      const categoryItem = data.find((item) => item.dir === category);
      if (categoryItem && categoryItem.sub) {
        title.innerHTML = categoryItem.category;
        if (categoryItem.class) menu.classList.add(categoryItem.class);
        return categoryItem.sub;
      }
      return [];
    };
    const menuData = filterByCategory(data, currentDir);
    const createMenu = (menuData) => {
      if (menuData.type === "link") {
        return `<li class="lnb-item"><a href="./${menuData.file}.html" class="lnb-btn lnb-link">${menuData.name}</a></li>`;
      } else if (menuData.type === "toggle") {
        return `
          <li class="lnb-item">
            <button type="button" class="lnb-btn lnb-toggle">${menuData.name}</button>
            <div class="lnb-submenu">
              <ul>
                ${menuData.sub.map(createSubMenu).join("")}
              </ul>
            </div>
          </li>
        `;
      }
    };
    const createSubMenu = (menuData) => {
      if (menuData.type === "link") {
        return `
          <li class="lnb-subitem">
            <a href="./${menuData.file}.html" class="lnb-btn lnb-link">${menuData.name}</a>
          </li>
        `;
      } else if (menuData.type === "toggle") {
        return `
          <li class="lnb-subitem">
            <button type="button" class="lnb-btn lnb-toggle-popup">${menuData.name}</button>
            <div class="lnb-submenu-lv2">
              <button type="button" class="lnb-btn-tit">${menuData.name}</button>
              <ul>
                ${menuData.sub.map(createSubMenuLv2).join("")}
              </ul>
            </div>
          </li>
        `;
      }
    };
    const createSubMenuLv2 = (menuData) => {
      return `<li><a href="./${menuData.file}.html" class="lnb-btn">${menuData.name}</a></li>`;
    };

    menuData.forEach((item) => list.push(createMenu(item)));
    menu.innerHTML = list.join("");
  };
  // exceptionLnb
  const exceptionLnb = () => {
    const exceptionCase = document.querySelector(".lnb-list.exception-case");
    if (!exceptionCase) return;
    const lnbToggles = exceptionCase.querySelectorAll(".lnb-btn.lnb-toggle");
    lnbToggles.forEach((item) => {
      item.closest(".lnb-item").classList.add("active");
      setTimeout(() => {
        item.setAttribute("aria-expanded", "true");
      }, 0);

      item.addEventListener("click", () => {
        const isExpanded = item.getAttribute("aria-expanded") === "true";
        item.closest(".lnb-item").classList.toggle("active", !isExpanded);
        item.setAttribute("aria-expanded", !isExpanded);
      });
    });
  };

  // activePage
  const activePage = () => {
    const lnbLinks = document.querySelectorAll(".krds-lnb:not(.sample) .lnb-link");
    lnbLinks.forEach((link) => {
      const linkPage = link.getAttribute("href").split("/").slice(-1)[0].replace(".html", "");
      if (linkPage === currentPage) {
        const exceptionCase = link.closest(".lnb-list.exception-case");
        if (!exceptionCase) {
          link.closest(".lnb-item").classList.add("active");
          setTimeout(() => {
            link.closest(".lnb-item").querySelector(".lnb-btn.lnb-toggle")?.setAttribute("aria-expanded", "true");
          }, 0);
        }
        link.classList.add("active");
        link.classList.add("selected");
        link.setAttribute("aria-current", "page");
        link.innerHTML += `<span class="sr-only">현재 페이지</span>`;
      }
    });

    const gnbMain = document.querySelectorAll(".krds-gnb:not(.sample) .gnb-main-trigger");
    gnbMain.forEach((item) => {
      const dataDir = item.getAttribute("data-dir");
      if (dataDir === currentDir) {
        item.classList.add("selected");
        item.setAttribute("aria-current", "page");
        item.innerHTML += `<span class="sr-only">현재 페이지</span>`;
      }
    });
  };

  // quickNavTab
  const quickNavTab = () => {
    const quickType = document.querySelector(".krds-quick-nav-type");

    if (!quickType) return;

    const quickList = quickType.querySelector(".krds-quick-nav-area .quick-nav-list ul");
    const quickTabs = quickType.querySelectorAll(".tab-area .has-anchor.tab:not(.sample) > ul > li");
    const quickTitle = quickType.querySelector(".quick-nav-header > .quick-title");

    // 메뉴 생성 함수
    const generateMenu = (id) => {
      let sectionLinks;
      if (id) {
        const hasTab = document.querySelector(`#${id}`).getAttribute("data-quick-nav");
        if (hasTab === "true") {
          sectionLinks = document.querySelectorAll(`#${id} .scroll-check .section-link`);
          quickType.querySelector(".krds-quick-nav-area").style.display = "flex";
        } else {
          quickType.querySelector(".krds-quick-nav-area").style.display = "none";
        }
      } else {
        sectionLinks = document.querySelectorAll(".scroll-check .section-link");
      }
      if (sectionLinks) {
        const title = document.querySelector(".lnb-btn.lnb-link.active");
        if (title) {
          quickTitle.innerHTML = title.innerHTML;
        }
        let list = [];
        sectionLinks.forEach((item, index) => {
          const uniqueIdx = `anchor-${index}${Math.random().toString(36).substring(2, 9)}`;
          item.setAttribute("id", uniqueIdx);
          const text = item.querySelector(".sec-tit")?.innerHTML;
          const activeClass = index === 0 ? `class="active"` : "";
          list.push(`<li><a ${activeClass} href="#${uniqueIdx}">${text}</a></li>`);
        });
        quickList.innerHTML = list.join("");
      }
    };

    // 초기 활성화된 탭에 대한 메뉴 생성
    const activeTab = document.querySelector(".tab-conts:not(.sample).active")?.getAttribute("id");
    if (activeTab) {
      generateMenu(activeTab);
    } else {
      generateMenu(false);
    }

    // 탭 클릭 이벤트 처리
    quickTabs.forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("aria-controls");
        generateMenu(id);
      });
    });
  };

  // dataKrdsMode
  const dataKrdsMode = () => {
    const root = document.querySelector("html");
    const wrap = document.querySelector("#wrap");
    const switchMode = wrap?.querySelector("#switch_mode");
    if (!switchMode) return;

    const savedMode = localStorage.getItem("krdsMode");
    if (savedMode) {
      // wrap.setAttribute("data-krds-mode", savedMode);
      root.setAttribute("data-krds-mode", savedMode);
      switchMode.checked = savedMode === "high-contrast";
    } else {
      // wrap.setAttribute("data-krds-mode", "light");
      root.setAttribute("data-krds-mode", "light");
      switchMode.checked = false;
    }

    switchMode.addEventListener("click", () => {
      const currentMode = root.getAttribute("data-krds-mode");
      const newMode = currentMode === "light" ? "high-contrast" : "light";
      root.setAttribute("data-krds-mode", newMode);
      localStorage.setItem("krdsMode", newMode);
      switchMode.checked = newMode === "high-contrast";
    });
    // 스위치 형태를 모드에 따라 관리
  };

  // breadcrumb
  const breadcrumb = () => {
    const breadcrumbElement = document.querySelector(".breadcrumb");
    if (!breadcrumbElement) return;
    // const getPathText = (selector) => document.querySelector(selector)?.textContent.trim() || "";
    const getPathText = (selector) => {
      const element = document.querySelector(selector);
      if (!element) return "";

      const clone = element.cloneNode(true);
      clone.querySelectorAll(".sr-only").forEach((srOnly) => srOnly.remove());

      return clone.textContent.trim();
    };
    const getPathTextToggle = () =>
      document.querySelector(".lnb-btn.active")?.closest(".lnb-item.active")?.querySelector(".lnb-btn.lnb-toggle")?.textContent.trim() || "";
    const paths = [
      getPathText(".krds-lnb .lnb-tit"),
      // getPathText(".krds-lnb .lnb-item.active > .lnb-btn.lnb-toggle"), // exceptionLnb 때문에 작동 안 함
      getPathTextToggle(),
      getPathText(".krds-lnb .lnb-btn.active"),
    ];
    const breadcrumbItems = [`<li class="home"><a href="#" class="txt">홈</a></li>`];
    paths.forEach((path) => {
      if (path) breadcrumbItems.push(`<li><span class="txt">${path}</span></li>`);
    });
    breadcrumbElement.innerHTML = breadcrumbItems.join("");

    // 타이틀 설정 임시
    const pageTitle = document.querySelector(".page-title-wrap .h-tit");
    if (!pageTitle) return;
    const splitText = (text) => {
      const [, outside = text, inside = ""] = text.match(/^(.*?)\s?\((.*?)\)$/) || [];
      return { outside: outside.trim(), inside: inside.trim() };
    };
    const { outside, inside } = splitText(paths[paths.length - 1]);
    if (currentDir === "component") {
      pageTitle.innerHTML = inside ? `${outside} <span class="krds-badge bg-light-gray">${inside}</span>` : outside;
    } else {
      pageTitle.innerHTML = outside;
    }
  };

  // contentScaler test
  const contentScaler = () => {
    window.addEventListener("keydown", (event) => {
      if (event.altKey && event.key === "1") {
        krds_adjustContentScale.scaleUp();
      }
      if (event.altKey && event.key === "2") {
        krds_adjustContentScale.scaleDown();
      }
      if (event.altKey && event.key === "3") {
        krds_adjustContentScale.scaleDefault();
      }
      if (event.altKey && event.key === "4") {
        krds_adjustContentScale.scaleMin();
      }
      if (event.altKey && event.key === "5") {
        krds_adjustContentScale.scaleMax();
      }
      if (event.altKey && event.key === "0") {
        const root = document.querySelector("html");
        const currentMode = root.getAttribute("data-krds-mode");
        const newMode = currentMode === "high-contrast" ? "light" : "high-contrast";
        root.setAttribute("data-krds-mode", newMode);
      }
    });
  };

  // emptyAnchor
  const emptyAnchor = () => {
    const tagA = document.querySelectorAll("a");
    tagA.forEach((item) => {
      const href = item.getAttribute("href");
      item.addEventListener("click", (el) => {
        if (href === "#") el.preventDefault();
      });
    });
  };

  // guide용 기존 스크립트 동작 막기
  const guideExample = () => {
    const exampleWrap = document.querySelectorAll(".g-example-wrap");
    if (exampleWrap.length === 0) return;

    const addClassToElements = (elements, className) => {
      elements.forEach((el) => el.classList.add(className));
    };

    exampleWrap.forEach((wrap) => {
      // header
      const header = wrap.querySelectorAll("#header");
      header.forEach((item) => {
        item.classList.add("sample");
        item.querySelector(".krds-gnb")?.classList.add("sample");
        item.querySelector(".krds-gnb-mobile")?.classList.add("sample");
        item.style.zIndex = "1";
      });

      // modal
      const modal = wrap.querySelectorAll(".modal:not(#modal_sample_03)");
      modal.forEach((item) => {
        item.classList.add("sample");
        item.querySelector(".modal-dialog").style.width = "100%";
        item.querySelector(".modal-back").style.display = "none";
        const closeButtons = item.querySelectorAll(".close-modal");
        closeButtons.forEach((close) => {
          close.classList.remove("close-modal");
        });
      });

      // lnb, quick
      [".krds-lnb", ".krds-quick-nav-area", ".krds-drop-wrap"].forEach((selector) => {
        const elements = wrap.querySelectorAll(selector);
        addClassToElements(elements, "sample");
      });

      // overflow
      [".datepicker-conts", ".krds-tooltip-wrap", ".krds-coach-highligt"].forEach((selector) => {
        const elements = wrap.querySelectorAll(selector);
        elements.forEach((item) => {
          item.closest(".g-example-scroll").style.overflow = "unset";
        });
      });
    });
  };

  // 검색필터
  const keyFilter = {
    init: () => {
      const keyWord = document.getElementById("keyword_search");
      const select = document.getElementById("sortSelect");

      if (keyWord) {
        keyFilter.total();
        keyFilter.exec();
        keyFilter.sortSelect();
      }
      if (select) {
        keyFilter.sortSelect();
      }
    },
    filter: () => {
      const keywords = document.getElementById("keyword_search").value.toLowerCase().split(/\s+/).filter(Boolean); // 공백으로 구분된 검색어 배열
      const list = document.querySelectorAll("#keyword_sch_area .structured-list .search-item");
      const selectBox = document.querySelector("#sortSelect");
  
      list.forEach(e => {
      const text = e.querySelectorAll(".keyword");
      
      // 모든 검색어가 해당 텍스트에 포함되는지 확인 (AND 조건)
      const matchesKeyword = keywords.every(keyword =>
        Array.from(text).some(el => el.innerHTML.toLowerCase().replace(/\s+/g, '').indexOf(keyword) !== -1)
      );
  
      if (!selectBox) {
        matchesKeyword ? e.classList.remove("hide") : e.classList.add("hide");
      } else {
        const selectValue = selectBox.value;
        const matchesSort = selectValue === "all" || Array.from(text).some(el => el.dataset.keyword === selectValue);
        
        matchesKeyword && matchesSort ? e.classList.remove("hide") : e.classList.add("hide");
      }
      });
  
      keyFilter.resultTxt(keywords.join(' '));
      keyFilter.total();
      keyFilter.noData(keywords.join(' '));
    },
    total: () => {
      const totalLength = document.querySelectorAll("#keyword_sch_area .structured-list .search-item:not(.hide)").length;
      const totalText = document.querySelector("#keyword_sch_area .sch-info .total");
      totalText.innerText = totalLength;
    },
    noData: (keyword) => {
      const list = document.querySelectorAll("#keyword_sch_area .structured-list .search-item");
      const listLen = list.length;
      const listHide = document.querySelectorAll("#keyword_sch_area .structured-list .search-item.hide");
      const listHideLen = listHide.length;

      const noDataItem = document.querySelector("#keyword_sch_area .no-data");
      if (keyword) noDataItem.querySelector(".keyword").innerText = `"${keyword}" `;

      setTimeout(() => {
        if (listLen == listHideLen) {
          noDataItem.classList.remove("hide");
        } else {
          noDataItem.classList.add("hide");
        }
      }, 50);
    },
    exec: () => {
      const btn = document.querySelector("#keyword_sch_area .btn-exec");
      const input = document.querySelector("#keyword_sch_area .form-control");

      btn.addEventListener("click", () => {
        keyFilter.filter();
      });

      input.addEventListener("keyup", (e) => {
        if (e.key === "Enter") {
          keyFilter.filter();
        }
      });
    },
    sortSelect: () => {
      const selectBox = document.querySelector("#sortSelect");

      if (selectBox) {
        const listItems = document.querySelectorAll(".structured-list .search-item");

        selectBox.addEventListener("change", (e) => {
          const selectValue = e.target.value;
          const selectText = e.target.querySelector("option:checked").text;

          listItems.forEach((li) => {
            const badges = li.querySelectorAll(".krds-badge") || li.querySelectorAll(".category");

            let showItem = false;
            badges.forEach((badge) => {
              if (selectValue === "all" || badge.dataset.keyword === selectValue) return (showItem = true);
            });

            !showItem ? li.classList.add("hide") : li.classList.remove("hide");

            keyFilter.noData(selectText);
            keyFilter.total();
          });
        });
      }
    },
    resultTxt: (keyword) => {
      const schInfoTxt = document.querySelector("#keyword_sch_area .sch-info");
      let schInfoResult = "";

      schInfoResult += `
			<li>적용된 검색어 '<span class="point keyword">${keyword}</span>'</li>
			<li>검색 결과 <span class="point total">10</span>개</li>
		`;
      schInfoTxt.innerHTML = schInfoResult;
    },
  };

  // 사용성 가이드라인 체크리스트 필터
  const checkFilter = () => {
    const levelFilter = document.querySelector("#apply-level-filter");
    if (!levelFilter) return;

    const chFilter = () => {
      const checkBoxs = levelFilter.querySelectorAll(".form-check input");
      const checkItems = document.querySelectorAll(".g-filter-list > li");
      const filterItems = document.querySelectorAll(".g-filter-item");

      checkBoxs.forEach((checkbox) => {
        checkbox.addEventListener("change", function () {
          const selectedFilters = Array.from(checkBoxs)
            .filter((checkbox) => checkbox.checked)
            .map((checkbox) => checkbox.id);

          // 리스트 항목 필터링
          Array.from(checkItems).forEach((item) => {
            const dataType = item.querySelector("span").getAttribute("data-type").split(" ");
            const isVisible = selectedFilters.length === 0 || selectedFilters.some((filter) => dataType.includes(filter));

            item.style.display = isVisible ? item.classList.remove("hide") : item.classList.add("hide");
          });

          // 각 filterItem의 li 요소 중 hide 클래스 개수 체크
          filterItems.forEach((filterItem) => {
            const items = filterItem.querySelectorAll(".g-filter-list li");
            let visibleCount = 0;

            items.forEach((li) => {
              if (!li.classList.contains("hide")) {
                visibleCount++;
              }
            });

            const noData = document.createElement("p");
            noData.classList.add("no-data");
            noData.innerText = "선택하신 조건에 맞는 검색결과가 없습니다. ";

            if (visibleCount == 0) {
              filterItem.querySelector(".g-filter-cont").appendChild(noData);
            } else {
              filterItem.querySelector(".no-data")?.remove();
            }
          });
        });
      });
    };

    chFilter();
  };

  //핀치줌
  const initPinchZoom = () => {
    const elements = document.querySelectorAll("div.g-img-zoom");
    let pinchZoomInstance = null;

    const pinchZoom = () => {
      elements.forEach(function (el) {
        if (!el.classList.contains("pinch-zoom-initialized")) {
          pinchZoomInstance = new PinchZoom.default(el, {});
          el.style.transform = "scale(1) translate(0, 0)";
          el.classList.add("pinch-zoom-initialized");
        }
      });
    };

    const removePinchZoom = () => {
      elements.forEach(function (el) {
        if (el.classList.contains("pinch-zoom-initialized")) {
          const pinchZoomContainer = document.querySelectorAll(".pinch-zoom-container");

          pinchZoomContainer.forEach((element) => {
            const parent = element.parentNode;
            // 하위 요소들을 부모 요소에 삽입
            while (element.firstChild) {
              parent.insertBefore(element.firstChild, element);
            }

            parent.querySelector(".g-img-zoom").classList.remove("pinch-zoom-initialized");
            parent.querySelector(".g-img-zoom").style = "";

            parent.removeChild(element);
          });
        }
      });
      pinchZoomInstance = null;
    };

    const checkWidthAndInit = () => {
      if (window.innerWidth < 768) {
        //모바일 사이즈 임시
        pinchZoom();
      } else {
        removePinchZoom();
      }
    };

    checkWidthAndInit();

    window.addEventListener("resize", checkWidthAndInit);
  };

  // run
  updateTitle();

  initGnb(menuData);
  initGnbMobile(menuData);
  initLnb(menuData);
  exceptionLnb();
  activePage();

  guideExample();
  quickNavTab();
  dataKrdsMode();
  breadcrumb();
  contentScaler();
  emptyAnchor();

  // 검색필터
  keyFilter.init();
  checkFilter();

  //핀치줌
  initPinchZoom();
})();
// e : function
