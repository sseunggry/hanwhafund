"use strict";

/**
 * ------------------------------------------------------------------------
 * [공통 유틸리티] uiUtils 공통 함수
 * ------------------------------------------------------------------------
 */
const uiUtils = {
  // 요소 내부에 포커스를 가둡니다. (Modal, Popover 등)
  focusTrap: function ($trap) {
    const $focusableElements = $trap.find(
      'a[href], button:not(:disabled), textarea:not(:disabled), input:not(:disabled), select:not(:disabled), [tabindex]:not([tabindex="-1"])'
    );
    if ($focusableElements.length === 0) return;

    const $firstFocusableElement = $focusableElements.first();
    const $lastFocusableElement = $focusableElements.last();

    // 'keydown.focustrap' 네임스페이스를 사용하여 이벤트 중복 방지
    $trap.on("keydown.focustrap", (event) => {
      if (event.key === "Tab") {
        const $activeElement = $(document.activeElement);

        if (event.shiftKey && $activeElement.is($firstFocusableElement)) {
          // Shift + Tab on first element -> focus last
          event.preventDefault();
          $lastFocusableElement.focus();
        } else if (!event.shiftKey && $activeElement.is($lastFocusableElement)) {
          // Tab on last element -> focus first
          event.preventDefault();
          $firstFocusableElement.focus();
        }
      }
    });
  },
  removeFocusTrap: function ($trap) {
    $trap.off("keydown.focustrap");
  },
	// 트리거($btn)를 기준으로 대상($el)의 위치(top, left)를 계산합니다. (tooltip, popover)
	calculatePosition: function ($btn, $el, gap = 10) {
    let primaryPosition = "bottom";
    if ($el.hasClass("top")) primaryPosition = "top";
    else if ($el.hasClass("left")) primaryPosition = "left";
    else if ($el.hasClass("right")) primaryPosition = "right";

    let alignment = "center"; // 기본값
    if ($el.hasClass("align-left")) alignment = "left";
    else if ($el.hasClass("align-right")) alignment = "right";
    else if ($el.hasClass("align-top")) alignment = "top";
    else if ($el.hasClass("align-bottom")) alignment = "bottom";

    const tooltipHeight = $el.outerHeight();
    const tooltipWidth = $el.outerWidth();
    const triggerRect = $btn[0].getBoundingClientRect();
    const itemTop = triggerRect.top + window.scrollY;
    const itemLeft = triggerRect.left + window.scrollX;
    const itemRight = triggerRect.right + window.scrollX;
    const itemBottom = triggerRect.bottom + window.scrollY;
    const itemHeight = triggerRect.height;
    const itemWidth = triggerRect.width;

    let tooltipTop, tooltipLeft;

    switch (primaryPosition) {
      case "top":
        tooltipTop = itemTop - tooltipHeight - gap;
        if (alignment === "left") tooltipLeft = itemLeft;
        else if (alignment === "right") tooltipLeft = itemRight - tooltipWidth;
        else tooltipLeft = itemLeft + (itemWidth - tooltipWidth) / 2;
        break;
      case "left":
        tooltipLeft = itemLeft - tooltipWidth - gap;
        if (alignment === "top") tooltipTop = itemTop;
        else if (alignment === "bottom") tooltipTop = itemBottom - tooltipHeight;
        else tooltipTop = itemTop + (itemHeight - tooltipHeight) / 2;
        break;
      case "right":
        tooltipLeft = itemRight + gap;
        if (alignment === "top") tooltipTop = itemTop;
        else if (alignment === "bottom") tooltipTop = itemBottom - tooltipHeight;
        else tooltipTop = itemTop + (itemHeight - tooltipHeight) / 2;
        break;
      case "bottom":
      default:
        tooltipTop = itemBottom + gap;
        if (alignment === "left") tooltipLeft = itemLeft;
        else if (alignment === "right") tooltipLeft = itemRight - tooltipWidth;
        else tooltipLeft = itemLeft + (itemWidth - tooltipWidth) / 2;
        break;
    }

    // CSS 적용은 함수가 아닌 호출부에서 하도록 반환값 변경 (더 유연함)
    return { top: tooltipTop, left: tooltipLeft };
  },
};

