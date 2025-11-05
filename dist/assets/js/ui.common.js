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
	calculatePosition2: function ($btn, $el, gap = 10) {
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
  calculatePosition: function ($btn, $popover, gap) {
    const btnRect = $btn[0].getBoundingClientRect();
    const popoverWidth = $popover.outerWidth();
    const popoverHeight = $popover.outerHeight();
    const windowWidth = window.innerWidth;

    // 팝오버에 적용된 클래스를 읽어 기본 위치 결정
    const isTop = $popover.hasClass('top');
    const isBottom = $popover.hasClass('bottom');
    const isLeft = $popover.hasClass('left');
    
    // 정렬 (align)
    const isAlignLeft = $popover.hasClass('align-left');
    const isAlignRight = $popover.hasClass('align-right');
    const isAlignTop = $popover.hasClass('align-top');
    const isAlignBottom = $popover.hasClass('align-bottom');

    let idealTop, idealLeft;

    // --- 1. Y축 (top) 위치 계산 ---
    if (isTop) {
      idealTop = btnRect.top - popoverHeight - gap;
    } else if (isLeft) {
      if (isAlignTop) idealTop = btnRect.top;
      else if (isAlignBottom) idealTop = btnRect.bottom - popoverHeight;
      else idealTop = btnRect.top + (btnRect.height / 2) - (popoverHeight / 2); // Center
    }
    // ... (right도 left와 동일) ...
    else { // 기본값: bottom
      idealTop = btnRect.bottom + gap;
    }

    // --- 2. X축 (left) 위치 계산 (최적 맞춤 로직) ---
    const viewportPadding = 10; // 화면 가장자리에서 최소 10px 여백
    const windowRight = window.innerWidth - viewportPadding;

    // [A] 3가지 정렬 위치를 모두 계산합니다.
    const centerLeft = btnRect.left + (btnRect.width / 2) - (popoverWidth / 2);
    const alignLeft = btnRect.left;
    const alignRight = btnRect.right - popoverWidth;

    // [B] 3가지 정렬이 각각 화면 안에 들어오는지(fit) 확인합니다.
    const centerFits = (centerLeft >= viewportPadding && centerLeft + popoverWidth <= windowRight);
    const leftFits = (alignLeft >= viewportPadding && alignLeft + popoverWidth <= windowRight);
    const rightFits = (alignRight >= viewportPadding && alignRight + popoverWidth <= windowRight);

    // [C] 사용자가 요청한 정렬을 확인합니다.
    const requestedAlign = isAlignLeft ? 'left' : (isAlignRight ? 'right' : 'center');
    
    let finalLeft;

    // [D] 최적의 위치를 선택합니다.
    
    // 1순위: 사용자가 요청한 정렬이 화면에 맞으면, 그것을 사용합니다.
    if (requestedAlign === 'center' && centerFits) {
      finalLeft = centerLeft;
    } else if (requestedAlign === 'left' && leftFits) {
      finalLeft = alignLeft;
    } else if (requestedAlign === 'right' && rightFits) {
      finalLeft = alignRight;
    
    // 2순위: 요청한 정렬이 안 맞으면, 다른 옵션 중 맞는 것을 사용합니다.
    // (가운데 -> 왼쪽 -> 오른쪽 순서로 선호)
    } else if (centerFits) {
      finalLeft = centerLeft;
    } else if (leftFits) {
      finalLeft = alignLeft;
    } else if (rightFits) {
      finalLeft = alignRight;
        
    // 3순위: 모든 정렬이 화면을 넘어갈 때 (팝업이 뷰포트보다 클 때 등)
    //         그때만 화면 끝에 강제로 붙입니다.
    } else {
      if (centerLeft + popoverWidth > windowRight) {
        // 오른쪽으로 넘치면 오른쪽에 붙임
        finalLeft = windowRight - popoverWidth;
      } else {
        // 왼쪽으로 넘치면 왼쪽에 붙임
        finalLeft = viewportPadding;
      }
    }

    // --- 3. 최종 위치 반환 ---
    // (CSS top/left는 스크롤 위치가 포함되어야 함)
    return {
      top: idealTop + window.scrollY,
      left: finalLeft + window.scrollX,
    };
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
// const uiLnb2 = {
//   $sidebar: null,
//   $links: null,
//   $sections: null,
//   offset: 150, 

//   init: function () {
//     this.$sidebar = $(".sidebar");
//     if (!this.$sidebar.length) return;

//     this.$links = this.$sidebar.find("a[href^='#']");
//     if (!this.$links.length) return;

//     this.$sections = $();
//     this.$links.each((i, link) => {
//       const $section = $($(link).attr("href"));
//       if ($section.length) {
//         this.$sections = this.$sections.add($section);
//       }
//     });

//     if (!this.$sections.length) return;
    
//     // [추가] 1. 수동 스크롤 핸들러
//     this.setupManualScrollHandler();
    
//     // [기존] 2. 클릭 핸들러
//     this.setupClickHandlers();

//     // [기존] 3. 스크롤 스파이
//     $(window).on("scroll.sidebarSpy", () => {
//       this.updateActiveState();
//     });

//     this.updateActiveState();
//   },
  
//   /**
//    * [신규] 수동 수평 스크롤 핸들러
//    * 사용자가 LNB를 직접 휠/터치로 스크롤하면
//    * 진행 중인 .animate()를 즉시 중지합니다.
//    */
//   setupManualScrollHandler: function() {
//     // 휠, 마우스휠(IE/Edge), 터치 시작 이벤트 감지
//     this.$sidebar.on('wheel mousewheel touchstart', function() {
//       // .stop(true)는 현재 애니메이션을 즉시 멈춥니다.
//       $(this).stop(true);
//     });
//   },

//   setupClickHandlers: function() {
//     const self = this;
//     this.$links.on('click', function() {
//       const $clickedLi = $(this).closest('li');
//       self.scrollToActiveTab($clickedLi);
//     });
//   },

//   scrollToActiveTab: function($activeLi) {
//     if (!this.$sidebar || !$activeLi || !$activeLi.length) return;

//     const $scroller = this.$sidebar;
//     const overflowX = $scroller.css('overflow-x');
//     if (overflowX !== 'auto' && overflowX !== 'scroll') {
//       return; 
//     }

//     const scrollerWidth = $scroller.innerWidth();
//     const scrollerScrollLeft = $scroller.scrollLeft();
//     const liOffsetLeft = $activeLi.offset().left - $scroller.offset().left;
//     const liWidth = $activeLi.innerWidth();
//     const liLeft = liOffsetLeft + scrollerScrollLeft;
//     const liRight = liLeft + liWidth;
//     const visibleLeft = scrollerScrollLeft;
//     const visibleRight = scrollerScrollLeft + scrollerWidth;
//     const buffer = 16; 
//     let targetScrollLeft = null; 

//     if (liRight > visibleRight) {
//       targetScrollLeft = liRight - scrollerWidth + buffer;
//     } else if (liLeft < visibleLeft) {
//       targetScrollLeft = liLeft - buffer;
//     }

//     if (targetScrollLeft !== null) {
//       // [수정] 
//       // 애니메이션 시작 전, 기존 애니메이션을 멈춥니다.
//       $scroller.stop(true).animate({ scrollLeft: targetScrollLeft }, 300);
//     }
//   },
//   updateActiveState: function () {
//     const scrollTop = $(window).scrollTop();
//     const triggerPos = scrollTop + this.offset;
//     let currentActiveId = null;
//     let $activeLi = null; 

//     const sectionsReversed = this.$sections.get().reverse();
//     for (const section of sectionsReversed) {
//       const $section = $(section);
      
//       if ($section.offset() && $section.offset().top <= triggerPos) {
//         currentActiveId = $section.attr("id");
//         break; 
//       }
//     }

//     if (currentActiveId === null) {
//       currentActiveId = this.$sections.first().attr("id");
//     }

//     if (scrollTop + $(window).height() >= $(document).height() - 50) { 
//       currentActiveId = this.$sections.last().attr("id");
//     }

//     // 사이드바 링크에 active 클래스 적용
//     this.$links.each(function () {
//       const $link = $(this);
//       const $li = $link.closest("li");
      
//       // [수정] 이 라인이 빠져서 에러가 발생했습니다.
//       const href = $link.attr("href"); 

//       if (href === "#" + currentActiveId) {
//         $li.addClass("active");
//         $link.attr("aria-current", "page");
//         $activeLi = $li; 
//       } else {
//         $li.removeClass("active");
//         $link.removeAttr("aria-current");
//       }
//     });

//     if ($activeLi && !this.$sidebar.is(':animated')) {
//       this.scrollToActiveTab($activeLi);
//     }
//   },
// };
// const calendarJquery = {
// 	init: function () {
//     this.initLocalization(); //jQuery UI Datepicker 한국어 설정
//     this.initPickers(); //단일/범위 Datepicker 초기화
//     this.initTriggerButtons(); //캘린더 아이콘 버튼 이벤트 바인딩
//   },
// 	initLocalization: function () {
//     $.datepicker.regional['ko'] = {
//       closeText: '닫기',
//       prevText: '이전달',
//       nextText: '다음달',
//       currentText: '오늘', // 이 텍스트는 getCommonOptions에서 동적으로 덮어씁니다.
//       monthNames: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
//       monthNamesShort: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
//       dayNames: ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'],
//       dayNamesShort: ['일', '월', '화', '수', '목', '금', '토'],
//       dayNamesMin: ['일', '월', '화', '수', '목', '금', '토'], // "일월화수목금토"
//       weekHeader: '주',
//       dateFormat: 'yy-mm-dd', // "2025-09-23" 형식
//       firstDay: 0,
//       isRTL: false,
//       showMonthAfterYear: true, // "2025년 11월"
//       // yearSuffix: '년'
//     };
//     $.datepicker.setDefaults($.datepicker.regional['ko']);
//   },
// 	getCommonOptions: function () {
//     return {
//       changeMonth: true,
//       changeYear: true,
//       showButtonPanel: false, 
//       dateFormat: 'yy-mm-dd',
      
//       beforeShow: function (input, inst) {
//         inst.dpDiv.addClass('calendar-datepicker');

// 				const $anchor = $(input).closest(".calendar-group");

// 				setTimeout(() => {
// 					if ($anchor.length > 0) {
// 						const anchorOffset = $anchor.offset();
// 						const anchorHeight = $anchor.outerHeight();
// 						const anchorWidth = $anchor.outerWidth(); // (요청사항) 기준 요소의 전체 너비
		
// 						// 3. (요청사항) 달력 위치를 부모의 left:0, 하단으로 설정
// 						inst.dpDiv.css({
// 							position: "absolute",
// 							top: anchorOffset.top + anchorHeight + "px", // 부모 하단 + 5px 갭
// 							left: anchorOffset.left + "px", // 부모 left
// 							width: anchorWidth + "px", // (요청사항) 부모 너비와 동일하게
// 						});
// 					}

// 					const $header = inst.dpDiv.find('.ui-datepicker-header');
// 					if ($header.length === 0) return;
	
// 					inst.dpDiv.find('.calendar-today-bar').remove();
	
// 					const today = new Date();
// 					const dayName = $.datepicker.regional['ko'].dayNamesShort[today.getDay()];
// 					const formattedDate = $.datepicker.formatDate('yy-mm-dd', today);
// 					const todayText = `오늘 ${formattedDate} (${dayName})`;
					
// 					const $todayButton = $(`<div class="calendar-today-btn"><button type="button">${todayText}</button></div>`);
					
// 					$todayButton.on('click', function(e) {
// 						e.stopPropagation(); 
						
// 						$(input).datepicker('setDate', new Date());
// 						drawTodayButton(); 
// 					});
// 					$header.after($todayButton);
// 				}, 0);

//         // const drawTodayButton = () => {
//         // };
// 				// setTimeout(() => {
// 				// 	drawTodayButton

// 				// }, 0);
//         // setTimeout(drawTodayButton, 0); 
//       }
//     };
//   },
// 	initPickers: function () {
//     const commonOptions = this.getCommonOptions();

//     $('.calendar-group').each(function () {
//       const $inputs = $(this).find('input.datepicker.cal');

//       // --- 1. 단일 Datepicker (isRange: false) ---
//       if ($inputs.length === 1) {
//         $inputs.datepicker(commonOptions);
//       }
//       // --- 2. 범위 Datepicker (isRange: true) ---
//       else if ($inputs.length === 2) {
//         const $start = $inputs.eq(0);
//         const $end = $inputs.eq(1);

//         // 시작일 옵션
//         $start.datepicker($.extend({}, commonOptions, {
//           onSelect: function (selectedDate) {
//             // 시작일 선택 시, 종료일의 최소 날짜를 설정
//             $end.datepicker("option", "minDate", selectedDate);
//           }
//         }));

//         // 종료일 옵션
//         $end.datepicker($.extend({}, commonOptions, {
//           onSelect: function (selectedDate) {
//             // 종료일 선택 시, 시작일의 최대 날짜를 설정
//             $start.datepicker("option", "maxDate", selectedDate);
//           }
//         }));
//       }
//     });
//   },
// 	initTriggerButtons: function () {
//     $(document).on('click', '.form-btn-datepicker', function (e) {
//       e.preventDefault();
//       const $input = $(this).siblings('input.datepicker.cal');
      
//       if ($input.length) {
//         if ($input.datepicker('widget').is(':visible')) {
//           $input.datepicker('hide');
//         } else {
//           $input.datepicker('show');
//         }
//       }
//     });
//   }
// }
const calendar = {
  init: function () {
    if ($.fn.datepicker && $.fn.datepicker.dates['ko']) {
      $.fn.datepicker.defaults.language = 'ko';
    }
    this.initPickers();
  },

  getCommonOptions: function () {
    return {
      language: 'ko',
      format: 'yyyy-mm-dd',
      autoclose: true,
      todayHighlight: true,
      container: 'body', 
      // todayBtn: "linked", 
      showOutsideDays: false,
      pickerClass: 'calendar-datepicker',
      templates: {
        leftArrow: '<i class="svg-icon icon-prev" aria-label="이전달"></i>',
        rightArrow: '<i class="svg-icon icon-next" aria-label="다음달"></i>'
      }
    };
  },
  initPickers: function () {
    const commonOptions = this.getCommonOptions();
    const self = this; 

    $('.calendar-group').each( (index, element) => {
      const $group = $(element);

      if ($group.parent().find('.datepicker-inline-container').length > 0) return;

      const $inputs = $group.find('input.datepicker.cal');
      const $btns = $group.find('.form-btn-datepicker');
      
      const onShowHandler = (e, inputElement) => {
        const datepickerInstance = $(inputElement).data('datepicker');
        const $picker = datepickerInstance.picker;
        
        let $anchor = $group;

        const anchorOffset = $anchor.offset();
        const anchorHeight = $anchor.outerHeight();
        const anchorWidth = $anchor.outerWidth();

        $picker.css({
          position: 'absolute',
          top: anchorOffset.top + anchorHeight + 'px',
          left: anchorOffset.left + 'px',
          width: anchorWidth + 'px',
        });
        
      };

      if ($inputs.length === 1) {
        const $input = $inputs.first();
        const $btn = $btns.first();

        $input.datepicker(commonOptions)
          .on('show', function(e) {
             onShowHandler(e, this);
          });
        
        $btn.on('click.datepicker', (e) => {
          e.stopPropagation();
          $input.datepicker('show');
        });
      } else if ($inputs.length === 2) {
        const $startInput = $inputs.eq(0);
        const $endInput = $inputs.eq(1);
        const $startBtn = $btns.eq(0);
        const $endBtn = $btns.eq(1);

        // [시작일] 초기화
        $startInput.datepicker(commonOptions)
          .on('show', function(e) {
             onShowHandler(e, this);
          })
          .on('changeDate', function(e) { // 'changeDate' 이벤트 사용
             // 시작일 선택 시, 종료일의 minDate 설정
             if (e.date) {
               $endInput.datepicker('setStartDate', e.date);
             }
          });
        
        $startBtn.on('click.datepicker', (e) => {
          e.stopPropagation();
          $startInput.datepicker('show');
        });

        // [종료일] 초기화
        $endInput.datepicker(commonOptions)
          .on('show', function(e) {
             onShowHandler(e, this);
          })
          .on('changeDate', function(e) { // 'changeDate' 이벤트 사용
            // 종료일 선택 시, 시작일의 maxDate 설정
            if (e.date) {
              $startInput.datepicker('setEndDate', e.date);
            }
          });

        $endBtn.on('click.datepicker', (e) => {
          e.stopPropagation();
          $endInput.datepicker('show');
        });
      }
    });
  },
};
const calendarInline = {
  init: function() {
    // [✨ 수정] ID 대신 클래스로 모든 인라인 컨테이너를 찾습니다.
    $('.datepicker-inline-container').each(function() {
      const $container = $(this);
      
      // (안전장치) 이미 초기화되었으면 건너뜁니다.
      if ($container.data('datepicker-inline-initialized')) return;
      $container.data('datepicker-inline-initialized', true);

      // [✨ 수정] 부모(wrapper)에서 연관된 인풋을 찾습니다.
      // (HTML 구조: <div class="conts-area"> <div class="calendar-group">...</div> <div class="datepicker-inline-container"></div> </div>)
      const $wrapper = $container.parent(); 
      const $startInput = $wrapper.find('.datepicker.cal').eq(0);
      const $endInput = $wrapper.find('.datepicker.cal').eq(1);

      if (!$startInput.length) {
        console.warn('Inline datepicker container found, but no associated inputs (.datepicker.cal) found in parent.');
        return; 
      }

      // 2. 캘린더 옵션 (autoclose=false)
      const options = calendar.getCommonOptions(); 
      options.autoclose = false; 

      // 3. DIV에 datepicker를 인라인으로 직접 초기화합니다.
      $container.datepicker(options);
      
      const datepickerInstance = $container.data('datepicker');
      if (!datepickerInstance) return;

      // 4. [✨ 수정] 이 특정 인스턴스에 대한 이벤트를 바인딩합니다.
      calendarInline.bindEvents($container, $startInput, $endInput);

      // 5. 첫 번째 input을 기본 활성화 상태로 설정
      $startInput.addClass('active'); // (CSS에서 .active 스타일 추가 필요)
      const startDate = $startInput.val();
      if (startDate) {
        $container.datepicker('setDate', startDate);
      }
    });
  },
  
  /**
   * [✨ 수정] 각 인스턴스별로 이벤트를 바인딩하는 함수
   */
  bindEvents: function($container, $startInput, $endInput) {

    // 이벤트 1: 인라인 캘린더에서 날짜를 클릭했을 때
    $container.on('changeDate', function(e) {
      if (!e.date) return;
      const formattedDate = $.fn.datepicker.DPGlobal.formatDate(e.date, 'yyyy-mm-dd', 'ko');
      
      if ($startInput.hasClass('active')) {
        $startInput.val(formattedDate);
        $endInput.trigger('click'); // 종료일 input으로 포커스 이동
      } else {
        $endInput.val(formattedDate);
      }
      calendarInline.updateRange($container, $startInput, $endInput); // 범위 업데이트
    });

    // 이벤트 2: '시작일' Input을 탭/클릭했을 때
    $startInput.on('click focus', function() {
      $startInput.addClass('active');
      $endInput.removeClass('active');
      
      const date = $(this).val();
      if (date) {
        $container.datepicker('setDate', date);
      }
      calendarInline.updateRange($container, $startInput, $endInput);
    });

    // 이벤트 3: '종료일' Input을 탭/클릭했을 때
    $endInput.on('click focus', function() {
      $endInput.addClass('active');
      $startInput.removeClass('active');
      
      const date = $(this).val();
      if (date) {
        $container.datepicker('setDate', date);
      }
      calendarInline.updateRange($container, $startInput, $endInput);
    });
  },

  // [✨ 수정] 캘린더의 min/max 날짜를 설정하는 헬퍼 함수
  updateRange: function($container, $startInput, $endInput) {
    const startDate = $startInput.val();
    const endDate = $endInput.val();

    // setStartDate/EndDate는 date 객체나 빈 문자열을 받아야 합니다.
    $container.datepicker('setStartDate', startDate ? new Date(startDate) : null);
    $container.datepicker('setEndDate', endDate ? new Date(endDate) : null);
  }
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
		calendar.init();
		calendarInline.init();

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