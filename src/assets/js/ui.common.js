"use strict";

// [공통 유틸리티] uiUtils 공통 함수
const uiUtils = {
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
          event.preventDefault();
          $lastFocusableElement.focus();
        } else if (!event.shiftKey && $activeElement.is($lastFocusableElement)) {
          event.preventDefault();
          $firstFocusableElement.focus();
        }
      }
    });
  },
  removeFocusTrap: function ($trap) {
    $trap.off("keydown.focustrap");
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

    // Y축 (top) 위치 계산
    if (isTop) {
      idealTop = btnRect.top - popoverHeight - gap;
    } else if (isLeft) {
      if (isAlignTop) idealTop = btnRect.top;
      else if (isAlignBottom) idealTop = btnRect.bottom - popoverHeight;
      else idealTop = btnRect.top + (btnRect.height / 2) - (popoverHeight / 2); // Center
    } else { // 기본값: bottom
      idealTop = btnRect.bottom + gap;
    }

    // 2. X축 (left) 위치 계산
    const viewportPadding = 10;
    const windowRight = window.innerWidth - viewportPadding;

    const centerLeft = btnRect.left + (btnRect.width / 2) - (popoverWidth / 2);
    const alignLeft = btnRect.left;
    const alignRight = btnRect.right - popoverWidth;

    const centerFits = (centerLeft >= viewportPadding && centerLeft + popoverWidth <= windowRight);
    const leftFits = (alignLeft >= viewportPadding && alignLeft + popoverWidth <= windowRight);
    const rightFits = (alignRight >= viewportPadding && alignRight + popoverWidth <= windowRight);

    const requestedAlign = isAlignLeft ? 'left' : (isAlignRight ? 'right' : 'center');
    
    let finalLeft;
    
    if (requestedAlign === 'center' && centerFits) {
      finalLeft = centerLeft;
    } else if (requestedAlign === 'left' && leftFits) {
      finalLeft = alignLeft;
    } else if (requestedAlign === 'right' && rightFits) {
      finalLeft = alignRight;
    } else if (centerFits) {
      finalLeft = centerLeft;
    } else if (leftFits) {
      finalLeft = alignLeft;
    } else if (rightFits) {
      finalLeft = alignRight;
    } else {
      if (centerLeft + popoverWidth > windowRight) {
        finalLeft = windowRight - popoverWidth;
      } else {
        finalLeft = viewportPadding;
      }
    }
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
    $listbox.scrollTop(
      $listbox.scrollTop() + $selected.position().top - $listbox.height() / 2 + $selected.height() / 2
    );
  },
  close: function ($select) {
    const $btn = $select.find(".select-button");
    const $listbox = $select.find(".select-listbox");

    $select.removeClass("active");
    $btn.attr("aria-expanded", "false");
    $listbox.attr("hidden", true);
  },
  closeAll: function () {
    $(".form-select.active").each(function () {
      uiSelect.close($(this));
    });
  },
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
      .removeClass("selected");

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
  baseZIndex: 5,
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
    $(document).on("click", ".modal.show", function (e) {
      if ($(e.target).hasClass("modal-back")) {
        const $modal = $(this);
        uiModal.close($modal.attr("id"));
      }
    });
  },
  open: function (id, $trigger) {
    const $modal = $(`#${id}`);
    if (!$modal.length) return;

    let maxZIndex = this.baseZIndex;
    const $visibleModals = $('.modal.in, .modal.show').not($modal);
    if ($visibleModals.length > 0) {
      $visibleModals.each(function() {
        const currentZ = parseInt($(this).css('z-index'), 10) || uiModal.baseZIndex;
        if (currentZ > maxZIndex) {
          maxZIndex = currentZ;
        }
      });
    }
    $modal.css('z-index', maxZIndex + 1);

    const $content = $modal.find(".modal-content");
    const $scrollableConts = $modal.find(".modal-conts[tabindex='0']");

    // 모달을 연 트리거 저장
    $modal.data("modal-trigger", $trigger);

		$("html").css('overflow', 'hidden');
    $modal.addClass("show");
    setTimeout(() => $modal.addClass("in"), 10);

    // 3. 트랜지션 완료 후 포커스 이동
    $modal.one("transitionend", () => {
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
  close: function (id) {
    const $modal = $(`#${id}`);
    if (!$modal.length) return;

    const $trigger = $modal.data("modal-trigger");
    const $content = $modal.find(".modal-content");

    $modal.removeClass("in");

    $modal.one("transitionend", () => {
      $modal.removeClass("show");

      $modal.css('z-index', ''); 

      // 다른 모달이 열려있지 않을 때만 body 스크롤 복원
      if ($(".modal.in").length === 0) {
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
  scrollTabIntoView: function($tab, $tablist, smooth = true) {
    if (!$tab.length || !$tablist.length) return;
    
    // 1. 컨테이너가 스크롤 가능한지 확인 (가로 스크롤만)
    if ($tablist[0].scrollWidth <= $tablist[0].clientWidth) return;

    const containerWidth = $tablist.outerWidth();
    const scrollLeft = $tablist.scrollLeft();
    const tabOffsetLeft = $tab[0].offsetLeft; // 부모($tablist) 기준 탭의 왼쪽 위치
    const tabWidth = $tab.outerWidth();
    
    const containerVisibleRight = scrollLeft + containerWidth;
    const tabRight = tabOffsetLeft + tabWidth;
    let newScrollLeft = null;
    const buffer = 20; // 좌우 20px 여유 공간

    if (tabRight > containerVisibleRight) { 
      newScrollLeft = tabRight - containerWidth + buffer;
    } else if (tabOffsetLeft < scrollLeft) { 
      newScrollLeft = tabOffsetLeft - buffer;
    }
    
    if (newScrollLeft !== null) {
      if (smooth) {
        $tablist.stop().animate({ scrollLeft: newScrollLeft }, 300);
      } else {
        $tablist.scrollLeft(newScrollLeft);
      }
    }
  },

  init: function () {
    $(document).on("click", '.tab [role="tablist"] .btn-tab', function (e) {
      e.preventDefault();
      const $btn = $(this);
      const $tab = $btn.closest('[role="tab"]');

      if ($tab.hasClass("active") || $btn.is(":disabled")) return;

      const $tabArea = $tab.closest(".tab-area");
      const $tablist = $tab.closest('[role="tablist"]');
      const $targetPanel = $(`#${$tab.attr("aria-controls")}`);

      // 1. 기존 활성 탭/패널 비활성화
      const $activeTab = $tablist.find(".active");
      const $activePanel = $tabArea.find(".tab-conts.active");

      $activeTab.removeClass("active").attr("aria-selected", "false").find(".sr-only").remove();
      $activePanel.removeClass("active");

      // 2. 새 탭/패널 활성화
      $tab.addClass("active").attr("aria-selected", "true");
      $btn.append('<span class="sr-only">선택됨</span>');
      $targetPanel.addClass("active");

      uiTab.scrollTabIntoView($tab, $tablist, true);
    });

    // 키보드 네비게이션
    $(document).on("keydown", '.tab [role="tablist"] .btn-tab', function (e) {
      const $btn = $(this);
      const $tab = $btn.closest('[role="tab"]');
      const $tablist = $tab.closest('[role="tablist"]');
      let $nextTab;

      switch (e.key) {
        case "ArrowLeft":
        case "ArrowUp":
          e.preventDefault();
          $nextTab = $tab.prev();
          if (!$nextTab.length) {
            $nextTab = $tab.siblings().last();
          }
          break;
        case "ArrowRight":
        case "ArrowDown":
          e.preventDefault();
          $nextTab = $tab.next();
          if (!$nextTab.length) {
            $nextTab = $tab.siblings().first();
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
      
      if ($nextTab && $nextTab.length) {
        $nextTab.find(".btn-tab").focus();
        uiTab.scrollTabIntoView($nextTab, $tablist, false);
      }
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
				if ($currentTrigger && $currentTrigger[0] === $btn[0]) {
          uiPopover.close($popover);
        } else {
          uiPopover.open($btn, $popover);
        }
      } else {
        uiPopover.open($btn, $popover);
      }
    });

    // 2. 팝오버 닫기 (내부 닫기 버튼)
    $(document).on("click", ".popover .btn-close", function (e) {
      e.preventDefault();
      const $popover = $(this).closest(".popover"); // 클래스명 변경
      uiPopover.close($popover);
    });
  },
	open: function($btn, $popover) {
		// 1. 다른 팝오버/셀렉트 닫기
		uiPopover.closeAll();
		uiSelect.closeAll(); 

		// 2. 버튼에서 위치/정렬 값 읽어오기 
		const posData = $btn.data('popover-pos') || 'bottom-center';
		const parts = posData.split('-'); 

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
    $tooltip.addClass("active");
    
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
const uiLnb = {
  $sidebar: null,
  $links: null,
  $sections: null,
  offset: 150, 
  isClickScrolling: false, // [신규] 클릭으로 인한 스크롤인지 확인
  pauseTimer: null,      // [신규] 스크롤 감지 재개를 위한 타이머

  /**
   * [신규] 탭/LNB 항목을 스크롤 영역 안으로 이동시키는 헬퍼
   * (uiTab에서 가져온 공통 함수)
   */
  scrollItemIntoView: function($item, $container, smooth = true) {
    if (!$item.length || !$container.length) return;
    
    // 1. 컨테이너가 가로로 스크롤 가능한지 확인 (모바일 LNB)
    const isHorizontallyScrollable = $container[0].scrollWidth > $container[0].clientWidth;
    if (!isHorizontallyScrollable) return; // 가로 스크롤 아니면 중단

    // --- jQuery .animate() (부드러운 "모션" 스크립트) ---
    const containerWidth = $container.outerWidth();
    const scrollLeft = $container.scrollLeft();
    const itemOffsetLeft = $item[0].offsetLeft; // 부모($container) 기준 아이템의 왼쪽 위치
    const itemWidth = $item.outerWidth();
    
    const containerVisibleRight = scrollLeft + containerWidth;
    const itemRight = itemOffsetLeft + itemWidth;
    let newScrollLeft = null;
    const buffer = 20; // 좌우 20px 여유 공간

    if (itemRight > containerVisibleRight) { 
      // 아이템이 오른쪽에 잘렸을 때
      newScrollLeft = itemRight - containerWidth + buffer;
    } else if (itemOffsetLeft < scrollLeft) { 
      // 아이템이 왼쪽에 잘렸을 때
      newScrollLeft = itemOffsetLeft - buffer;
    }
    
    if (newScrollLeft !== null) {
      if (smooth) {
        $container.stop().animate({ scrollLeft: newScrollLeft }, 300); // 0.3초 "모션"
      } else {
        // 스크롤 스파이(수동 스크롤)는 즉시 반영
        $container.scrollLeft(newScrollLeft);
      }
    }
  },

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
    
    // [신규] 1. LNB 링크 클릭 이벤트 (페이지 세로 스크롤 담당)
    this.setupClickHandlers();
    
    // 2. 수동 스크롤 이벤트 (스크롤 스파이 담당)
    $(window).on("scroll.sidebarSpy", () => {
      this.updateActiveState();
    });

    this.updateActiveState();
  },

  /**
   * [신규] LNB 링크 클릭 시, 페이지(세로)를 스크롤하는 핸들러
   */
  setupClickHandlers: function() {
    const self = this;
    this.$links.on('click.lnbClick', function(e) {
      e.preventDefault(); 
      const $link = $(this);
      const $targetSection = $($link.attr('href'));
      
      if ($targetSection.length) {
        // 1. 스크롤 스파이(updateActiveState)를 잠시 멈춤
        self.isClickScrolling = true;
        clearTimeout(self.pauseTimer);

        // 2. (즉시) 클릭한 메뉴 활성화 (active 클래스 + 가로 스크롤)
        self.setActiveIndicator($link, true); // true = 부드럽게

        // 3. 페이지(세로) 스크롤 애니메이션
        const targetScrollTop = $targetSection.offset().top - self.offset + 1;
        const animationDuration = 500; // 0.5초

        $('html, body').stop().animate({
          scrollTop: targetScrollTop
        }, animationDuration, () => {
          // 4. 애니메이션 완료 후 스크롤 스파이 재개
          self.pauseTimer = setTimeout(() => {
            self.isClickScrolling = false;
          }, 50); // 50ms 여유
        });
      }
    });
  },

  /**
   * [수정] 스크롤 스파이 (수동 스크롤 감지)
   */
  updateActiveState: function () {
    // 1. 클릭으로 스크롤 중이면, 스파이 로직 중단
    if (this.isClickScrolling) return;

    const scrollTop = $(window).scrollTop();
    const triggerPos = scrollTop + this.offset;
    let currentActiveId = null;

    const sectionsReversed = this.$sections.get().reverse();
    for (const section of sectionsReversed) {
      const $section = $(section);
      if ($section.offset() && $section.offset().top <= triggerPos) {
        currentActiveId = $section.attr("id");
        break; 
      }
    }

    if (currentActiveId === null) {
      currentActiveId = this.$sections.first().attr("id");
    }

    if (scrollTop + $(window).height() >= $(document).height() - 50) {
      currentActiveId = this.$sections.last().attr("id");
    }

    // 2. 현재 ID에 해당하는 링크를 찾아 활성화
    const $activeLink = this.$links.filter(`[href="#${currentActiveId}"]`);
    this.setActiveIndicator($activeLink, false); // false = 즉시
  },

  /**
   * [신규] 활성화 및 LNB(가로) 스크롤을 담당하는 공통 함수
   * @param {jQuery} $anchor - 활성화할 <a> 태그
   * @param {boolean} isSmooth - 가로 스크롤을 부드럽게 할지 여부
   */
  setActiveIndicator: function($anchor, isSmooth) {
    if (!$anchor || !$anchor.length) return;
    const $li = $anchor.closest('li');

    // 이미 활성화 상태면 중단
    if ($li.hasClass('active')) return;
    
    // 1. 모든 링크 비활성화
    this.$links.closest('li').removeClass('active');
    this.$links.removeAttr('aria-current');
    
    // 2. 타겟 링크 활성화
    $li.addClass('active');
    $anchor.attr('aria-current', 'page');
    
    // 3. (모바일용) LNB 가로 스크롤 실행
    this.scrollItemIntoView($li, this.$sidebar, isSmooth);
  }
};
const gsapMotion = {
  // 1. 애니메이션 유형 정의 (클래스 이름: GSAP 'from' 속성)
  animationTypes: {
    "fade-up": { y: 50 },
    "fade-down": { y: -50 },
    "fade-left": { x: 50 }, // (X축 기준) 오른쪽에서 왼쪽으로
    "fade-right": { x: -50 }, // (X축 기준) 왼쪽에서 오른쪽으로
    "zoom-in": { scale: 0.8 },
    "zoom-out": { scale: 1.2 },
    "opacity": { /* opacity: 0은 기본값이므로 별도 속성 없음 */ },
    "chart-bar-up": {height: 0},
  },

  // 2. GSAP 및 ScrollTrigger 기본값
  defaults: {
    gsap: {
      opacity: 0,
      duration: 1,    // 기본 속도 0.8초
      ease: "power3.out", // 부드러운 시작
    },
    scrollTrigger: {
      start: "top 75%", // 사용자가 요청한 기본값 (화면 80% 지점)
      toggleActions: "restart none none reverse",
      markers: false // 디버깅 시 true로 변경
    }
  },

  init: function() {
    const $motion = $('.motion');

    $motion.each((index, el) => {
      let gsapProps = { ...this.defaults.gsap };
      let scrollTriggerProps = { ...this.defaults.scrollTrigger, trigger: el };

      let typeApplied = false;
      for (const type in this.animationTypes) {
        if (el.classList.contains(type)) {
          gsapProps = { ...gsapProps, ...this.animationTypes[type] };
          typeApplied = true;
          break; // 여러 유형이 있어도 첫 번째 것만 적용
        }
      }

      const delay = el.dataset.delay;       // data-delay="0.2" (0.2초 지연)
      const duration = el.dataset.duration; // data-duration="1.5" (1.5초 동안)
      const start = el.dataset.start;       // data-start="top 90%" (트리거 위치)
      const stagger = el.dataset.stagger;   // data-stagger="0.1" (자식 요소들 0.1초 간격)

      if (delay) gsapProps.delay = parseFloat(delay);
      if (duration) gsapProps.duration = parseFloat(duration);
      if (start) scrollTriggerProps.start = start;
      if (el.classList.contains('chart-bar-up')) {
        gsapProps.height = 0;
      }

      gsapProps.scrollTrigger = scrollTriggerProps;

      if (stagger) {
        gsap.from(el.children, { ...gsapProps, stagger: parseFloat(stagger) });
      } else {
        gsap.from(el, gsapProps);
      }
    });
  }
};


const calendar = {
  init: function () {
    if ($.fn.datepicker && $.fn.datepicker.dates['ko']) {
      $.fn.datepicker.defaults.language = 'ko';

			$.fn.datepicker.dates['ko'].titleFormat = "yyyy-mm";
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
      todayBtn: "linked", 
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

    gsapMotion.init();

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