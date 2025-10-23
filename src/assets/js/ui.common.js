let projectName = 'hwf';
let scrollTop = 0;

const commonJs = {
	init: function () {
		this.resize();
		this.scroll();

		this.customSelect.init();
		this.segmentControl.init();
		this.tooltip.init();
		this.modal.init();
		this.accordion.init();
		this.tab.init();

		this.bindGlobalEvents();
	},
	bindGlobalEvents: function () {
		// --- Tooltip ---
		$(document).on('click', '.btn-toggle-tooltip, .btn-toggle-popover', function (e) {
			e.preventDefault();
			e.stopPropagation();
			commonJs.tooltip.toggle.call(this); // 'this'는 클릭된 버튼
		});
		$(document).on('click', '.btn-close-tooltip', function (e) {
			e.preventDefault();
			commonJs.tooltip.close.call(this); // 'this'는 클릭된 닫기 버튼
		});

		// --- Modal ---
		$(document).on('click', '.btn-open-modal, .btn-open-bottom-sheet', function (e) {
			e.preventDefault();
			commonJs.modal.open.call(this); // 'this'는 열기 버튼
		});
		$(document).on('click', '.btn-close-modal, .btn-close-bottom-sheet', function (e) {
			e.preventDefault();
			commonJs.modal.close.call(this); // 'this'는 닫기 버튼
		});

		// --- Accordion ---
		$(document).on('click', `.${projectName}-accordion .btn-accordion`, function (e) {
			e.preventDefault();
			commonJs.accordion.handleToggle.call(this); // 'this'는 클릭된 버튼
		});

		// --- Tab ---
		$(document).on('click', `.${projectName}-tab-area [role="tab"]`, function (e) {
			e.preventDefault();
			commonJs.tab.activateTab.call(this); // 'this'는 클릭된 탭(li)
		});
		$(document).on('keydown', `.${projectName}-tab-area [role="tablist"]`, function (e) {
			// 'this'는 tablist(ul), 이벤트 객체(e)를 핸들러에 전달
			commonJs.tab.handleKeyboardNav.call(this, e);
		});

		// --- Window Events ---
		if (!window.commonJsResizeListenerAttached) {
			const debouncedResize = this.debounce(this.handleResize, 150);
			$(window).on('resize.commonJs', debouncedResize);
			window.commonJsResizeListenerAttached = true;
		}
		if (!window.commonJsScrollListenerAttached) {
			const debouncedScroll = this.debounce(this.handleScroll, 150);
			$(window).on('scroll.commonJs', () => {
				scrollTop = $(window).scrollTop();
				debouncedScroll();
			});
			window.commonJsScrollListenerAttached = true;
		}
	},
	handleResize: function () {
		// console.log('Resized');
		// 리사이즈 시 툴팁 위치 업데이트
		// $.each(commonJs.tooltip.activeTooltips, (id, refs) => {
		// 	if (refs.$tooltipEl.hasClass(refs.settings.activeClass)) {
		// 		commonJs.tooltip._updatePosition(refs.$btn, refs.$tooltipEl, refs.settings);
		// 	}
		// });
	},
	handleScroll: function () {
		// console.log('Scrolled:', scrollTop);
		// 스크롤 시 툴팁 위치 업데이트
		// $.each(commonJs.tooltip.activeTooltips, (id, refs) => {
		// 	if (refs.$tooltipEl.hasClass(refs.settings.activeClass)) {
		// 		commonJs.tooltip._updatePosition(refs.$btn, refs.$tooltipEl, refs.settings);
		// 	}
		// });
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
		init: function () { // 'this'는 commonJs.customSelect
			const $wrappers = $(`.${projectName}-form-select`);
			if ($wrappers.length === 0) return;

			$wrappers.each(function () {
				commonJs.customSelect.setupSelect.call(this); // setupSelect 호출, this는 DOM 요소
			});
		},
		setupSelect: function () { // 'this'는 .each()로부터 전달받은 DOM 요소
			const $wrapper = $(this);
			if ($wrapper.data('custom-select-initialized')) return;
			$wrapper.data('custom-select-initialized', true);

			const $select = $wrapper.find('select.sr-only');
			const $uiSelect = $wrapper.find('.ui-select');
			const $button = $uiSelect.find('.select-button');
			const $valueSpan = $button.find('.select-value');
			const $listbox = $uiSelect.find('.select-listbox');
			const $options = $listbox.find('.select-option');
			const placeholder = $select.data('placeholder') || '';
			const isDisabled = $select.is(':disabled');
			const listboxId = $listbox.attr('id');

			if (isDisabled) {
				$wrapper.addClass('disabled');
				$uiSelect.attr('aria-disabled', 'true');
				$button.attr('tabindex', '-1');
				return;
			}

			// --- 헬퍼 함수 ---
			const openListbox = () => {
				if (isDisabled) return;
				$('[data-custom-select-initialized="true"] .ui-select[aria-expanded="true"]').not($uiSelect).each(function () {
					$(this).find('.select-button').trigger('closeListbox.customSelect');
				});
				$listbox.removeAttr('hidden');
				$uiSelect.attr('aria-expanded', 'true');
				let $focusedOption = $options.filter('[aria-selected="true"]');
				if (!$focusedOption.length) $focusedOption = $options.not('.disabled').first();
				setTimeout(() => {
					if ($focusedOption.length) $focusedOption.focus();
					else if ($options.length) $options.not('.disabled').first().focus();
					else $listbox.focus();
				}, 0);
				$(document).on('click.customSelect.' + listboxId, handleOutsideClick);
			};
			const closeListbox = () => {
				$listbox.attr('hidden', true);
				$uiSelect.attr('aria-expanded', 'false');
				$(document).off('click.customSelect.' + listboxId);
				if (!$uiSelect.is(':focus')) {
					$uiSelect.focus();
				}
			};
			const toggleListbox = () => {
				if ($uiSelect.attr('aria-expanded') === 'true') closeListbox();
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
				if ($(event.target).closest($uiSelect).length === 0) {
					closeListbox();
				}
			};

			// --- 이벤트 바인딩 ---
			$uiSelect.on('click', function (e) {
				if ($(e.target).closest('.select-button').length) {
					e.stopPropagation();
					toggleListbox();
				}
			});
			$button.on('closeListbox.customSelect', closeListbox);
			$listbox.on('click', '.select-option', function (e) {
				e.stopPropagation();
				selectOption($(this));
			});
			$uiSelect.on('keydown', function (e) {
				const isListboxOpen = $uiSelect.attr('aria-expanded') === 'true';
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
				} else {
					const $firstEnabledOption = $options.not('.disabled').first();
					if ($firstEnabledOption.length) {
						$valueSpan.text($firstEnabledOption.text()).removeClass('placeholder');
						$options.attr('aria-selected', 'false');
						$firstEnabledOption.attr('aria-selected', 'true');
					} else {
						const firstOptText = $options.first().text() || '옵션 없음';
						$valueSpan.text(firstOptText).addClass('placeholder');
						$options.attr('aria-selected', 'false');
					}
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
		}
	},
	segmentControl: {
		init: function () { // 'this'는 commonJs.segmentControl
			const $wrappers = $(`.${projectName}-segment-control`);
			if ($wrappers.length === 0) return;
			$wrappers.each(function () {
				// 'this'는 개별 DOM 요소
				commonJs.segmentControl.setupSegment.call(this);
			});
		},
		setupSegment: function () { // 'this'는 DOM 요소
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
		}
	},
	tooltip: {
		activeTooltips: {},
		resizeListenerAttached: false,
		defaultSettings: {
			activeClass: 'active',
			tooltipSelector: '.hwf-tooltip, .hwf-popover',
			gap: 12
		},
		debounce: commonJs.debounce, // 유틸리티 참조

		_updatePosition: function ($btn, $tooltipEl, settings) {
			if (!$tooltipEl || !$tooltipEl.length || !$btn || !$btn.length) return;
			let primaryPosition = 'bottom';
			if ($tooltipEl.hasClass('top')) primaryPosition = 'top'; else if ($tooltipEl.hasClass('left')) primaryPosition = 'left'; else if ($tooltipEl.hasClass('right')) primaryPosition = 'right';
			let alignment = 'center';
			if ($tooltipEl.hasClass('left-align')) alignment = 'left'; else if ($tooltipEl.hasClass('right-align')) alignment = 'right';
			const tooltipGap = settings.gap;
			const tooltipHeight = $tooltipEl.outerHeight(); const tooltipWidth = $tooltipEl.outerWidth(); const triggerRect = $btn[0].getBoundingClientRect();
			const itemTop = triggerRect.top + window.scrollY; const itemLeft = triggerRect.left + window.scrollX; const itemRight = triggerRect.right + window.scrollX; const itemBottom = triggerRect.bottom + window.scrollY;
			const itemHeight = triggerRect.height; const itemWidth = triggerRect.width;
			let tooltipTop, tooltipLeft;
			switch (primaryPosition) {
				case 'top': tooltipTop = itemTop - tooltipHeight - tooltipGap; if (alignment === 'left') tooltipLeft = itemLeft; else if (alignment === 'right') tooltipLeft = itemRight - tooltipWidth; else tooltipLeft = itemLeft + (itemWidth - tooltipWidth) / 2; break;
				case 'left': tooltipLeft = itemLeft - tooltipWidth - tooltipGap; if (alignment === 'top') tooltipTop = itemTop; else if (alignment === 'bottom') tooltipTop = itemBottom - tooltipHeight; else tooltipTop = itemTop + (itemHeight - tooltipHeight) / 2; break;
				case 'right': tooltipLeft = itemRight + tooltipGap; if (alignment === 'top') tooltipTop = itemTop; else if (alignment === 'bottom') tooltipTop = itemBottom - tooltipHeight; else tooltipTop = itemTop + (itemHeight - tooltipHeight) / 2; break;
				case 'bottom': default: tooltipTop = itemBottom + tooltipGap; if (alignment === 'left') tooltipLeft = itemLeft; else if (alignment === 'right') tooltipLeft = itemRight - tooltipWidth; else tooltipLeft = itemLeft + (itemWidth - tooltipWidth) / 2; break;
			}
			const viewportWidth = window.innerWidth;
			if (tooltipLeft + tooltipWidth > viewportWidth + window.scrollX - tooltipGap) tooltipLeft = viewportWidth + window.scrollX - tooltipWidth - tooltipGap;
			if (tooltipLeft < window.scrollX + tooltipGap) tooltipLeft = window.scrollX + tooltipGap;
			$tooltipEl.css({ position: 'absolute', top: Math.round(tooltipTop) + 'px', left: Math.round(tooltipLeft) + 'px', transform: '' });
		},
		_open: function ($btn, $targetEl, settings) {
			if (!$btn || !$targetEl || !$targetEl.length || $targetEl.hasClass(settings.activeClass)) return;
			const targetId = $targetEl.attr('id');
			const eventNamespace = '.tooltipClose.' + targetId;
			this._updatePosition($btn, $targetEl, settings);
			$targetEl.addClass(settings.activeClass);
			$btn.attr('aria-expanded', 'true');
			$targetEl.attr('aria-hidden', 'false');
			this.activeTooltips[targetId] = { $btn: $btn, $tooltipEl: $targetEl, settings: settings };
			setTimeout(() => {
				$(document).on(eventNamespace, (e) => {
					if ($targetEl.hasClass(settings.activeClass) && $(e.target).closest($targetEl).length === 0 && !$(e.target).is($btn) && $(e.target).closest($btn).length === 0) {
						this._close($targetEl, $btn, settings);
					}
				});
			}, 0);
		},
		_close: function ($tooltipToClose, $btn, settings) {
			if (!$tooltipToClose || !$tooltipToClose.length || !$tooltipToClose.hasClass(settings.activeClass)) return;
			const targetId = $tooltipToClose.attr('id');
			const eventNamespace = '.tooltipClose.' + targetId;
			$tooltipToClose.removeClass(settings.activeClass);
			$tooltipToClose.attr('aria-hidden', 'true');
			if (targetId) delete this.activeTooltips[targetId];
			const $openerButton = $btn || (targetId ? $(`[aria-controls="${targetId}"]`) : $());
			if ($openerButton.length) $openerButton.attr('aria-expanded', 'false');
			$(document).off(eventNamespace);
		},
		handleResizeOrScroll: null,
		init: function () { // 'this'는 버튼 DOM 요소
			const $btn = $(this);
			const userOptions = { gap: $btn.data('gap'), position: $btn.data('position') }; // data 속성에서 옵션 읽기
			const settings = $.extend({}, commonJs.tooltip.defaultSettings, userOptions);
			if (!$btn.is('button, a, [role="button"]') || !$btn.attr('aria-controls')) return;
			const targetId = $btn.attr('aria-controls');
			if ($btn.data('tooltip-settings')) return;
			$btn.data('tooltip-settings', settings);
			$btn.data('tooltip-target-id', targetId);
			if (targetId) {
				const $targetEl = $('#' + targetId);
				if ($targetEl.length) {
					const isActiveInitially = $targetEl.hasClass(settings.activeClass);
					if (isActiveInitially) {
						commonJs.tooltip._updatePosition($btn, $targetEl, settings);
						$btn.attr('aria-expanded', 'true');
						$targetEl.attr('aria-hidden', 'false');
						commonJs.tooltip.activeTooltips[targetId] = { $btn: $btn, $tooltipEl: $targetEl, settings: settings };
						// ... (외부 클릭 바인딩) ...
					} else {
						$btn.attr('aria-expanded', 'false');
						$targetEl.attr('aria-hidden', 'true');
					}
				} else { console.warn('Tooltip target not found:', targetId); }
			} else { console.warn('Button is missing aria-controls attribute:', this); }
			if (!commonJs.tooltip.handleResizeOrScroll) {
				commonJs.tooltip.handleResizeOrScroll = commonJs.debounce(() => {
					$.each(commonJs.tooltip.activeTooltips, (id, refs) => {
						if (refs.$tooltipEl.hasClass(refs.settings.activeClass)) {
							commonJs.tooltip._updatePosition(refs.$btn, refs.$tooltipEl, refs.settings);
						} else { delete commonJs.tooltip.activeTooltips[id]; }
					});
				}, 100);
				if (!commonJs.tooltip.resizeListenerAttached) {
					$(window).on('resize.tooltipControl scroll.tooltipControl', commonJs.tooltip.handleResizeOrScroll);
					commonJs.tooltip.resizeListenerAttached = true;
				}
			}
		},
		toggle: function (buttonElement) { // 'this'는 commonJs.tooltip, buttonElement는 클릭된 DOM
			const $btn = $(buttonElement || this); // .call(this)로 호출 시 this는 버튼
			const settings = $btn.data('tooltip-settings');
			const targetId = $btn.data('tooltip-target-id');
			if (!settings || !targetId) { console.error('Tooltip not initialized:', $btn); return; }
			const $targetEl = $('#' + targetId);
			if ($targetEl.length) {
				if ($targetEl.hasClass(settings.activeClass)) commonJs.tooltip._close($targetEl, $btn, settings);
				else commonJs.tooltip._open($btn, $targetEl, settings);
			}
		},
		close: function (element) { // 'this'는 commonJs.tooltip, element는 DOM
			const $element = $(element || this);
			let $tooltipToClose = null; let targetId = null; let $openBtn = null; let settings = {};
			if ($element.is('.btn-close-tooltip')) {
				targetId = $element.attr('aria-controls') || $element.closest('[id]').attr('id');
				if (targetId) $tooltipToClose = $('#' + targetId);
			} else if ($element.is(commonJs.tooltip.defaultSettings.tooltipSelector)) {
				$tooltipToClose = $element; targetId = $element.attr('id');
			}
			if ($tooltipToClose && $tooltipToClose.length) {
				$openBtn = targetId ? $(`[aria-controls="${targetId}"]`) : $();
				settings = $openBtn.data('tooltip-settings') || commonJs.tooltip.defaultSettings;
				commonJs.tooltip._close($tooltipToClose, $openBtn, settings);
			} else { console.warn('Could not find tooltip to close for:', $element); }
		}
		// updatePosition은 handleResizeOrScroll이 자동으로 처리
	},
	modal: {
		activeModals: {}, zCounter: 1010, defaultSettings: { /* ... */ },
		_open: function ($btn, $targetEl, settings) { /* ... */ },
		_close: function ($modalToClose, $btn, settings) { /* ... */ },
		_focusTrap: function ($modalEl, $btn) { /* ... */ },
		_returnFocus: function ($btn) { /* ... */ },
		init: function () { // 'this'는 열기 버튼 DOM
			const $btn = $(this);
			const settings = $.extend({}, commonJs.modal.defaultSettings, {});
			const targetId = $btn.attr('aria-controls');
			if (!$btn.is('button, a, [role="button"]') || !targetId) return;
			if ($btn.data('modal-settings')) return;
			$btn.data('modal-settings', settings);
			$btn.data('modal-target-id', targetId);
			if (targetId) {
				const $targetEl = $('#' + targetId);
				if ($targetEl.length) $btn.attr('aria-expanded', 'false');
				else console.warn('Modal target not found:', targetId);
			} else { console.warn('Button is missing aria-controls attribute:', this); }
		},
		open: function (buttonElement) { // 'this'는 commonJs.modal
			const $btn = $(buttonElement);
			const settings = $btn.data('modal-settings');
			const targetId = $btn.data('modal-target-id');
			if (!settings || !targetId) { console.error('Modal not initialized:', $btn); return; }
			const $targetEl = $('#' + targetId);
			if ($targetEl.length) this._open($btn, $targetEl, settings);
		},
		close: function (element) { // 'this'는 commonJs.modal
			const $element = $(element);
			let $modalToClose = null; let targetId = null; let $openBtn = null; let settings = {};
			if ($element.is('.btn-close-modal, .btn-close-bottom-sheet')) {
				targetId = $element.attr('aria-controls') || $element.closest('[id]').attr('id');
				if (targetId) $modalToClose = $('#' + targetId);
			} else if ($element.is(commonJs.modal.defaultSettings.modalSelector)) {
				$modalToClose = $element; targetId = $element.attr('id');
			}
			if ($modalToClose && $modalToClose.length) {
				$openBtn = targetId ? $(`[aria-controls="${targetId}"]`) : $();
				settings = $openBtn.data('modal-settings') || commonJs.modal.defaultSettings;
				this._close($modalToClose, $openBtn, settings);
			} else { console.warn('Could not find modal to close for:', $element); }
		}
	},

	accordion: {
		init: function () { // 'this'는 아코디언 그룹 div
			const $accordionWrapper = $(this);
			if ($accordionWrapper.data('accordion-initialized')) return;
			$accordionWrapper.data('accordion-initialized', true);
			// EJS가 ARIA/ID를 잘 생성했으므로 초기화 로직 최소화
		},
		handleToggle: function (buttonElement) { // 'this'는 commonJs.accordion
			const $btn = $(buttonElement);
			const $accordionWrapper = $btn.closest(`.${projectName}-accordion`);
			if (!$accordionWrapper.length) return;
			const $item = $btn.closest('.accordion-item');
			if (!$item.length) return;
			const $collapse = $item.find('.accordion-collapse');
			if (!$collapse.length) return;
			const accordionType = $accordionWrapper.data('type') || 'singleOpen';
			const isActive = $item.hasClass('active');
			if ($btn.is(':disabled')) return;

			if (accordionType === 'singleOpen' && !isActive) {
				// 다른 항목 닫기
				$accordionWrapper.find('.accordion-item.active').each(function () {
					const $otherItem = $(this);
					if ($otherItem[0] !== $item[0]) {
						const $otherCollapse = $otherItem.find('.accordion-collapse');
						const $otherBtn = $otherItem.find('.btn-accordion');
						$otherItem.removeClass('active');
						$otherBtn.attr('aria-expanded', 'false');
						$otherCollapse.slideUp(200, function () { $(this).attr('hidden', true); });
					}
				});
			}
			// 현재 항목 토글
			const newExpandedState = !isActive;
			$item.toggleClass('active', newExpandedState);
			$btn.attr('aria-expanded', newExpandedState);
			if (newExpandedState) {
				$collapse.removeAttr('hidden').hide().slideDown(200);
			} else {
				$collapse.slideUp(200, function () { $(this).attr('hidden', true); });
			}
		}
	},

	tab: {
		init: function () { // 'this'는 탭 영역 div
			const $tabArea = $(this);
			if ($tabArea.data('tabs-initialized')) return;
			$tabArea.data('tabs-initialized', true);
			this._syncState($tabArea); // 'this'는 commonJs.tab
		},
		_syncState: function ($tabArea) { // 'this'는 commonJs.tab
			const $tabs = $tabArea.find('[role="tab"]');
			const $panels = $tabArea.find('[role="tabpanel"]');
			let $activeTab = $tabs.filter('.active');
			if ($activeTab.length === 0 && $tabs.length > 0) {
				$activeTab = $tabs.first().addClass('active');
			}
			const activePanelId = $activeTab.attr('aria-controls');
			$tabs.each(function () {
				const $tab = $(this);
				const isActive = $tab.is($activeTab);
				$tab.attr('aria-selected', isActive);
				$tab.find('.btn-tab').attr('tabindex', isActive ? '0' : '-1');
			});
			$panels.each(function () {
				const $panel = $(this);
				const isActive = $panel.attr('id') === activePanelId;
				$panel.toggleClass('active', isActive);
				if (!isActive) $panel.attr('hidden', true);
				else $panel.removeAttr('hidden');
			});
		},
		activateTab: function (tabElement) { // 'this'는 commonJs.tab, tabElement는 탭 li
			const $clickedTab = $(tabElement);
			if ($clickedTab.hasClass('active') || $clickedTab.is('[aria-disabled="true"]')) return;
			const $tabArea = $clickedTab.closest(`.${projectName}-tab-area`);
			const $tabs = $tabArea.find('[role="tab"]');
			const $panels = $tabArea.find('[role="tabpanel"]');
			const targetPanelId = $clickedTab.attr('aria-controls');

			$tabs.removeClass('active').attr('aria-selected', 'false');
			$tabs.find('.btn-tab').attr('tabindex', '-1');
			$panels.removeClass('active').attr('hidden', true);
			$clickedTab.addClass('active').attr('aria-selected', 'true');
			$clickedTab.find('.btn-tab').attr('tabindex', '0').focus();
			$panels.filter('#' + targetPanelId).addClass('active').removeAttr('hidden');

			// (선택사항) SR-only 텍스트 업데이트
			$tabs.find('.btn-tab .sr-only').remove();
			$clickedTab.find('.btn-tab').append('<span class="sr-only"> 선택됨</span>');
		},
		handleKeyboardNav: function (e) { // 'this'는 ul[role="tablist"]
			const $currentItem = $(document.activeElement);
			if (!$currentItem.is('.btn-tab')) return;
			const $tablist = $(this);
			const $tabs = $tablist.find('[role="tab"]');
			const $currentTabLi = $currentItem.closest('[role="tab"]');
			const currentIndex = $tabs.index($currentTabLi);
			let $nextTabLi;

			if (['ArrowRight', 'ArrowDown', 'ArrowLeft', 'ArrowUp', 'Home', 'End'].includes(e.key)) {
				e.preventDefault();
				if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
					const nextIndex = (currentIndex + 1) % $tabs.length;
					$nextTabLi = $tabs.eq(nextIndex);
				} else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
					const prevIndex = (currentIndex - 1 + $tabs.length) % $tabs.length;
					$nextTabLi = $tabs.eq(prevIndex);
				} else if (e.key === 'Home') {
					$nextTabLi = $tabs.first();
				} else if (e.key === 'End') {
					$nextTabLi = $tabs.last();
				}
				if ($nextTabLi && $nextTabLi.length) {
					// 키보드 이동 시 포커스 이동 + 즉시 활성화
					commonJs.tab.activateTab($nextTabLi[0]);
				}
			}
		} // end handleKeyboardNav
	}
};

$(function () {
	commonJs.init();
});