const uiSelect = {
  init: function () {
    // 셀렉트 버튼 클릭 (토글)
    $(document).on("click", ".form-select .select-button", function (e) {
      e.preventDefault();
      // e.stopPropagation(); // document 클릭 전파 중단
      const $btn = $(this);
      const $select = $btn.closest(".form-select");
      const isOpening = $btn.attr("aria-expanded") === "false";

      if (isOpening) {
        uiSelect.open($select);
      } else {
        uiSelect.close($select);
      }
    });

    // 옵션 클릭 (선택)
    $(document).on("click", ".form-select .select-option", function (e) {
      e.preventDefault();
      const $option = $(this);
      if ($option.hasClass("disabled") || $option.attr("aria-disabled") === "true") {
        return;
      }
      uiSelect.selectOption($option);
    });

    // 키보드 네비게이션 (버튼 + 리스트박스)
    $(document).on("keydown", ".form-select", function (e) {
      const $select = $(this);
      const $btn = $select.find(".select-button");
      const $listbox = $select.find(".select-listbox");
      const isOpen = $btn.attr("aria-expanded") === "true";
      const $currentOption = $(document.activeElement).closest(".select-option");

      // 현재 포커스된 (또는 선택된) 옵션 찾기
      let $focusedOption = $listbox.find(".select-option:focus");
      if (!$focusedOption.length) {
        $focusedOption = $listbox.find('[aria-selected="true"]');
      }

      const getNext = ($opt) => {
        let $next = $opt.nextAll(".select-option:not(.disabled)").first();
        if (!$next.length)
          $next = $listbox.find(".select-option:not(.disabled)").first();
        return $next;
      };
      const getPrev = ($opt) => {
        let $prev = $opt.prevAll(".select-option:not(.disabled)").first();
        if (!$prev.length)
          $prev = $listbox.find(".select-option:not(.disabled)").last();
        return $prev;
      };

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          if (!isOpen) {
            uiSelect.open($select);
          }
          getNext($focusedOption).focus();
          break;
        case "ArrowUp":
          e.preventDefault();
          if (!isOpen) {
            uiSelect.open($select);
          }
          getPrev($focusedOption).focus();
          break;
        case "Enter":
        case " ": // 스페이스바
          e.preventDefault();
          if (!isOpen) {
            uiSelect.open($select);
          } else if ($currentOption.length) {
            uiSelect.selectOption($currentOption);
          }
          break;
        case "Escape":
          e.preventDefault();
          if (isOpen) {
            uiSelect.close($select);
            $btn.focus();
          }
          break;
        case "Tab":
          // 탭 키는 포커스 트랩이 아닌 셀렉트를 닫도록 함
          if (isOpen) {
            uiSelect.close($select);
          }
          break;
      }
    });
  },

  /**
   * 셀렉트 열기
   * @param {jQuery} $select - .form-select 요소
   */
  open: function ($select) {
    if ($select.hasClass("disabled")) return;

    // 1. 다른 셀렉트/팝오버 닫기
    uiSelect.closeAll();
    uiPopover.closeAll(); // 팝오버도 닫아줌

    const $btn = $select.find(".select-button");
    const $listbox = $select.find(".select-listbox");

    $select.addClass("active");
    $btn.attr("aria-expanded", "true");
    $listbox.removeAttr("hidden");

    // 2. 현재 선택된 옵션으로 포커스/스크롤
    let $selected = $listbox.find('[aria-selected="true"]');
    if (!$selected.length) {
      $selected = $listbox.find(".select-option:not(.disabled)").first();
    }
    $selected.focus();
    // 스크롤 (필요시)
    $listbox.scrollTop(
      $listbox.scrollTop() + $selected.position().top - $listbox.height() / 2 + $selected.height() / 2
    );
  },

  /**
   * 셀렉트 닫기
   * @param {jQuery} $select - .form-select 요소
   */
  close: function ($select) {
    const $btn = $select.find(".select-button");
    const $listbox = $select.find(".select-listbox");

    $select.removeClass("active");
    $btn.attr("aria-expanded", "false");
    $listbox.attr("hidden", true);
  },

  /**
   * 모든 셀렉트 닫기
   */
  closeAll: function () {
    $(".form-select.active").each(function () {
      uiSelect.close($(this));
    });
  },

  /**
   * 옵션 선택
   * @param {jQuery} $option - 선택된 .select-option
   */
  selectOption: function ($option) {
    const $select = $option.closest(".form-select");
    const $btn = $select.find(".select-button");
    const $listbox = $select.find(".select-listbox");
    const $nativeSelect = $select.find("select.sr-only");
    const $valueDisplay = $select.find(".select-value");

    const newValue = $option.data("value");
    const newText = $option.text();

    // 1. 기존 선택 해제
    $listbox
      .find('[aria-selected="true"]')
      .attr("aria-selected", "false")
      .removeClass("selected"); // 'selected' 클래스(스타일링용)

    // 2. 새 옵션 선택
    $option.attr("aria-selected", "true").addClass("selected");

    // 3. UI 텍스트 및 네이티브 <select> 값 업데이트
    $valueDisplay.text(newText).removeClass("placeholder");
    $nativeSelect.val(newValue).trigger("change"); // change 이벤트 발생

    // 4. 셀렉트 닫고 버튼에 포커스
    uiSelect.close($select);
    $btn.focus();
  },
};
const uiModal = {
  init: function () {
    // 모달 열기
    $(document).on("click", "[data-modal-open]", function (e) {
      e.preventDefault();
      const $trigger = $(this);
      const modalId = $trigger.data("modal-open");
      uiModal.open(modalId, $trigger);
    });

    // 모달 닫기
    $(document).on("click", ".modal .btn-close", function (e) {
      e.preventDefault();
      const $modal = $(this).closest(".modal");
      uiModal.close($modal.attr("id"));
    });

    // 모달 배경 클릭 시 닫기
    $(document).on("click", ".modal", function (e) {
      if ($(e.target).hasClass("modal-back")) {
        const $modal = $(this);
        uiModal.close($modal.attr("id"));
      }
    });
  },

  /**
   * 모달 열기
   * @param {string} id - 열릴 모달의 ID
   * @param {jQuery} $trigger - 모달을 연 버튼 (포커스 복귀용)
   */
  open: function (id, $trigger) {
    const $modal = $(`#${id}`);
    if (!$modal.length) return;

    const $content = $modal.find(".modal-content");
    const $scrollableConts = $modal.find(".modal-conts[tabindex='0']");

    // 모달을 연 트리거 저장
    $modal.data("modal-trigger", $trigger);

    // $("body").addClass("scroll-no");
		$("html").css('overflow', 'hidden');
    $modal.addClass("shown"); // 1. .shown으로 표시 (display: block)

    // 2. 트랜지션을 위해 짧은 지연 후 .in 클래스 추가 (fade-in)
    setTimeout(() => $modal.addClass("in"), 10);

    // 3. 트랜지션 완료 후 포커스 이동
    $modal.one("transitionend", () => {
      // 스크롤 영역이 있으면 영역에, 없으면 컨텐츠 래퍼에 포커스
      if ($scrollableConts.length) {
        $scrollableConts.focus();
      } else {
        $content.focus();
      }
    });

    // 포커스 트랩 설정
    uiUtils.focusTrap($content);

    // ESC 키로 닫기 (이벤트 네임스페이스 사용)
    $modal.on("keydown.modalEsc", function (e) {
      if (e.key === "Escape") {
        uiModal.close(id);
      }
    });
  },

  /**
   * 모달 닫기
   * @param {string} id - 닫힐 모달의 ID
   */
  close: function (id) {
    const $modal = $(`#${id}`);
    if (!$modal.length) return;

    const $trigger = $modal.data("modal-trigger");
    const $content = $modal.find(".modal-content");

    // 1. .in 클래스 제거 (fade-out)
    $modal.removeClass("in");

    // 2. 트랜지션 완료 후 .shown 제거 (display: none)
    $modal.one("transitionend", () => {
      $modal.removeClass("shown");

      // 다른 모달이 열려있지 않을 때만 body 스크롤 복원
      if ($(".modal.in").length === 0) {
        // $("body").removeClass("scroll-no");
				$("html").css('overflow', '');
      }

      // 포커스를 원래 트리거로 복귀
      if ($trigger && $trigger.length) {
        $trigger.focus();
      }
      $modal.removeData("modal-trigger");
    });

    // 포커스 트랩 및 ESC 이벤트 제거
    uiUtils.removeFocusTrap($content);
    $modal.off("keydown.modalEsc");
  },

	setFullModalContentHeight: function(){
    const rootFontSize = parseFloat($('html').css('font-size'));
    if (!rootFontSize) return;

    const $fullModals = $('.modal[data-type="full"]');
    $fullModals.each(function () {
      const $modal = $(this);
      const $header = $modal.find(".modal-header");
      const $btnWrap = $modal.find(".modal-btn");
      const $contentArea = $modal.find(".modal-conts");
      if (!$contentArea.length) return;

      const headerHeightPx = $header.length ? $header.outerHeight() : 0;
      const btnWrapHeightPx = $btnWrap.length ? $btnWrap.outerHeight() : 0;
      const headerHeightRem = headerHeightPx / rootFontSize;
      const btnWrapHeightRem = btnWrapHeightPx / rootFontSize;

      $contentArea.css('height', `calc(100vh - ${headerHeightRem + btnWrapHeightRem}rem)`);
    });
  }
};
const uiAccordion = {
  init: function () {
    // 아코디언 버튼 클릭 (이벤트 위임)
    $(document).on("click", ".accordion .btn-accordion", function (e) {
      e.preventDefault();

			const $button = $(this);
      const $currentItem = $button.closest(".accordion-item");
      const $accordionContainer = $button.closest(".accordion");

      if ($accordionContainer.length === 0) return;
      if ($button.is(':disabled')) return;

      const $accordionItems = $accordionContainer.find(".accordion-item");
      const $accordionContent = $currentItem.find(`#${$button.attr('aria-controls')}`);
      const accordionType = $accordionContainer.data("type") || "singleOpen"; // multiOpen, singleOpen
      
      const isExpanded = $button.attr("aria-expanded") === "true";
      const isOpening = !isExpanded;

      if (accordionType === "singleOpen" && isOpening) {
        $accordionItems.not($currentItem).each(function () {
          const $otherItem = $(this);
          const $otherButton = $otherItem.find('.btn-accordion');
          const $otherContent = $otherItem.find('.accordion-collapse');
          
          $otherItem.removeClass("active");
          $otherButton.attr("aria-expanded", "false").removeClass("active");
          $otherContent.removeClass("active").attr("hidden", true);
        });
      }

      $button.attr("aria-expanded", isOpening);
      $button.toggleClass("active", isOpening);
      $currentItem.toggleClass("active", isOpening);
      $accordionContent.toggleClass("active", isOpening);
      
      if (isOpening) {
         $accordionContent.removeAttr("hidden"); // 열기
      } else {
         $accordionContent.attr("hidden", true); // 닫기
      }
    });
  },
};
const uiTab = {
  init: function () {
    // 탭 버튼 클릭 (이벤트 위임)
    $(document).on("click", '.tab [role="tablist"] .btn-tab', function (e) {
      e.preventDefault();
      const $btn = $(this);
      const $tab = $btn.closest('[role="tab"]');

      if ($tab.hasClass("active") || $btn.is(":disabled")) {
        return; // 이미 활성화되었거나 비활성화된 탭이면 중지
      }

      const $tabArea = $tab.closest(".tab-area");
      const $tablist = $tab.closest('[role="tablist"]');
      const $targetPanel = $(`#${$tab.attr("aria-controls")}`);

      // 1. 기존 활성 탭/패널 비활성화
      const $activeTab = $tablist.find(".active");
      const $activePanel = $tabArea.find(".tab-conts.active");

      $activeTab
        .removeClass("active")
        .attr("aria-selected", "false")
        .find(".sr-only")
        .remove();
      $activePanel.removeClass("active");

      // 2. 새 탭/패널 활성화
      $tab.addClass("active").attr("aria-selected", "true");
      $btn.append('<span class="sr-only">선택됨</span>');
      $targetPanel.addClass("active");
    });

    // 키보드 네비게이션
    $(document).on("keydown", '.tab [role="tablist"] .btn-tab', function (e) {
      const $btn = $(this);
      const $tab = $btn.closest('[role="tab"]');
      let $nextTab;

      switch (e.key) {
        case "ArrowLeft":
        case "ArrowUp":
          e.preventDefault();
          $nextTab = $tab.prev();
          if (!$nextTab.length) {
            $nextTab = $tab.siblings().last(); // 처음이면 끝으로
          }
          break;
        case "ArrowRight":
        case "ArrowDown":
          e.preventDefault();
          $nextTab = $tab.next();
          if (!$nextTab.length) {
            $nextTab = $tab.siblings().first(); // 마지막이면 처음으로
          }
          break;
        case "Home":
          e.preventDefault();
          $nextTab = $tab.siblings().first();
          break;
        case "End":
          e.preventDefault();
          $nextTab = $tab.siblings().last();
          break;
        default:
          return;
      }
      $nextTab.find(".btn-tab").focus();
    });
  },
};
const uiSegmentControl = {
  init: function () {
    // 타입 1: 네이티브 라디오 (change 이벤트)
    $(document).on("change", '.segment-control input[type="radio"]', function () {
        const $input = $(this);
        const $group = $input.closest(".segment-control");

        $group.find('label').removeClass('active');
        $input.closest('label').addClass('active');
      }
    );

    // 타입 2: 커스텀 버튼 (click 이벤트)
    $(document).on("click", '.segment-control button[role="radio"]', function (e) {
        e.preventDefault();

        const $btn = $(this);
        if ($btn.hasClass("active") || $btn.is(":disabled")) return;

        const $group = $btn.closest('[role="radiogroup"]');

        $group.find('button[role="radio"]').removeClass("active").attr({ "aria-checked": "false", tabindex: "-1" });
        $btn.addClass("active").attr({ "aria-checked": "true", tabindex: "0" });
      }
    );

    // 키보드 네비게이션 (타입 2 커스텀 버튼용)
    $(document).on("keydown",'.segment-control button[role="radio"]', function (e) {
        const $btn = $(this);
        let $nextBtn;

        const getNext = ($btn) => {
          const $next = $btn.next('button[role="radio"]');
          return $next.length ? $next : $btn.siblings('button[role="radio"]').first();
        };

        const getPrev = ($btn) => {
          const $prev = $btn.prev('button[role="radio"]');
          return $prev.length ? $prev : $btn.siblings('button[role="radio"]').last();
        };

        switch (e.key) {
          case "ArrowLeft":
          case "ArrowUp":
            e.preventDefault();
            $nextBtn = getPrev($btn);
            break;
          case "ArrowRight":
          case "ArrowDown":
            e.preventDefault();
            $nextBtn = getNext($btn);
            break;
          default:
            return;
        }

        // 키보드 이동 시 포커스 및 클릭(선택) 처리
        if ($nextBtn && $nextBtn.length) {
          $nextBtn.focus();
          $nextBtn.click();
        }
      }
    );
  },
};
const uiPopover = {
  init: function () {
    // 1. 팝오버 열기
    $(document).on("click", "[data-popover-open]", function (e) {
      e.preventDefault();
      // e.stopPropagation(); 
      const $btn = $(this);
      const popoverId = $btn.data("popover-open");
      const $popover = $(`#${popoverId}`);

			const $currentTrigger = $popover.data("popover-trigger");

      if ($popover.hasClass("active")) {
        // uiPopover.close($popover);
				if ($currentTrigger && $currentTrigger[0] === $btn[0]) {
          // 활성화 상태 + 같은 버튼 클릭 -> 닫기
          uiPopover.close($popover);
        } else {
          // 활성화 상태 + 다른 버튼 클릭 -> 다시 열기 (위치 재조정)
          uiPopover.open($btn, $popover);
        }
      } else {
        // 비활성화 상태 -> 열기
        uiPopover.open($btn, $popover);
      }
    });

    // 2. 팝오버 닫기 (내부 닫기 버튼)
    $(document).on("click", ".popover .btn-close", function (e) {
      e.preventDefault();
      const $popover = $(this).closest(".popover"); // 클래스명 변경
      uiPopover.close($popover);
    });

    // 3. 팝오버 닫기 (Click Outside)
    // $(document).on("click.popover", function (e) {
    //   // 팝오버가 아닌 영역, 팝오버 트리거가 아닌 영역을 클릭 시
    //   if (
    //     !$(e.target).closest(".popover").length &&
    //     !$(e.target).closest("[data-popover-open]").length
    //   ) {
    //     uiPopover.closeAll();
    //   }
    // });
  },
	open: function($btn, $popover) {
		// 1. 다른 팝오버/셀렉트 닫기
		uiPopover.closeAll();
		uiSelect.closeAll(); 

		// ★★★ 시작: data-popover-pos 값 파싱 ★★★
		// 2. 버튼에서 위치/정렬 값 읽어오기 (기본값: 'bottom-center')
		const posData = $btn.data('popover-pos') || 'bottom-center';
		const parts = posData.split('-'); // "bottom-right" -> ["bottom", "right"]

		const newPosition = parts[0] || 'bottom';
		const newAlign = parts[1] || 'center';

		// 3. 팝오버에 붙어있을 수 있는 기존 위치/정렬 클래스 모두 제거
		const positionClasses = 'top bottom left right';
		const alignClasses = 'align-top align-bottom align-left align-right align-center';
		$popover.removeClass(positionClasses).removeClass(alignClasses);

		// 4. 새 위치/정렬 클래스 추가
		$popover.addClass(newPosition);
		if (newAlign !== 'center') {
			$popover.addClass('align-' + newAlign);
		}

		// 5. 위치 계산 및 표시
		$popover.addClass("active").attr("aria-hidden", "false");

		const position = uiUtils.calculatePosition($btn, $popover, 10);
		$popover.css({
			top: position.top + "px",
			left: position.left + "px",
		});

		// 6. 접근성
		$popover.data("popover-trigger", $btn);
		uiUtils.focusTrap($popover);
		$popover.find(".btn-close").focus();

		// ESC 닫기
		$popover.on("keydown.popoverEsc", function (e) {
			if (e.key === "Escape") {
				uiPopover.close($popover);
			}
		});
	},
  // open: function ($btn, $popover) {
  //   // 1. 다른 팝오버/셀렉트 닫기 (안전장치)
  //   uiPopover.closeAll();
  //   uiSelect.closeAll(); 

  //   // 2. 위치 계산 및 표시
  //   $popover.addClass("active").attr("aria-hidden", "false");
    
  //   // ★★★ uiUtils의 공통 함수 호출 ★★★
  //   const position = uiUtils.calculatePosition($btn, $popover, 10);
  //   $popover.css({
  //     top: position.top + "px",
  //     left: position.left + "px",
  //   });

  //   // 3. 접근성
  //   $popover.data("popover-trigger", $btn);
  //   uiUtils.focusTrap($popover);
  //   $popover.find(".btn-close").focus();

  //   // ESC 닫기
  //   $popover.on("keydown.popoverEsc", function (e) {
  //     if (e.key === "Escape") {
  //       uiPopover.close($popover);
  //     }
  //   });
  // },
  close: function ($popover) {
    if (!$popover.hasClass("active")) return;
    const $trigger = $popover.data("popover-trigger");
    $popover.removeClass("active").attr("aria-hidden", "true");
    uiUtils.removeFocusTrap($popover);
    $popover.off("keydown.popoverEsc");
    $popover.removeData("popover-trigger");
    if ($trigger && $trigger.length) {
      $trigger.focus();
    }
  },
  closeAll: function () {
    $(".popover.active").each(function () {
      uiPopover.close($(this));
    });
  },
};
const uiTooltip = {
  init: function () {
    // 마우스 호버(mouseenter) 시 툴팁 표시
    $(document).on("mouseenter", "[data-tooltip]", function () {
      const $btn = $(this);
      const tooltipId = $btn.data("tooltip");
      const $tooltip = $(`#${tooltipId}`); // 툴팁 요소 찾기

      if ($tooltip.length) {
        uiTooltip.show($btn, $tooltip);
      }
    });

    // 마우스 아웃(mouseleave) 시 툴팁 숨김
    $(document).on("mouseleave", "[data-tooltip]", function () {
      const tooltipId = $(this).data("tooltip");
      const $tooltip = $(`#${tooltipId}`);
      
      if ($tooltip.length) {
        uiTooltip.hide($tooltip);
      }
    });
  },
  show: function ($btn, $tooltip) {
    // 1. 툴팁 표시
    $tooltip.addClass("active"); // (CSS에서 .active로 보이게 처리)
    
    // 2. ★★★ uiUtils의 공통 함수 호출 ★★★
    const position = uiUtils.calculatePosition($btn, $tooltip, 8); // 툴팁은 간격을 8px로
    $tooltip.css({
      top: position.top + "px",
      left: position.left + "px",
    });
  },
  hide: function ($tooltip) {
    $tooltip.removeClass("active");
  }
};
const uiLnb2 = {
  isClickScrolling: false, // 클릭으로 스크롤 중인지 확인
  $links: null,
  $sections: null,
  $sidebar: null,
  scrollOffset: 80,       // LNB 클릭/스파이 기준선 (init에서 재계산)
  handleScroll: null,
  scrollEndTimer: null, // [수정] jQuery.animate 콜백으로 대체

  init: function() {
    this.$links = $('.layout-sidebar .sidebar li a[href^="#"]');
    this.$sections = $('.layout-sidebar .layout-content .cont-group[id]');
    this.$sidebar = $('.sidebar');
    const $topFixed = $('.top-fixed');

    if (this.$links.length === 0 || this.$sections.length === 0 || !this.$sidebar.length) return;

    // this.setupClickHandlers();
    this.initScrollSpy();
  },
  setupClickHandlers: function() {
    const self = this;

    this.$links.on('click.lnbClick', function(e) {
      e.preventDefault();
      const $link = $(this);
      const $targetSection = $($link.attr('href'));
      
      if ($targetSection.length) {
        self.isClickScrolling = true; // 스크롤 스파이 멈춤
        self.setActiveIndicator($link); // (즉시) 클릭한 메뉴 활성화

        const targetScrollTop = $targetSection.offset().top - self.scrollOffset + 1; // 1px 보정
        
        $('html, body').animate({
          scrollTop: targetScrollTop
        }, 500, () => { // 0.5초 애니메이션
          self.isClickScrolling = false; // 스크롤 스파이 재개
        });
      }
    });
  },
  initScrollSpy: function() {
    const self = this;
    
    this.handleScroll = () => {
      const scrollY = $(window).scrollTop();

      // 클릭으로 스크롤 중이면 스파이 기능 중지
      if (self.isClickScrolling) return;

      // --- 기능 2b: 스크롤 스파이 (메뉴 활성화) ---
      const winHeight = $(window).height();
      const scrollHeight = $(document).height();
      const $firstLink = self.$links.first();
      const $lastLink = self.$links.last();
      const firstSecTop = self.$sections.first().length ? self.$sections.first().offset().top : 0;

      // 맨 아래 도달
      if (scrollY + winHeight >= scrollHeight - 10) {
        self.setActiveIndicator($lastLink);
        return;
      }
      // 맨 위 (첫 섹션 도달 전)
      if (scrollY < firstSecTop - self.scrollOffset) {
        self.setActiveIndicator($firstLink);
        return;
      }

      // 중간 섹션 탐색
      for (let i = self.$sections.length - 1; i >= 0; i--) {
        const $currentSection = self.$sections.eq(i);
        const sectionTop = $currentSection.offset().top - self.scrollOffset;

        if (scrollY >= sectionTop - 1) { // 1px 버퍼
          const id = $currentSection.attr('id');
          const $navLink = self.$links.filter(`[href="#${id}"]`);
          self.setActiveIndicator($navLink);
          return; 
        }
      }
    };

    $(window).on('scroll.lnbScroll', this.handleScroll);
    this.handleScroll(); // 초기 로드 시 실행
  },

  setActiveIndicator: function($anchor) {
    if (!$anchor || !$anchor.length) return;
    if ($anchor.parent().hasClass('active')) return;
    
    this.$links.parent().removeClass('active');
    $anchor.parent().addClass('active');
  }
};
const uiLnb = {
  $sidebar: null,
  $links: null,
  $sections: null,
  offset: 150, 

  init: function () {
    this.$sidebar = $(".sidebar");
    if (!this.$sidebar.length) return;

    this.$links = this.$sidebar.find("a[href^='#']");
    if (!this.$links.length) return;

    this.$sections = $();
    this.$links.each((i, link) => {
      const $section = $($(link).attr("href"));
      if ($section.length) {
        this.$sections = this.$sections.add($section);
      }
    });

    if (!this.$sections.length) return;
    
    $(window).on("scroll.sidebarSpy", () => {
      this.updateActiveState();
    });

    this.updateActiveState();
  },

  updateActiveState: function () {
    const scrollTop = $(window).scrollTop();
    const triggerPos = scrollTop + this.offset;
    let currentActiveId = null;

    const sectionsReversed = this.$sections.get().reverse();
    for (const section of sectionsReversed) {
      const $section = $(section);
      
      if ($section.offset() && $section.offset().top <= triggerPos) {
        currentActiveId = $section.attr("id");
        break; // 찾았으므로 반복 중단
      }
    }

    // 무조건 첫 번째 섹션 ID를 활성화
    if (currentActiveId === null) {
      currentActiveId = this.$sections.first().attr("id");
    }

    // 페이지 맨 아래 엣지 케이스 (스크롤이 끝까지 도달했을 때)
    if (scrollTop + $(window).height() >= $(document).height() - 50) { // 50px 버퍼
      currentActiveId = this.$sections.last().attr("id");
    }

    // 사이드바 링크에 active 클래스 적용
    this.$links.each(function () {
      const $link = $(this);
      const $li = $link.closest("li");
      const href = $link.attr("href"); // 예: "#performance"

      if (href === "#" + currentActiveId) {
        $li.addClass("active");
        $link.attr("aria-current", "page");
      } else {
        $li.removeClass("active");
        $link.removeAttr("aria-current");
      }
    });
  },
};

const commonJs = {
  init: function () {
    uiModal.init();
    uiAccordion.init();
    uiTab.init();
    uiSegmentControl.init();
    uiPopover.init();
    uiTooltip.init();
    uiSelect.init();
    uiLnb.init();

    // 전역 이벤트 바인딩
    this.bindGlobalEvents();
  },

  // 전역 클릭 이벤트 (외부 클릭 시 팝업/셀렉트 닫기)
  bindGlobalEvents: function () {
    $(document).on("click.globalClose", function (e) {
      const $target = $(e.target);

      // 1. 팝오버(툴팁) 외부 클릭 시 닫기
      if (!$target.closest(".popover, [data-popover-open]").length) {
        uiPopover.closeAll();
      }

      // 2. 셀렉트 외부 클릭 시 닫기
      if (!$target.closest(".form-select").length) {
        uiSelect.closeAll();
      }
    });
  },
};

// 실행
$(function () {
  commonJs.init();
});