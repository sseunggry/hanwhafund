let projectName = 'hwf';
let scrollTop = 0;

const commonJs = {
  init: function () {
    this.resize();
    this.scroll();

    // 모든 컴포넌트 init 호출
    this.customSelect.init();
    this.segmentControl.init();
    this.tooltip.init();
    this.modal.init();
    this.accordion.init();
    this.tab.init();

    this.bindGlobalEvents();
  },
  bindGlobalEvents: function () {
    if (!window.commonJsResizeListenerAttached) {
      const debouncedResize = this.debounce(this.resize, 150);
      $(window).on('resize.commonJs', debouncedResize);
      window.commonJsResizeListenerAttached = true;
    }
    if (!window.commonJsScrollListenerAttached) {
      const debouncedScroll = this.debounce(this.scroll, 150);
      $(window).on('scroll.commonJs', () => {
        scrollTop = $(window).scrollTop();
        debouncedScroll();
      });
      window.commonJsScrollListenerAttached = true;
    }
  },
  resize: function () {
    // console.log('Resized');
    // EJS 수정: 리사이즈 시 툴팁 위치 업데이트
    commonJs.tooltip.updateAllVisibleTooltipPositions();
  },
  scroll: function () {
    // console.log('Scrolled:', scrollTop);
    // EJS 수정: 스크롤 시 툴팁 위치 업데이트
    commonJs.tooltip.updateAllVisibleTooltipPositions();
  },
  debounce: function (func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => { clearTimeout(timeout); func.apply(this, args); };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },
  customSelect: {
    init: function () {
      const $wrappers = $(`.${projectName}-form-select`);
      if ($wrappers.length === 0) return;

      $wrappers.each(function () {
        const $wrapper = $(this);
        if ($wrapper.data('custom-select-initialized')) return;
        $wrapper.data('custom-select-initialized', true);

        const $select = $wrapper.find('select.sr-only');
        const $button = $wrapper.find('.select-button');
        const $valueSpan = $button.find('.select-value');
        const $listbox = $wrapper.find('.select-listbox');
        const $options = $listbox.find('.select-option');
        const placeholder = $select.data('placeholder') || '';
        const isDisabled = $select.is(':disabled');
        const listboxId = $listbox.attr('id') || `custom-select-${Math.random().toString(36).substring(2, 9)}`;
        $listbox.attr('id', listboxId);

        if (isDisabled) {
          $wrapper.addClass('disabled');
          $button.attr('aria-disabled', 'true').attr('tabindex', '-1');
          return;
        }

        // --- 헬퍼 함수 ---
        const closeListbox = () => {
          $listbox.attr('hidden', true);
          $button.attr('aria-expanded', 'false');
          $(document).off('click.customSelect.' + listboxId);
          if (!$button.is(':focus')) {
            $button.focus();
          }
        };
        const openListbox = () => {
          if (isDisabled) return;
          // 다른 열린 셀렉트박스 닫기
          $('[data-custom-select-initialized="true"] .select-button[aria-expanded="true"]').not($button).each(function () {
            $(this).attr('aria-expanded', 'false');

            const $otherListbox = $(this).closest(`.${projectName}-form-select`).find('.select-listbox');
            $otherListbox.attr('hidden', true);
            const otherListboxId = $otherListbox.attr('id');
            $(document).off('click.customSelect.' + otherListboxId);
          });
          $listbox.removeAttr('hidden');
          $button.attr('aria-expanded', 'true');
          let $focusedOption = $options.filter('[aria-selected="true"]');
          if (!$focusedOption.length) $focusedOption = $options.not('.disabled').first();
          setTimeout(() => {
            if ($focusedOption.length) $focusedOption.focus();
            else if ($options.length) $options.not('.disabled').first().focus();
            else $listbox.focus();
          }, 0);
          $(document).on('click.customSelect.' + listboxId, handleOutsideClick);
        };
        const toggleListbox = () => {
          if ($button.attr('aria-expanded') === 'true') closeListbox();
          else openListbox();
        };
        const selectOption = ($option) => {
          if (!$option || !$option.length || $option.hasClass('disabled')) return;
          const value = $option.data('value');
          const text = $option.text();
          $valueSpan.text(text).removeClass('placeholder');
          $options.attr('aria-selected', 'false');
          $option.attr('aria-selected', 'true');
          if ($select.val() !== value) $select.val(value).trigger('change');
          closeListbox();
        };
        const handleOutsideClick = (event) => {
          if ($(event.target).closest($wrapper).length === 0) {
            closeListbox();
          }
        };
        // --- 이벤트 바인딩 ---
        $wrapper.on('click', function (e) {
          if ($(e.target).closest('.select-button').length) {
            e.stopPropagation();
            toggleListbox();
          }
        });
        $listbox.on('click', '.select-option', function (e) {
          e.stopPropagation();
          selectOption($(this));
        });
        $button.on('keydown', function (e) {
          const isListboxOpen = $button.attr('aria-expanded') === 'true';
          if (!isListboxOpen && ['Enter', ' ', 'ArrowDown', 'ArrowUp'].includes(e.key)) { e.preventDefault(); openListbox(); }
          else if (isListboxOpen && (e.key === 'Escape' || e.key === 'Tab')) { e.preventDefault(); closeListbox(); }
        });
        $listbox.on('keydown', function (e) {
          const $currentItem = $(document.activeElement);
          if (!$listbox.is($currentItem) && !$options.is($currentItem)) return;
          const $enabledOptions = $options.not('.disabled');
          let $targetOption;
          switch (e.key) {
            case 'Enter': case ' ': if ($currentItem.is('.select-option')) { e.preventDefault(); selectOption($currentItem); e.stopPropagation(); } break;
            case 'ArrowDown': e.preventDefault(); if ($currentItem.is('.select-option')) { $targetOption = $currentItem.nextAll('.select-option:not(.disabled)').first(); if (!$targetOption.length) $targetOption = $enabledOptions.first(); } else { $targetOption = $enabledOptions.first(); } if ($targetOption && $targetOption.length) $targetOption.focus(); break;
            case 'ArrowUp': e.preventDefault(); if ($currentItem.is('.select-option')) { $targetOption = $currentItem.prevAll('.select-option:not(.disabled)').first(); if (!$targetOption.length) $targetOption = $enabledOptions.last(); } else { $targetOption = $enabledOptions.last(); } if ($targetOption && $targetOption.length) $targetOption.focus(); break;
            case 'Escape': e.preventDefault(); closeListbox(); e.stopPropagation(); break;
            case 'Tab': closeListbox(); break;
            default: break;
          }
        });
        // 네이티브 변경
        $select.on('change.customSelectUpdate', function () {
          const newValue = $(this).val();
          const $newOption = $options.filter(`[data-value="${newValue}"]`);
          if ($newOption.length) {
            $valueSpan.text($newOption.text()).removeClass('placeholder');
            $options.attr('aria-selected', 'false');
            $newOption.attr('aria-selected', 'true');
          } else if (placeholder) {
            $valueSpan.text(placeholder).addClass('placeholder');
            $options.attr('aria-selected', 'false');
          }
        });
        // 초기 상태 적용
        const initialValue = $select.val();
        const $initialOption = $options.filter(`[data-value="${initialValue}"]`);
        if (initialValue && $initialOption.length) {
          $valueSpan.text($initialOption.text()).removeClass('placeholder');
        } else if (placeholder) {
          $valueSpan.text(placeholder).addClass('placeholder');
        } else {
          if ($valueSpan.text() !== '옵션 없음' && $valueSpan.text() !== '선택') {
            $valueSpan.removeClass('placeholder');
          }
        }
      });
    },
  },
  segmentControl: {
    init: function () {
      const $wrappers = $(`.${projectName}-segment-control`);
      if ($wrappers.length === 0) return;

      $wrappers.each(function () {
        const $wrapper = $(this);
        if ($wrapper.data('segment-control-initialized')) return;
        $wrapper.data('segment-control-initialized', true);

        const isButtonMode = $wrapper.hasClass('tag-button');
        if (isButtonMode) {
          const $buttons = $wrapper.find('.control-button[role="radio"]');
          $buttons.on('click', function (e) {
            const $this = $(this);
            if ($this.is('[disabled]') || $this.attr('aria-checked') === 'true') return;
            $buttons.removeClass('active').attr('aria-checked', 'false').attr('tabindex', '-1');
            $this.addClass('active').attr('aria-checked', 'true').attr('tabindex', '0');
            $wrapper.trigger('change', $this.data('value'));
          });
          $wrapper.on('keydown', function (e) {
            const $focusedButton = $(document.activeElement);
            if (!$focusedButton.is('.control-button[role="radio"]') || !$wrapper.has($focusedButton).length) return;
            let $targetButton;
            const $enabledButtons = $buttons.not('[disabled]');
            const currentIndex = $enabledButtons.index($focusedButton);
            if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
              e.preventDefault();
              const nextIndex = (currentIndex + 1) % $enabledButtons.length;
              $targetButton = $enabledButtons.eq(nextIndex);
            } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
              e.preventDefault();
              const prevIndex = (currentIndex - 1 + $enabledButtons.length) % $enabledButtons.length;
              $targetButton = $enabledButtons.eq(prevIndex);
            }
            if ($targetButton && $targetButton.length) {
              $targetButton.focus();
              $targetButton.trigger('click');
            }
          });
        } else {
          const $radios = $wrapper.find('input[type="radio"]');
          const $labels = $wrapper.find('label.control-button');
          $radios.each(function () {
            if ($(this).is(':checked')) $(this).closest('label').addClass('active');
          });
          $radios.on('change', function () {
            $labels.removeClass('active');
            if ($(this).is(':checked')) $(this).closest('label').addClass('active');
          });
        }
      });
    },
  },
  tooltip: {
    init() {
      // const $tooltipButtons = $(`.${projectName}-tooltip-wrap .tooltip-btn`);
      const $tooltipButtons = $(`.btn-toggle-popover[aria-controls]`);
      if ($tooltipButtons.length === 0) return;

      this.setupTooltips($tooltipButtons);
    },
    setupTooltips($buttons) {
      const self = this;
      $buttons.each(function () {
        const $button = $(this);

        if ($button.data('tooltip-initialized')) return;
        $button.data('tooltip-initialized', true);
        
        // const $tooltipContainer = $button.closest(`.${projectName}-tooltip-wrap`);
        // const $tooltipPopover = $tooltipContainer.find(".tooltip-popover");
        const popoverId = $button.attr('aria-controls');
        if (!popoverId) return; // ID가 없으면 중단

        const $tooltipPopover = $(`#${popoverId}`);
        if ($tooltipPopover.length === 0) return; // ID로 팝오버를 찾지 못하면 중단

        const $closeButton = $tooltipPopover.find(".btn-close-tooltip"); 
        const tooltipId = `tooltip-${Math.random().toString(36).substring(2, 9)}`;
        
        $button.data('tooltip-id', tooltipId);
        $button.attr("aria-expanded", "false");

        // if ($tooltipContainer.length && $tooltipContainer.attr('class').split(' ').length === 1) {
        //   $tooltipContainer.addClass("top left"); // 이 로직은 EJS 구조와 상이할 수 있으나 유지
        // }

        // 이벤트 바인딩
        $button.on("click", (e) => {
          e.stopPropagation(); 
          self.toggleTooltip($button, $tooltipPopover);
        });
        $closeButton.on("click", () => {
          self.closeTooltip($button, $tooltipPopover); 
        });
      });
    },
    toggleTooltip($button, $tooltipPopover) {
      // const isVisible = $tooltipPopover.is(":visible");
      const isVisible = $tooltipPopover.attr('aria-hidden') === 'false';
      
      if (isVisible) {
        this.closeTooltip($button, $tooltipPopover);
      } else {
        this.closeAllTooltips($button); 

        $tooltipPopover.show().attr('aria-hidden', 'false');
        $tooltipPopover.attr("tabindex", 0).focus();
        $button.attr("aria-expanded", "true");
        
        this.adjustTooltipPosition($button, $tooltipPopover);

        const tooltipId = $button.data('tooltip-id');
        const handleOutsideClick = (event) => {
          if ($(event.target).closest($tooltipPopover).length === 0 && 
              !$(event.target).is($button) &&
              $(event.target).closest($button).length === 0) {
            this.closeTooltip($button, $tooltipPopover);
          }
        };
        
        setTimeout(() => {
          $(document).on(`click.${tooltipId}`, handleOutsideClick);
        }, 0);
      }
    },
    closeTooltip($button, $tooltipPopover) {
      const tooltipId = $button.data('tooltip-id');
      $tooltipPopover.hide().attr('aria-hidden', 'true');
      $button.attr("aria-expanded", "false");

      if (tooltipId) {
        $(document).off(`click.${tooltipId}`);
      }
      
      $button.focus();
    },
    closeAllTooltips($exceptButton) {
      // let $buttonsToClose = $(`.${projectName}-tooltip-wrap .tooltip-btn[aria-expanded="true"]`);
      let $buttonsToClose = $(`.btn-toggle-popover[aria-expanded="true"]`);
      
      if ($exceptButton && $exceptButton.length) {
        $buttonsToClose = $buttonsToClose.not($exceptButton);
      }

      const self = this;
      $buttonsToClose.each(function() {
          const $btn = $(this);
          // const $popover = $btn.closest(`.${projectName}-tooltip-wrap`).find(".tooltip-popover");
          const popoverId = $btn.attr('aria-controls');

          if (popoverId) {
            const $popover = $(`#${popoverId}`);
            if ($popover.length) {
              self.closeTooltip($btn, $popover);
            }
          }
      });
    },
    adjustTooltipPosition($button, $tooltipPopover) {
        const $btn = $button;
        const $tooltipEl = $tooltipPopover;

        if (!$tooltipEl || !$tooltipEl.length || !$btn || !$btn.length) return;

        let primaryPosition = 'top'; // 기본값
        if ($tooltipEl.hasClass('bottom')) primaryPosition = 'bottom';
        else if ($tooltipEl.hasClass('left')) primaryPosition = 'left';
        else if ($tooltipEl.hasClass('right')) primaryPosition = 'right';

        let alignment = 'center'; // 기본값
        if ($tooltipEl.hasClass('left')) alignment = 'left';
		    else if ($tooltipEl.hasClass('right')) alignment = 'right';

        const tooltipGap = 20;
        const tooltipHeight = $tooltipEl.outerHeight();
        const tooltipWidth = $tooltipEl.outerWidth();
        const triggerRect = $btn[0].getBoundingClientRect();
        const itemTop = triggerRect.top + window.scrollY;
        const itemLeft = triggerRect.left + window.scrollX;
        const itemRight = triggerRect.right + window.scrollX;
        const itemBottom = triggerRect.bottom + window.scrollY;
        const itemHeight = triggerRect.height;
        const itemWidth = triggerRect.width;

        let tooltipTop, tooltipLeft;

        // --- 위치 계산 switch 문 ---
        switch (primaryPosition) {
            case 'top':
                tooltipTop = itemTop - tooltipHeight - tooltipGap;
                if (alignment === 'left') tooltipLeft = itemLeft;
                else if (alignment === 'right') tooltipLeft = itemRight - tooltipWidth;
                else tooltipLeft = itemLeft + (itemWidth - tooltipWidth) / 2;
                break;
            case 'left':
                tooltipLeft = itemLeft - tooltipWidth - tooltipGap;
                if (alignment === 'top') tooltipTop = itemTop;
                else if (alignment === 'bottom') tooltipTop = itemBottom - tooltipHeight;
                else tooltipTop = itemTop + (itemHeight - tooltipHeight) / 2;
                break;
            case 'right':
                tooltipLeft = itemRight + tooltipGap;
                if (alignment === 'top') tooltipTop = itemTop;
                else if (alignment === 'bottom') tooltipTop = itemBottom - tooltipHeight;
                else tooltipTop = itemTop + (itemHeight - tooltipHeight) / 2;
                break;
            case 'bottom':
            default:
                tooltipTop = itemBottom + tooltipGap;
                if (alignment === 'left') tooltipLeft = itemLeft;
                else if (alignment === 'right') tooltipLeft = itemRight - tooltipWidth;
                else tooltipLeft = itemLeft + (itemWidth - tooltipWidth) / 2;
                break;
        }

        const viewportWidth = window.innerWidth;
        if (tooltipLeft + tooltipWidth > viewportWidth + window.scrollX - tooltipGap) {
          tooltipLeft = viewportWidth + window.scrollX - tooltipWidth - tooltipGap;
        }
        if (tooltipLeft < window.scrollX + tooltipGap) {
          tooltipLeft = window.scrollX + tooltipGap;
        }
        $tooltipEl.css({
            top: Math.round(tooltipTop) + 'px',
            left: Math.round(tooltipLeft) + 'px',
        });
    },
    updateAllVisibleTooltipPositions() {
      const self = this;
      $(`.tooltip-popover[aria-hidden="false"]`).each(function() {
          const $tooltipPopover = $(this);
          const popoverId = $tooltipPopover.attr('id');
          if (!popoverId) return;

          // 팝오버 ID로 연결된 버튼을 탐색
          const $button = $(`.btn-toggle-popover[aria-controls="${popoverId}"]`);
          if ($button.length) {
              self.adjustTooltipPosition($button, $tooltipPopover);
          }
      });
    }
  },
  modal: {
    outsideClickHandlers: {},
    init() {
      // const $modalOpenTriggers = $(".open-modal");
      // const $modalCloseTriggers = $(".btn-close-modal"); 

      const $modalOpenTriggers = $(".btn-open-modal, .btn-open-bottom-sheet");
      const $modalCloseTriggers = $(".btn-close-modal"); 

      if ($modalOpenTriggers.length === 0 && $modalCloseTriggers.length === 0) return;

      this.setupTriggers($modalOpenTriggers, $modalCloseTriggers);
    },
    setupTriggers($openTriggers, $closeTriggers) {
      const self = this; 

      $openTriggers.on("click", function (event) {
        event.preventDefault();
        const $trigger = $(this);

        let modalId = $trigger.attr("data-target");
        if (!modalId) modalId = $trigger.attr("aria-controls");

        if (modalId) {
          $trigger.attr("data-modal-id", modalId)
                  .addClass("modal-opened")
                  .attr("tabindex", "-1");
          self.openModal(modalId);
        }
      });

      $closeTriggers.on("click", function (event) {
        event.preventDefault();
        // const modalId = $(this).closest(".modal").attr("id"); 
        const modalId = $(this).closest(`.${projectName}-modal`).attr("id"); 
        if (modalId) {
          self.closeModal(modalId);
        }
      });
    },
    openModal(id) {
      const $modalElement = $(`#${id}`);
      if ($modalElement.length === 0) return;
      const $dialogElement = $modalElement.find(".modal-content");
      const $modalBack = $modalElement.find(".modal-back");

      $("body").addClass("scroll-no");
      $dialogElement.attr("tabindex", "0");
      $modalElement.attr("aria-hidden", "false").addClass("shown");
      $modalBack.addClass("in");

      setTimeout(() => {
        $modalElement.addClass("in");
      }, 150);

      setTimeout(() => {
        $dialogElement.focus();
      }, 350);

      // ESC 모달 닫기
      $dialogElement.one("keydown", (event) => { // .one() for { once: true }
        if (event.key === "Escape" || event.key === "Esc") {
          this.closeModal(id);
        }
      });

      // 모달 외부 클릭 처리
      const handler = (event) => {
        if ($(event.target).closest(".modal-content").length === 0) {
          // $dialogElement.focus(); // 외부 클릭 시 포커스만 이동
          this.closeModal(id); // 외부 클릭 시 닫기로 변경 (주석 처리된 원본 로직)
        }
      };
      this.outsideClickHandlers[id] = handler;
      
      $modalElement.off('click', this.outsideClickHandlers[id]) // 중복 방지
                     .on('click', this.outsideClickHandlers[id]);

      // common.focusTrap(dialogElement[0]); // jQuery 객체가 아닌 DOM 요소를 전달해야 함

      this.updateZIndex($modalElement);
    },
    closeModal(id) {
      const $modalElement = $(`#${id}`);
      if ($modalElement.length === 0) return;
      const $dialogElement = $modalElement.find(".modal-content");
      const $openModals = $(".modal.in:not(.sample)");
      const $modalBack = $modalElement.find(".modal-back");

      $dialogElement.removeAttr("tabindex");
      $modalElement.attr("aria-hidden", "true").removeClass("in");
      $modalBack.removeClass("in");

      setTimeout(() => {
        $modalElement.removeClass("shown");
      }, 350);

      if ($openModals.length < 2) {
        $("body").removeClass("scroll-no");
      }
      
      $modalElement.off('click', this.outsideClickHandlers[id]);
      delete this.outsideClickHandlers[id]; // 핸들러 제거

      this.returnFocusToTrigger(id);
    },
    updateZIndex($modalElement) {
      const $openModals = $(".modal.in:not(.sample)");
      const openModalsLength = $openModals.length; // .length는 0부터 시작하므로 +1 안함
      const newZIndex = 1010 + openModalsLength;
      if (openModalsLength > 0) { // 1개 이상 열려있으면 (지금 여는게 2번째 이상)
        $modalElement.css("z-index", newZIndex);
        $modalElement.find(".modal-back").removeClass("in");
      }
    },
    returnFocusToTrigger(id) {
      const $triggerButton = $(`.modal-opened[data-modal-id="${id}"]`);
      if ($triggerButton.length) {
        $triggerButton.focus()
                      .attr("tabindex", "0")
                      .removeClass("modal-opened")
                      .removeAttr("data-modal-id");
      }
    },
  },
  accordion: {
    init() {
      const $accordionButtons = $(".btn-accordion");
      if ($accordionButtons.length === 0) return;
      this.setupAccordions($accordionButtons);
    },
    setupAccordions($buttons) {
      $buttons.each(function (idx) {
        const $button = $(this);
        if ($button.data('accordion-initialized')) return;
        $button.data('accordion-initialized', true);

        const $accordionContainer = $button.closest(`.${projectName}-accordion`);
        if ($accordionContainer.length === 0) return;

        const $accordionItems = $accordionContainer.find(".accordion-item");
        const $currentItem = $button.closest(".accordion-item");

        const $accordionContent = $currentItem.find(`#${$button.attr('aria-controls')}`);
        const accordionType = $accordionContainer.data("type") || "singleOpen";

        $button.on("click", () => {
          const isExpanded = $button.attr("aria-expanded") === "true";

          // 멀티오픈이 아니고, 현재 버튼이 닫혀있을 때 (열릴 예정일 때)
          if (accordionType !== "multiOpen" && !isExpanded) {
            $accordionItems.not($currentItem).each(function () {
              const $otherItem = $(this);
              const $otherButton = $otherItem.find(".btn-accordion");
              const $otherContent = $otherItem.find(".accordion-collapse");

              $otherItem.removeClass("active");
              $otherButton.attr("aria-expanded", "false").removeClass("active");
              
              $otherContent.removeClass("active").attr("hidden", true);
            });
          }

          // 현재 아이템 토글
          $button.attr("aria-expanded", !isExpanded);
          $button.toggleClass("active", !isExpanded);
          $currentItem.toggleClass("active", !isExpanded);
          
          $accordionContent.toggleClass("active", !isExpanded);
          if (isExpanded) {
             $accordionContent.attr("hidden", true); // 닫힐 때
          } else {
             $accordionContent.removeAttr("hidden"); // 열릴 때
          }
        });
      });
    },
  },
  tab: {
    init() {
      const $layerTabArea = $(`.${projectName}-tab-area`);
      if ($layerTabArea.length === 0) return;
      this.setupTabs($layerTabArea);
    },
    setupTabs($tabAreas) {
      const self = this;
      $tabAreas.each(function () {
        const $tabArea = $(this);
        const $layerTabs = $tabArea.find(".tab > ul[role='tablist'] > li[role='tab']");

        $layerTabs.each(function () {
          const $tab = $(this);
          if ($tab.data("listenerAttached")) return;

          const control = $tab.attr("aria-controls");
          if (!control) return;
          const $selectedTabPanel = $(`#${control}`);
          if ($selectedTabPanel.length === 0) return;

          $selectedTabPanel.attr("role", "tabpanel");

          $tab.on("click", function (e) {
            e.preventDefault();
            if ($tab.attr('aria-selected') === 'true') return; // 이미 활성 상태면 중지

            const $closestTabs = $tab.closest("ul[role='tablist']").find("li[role='tab']");
            const $closestTabPanels = $tabArea.find(".tab-conts");
            
            self.resetTabs($closestTabs, $closestTabPanels);

            $tab.addClass("active").attr("aria-selected", "true");
            $tab.find("button .sr-only").text(" 선택됨");
            $selectedTabPanel.addClass("active");
          });

          self.setupKeyboardNavigation($tab);
          $tab.data("listenerAttached", true);
        });
      });
    },
    resetTabs($closestTabs, $closestTabPanels) {
      $closestTabs.each(function () {
        $(this).removeClass("active").attr("aria-selected", "false");
        $(this).find(".sr-only").text("");
      });
      $closestTabPanels.removeClass("active");
    },
    setupKeyboardNavigation($tab) {
      const $button = $tab.find('button');
      if (!$button.length) return; 

      $button.on("keydown", function (event) {
        const $currentTabLi = $(this).closest('li[role="tab"]');
        const $siblings = $currentTabLi.siblings('li[role="tab"]'); 
        let $newTabLi;

        if (event.key === "ArrowRight" || event.key === "ArrowDown") {
          event.preventDefault();
          $newTabLi = $currentTabLi.nextAll('li[role="tab"]').first();
          if ($newTabLi.length === 0) $newTabLi = $siblings.first();
        } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
          event.preventDefault();
          $newTabLi = $currentTabLi.prevAll('li[role="tab"]').first();
          if ($newTabLi.length === 0) $newTabLi = $siblings.last(); 
        }
        
        if ($newTabLi && $newTabLi.length) {
          $newTabLi.find("button").trigger('focus');
        }
      });
    },
  }
};

$(function () {
  commonJs.init();
});