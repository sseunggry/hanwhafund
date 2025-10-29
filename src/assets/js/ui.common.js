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
    this.modal.setFullModalContentHeight();
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
    commonJs.tooltip.updateAllVisibleTooltipPositions();
    commonJs.modal.setFullModalContentHeight();
  },
  scroll: function () {
    // console.log('Scrolled:', scrollTop);
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
    SELECTORS: {
      WRAPPER: `.${projectName}-form-select`,
      NATIVE_SELECT: 'select.sr-only',
      BUTTON: '.select-button',
      VALUE: '.select-value',
      LISTBOX: '.select-listbox',
      OPTION: '.select-option',
      OPEN_BUTTON: `.${projectName}-form-select .select-button[aria-expanded="true"]`,
    },
    init: function () {
      const $wrappers = $(this.SELECTORS.WRAPPER);
      if ($wrappers.length === 0) return;

      const self = this;

      $wrappers.each(function () {
        const $wrapper = $(this);
        if ($wrapper.data('custom-select-initialized')) return;
        $wrapper.data('custom-select-initialized', true);

        const $select = $wrapper.find(self.SELECTORS.NATIVE_SELECT);
        const $button = $wrapper.find(self.SELECTORS.BUTTON);
        const $valueSpan = $button.find(self.SELECTORS.VALUE);
        const $listbox = $wrapper.find(self.SELECTORS.LISTBOX);
        const $options = $listbox.find(self.SELECTORS.OPTION);
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
        const closeListbox = (revert = false) => {
          if (revert) {
            const originalText = $wrapper.data('original-text');
            const isPlaceholder = $wrapper.data('is-placeholder');
            if (originalText) {
              $valueSpan.text(originalText);
              if (isPlaceholder) {
                $valueSpan.addClass('placeholder');
              } else {
                $valueSpan.removeClass('placeholder');
              }
            }
          }
          // data 속성 초기화
          $wrapper.removeData('original-text');
          $wrapper.removeData('is-placeholder');

          $listbox.attr('hidden', true);
          $button.attr('aria-expanded', 'false');
          $(document).off('click.customSelect.' + listboxId);
          if (!$button.is(':focus')) {
            $button.focus();
          }
        };

        const openListbox = () => {
          if (isDisabled) return;
          $(self.SELECTORS.OPEN_BUTTON).not($button).each(function () {
            const $otherWrapper = $(this).closest(self.SELECTORS.WRAPPER);
            const $otherListbox = $otherWrapper.find(self.SELECTORS.LISTBOX);
            const otherListboxId = $otherListbox.attr('id');
            
            const originalText = $otherWrapper.data('original-text');
            const isPlaceholder = $otherWrapper.data('is-placeholder');
            if(originalText) {
              $(this).find(self.SELECTORS.VALUE).text(originalText);
              if (isPlaceholder) {
                $(this).find(self.SELECTORS.VALUE).addClass('placeholder');
              } else {
                $(this).find(self.SELECTORS.VALUE).removeClass('placeholder');
              }
            }
            $otherWrapper.removeData('original-text');
            $otherWrapper.removeData('is-placeholder');
            $(this).attr('aria-expanded', 'false');
            $otherListbox.attr('hidden', true);
            $(document).off('click.customSelect.' + otherListboxId);
          });

          $wrapper.data('original-text', $valueSpan.text());
          $wrapper.data('is-placeholder', $valueSpan.hasClass('placeholder'));

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
          if ($button.attr('aria-expanded') === 'true') {
            closeListbox(true);
          } else {
            openListbox();
          }
        };

        const selectOption = ($option) => {
          if (!$option || !$option.length || $option.hasClass('disabled')) return;
          const value = $option.data('value');
          const text = $option.text();
          $valueSpan.text(text).removeClass('placeholder');
          $options.attr('aria-selected', 'false');
          $option.attr('aria-selected', 'true');
          if ($select.val() !== value) $select.val(value).trigger('change');
          
          closeListbox(false); 
        };

        const previewOption = ($option) => {
          if (!$option || !$option.length) return;
          $valueSpan.text($option.text()).removeClass('placeholder');
          $option.focus();
        };

        const handleOutsideClick = (event) => {
          if ($(event.target).closest($wrapper).length === 0) {
            closeListbox(true); // [수정]
          }
        };

        // --- 이벤트 바인딩 ---
        $wrapper.on('click', function (e) {
          if (isDisabled) return;
          // 리스트박스 내부(옵션 등)를 클릭한 경우, 각 핸들러가 처리
          if ($(e.target).closest(self.SELECTORS.LISTBOX).length) {
            return;
          }
          e.stopPropagation();
          toggleListbox();
        });

        $listbox.on('click', self.SELECTORS.OPTION, function (e) {
          e.stopPropagation();
          selectOption($(this));
        });

        $button.on('keydown', function (e) {
          const isListboxOpen = $button.attr('aria-expanded') === 'true';
          if (!isListboxOpen && ['Enter', ' ', 'ArrowDown', 'ArrowUp'].includes(e.key)) { e.preventDefault(); openListbox(); }
          else if (isListboxOpen && (e.key === 'Escape' || e.key === 'Tab')) { 
            e.preventDefault(); 
            closeListbox(true); // [수정]
          }
        });

        $listbox.on('keydown', function (e) {
          const $currentItem = $(document.activeElement);
          if (!$listbox.is($currentItem) && !$options.is($currentItem)) return;
          const $enabledOptions = $options.not('.disabled');
          let $targetOption;
          switch (e.key) {
            case 'Enter': case ' ': 
              if ($currentItem.is(self.SELECTORS.OPTION)) { 
                e.preventDefault(); 
                selectOption($currentItem); // Enter/Space로 최종 선택
                e.stopPropagation(); 
              } 
              break;
            case 'ArrowDown': 
              e.preventDefault(); 
              if ($currentItem.is(self.SELECTORS.OPTION)) { 
                $targetOption = $currentItem.nextAll(`${self.SELECTORS.OPTION}:not(.disabled)`).first(); 
                if (!$targetOption.length) $targetOption = $enabledOptions.first(); 
              } else { 
                $targetOption = $enabledOptions.first(); 
              } 
              if ($targetOption && $targetOption.length) {
                previewOption($targetOption);
              }
              break;
            case 'ArrowUp': 
              e.preventDefault(); 
              if ($currentItem.is(self.SELECTORS.OPTION)) { 
                $targetOption = $currentItem.prevAll(`${self.SELECTORS.OPTION}:not(.disabled)`).first(); 
                if (!$targetOption.length) $targetOption = $enabledOptions.last(); 
              } else { 
                $targetOption = $enabledOptions.last(); 
              } 
              if ($targetOption && $targetOption.length) {
                previewOption($targetOption);
              }
              break;
            case 'Escape': 
              e.preventDefault(); 
              closeListbox(true);
              e.stopPropagation(); 
              break;
            case 'Tab': 
              closeListbox(true);
              break;
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
    SELECTORS: {
      WRAPPER: `.${projectName}-segment-control`,
      CONTROL_BTN: '.control-button[role="radio"]',
      NATIVE_RADIO: 'input[type="radio"]',
      CONTROL_LABEL: 'label.control-button',
    },
    init: function () {
      const $wrappers = $(this.SELECTORS.WRAPPER);
      if ($wrappers.length === 0) return;

      const self = this;

      $wrappers.each(function () {
        const $wrapper = $(this);
        if ($wrapper.data('segment-control-initialized')) return;
        $wrapper.data('segment-control-initialized', true);

        const isButtonMode = $wrapper.hasClass('tag-button');
        if (isButtonMode) {
          const $buttons = $wrapper.find(self.SELECTORS.CONTROL_BTN);
          $buttons.on('click', function (e) {
            const $this = $(this);
            if ($this.is('[disabled]') || $this.attr('aria-checked') === 'true') return;
            $buttons.removeClass('active').attr('aria-checked', 'false').attr('tabindex', '-1');
            $this.addClass('active').attr('aria-checked', 'true').attr('tabindex', '0');
            $wrapper.trigger('change', $this.data('value'));
          });
          $wrapper.on('keydown', function (e) {
            const $focusedButton = $(document.activeElement);
            if (!$focusedButton.is(self.SELECTORS.CONTROL_BTN) || !$wrapper.has($focusedButton).length) return;
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
          const $radios = $wrapper.find(self.SELECTORS.NATIVE_RADIO);
          const $labels = $wrapper.find(self.SELECTORS.CONTROL_LABEL);
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
    SELECTORS: {
      TRIGGER_BTN: '.btn-toggle-popover[aria-controls]',
      OPEN_TRIGGER_BTN: '.btn-toggle-popover[aria-expanded="true"]',
      POPOVER: '.tooltip-popover',
      OPEN_POPOVER: '.tooltip-popover[aria-hidden="false"]',
      CLOSE_BTN: '.btn-close-tooltip',
    },
    init() {
      const $tooltipButtons = $(this.SELECTORS.TRIGGER_BTN);
      if ($tooltipButtons.length === 0) return;

      this.setupTooltips($tooltipButtons);
    },
    setupTooltips($buttons) {
      const self = this;
      $buttons.each(function () {
        const $button = $(this);

        if ($button.data('tooltip-initialized')) return;
        $button.data('tooltip-initialized', true);
        
        const popoverId = $button.attr('aria-controls');
        if (!popoverId) return; 

        const $tooltipPopover = $(`#${popoverId}`);
        if ($tooltipPopover.length === 0) return;

        const $closeButton = $tooltipPopover.find(self.SELECTORS.CLOSE_BTN); 
        const tooltipId = `tooltip-${Math.random().toString(36).substring(2, 9)}`;
        
        $button.data('tooltip-id', tooltipId);
        $button.attr("aria-expanded", "false");

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
      let $buttonsToClose = $(this.SELECTORS.OPEN_TRIGGER_BTN);
      
      if ($exceptButton && $exceptButton.length) {
        $buttonsToClose = $buttonsToClose.not($exceptButton);
      }

      const self = this;
      $buttonsToClose.each(function() {
          const $btn = $(this);
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
      $(this.SELECTORS.OPEN_POPOVER).each(function() {
          const $tooltipPopover = $(this);
          const popoverId = $tooltipPopover.attr('id');
          if (!popoverId) return;

          const $button = $(`${self.SELECTORS.TRIGGER_BTN}[aria-controls="${popoverId}"]`);
          if ($button.length) {
              self.adjustTooltipPosition($button, $tooltipPopover);
          }
      });
    }
  },
  modal: {
    SELECTORS: {
      OPEN_TRIGGERS: ".btn-open-modal, .btn-open-bottom-sheet",
      CLOSE_TRIGGERS: ".btn-close-modal",
      MODAL_WRAPPER: `.${projectName}-modal`,
      OPEN_MODAL_INSTANCE: `.${projectName}-modal.in:not(.sample)`,
      CONTENT: ".modal-content",
      BACKDROP: ".modal-back",
      MODAL_FULL: `.${projectName}-modal[data-type="full"]`,
      OPENED_TRIGGER_BTN: (id) => `.modal-opened[data-modal-id="${id}"]` // 동적 셀렉터
    },
    outsideClickHandlers: {},
    init() {
      const $modalOpenTriggers = $(this.SELECTORS.OPEN_TRIGGERS);
      const $modalCloseTriggers = $(this.SELECTORS.CLOSE_TRIGGERS); 

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
          $trigger
            .attr("data-modal-id", modalId)
            .addClass("modal-opened")
            .attr("tabindex", "-1");
          self.openModal(modalId);
        }
      });

      $closeTriggers.on("click", function (event) {
        event.preventDefault();
        const modalId = $(this).closest(self.SELECTORS.MODAL_WRAPPER).attr("id"); 
        if (modalId) {
          self.closeModal(modalId);
        }
      });
    },
    openModal(id) {
      const $modalElement = $(`#${id}`);
      if ($modalElement.length === 0) return;
      const $dialogElement = $modalElement.find(this.SELECTORS.CONTENT);
      const $modalBack = $modalElement.find(this.SELECTORS.BACKDROP);

      $("html").css('overflow', 'hidden');
      // $("body").addClass("scroll-no");
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
      $dialogElement.one("keydown", (event) => {
        if (event.key === "Escape" || event.key === "Esc") {
          this.closeModal(id);
        }
      });

      // 모달 외부 클릭 처리
      const handler = (event) => {
        if ($(event.target).closest(this.SELECTORS.CONTENT).length === 0) {
          this.closeModal(id); 
        }
      };
      this.outsideClickHandlers[id] = handler;
      
      $modalElement
        .off('click', this.outsideClickHandlers[id])
        .on('click', this.outsideClickHandlers[id]);

      this.updateZIndex($modalElement);
    },
    closeModal(id) {
      const $modalElement = $(`#${id}`);
      if ($modalElement.length === 0) return;
      const $dialogElement = $modalElement.find(this.SELECTORS.CONTENT);
      const $openModals = $(this.SELECTORS.OPEN_MODAL_INSTANCE);
      const $modalBack = $modalElement.find(this.SELECTORS.BACKDROP);

      $("html").css('overflow', '');
      $dialogElement.removeAttr("tabindex");
      $modalElement.attr("aria-hidden", "true").removeClass("in");
      $modalBack.removeClass("in");

      setTimeout(() => {
        $modalElement.removeClass("shown");
      }, 350);

      // if ($openModals.length < 1) {
      //   $("html").css('overflow', '');
      //   // $("body").removeClass("scroll-no");
      // }
      
      $modalElement.off('click', this.outsideClickHandlers[id]);
      delete this.outsideClickHandlers[id]; 

      this.returnFocusToTrigger(id);
    },
    updateZIndex($modalElement) {
      const $openModals = $(this.SELECTORS.OPEN_MODAL_INSTANCE);
      const openModalsLength = $openModals.length;
      const newZIndex = 1010 + openModalsLength;
      if (openModalsLength > 0) { 
        $modalElement.css("z-index", newZIndex);
        $modalElement.find(this.SELECTORS.BACKDROP).removeClass("in");
      }
    },
    returnFocusToTrigger(id) {
      const $triggerButton = $(this.SELECTORS.OPENED_TRIGGER_BTN(id));
      if ($triggerButton.length) {
        $triggerButton.focus()
                      .attr("tabindex", "0")
                      .removeClass("modal-opened")
                      .removeAttr("data-modal-id");
      }
    },
    setFullModalContentHeight: function(){
      const rootFontSize = parseFloat($('html').css('font-size'));

      if (!rootFontSize) return;

      const $fullModals = $(this.SELECTORS.MODAL_FULL);

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
  },
  accordion: {
    // [추가] 셀렉터 상수화
    SELECTORS: {
      BUTTON: ".btn-accordion",
      WRAPPER: `.${projectName}-accordion`,
      ITEM: ".accordion-item",
      COLLAPSE: ".accordion-collapse",
    },
    init() {
      const $accordionButtons = $(this.SELECTORS.BUTTON);
      if ($accordionButtons.length === 0) return;
      this.setupAccordions($accordionButtons);
    },
    setupAccordions($buttons) {
      const self = this; 
      $buttons.each(function (idx) {
        const $button = $(this);
        if ($button.data('accordion-initialized')) return;
        $button.data('accordion-initialized', true);

        const $accordionContainer = $button.closest(self.SELECTORS.WRAPPER);
        if ($accordionContainer.length === 0) return;

        const $accordionItems = $accordionContainer.find(self.SELECTORS.ITEM);
        const $currentItem = $button.closest(self.SELECTORS.ITEM);

        const $accordionContent = $currentItem.find(`#${$button.attr('aria-controls')}`);
        const accordionType = $accordionContainer.data("type") || "singleOpen";

        $button.on("click", () => {
          const isExpanded = $button.attr("aria-expanded") === "true";

          if (accordionType !== "multiOpen" && !isExpanded) {
            $accordionItems.not($currentItem).each(function () {
              const $otherItem = $(this);
              const $otherButton = $otherItem.find(self.SELECTORS.BUTTON);
              const $otherContent = $otherItem.find(self.SELECTORS.COLLAPSE);

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
             $accordionContent.attr("hidden", true); 
          } else {
             $accordionContent.removeAttr("hidden");
          }
        });
      });
    },
  },
  tab: {
    SELECTORS: {
      WRAPPER: `.${projectName}-tab-area`,
      TAB_LIST: "ul[role='tablist']",
      TAB_ITEM: "li[role='tab']",
      TAB_PANEL: ".tab-conts",
      SR_ONLY: ".sr-only",
      BUTTON: "button",
    },
    init() {
      const $layerTabArea = $(this.SELECTORS.WRAPPER);
      if ($layerTabArea.length === 0) return;
      this.setupTabs($layerTabArea);
    },
    setupTabs($tabAreas) {
      const self = this;
      $tabAreas.each(function () {
        const $tabArea = $(this);
        const $layerTabs = $tabArea.find(`.tab > ${self.SELECTORS.TAB_LIST} > ${self.SELECTORS.TAB_ITEM}`);

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
            if ($tab.attr('aria-selected') === 'true') return;

            const $closestTabs = $tab.closest(self.SELECTORS.TAB_LIST).find(self.SELECTORS.TAB_ITEM);
            const $closestTabPanels = $tabArea.find(self.SELECTORS.TAB_PANEL);
            
            self.resetTabs($closestTabs, $closestTabPanels);

            $tab.addClass("active").attr("aria-selected", "true");
            $tab.find(`${self.SELECTORS.BUTTON} ${self.SELECTORS.SR_ONLY}`).text(" 선택됨");
            $selectedTabPanel.addClass("active");
          });

          self.setupKeyboardNavigation($tab);
          $tab.data("listenerAttached", true);
        });
      });
    },
    resetTabs($closestTabs, $closestTabPanels) {
      const self = this;
      $closestTabs.each(function () {
        $(this).removeClass("active").attr("aria-selected", "false");
        $(this).find(self.SELECTORS.SR_ONLY).text("");
      });
      $closestTabPanels.removeClass("active");
    },
    setupKeyboardNavigation($tab) {
      const self = this;
      const $button = $tab.find(this.SELECTORS.BUTTON);
      if (!$button.length) return; 

      $button.on("keydown", function (event) {
        const $currentTabLi = $(this).closest(self.SELECTORS.TAB_ITEM);
        const $siblings = $currentTabLi.siblings(self.SELECTORS.TAB_ITEM); 
        let $newTabLi;

        if (event.key === "ArrowRight" || event.key === "ArrowDown") {
          event.preventDefault();
          $newTabLi = $currentTabLi.nextAll(self.SELECTORS.TAB_ITEM).first();
          if ($newTabLi.length === 0) $newTabLi = $siblings.first();
        } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
          event.preventDefault();
          $newTabLi = $currentTabLi.prevAll(self.SELECTORS.TAB_ITEM).first();
          if ($newTabLi.length === 0) $newTabLi = $siblings.last(); 
        }
        
        if ($newTabLi && $newTabLi.length) {
          $newTabLi.find(self.SELECTORS.BUTTON).trigger('focus');
        }
      });
    },
  }
};

$(function () {
  commonJs.init();
});