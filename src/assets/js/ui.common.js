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

    // 적용된 클래스를 읽어 기본 위치 결정
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

    // X축 (left) 위치 계산
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
        case " ":
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
          if (isOpen) {
            uiSelect.close($select);
          }
          break;
      }
    });
  },
  open: function ($select) {
    if ($select.hasClass("disabled")) return;

    uiSelect.closeAll();
    uiPopover.closeAll();

    const $btn = $select.find(".select-button");
    const $listbox = $select.find(".select-listbox");

    $select.addClass("active");
    $btn.attr("aria-expanded", "true");
    $listbox.removeAttr("hidden");

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

    $listbox
      .find('[aria-selected="true"]')
      .attr("aria-selected", "false")
      .removeClass("selected");

    $option.attr("aria-selected", "true").addClass("selected");

    $valueDisplay.text(newText).removeClass("placeholder");
    $nativeSelect.val(newValue).trigger("change");

    uiSelect.close($select);
    $btn.focus();
  },
};
const uiInputClear = {
  init: function () {
    $(document).on("input.uiInputClear", ".input input", function () {
      const $input = $(this);
      const $clearBtn = $input.siblings(".btn-clear");
      const show = $input.val().length > 0 && !$input.prop('disabled') && !$input.prop('readonly');
      $clearBtn.toggleClass("active", show);
    });
    $(document).on("click.uiInputClear", ".input .btn-clear", function (e) {
      e.preventDefault();
      const $clearBtn = $(this);
      const $input = $clearBtn.siblings("input");
      $input.val("").trigger("input").focus();
    });
  }
};
const uiInputStateSync = {
  syncState: function($input) {
    if (!$input || !$input.length) return;
    
    const $wrapper = $input.closest('.input');
    if (!$wrapper.length) return;

    $wrapper.toggleClass('disabled', $input.prop('disabled'));
    $wrapper.toggleClass('readonly', $input.prop('readonly'));
  },

  init: function () {
    const self = this;
    const $inputs = $('.input input');
    
    if ($inputs.length === 0) return;

    const observerCallback = (mutationsList) => {
      for (const mutation of mutationsList) {
        if (mutation.type === 'attributes' && (mutation.attributeName === 'disabled' || mutation.attributeName === 'readonly')) {
          self.syncState($(mutation.target));
        }
      }
    };

    const observer = new MutationObserver(observerCallback);

    $inputs.each(function() {
      const $input = $(this);
      self.syncState($input);
      observer.observe(this, { 
        attributes: true, 
        attributeFilter: ['disabled', 'readonly'] 
      });
    });
  }
};
const uiModal = {
  baseZIndex: 5,
  init: function () {
    $(document).on("click", "[data-modal-open]", function (e) {
      e.preventDefault();
      const $trigger = $(this);
      const modalId = $trigger.data("modal-open");
      uiModal.open(modalId, $trigger);
    });

    $(document).on("click", ".modal .btn-close", function (e) {
      e.preventDefault();
      const $modal = $(this).closest(".modal");
      uiModal.close($modal.attr("id"));
    });

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

    $modal.data("modal-trigger", $trigger);

		$("html").css('overflow', 'hidden');
    $modal.addClass("show");
    setTimeout(() => $modal.addClass("in"), 10);

    $modal.one("transitionend", () => {
      if ($scrollableConts.length) {
        $scrollableConts.focus();
      } else {
        $content.focus();
      }
    });

    uiUtils.focusTrap($content);
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
          $otherContent.removeClass("active");
        });
      }

      $button.attr("aria-expanded", isOpening);
      $button.toggleClass("active", isOpening);
      $currentItem.toggleClass("active", isOpening);
      $accordionContent.toggleClass("active", isOpening);
    });
  },
};
const uiTab = {
  scrollTabIntoView: function($tab, $tablist, smooth = true) {
    if (!$tab.length || !$tablist.length) return;
    
    if ($tablist[0].scrollWidth <= $tablist[0].clientWidth) return;

    const containerWidth = $tablist.outerWidth();
    const scrollLeft = $tablist.scrollLeft();
    const tabOffsetLeft = $tab[0].offsetLeft; 
    const tabWidth = $tab.outerWidth();
    
    const containerVisibleRight = scrollLeft + containerWidth;
    const tabRight = tabOffsetLeft + tabWidth;
    let newScrollLeft = null;
    const buffer = 20;

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

      // 기존 활성 탭/패널 비활성화
      const $activeTab = $tablist.find(".active");
      const $activePanel = $tabArea.find(".tab-conts.active");

      $activeTab.removeClass("active").attr("aria-selected", "false").find(".sr-only").remove();
      $activePanel.removeClass("active");

      // 새 탭/패널 활성화
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
const uiToast = {
  $viewport: null,
  messages: {
    'download': '선택한 파일이 다운로드되었습니다.',
  },
  init: function () {
    const self = this;

    this.$viewport = $(".toast-container");
    if (this.$viewport.length === 0) return;

    $(document).on('click.uiToast', '[data-toast]', function(e) {
      const $btn = $(this);
      const toastKey = $btn.data('toast'); 
      const message = self.messages[toastKey] || toastKey;

      self.show(message);
    });
  },
  show: function (message, duration = 3000) {
    if (!message) return;
    if (this.$viewport.length === 0) return;

    const $toast = $('<div class="toast"></div>');
    $toast.text(message);
    this.$viewport.append($toast);

    setTimeout(() => {
      $toast.addClass("show");
    }, 10);
    setTimeout(() => {
      $toast.removeClass("show");
    }, duration);

    setTimeout(() => {
      $toast.remove();
    }, duration + 400);
  }
};
const uiSegmentControl = {
  init: function () {
    // 네이티브 라디오 (change 이벤트)
    $(document).on("change", '.segment-control input[type="radio"]', function () {
        const $input = $(this);
        const $group = $input.closest(".segment-control");

        $group.find('label').removeClass('active');
        $input.closest('label').addClass('active');
      }
    );

    // 커스텀 버튼 (click 이벤트)
    $(document).on("click", '.segment-control button[role="radio"]', function (e) {
        e.preventDefault();

        const $btn = $(this);
        if ($btn.hasClass("active") || $btn.is(":disabled")) return;

        const $group = $btn.closest('[role="radiogroup"]');

        $group.find('button[role="radio"]').removeClass("active").attr({ "aria-checked": "false", tabindex: "-1" });
        $btn.addClass("active").attr({ "aria-checked": "true", tabindex: "0" });
      }
    );

    // 키보드 네비게이션 (커스텀 버튼용)
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

    $(document).on("click", ".popover .btn-close", function (e) {
      e.preventDefault();
      const $popover = $(this).closest(".popover");
      uiPopover.close($popover);
    });
  },
	open: function($btn, $popover) {
		uiPopover.closeAll();
		uiSelect.closeAll(); 

		const posData = $btn.data('popover-pos') || 'bottom-center';
		const parts = posData.split('-'); 

		const newPosition = parts[0] || 'bottom';
		const newAlign = parts[1] || 'center';

		const positionClasses = 'top bottom left right';
		const alignClasses = 'align-top align-bottom align-left align-right align-center';
		$popover.removeClass(positionClasses).removeClass(alignClasses);

		$popover.addClass(newPosition);
		if (newAlign !== 'center') {
			$popover.addClass('align-' + newAlign);
		}

		$popover.addClass("active").attr("aria-hidden", "false");

		const position = uiUtils.calculatePosition($btn, $popover, 10);
		$popover.css({
			top: position.top + "px",
			left: position.left + "px",
		});

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
    $tooltip.addClass("active");
    const position = uiUtils.calculatePosition($btn, $tooltip, 8);
    $tooltip.css({
      top: position.top + "px",
      left: position.left + "px",
    });
  },
  hide: function ($tooltip) {
    $tooltip.removeClass("active");
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
        break;
      }
    }
    if (currentActiveId === null) {
      currentActiveId = this.$sections.first().attr("id");
    }
    if (scrollTop + $(window).height() >= $(document).height() - 50) {
      currentActiveId = this.$sections.last().attr("id");
    }
    this.$links.each(function () {
      const $link = $(this);
      const $li = $link.closest("li");
      const href = $link.attr("href");

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
const uiLnb2 = {
  $sidebar: null,
  $links: null,
  $sections: null,
  offset: 150, 
  isClickScrolling: false,
  pauseTimer: null, 
  scrollItemIntoView: function($item, $container, smooth = true) {
    if (!$item.length || !$container.length) return;
    
    const isHorizontallyScrollable = $container[0].scrollWidth > $container[0].clientWidth;
    if (!isHorizontallyScrollable) return;

    const containerWidth = $container.outerWidth();
    const scrollLeft = $container.scrollLeft();
    const itemOffsetLeft = $item[0].offsetLeft;
    const itemWidth = $item.outerWidth();
    
    const containerVisibleRight = scrollLeft + containerWidth;
    const itemRight = itemOffsetLeft + itemWidth;
    let newScrollLeft = null;
    const buffer = 20; 

    if (itemRight > containerVisibleRight) { 
      newScrollLeft = itemRight - containerWidth + buffer;
    } else if (itemOffsetLeft < scrollLeft) { 
      newScrollLeft = itemOffsetLeft - buffer;
    }
    
    if (newScrollLeft !== null) {
      if (smooth) {
        $container.stop().animate({ scrollLeft: newScrollLeft }, 300);
      } else {
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
    
    this.setupClickHandlers();
    
    $(window).on("scroll.sidebarSpy", () => {
      this.updateActiveState();
    });

    this.updateActiveState();
  },
  setupClickHandlers: function() {
    const self = this;
    this.$links.on('click.lnbClick', function(e) {
      e.preventDefault(); 
      const $link = $(this);
      const $targetSection = $($link.attr('href'));
      
      if ($targetSection.length) {
        self.isClickScrolling = true;
        clearTimeout(self.pauseTimer);

        self.setActiveIndicator($link, true);

        const targetScrollTop = $targetSection.offset().top - self.offset + 1;
        const animationDuration = 500; 

        $('html, body').stop().animate({
          scrollTop: targetScrollTop
        }, animationDuration, () => {
          self.pauseTimer = setTimeout(() => {
            self.isClickScrolling = false;
          }, 50); 
        });
      }
    });
  },
  updateActiveState: function () {
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

    const $activeLink = this.$links.filter(`[href="#${currentActiveId}"]`);
    this.setActiveIndicator($activeLink, false);
  },
  setActiveIndicator: function($anchor, isSmooth) {
    if (!$anchor || !$anchor.length) return;
    const $li = $anchor.closest('li');

    if ($li.hasClass('active')) return;
    
    this.$links.closest('li').removeClass('active');
    this.$links.removeAttr('aria-current');
    
    $li.addClass('active');
    $anchor.attr('aria-current', 'page');
    
    this.scrollItemIntoView($li, this.$sidebar, isSmooth);
  }
};
const gsapMotion = {
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
  defaults: {
    gsap: {
      opacity: 0,
      duration: 1, 
      ease: "power3.out", 
    },
    scrollTrigger: {
      start: "top 75%",
      toggleActions: "restart none none reverse",
      markers: false
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
          break;
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
const topButton = {
  init: function () {
    const $window = $(window);
    const $button = $('.footer-btn-top');
    const $footer = $('.footer');

    if (!$button.length || !$footer.length) return;
    const showThreshold = 200;
    let footerTop = $footer.offset().top;

    function onScroll() {
      const scrollTop = $window.scrollTop();
      const windowHeight = $window.height();

      if (scrollTop > showThreshold) {
        $button.addClass('is-visible');
      } else {
        $button.removeClass('is-visible');
      }
      footerTop = $footer.offset().top; 
      if (scrollTop + windowHeight >= footerTop) {
        $button.removeClass('is-fixed');
      } else {
        $button.addClass('is-fixed');
      }
    }

    $window.on('scroll.scrollTop resize.scrollTop', onScroll);
    onScroll();
    $button.on('click', 'a', function(e) {
      e.preventDefault();
      $('html, body').animate({ scrollTop: 0 }, 300);
    });
  }
}

// 캘린더 기능 예시용
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
      maxViewMode: 1,
      titleFormat: 'yyyy-mm',
      yearTitleFormat: 'yyyy년',
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
          .on('changeDate', function(e) {
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
          .on('changeDate', function(e) {
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
    let $container = $('.datepicker-inline-container');
    $('.calendarOpen').click(function(){
      const $wrapper = $('#mobilFilterBottomSheet');
      const $startInput = $wrapper.find('.calendar').eq(0);
      const $endInput = $wrapper.find('.calendar').eq(1);

      $wrapper.find('.calendar').removeClass('focus');
      $startInput.addClass('focus');

      if($startInput.find('input').val() != '' ) {
        calendarInline.updateRange($container, $startInput.find('input').val());
      } else {
        calendarInline.updateRange($container, null);
      }
    });

    $container.each(function() {
      const $container = $(this);
      
      if ($(this).data('datepicker-inline-initialized')) return;
      $(this).data('datepicker-inline-initialized', true);

      const $wrapper = $(this).parent(); 
      const $startInput = $wrapper.find('.calendar').eq(0);
      const $endInput = $wrapper.find('.calendar').eq(1);

      const options = calendar.getCommonOptions(); 
      options.autoclose = false; 

      $(this).datepicker(options);
      
      const datepickerInstance = $(this).data('datepicker');
      if (!datepickerInstance) return;

      calendarInline.bindEvents($(this), $startInput, $endInput);
    });
  },
  formatDate: function(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  },
  bindEvents: function($container, $startInput, $endInput) {
    let startDate = '';

    $container.on('changeDate', function(e) {
      if (!e.date) return;
      const formattedDate = calendarInline.formatDate(e.date);

      if ($startInput.hasClass('focus')) {
        $startInput.find('input').val(formattedDate);
        startDate = formattedDate;
      } else {
        $endInput.find('input').val(formattedDate);
      }

      calendarInline.updateRange($container, e.date); // 범위 업데이트
    });
    $startInput.on('click', function() {
      $startInput.addClass('focus');
      $endInput.removeClass('focus');
      
      const date = $(this).find('input').val();
      if (date) {
        calendarInline.updateRange($container, date);
      } else {
        calendarInline.updateRange($container, null);
      }
    });
    $endInput.on('click', function() {
      $endInput.addClass('focus');
      $startInput.removeClass('focus');

      if( startDate != '' ) {
        $container.datepicker('setStartDate', startDate ? new Date(startDate) : null);
      }
      
      const date = $(this).find('input').val();
      if (date) {
        calendarInline.updateRange($container, date);
      } else {
        calendarInline.updateRange($container, null);
      }
    });
  },
  updateRange: function($container, $date) {
    $container.datepicker('update', $date ? new Date($date) : null);
  }
};

const commonJs = {
  init: function () {
    uiSelect.init();
    uiInputClear.init();
    uiInputStateSync.init();
    uiModal.init();
    uiAccordion.init();
    uiTab.init();
    uiToast.init();
    uiSegmentControl.init();
    uiPopover.init();
    uiTooltip.init();
    uiLnb.init();
    gsapMotion.init();
    topButton.init();

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