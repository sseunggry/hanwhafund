/*
------------------------------------------------------------
iaData.js (data-pageA1.json 전용 + 정렬 기능 포함)
------------------------------------------------------------
*/

const iaData = {
  currentSort: { key: null, asc: true },

  // 표 세팅
  set: function (id, data) {
    const $tab = $("#" + id);
    const $thead = $tab.find(".ia-table thead");
    const $tbody = $tab.find(".ia-table tbody");

    // 데이터 저장
    $tab.data("list", data.list);

    // 표 렌더링
    this.render($tab, data.list);

    // 정렬 이벤트 연결 (한 번만)
    if (!$thead.data("sortable")) {
      $thead.data("sortable", true);
      $thead.on("click", "th", (e) => {
        const $th = $(e.currentTarget);
        const key = $th.data("key");
        if (!key) return;

        // 정렬 상태 토글
        if (this.currentSort.key === key) {
          this.currentSort.asc = !this.currentSort.asc;
        } else {
          this.currentSort.key = key;
          this.currentSort.asc = true;
        }

        // 데이터 정렬
        const list = [...$tab.data("list")];
        list.sort((a, b) => {
          const aVal = (a[key] || "").toString().toLowerCase();
          const bVal = (b[key] || "").toString().toLowerCase();
          if (aVal < bVal) return this.currentSort.asc ? -1 : 1;
          if (aVal > bVal) return this.currentSort.asc ? 1 : -1;
          return 0;
        });

        // 렌더링
        this.render($tab, list);

        // 헤더 정렬 표시 갱신
        $thead.find("th").removeClass("asc desc");
        $th.addClass(this.currentSort.asc ? "asc" : "desc");
      });
    }
  },

  // 표 렌더링
  render: function ($tab, list) {
    const $tbody = $tab.find(".ia-table tbody");
    let html = "";

    $.each(list, function () {
      html += `
        <tr class="ia-item" data-iaid="${this.pageID}">
          <td>${this.createDate || ""}</td>
          <td>${this.modifyDate || ""}</td>
          <td>${this.depth1 || ""}</td>
          <td>${this.depth2 || ""}</td>
          <td>${this.depth3 || ""}</td>
          <td>${this.depth4 || ""}</td>
          <td>${this.device || ""}</td>
          <td>${this.user || ""}</td>
          <td>${this.pageType || ""}</td>
          <td>${this.pageName || ""}</td>
          <td>${this.pageID || ""}</td>
          <td><a href="${this.link}" target="_blank">${this.link}</a></td>
          <td>${this.order || ""}</td>
          <td>${this.status || ""}</td>
          <td>
            ${
              this.memo && this.memo.length
                ? this.memo
                    .map(
                      (m, i) =>
                        `<span class="ia-memo" data-i="${i + 1}">- ${m.detail}</span>`
                    )
                    .join("<br>")
                : ""
            }
          </td>
        </tr>
      `;
    });

    $tbody.html(html);
  },
};

// ----------------------------------------
// JSON 파일 로드 및 실행
// ----------------------------------------
// $(function () {
//   $.getJSON("./js_ia_second/data-pageA1.json")
//     .done(function (data) {
//       iaData.set("tabPageA1", data);
//     })
//     .fail(function (xhr, status, err) {
//       console.error("⚠️ data-pageA1.json 불러오기 실패:", err);
//     });
// });

$(function () {
  iaData.set("tabPageA1", iaPageAData1);
	console.log(iaData);
});
