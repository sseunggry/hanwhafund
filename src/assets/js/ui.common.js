let projectName = 'hwf';
let scrollTop = 0;

const commonJs = {
	init: function () {
		$(`.${projectName}-form-select`).each(commonJs.customSelect.init);
		$(`.${projectName}-segment-control`).each(commonJs.segmentControl.init);

		$(`.btn-toggle-tooltip, .btn-toggle-popover`).each(commonJs.tooltip.init);
		$(`.btn-open-modal, .btn-open-bottom-sheet`).each(commonJs.modal.init);

		commonJs.bindGlobalEvents(); //전역 이벤트 리스너 바인딩 (이벤트 위임 방식)
	},
	bindGlobalEvents: function () {
		// 툴팁 토글 버튼 클릭 (이벤트 위임)
		$(document).on('click', '.btn-toggle-tooltip, .btn-toggle-popover', function (e) {
			e.preventDefault();
			e.stopPropagation();
			commonJs.tooltip.toggle.call(this);
		});

		// 툴팁 닫기 버튼 클릭 (이벤트 위임)
		$(document).on('click', '.btn-close-tooltip', function (e) {
			e.preventDefault();
			commonJs.tooltip.close.call(this);
		});

		// ✨ 모달 열기 버튼
		$(document).on('click', '.btn-open-modal, .btn-open-bottom-sheet', function (e) {
			e.preventDefault();
			commonJs.modal.open.call(this); // 'this'는 클릭된 열기 버튼
		});
		// ✨ 모달 닫기 버튼
		$(document).on('click', '.btn-close-modal, .btn-close-bottom-sheet', function (e) {
			e.preventDefault();
			commonJs.modal.close.call(this); // 'this'는 클릭된 닫기 버튼
		});
	},
	resize: function () {

	},
	scroll: function () {

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
			const $wrapper = $(this);
			const $select = $wrapper.find('select.sr-only');
			const $button = $wrapper.find('.select-button');
			const $valueSpan = $button.find('.select-value');
			const $listbox = $wrapper.find('.select-listbox');
			const $options = $listbox.find('.select-option');

			// 중복 초기화 방지
			if ($wrapper.data('custom-select-initialized')) return;
			$wrapper.data('custom-select-initialized', true);

			const placeholder = $select.data('placeholder') || '';
			const isDisabled = $select.is(':disabled');
			const listboxId = $listbox.attr('id');

			// 비활성화 처리
			if (isDisabled) {
				$wrapper.addClass('disabled');
				$button.attr('aria-disabled', 'true').attr('tabindex', '-1');
				return;
			}

			// --- 헬퍼 함수 ---
			function openListbox() {
				if (isDisabled) return;
				// 다른 열린 셀렉트 닫기
				$('[data-custom-select-initialized="true"] .select-button[aria-expanded="true"]').not($button).each(function () {
					$(this).trigger('closeListbox.customSelect');
				});

				$listbox.removeAttr('hidden'); // ✨ 먼저 보이게
				$button.attr('aria-expanded', 'true');

				let $focusedOption = $options.filter('[aria-selected="true"]');
				if (!$focusedOption.length) {
					$focusedOption = $options.not('.disabled').first();
				}

				// ✨ 요소가 보인 후 포커스 이동 (setTimeout 사용)
				setTimeout(() => {
					if ($focusedOption.length) {
						$focusedOption.focus();
					} else {
						$listbox.focus(); // 옵션 없으면 리스트박스에
					}
				}, 0);

				$(document).on('click.customSelect.' + listboxId, handleOutsideClick);
			}

			// 리스트박스 닫기
			function closeListbox() {
				$listbox.attr('hidden', true);
				$button.attr('aria-expanded', 'false');
				$(document).off('click.customSelect.' + listboxId);

				$button.focus();
			}

			// 리스트박스 토글
			function toggleListbox() {
				if ($button.attr('aria-expanded') === 'true') {
					closeListbox();
				} else {
					openListbox();
				}
			}

			// 옵션 선택 처리
			function selectOption($option) {
				if (!$option || !$option.length || $option.hasClass('disabled')) return;
				const value = $option.data('value');
				const text = $option.text();

				$valueSpan.text(text).removeClass('placeholder');
				$options.attr('aria-selected', 'false');
				$option.attr('aria-selected', 'true');

				if ($select.val() !== value) {
					$select.val(value).trigger('change');
				}
				closeListbox();
			}

			// 외부 클릭 처리
			function handleOutsideClick(event) {
				// wrapper 외부 클릭 시 닫기
				if ($(event.target).closest($wrapper).length === 0) {
					closeListbox();
				}
			}

			// --- 이벤트 바인딩 ---
			$wrapper.on('click', function (e) {
				if (!$(e.target).is($button) && $(e.target).closest($button).length === 0) {
					e.stopPropagation();
					$button.trigger('click');
				}
			});
			$button.on('click', function (e) {
				e.stopPropagation();
				toggleListbox();
			});

			// 외부에서 닫기 요청 시
			$button.on('closeListbox.customSelect', closeListbox);

			// 옵션 클릭: 선택 (이벤트 위임)
			$listbox.on('click', '.select-option', function (e) {
				e.stopPropagation();
				selectOption($(this));
			});

			// 키보드 네비게이션
			$button.on('keydown', function (e) {
				const isListboxOpen = $button.attr('aria-expanded') === 'true';
				if (!isListboxOpen && ['Enter', ' ', 'ArrowDown', 'ArrowUp'].includes(e.key)) {
					e.preventDefault();
					openListbox();
				}
				else if (isListboxOpen && (e.key === 'Escape' || e.key === 'Tab')) {
					e.preventDefault();
					closeListbox();
				}
			});

			// 리스트박스 또는 그 안의 옵션에 포커스가 있을 때
			$listbox.on('keydown', function (e) {
				const $currentItem = $(document.activeElement);
				if (!$listbox.is($currentItem) && !$options.is($currentItem)) return;

				const $enabledOptions = $options.not('.disabled');
				let $targetOption;

				switch (e.key) {
					case 'Enter':
					case ' ':
						if ($currentItem.is('.select-option')) {
							e.preventDefault();
							selectOption($currentItem);
							e.stopPropagation();
						} else {
							toggleListbox();
						}
						break;
					case 'ArrowDown':
						e.preventDefault();
						if ($currentItem.is('.select-option')) {
							$targetOption = $currentItem.nextAll('.select-option:not(.disabled)').first();
						} else {
							$targetOption = $enabledOptions.first();
						}
						if ($targetOption && $targetOption.length) $targetOption.focus();
						break;
					case 'ArrowUp':
						e.preventDefault();
						if ($currentItem.is('.select-option')) {
							$targetOption = $currentItem.prevAll('.select-option:not(.disabled)').first();
						} else {
							$targetOption = $enabledOptions.last();
						}
						if ($targetOption && $targetOption.length) $targetOption.focus();
						break;
					case 'Escape':
						e.preventDefault();
						closeListbox();
						e.stopPropagation();
						break;
					case 'Tab':
						closeListbox();
						break;
					default:
						break;
				}
			});

			// --- 네이티브 select 변경 시 UI 업데이트 ---
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

			// --- 초기 상태 적용 ---
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
		init: function () {
			const $wrapper = $(this); // <div class="hwf-segment-control">
			const isButtonMode = $wrapper.hasClass('tag-button'); // 버튼 모드인지 확인

			if (isButtonMode) {
				// --- 버튼 모드 (ARIA Radio Group) 로직 ---
				const $buttons = $wrapper.find('.control-button[role="radio"]');

				// 1. 클릭 이벤트 바인딩
				$buttons.on('click', function (e) {
					const $this = $(this);
					if ($this.is('[disabled]') || $this.attr('aria-checked') === 'true') {
						// 비활성화거나 이미 선택된 버튼은 아무것도 안 함 (선택 해제 방지)
						return;
					}

					// 모든 버튼 상태 초기화
					$buttons.removeClass('active').attr('aria-checked', 'false').attr('tabindex', '-1');

					// 클릭된 버튼만 활성 상태로 변경
					$this.addClass('active').attr('aria-checked', 'true').attr('tabindex', '0');

					// (선택사항) 값 변경 이벤트 트리거
					$wrapper.trigger('change', $this.data('value'));
				});

				// 2. 키보드 네비게이션 (방향키)
				$wrapper.on('keydown', function (e) {
					// 포커스가 그룹 내 라디오 버튼에 있을 때만 작동
					const $focusedButton = $(document.activeElement);
					if (!$focusedButton.is('.control-button[role="radio"]') || !$wrapper.has($focusedButton).length) {
						return;
					}

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
						// 포커스 이동 및 선택 상태 변경 (클릭 이벤트 트리거 방식)
						$targetButton.focus(); // 실제 포커스 이동
						$targetButton.trigger('click'); // 클릭 이벤트 실행하여 상태 변경
					}
				});

			} else {
				// --- 라디오 버튼 모드 로직 ---
				const $radios = $wrapper.find('input[type="radio"]');
				const $labels = $wrapper.find('label.control-button');

				// 초기 상태 반영 (CSS로도 가능하지만 JS로 명확히)
				$radios.each(function () {
					if ($(this).is(':checked')) {
						$(this).closest('label').addClass('active');
					}
				});

				// 라디오 버튼 상태 변경 시 라벨 클래스 업데이트
				$radios.on('change', function () {
					$labels.removeClass('active'); // 모든 라벨 active 제거
					if ($(this).is(':checked')) {
						$(this).closest('label').addClass('active'); // 체크된 것의 라벨에만 active 추가
					}
				});
				// (선택사항) 키보드 접근성 향상: 라벨에 포커스 갔을 때 내부 라디오로 포커스 이동
				// $labels.on('focus', function() {
				//    $(this).find('input[type="radio"]').focus();
				// });
			}
		}
	},
	tooltip: {
		activeTooltips: {},
		resizeListenerAttached: false,
		defaultSettings: { // 기본 설정값
			activeClass: 'active',
			tooltipSelector: '.hwf-tooltip, .hwf-popover',
			gap: 20
		},
		_updatePosition: function ($btn, $tooltipEl, settings) {
			if (!$tooltipEl || !$tooltipEl.length || !$btn || !$btn.length) return;

			// --- 위치/정렬 클래스 읽기 ---
			let primaryPosition = 'top'; // 기본값
			if ($tooltipEl.hasClass('bottom')) primaryPosition = 'bottom';
			else if ($tooltipEl.hasClass('left')) primaryPosition = 'left';
			else if ($tooltipEl.hasClass('right')) primaryPosition = 'right';

			let alignment = 'center'; // 기본값
			if ($tooltipEl.hasClass('left')) alignment = 'left';
			else if ($tooltipEl.hasClass('right')) alignment = 'right';

			const tooltipGap = settings.gap; // 설정에서 gap 값 사용
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

			// --- 뷰포트 경계 체크 ---
			const viewportWidth = window.innerWidth;
			if (tooltipLeft + tooltipWidth > viewportWidth + window.scrollX - tooltipGap) tooltipLeft = viewportWidth + window.scrollX - tooltipWidth - tooltipGap;
			if (tooltipLeft < window.scrollX + tooltipGap) tooltipLeft = window.scrollX + tooltipGap;

			// CSS 적용
			$tooltipEl.css({
				top: Math.round(tooltipTop) + 'px',
				left: Math.round(tooltipLeft) + 'px',
			});
		},
		// 툴팁 열기 로직
		_open: function ($btn, $targetEl, settings) {
			if (!$btn || !$targetEl || !$targetEl.length || $targetEl.hasClass(settings.activeClass)) return; // 이미 열려있으면 중단
			const targetId = $targetEl.attr('id');
			const eventNamespace = '.tooltipClose.' + targetId;

			$targetEl.addClass(settings.activeClass);
			$btn.attr('aria-expanded', 'true');
			$targetEl.attr('aria-hidden', 'false');
			this.activeTooltips[targetId] = { $btn: $btn, $tooltipEl: $targetEl, settings: settings }; // 활성 목록 추가
			this._updatePosition($btn, $targetEl, settings); // 위치 계산

			setTimeout(() => { // 외부 클릭 닫기 바인딩
				$(document).on(eventNamespace, function (e) {
					if ($(e.target).closest($targetEl).length === 0 && !$(e.target).is($btn) && $(e.target).closest($btn).length === 0) {
						this._close($targetEl, $btn, settings); // 내부 닫기 함수 호출
					}
				});
			}, 0);
		},
		// 툴팁 닫기 로직
		_close: function ($tooltipToClose, $btn, settings) {
			if (!$tooltipToClose || !$tooltipToClose.length || !$tooltipToClose.hasClass(settings.activeClass)) return; // 이미 닫혀있으면 중단
			const targetId = $tooltipToClose.attr('id');
			const eventNamespace = '.tooltipClose.' + targetId;

			$tooltipToClose.removeClass(settings.activeClass);
			$tooltipToClose.attr('aria-hidden', 'true');
			if (targetId) delete this.activeTooltips[targetId]; // 활성 목록 제거

			const $openerButton = $btn || (targetId ? $(`[aria-controls="${targetId}"]`) : $());
			if ($openerButton.length) {
				$openerButton.attr('aria-expanded', 'false');
			}
			$(document).off(eventNamespace); // 외부 클릭 리스너 제거
		},
		handleResizeOrScroll: null,
		init: function () {
			const $btn = $(this);
			const userOptions = {};
			const settings = $.extend({}, commonJs.tooltip.defaultSettings, userOptions);

			if (!$btn.is('button, a, [role="button"]') || !$btn.attr('aria-controls')) return;
			const targetId = $btn.attr('aria-controls');

			if ($btn.data('tooltip-settings')) return;
			$btn.data('tooltip-settings', settings); // 버튼에 설정 저장
			$btn.data('tooltip-target-id', targetId);

			if (targetId) {
				const $targetEl = $('#' + targetId);
				if ($targetEl.length) {
					const isActiveInitially = $targetEl.hasClass(settings.activeClass);
					if (isActiveInitially) { // 이미 active 클래스가 있으면:
						$btn.attr('aria-expanded', 'true');
						$targetEl.attr('aria-hidden', 'false');
						commonJs.tooltip.activeTooltips[targetId] = { $btn: $btn, $tooltipEl: $targetEl, settings: settings };
						commonJs.tooltip._updatePosition($btn, $targetEl, settings);

						const eventNamespace = '.tooltipClose.' + targetId;

						setTimeout(() => {
							$(document).on(eventNamespace, function (e) {
								if (
									$targetEl.hasClass(settings.activeClass) &&
									$(e.target).closest($targetEl).length === 0 &&
									!$(e.target).is($btn) && $(e.target).closest($btn).length === 0) {
									commonJs.tooltip.close($targetEl, $btn, settings);
								}
							});
						}, 0);
					} else {// active 클래스가 없으면 (닫힌 상태):
						$btn.attr('aria-expanded', 'false');
						$targetEl.attr('aria-hidden', 'true');
					}
				} else { console.warn('Tooltip target not found:', targetId); }
			} else { console.warn('Button is missing aria-controls attribute:', this); }

			// 리사이즈/스크롤 핸들러 설정 (한 번만)
			if (!commonJs.tooltip.handleResizeOrScroll) {
				commonJs.tooltip.handleResizeOrScroll = commonJs.debounce(() => {
					$.each(commonJs.tooltip.activeTooltips, (id, refs) => {
						if (refs.$tooltipEl.hasClass(refs.settings.activeClass)) {
							commonJs.tooltip._updatePosition(refs.$btn, refs.$tooltipEl, refs.settings);
						} else {
							delete commonJs.tooltip.activeTooltips[id];
						}
					});
				}, 100);

				if (!commonJs.tooltip.resizeListenerAttached) {
					$(window).on('resize.tooltipControl scroll.tooltipControl', commonJs.handleResizeOrScroll);
					commonJs.tooltip.resizeListenerAttached = true;
				}
			}
		},
		toggle: function () {
			const $btn = $(this); // 'this'는 토글 버튼
			const settings = $btn.data('tooltip-settings');
			const targetId = $btn.data('tooltip-target-id');
			if (!settings || !targetId) return; // 초기화 안 됨
			const $targetEl = $('#' + targetId);

			if ($targetEl.length) {
				if ($targetEl.hasClass(settings.activeClass)) {
					commonJs.tooltip._close($targetEl, $btn, settings);
				} else {
					commonJs.tooltip._open($btn, $targetEl, settings);
				}
			}
		},
		close: function () {
			const $el = $(this); // 닫기 버튼 또는 툴팁 자체
			let $tooltipToClose = null;
			let targetId = null;
			let $openBtn = null;
			let settings = {}; // 설정 로드 필요

			if ($el.is('.btn-close-tooltip')) {
				targetId = $el.attr('aria-controls') || $el.closest('[id]').attr('id'); // ID 찾기
				if (targetId) $tooltipToClose = $('#' + targetId);
			} else if ($el.is('[id]')) { // 툴팁 요소 가정
				$tooltipToClose = $el;
				targetId = $el.attr('id');
			}

			if ($tooltipToClose && $tooltipToClose.length) {
				$openBtn = targetId ? $(`[aria-controls="${targetId}"]`) : $();
				settings = $openBtn.data('tooltip-settings') || {}; // 버튼 설정 가져오기
				commonJs.tooltip._close($tooltipToClose, $openBtn, settings);
			} else {
				console.warn('Could not find tooltip to close for:', this);
			}
		},
		updatePosition: function () {
			const $btn = $(this);
			const settings = $btn.data('tooltip-settings');
			const targetId = $btn.data('tooltip-target-id');
			if (!settings || !targetId) return;
			const $targetEl = $('#' + targetId);

			if ($targetEl && $targetEl.length && $targetEl.hasClass(settings.activeClass)) {
				commonJs.tooltip._updatePosition($btn, $targetEl, settings);
			}
		}
	},
	modal: {
		activeModals: {},
		defaultSettings: {
			activeClass: 'show', // 'show' 대신 'active' 사용 권장 (일관성)
			modalSelector: '.hwf-modal, .hwf-bottom-sheet'
			// focusSelector: 'a, button, input:not([type=hidden]), [tabindex]:not([tabindex="-1"])'
		},
		// --- 내부 핵심 로직 함수들 ---
		_open: function ($btn, $targetEl, settings) {
			// 'this'는 commonJs.modal 객체
			if (!$btn || !$targetEl || !$targetEl.length || $targetEl.hasClass(settings.activeClass)) return;
			const targetId = $targetEl.attr('id');
			const eventNamespace = '.modalClose.' + targetId;

			// 다른 열린 모달 닫기 (필요 시)
			// ✨ 여기서 this는 commonJs.modal 객체이므로 this.activeModals 사용
			$.each(this.activeModals, (id, refs) => {
				if (id !== targetId && refs.$modalEl.hasClass(refs.settings.activeClass)) {
					this._close(refs.$modalEl, refs.$btn, refs.settings);
				}
			});

			$targetEl.addClass(settings.activeClass);
			$btn.attr('aria-expanded', 'true'); // 버튼 상태 업데이트
			this.activeModals[targetId] = { $btn: $btn, $modalEl: $targetEl, settings: settings }; // 활성 목록 추가

			// 바깥 영역 클릭 닫기 바인딩
			setTimeout(() => {
				$(document).on(eventNamespace, (e) => { // 화살표 함수로 'this' 유지
					if ($targetEl.hasClass(settings.activeClass) && $(e.target).closest($targetEl).length === 0 && !$(e.target).is($btn) && $(e.target).closest($btn).length === 0) {
						this._close($targetEl, $btn, settings); // 내부 닫기 함수 호출
					}
				});
			}, 0);

			// (선택사항) 포커스 이동 로직
			// const $focusTarget = $targetEl.find(settings.focusSelector).first();
			// if ($focusTarget.length) { setTimeout(() => $focusTarget.focus(), 50); }
		},

		_close: function ($modalToClose, $btn, settings) {
			// 'this'는 commonJs.modal 객체
			if (!$modalToClose || !$modalToClose.length || !$modalToClose.hasClass(settings.activeClass)) return;
			const targetId = $modalToClose.attr('id');
			const eventNamespace = '.modalClose.' + targetId;

			$modalToClose.removeClass(settings.activeClass);
			// ✨ 객체 속성 접근 시 'this.' 사용
			if (targetId) delete this.activeModals[targetId];

			const $openerButton = $btn || (targetId ? $(`[aria-controls="${targetId}"]`) : $());
			if ($openerButton.length) {
				$openerButton.attr('aria-expanded', 'false'); // 버튼 상태 업데이트
				// (선택사항) 포커스 복귀
				// setTimeout(() => $openerButton.focus(), 50);
			}
			$(document).off(eventNamespace); // 외부 클릭 리스너 제거
		},

		// --- ✨ 공개 메서드 ---
		init: function () { // ✨ 'this'는 모달 열기 버튼 DOM 요소
			const $btn = $(this);
			const userOptions = {}; // data 속성 등에서 옵션 로드 가능
			// ✨ defaultSettings는 commonJs.modal 객체의 속성
			const settings = $.extend({}, commonJs.modal.defaultSettings, userOptions);

			if (!$btn.is('button, a, [role="button"]') || !$btn.attr('aria-controls')) return;
			const targetId = $btn.attr('aria-controls');

			if ($btn.data('modal-settings')) return; // 중복 초기화 방지
			$btn.data('modal-settings', settings); // 버튼에 설정 저장
			$btn.data('modal-target-id', targetId);

			if (targetId) {
				const $targetEl = $('#' + targetId);
				if ($targetEl.length) {
					// 초기 상태 설정 (보통 모달은 처음에 닫혀있음)
					$btn.attr('aria-expanded', 'false');
					// $targetEl.attr('aria-hidden', 'true'); // hidden 속성/클래스 관리 확인
					if ($targetEl.hasClass(settings.activeClass)) {
						// 만약 초기 로드 시 열려있어야 한다면 여기서 _open 로직 일부 실행
						console.warn('Modal should ideally be closed on init:', targetId);
						// commonJs.modal._open($btn, $targetEl, settings); // 필요 시 호출
					}
				} else { console.warn('Modal target not found:', targetId); }
			} else { console.warn('Button is missing aria-controls attribute:', this); }
		}, // end init

		open: function () { // ✨ 'this'는 클릭된 열기 버튼 DOM 요소
			const $btn = $(this);
			const settings = $btn.data('modal-settings');
			const targetId = $btn.data('modal-target-id');
			if (!settings || !targetId) { console.error('Modal not initialized for button:', this); return; }
			const $targetEl = $('#' + targetId);

			if ($targetEl.length) {
				// ✨ 내부 함수 호출 ('commonJs.modal.' 경로 사용)
				commonJs.modal._open($btn, $targetEl, settings);
			}
		}, // end open

		close: function () { // ✨ 'this'는 닫기 버튼 또는 모달 DOM 요소
			const $element = $(this);
			let $modalToClose = null;
			let targetId = null;
			let $openBtn = null;
			let settings = {};

			// 닫을 모달 찾기
			if ($element.is('.btn-close-modal, .btn-close-bottom-sheet')) { // 구체적인 닫기 버튼 클래스 사용
				targetId = $element.attr('aria-controls') || $element.closest('[id]').attr('id');
				if (targetId) $modalToClose = $('#' + targetId);
			} else if ($element.is(commonJs.modal.defaultSettings.modalSelector)) { // 모달 요소 자체
				$modalToClose = $element;
				targetId = $element.attr('id');
			}

			if ($modalToClose && $modalToClose.length) {
				$openBtn = targetId ? $(`[aria-controls="${targetId}"]`) : $();
				// ✨ 열기 버튼에 저장된 설정 사용, 없으면 기본값
				settings = $openBtn.data('modal-settings') || commonJs.modal.defaultSettings;
				// ✨ 내부 함수 호출 ('commonJs.modal.' 경로 사용)
				commonJs.modal._close($modalToClose, $openBtn, settings);
			} else {
				console.warn('Could not find modal to close for:', this);
			}
		} // end close
	}
};

$(function () {
	commonJs.init();
});