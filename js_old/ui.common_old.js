(function ($) {
	// --- ✨ 공유 변수 및 헬퍼 함수 ---
	let activeTooltips = {};

	//함수
	// Debounce 함수
	function debounce(func, wait) {
		let timeout;
		return function executedFunction(...args) {
			const later = () => { clearTimeout(timeout); func.apply(this, args); };
			clearTimeout(timeout);
			timeout = setTimeout(later, wait);
		};
	}

	// 위치 계산 함수
	function _updatePosition($btn, $tooltipEl, settings) {
		if (!$tooltipEl || !$tooltipEl.length || !$btn || !$btn.length) return;

		// --- 위치/정렬 클래스 읽기 ---
		let primaryPosition = 'top'; // 기본값
		if ($tooltipEl.hasClass('bottom')) primaryPosition = 'bottom';
		else if ($tooltipEl.hasClass('left')) primaryPosition = 'left';
		else if ($tooltipEl.hasClass('right')) primaryPosition = 'right';

		let alignment = 'center'; // 기본값
		if ($tooltipEl.hasClass('left')) alignment = 'left';
		else if ($tooltipEl.hasClass('right')) alignment = 'right';

		const tooltipGap = settings.gap || 20; // 설정에서 gap 값 사용
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
			position: 'absolute',
			top: Math.round(tooltipTop) + 'px',
			left: Math.round(tooltipLeft) + 'px',
			transform: '',
		});
	}

	// 툴팁 열기 로직
	function _open($btn, $targetEl, settings) {
		if (!$btn || !$targetEl || !$targetEl.length || $targetEl.hasClass(settings.activeClass)) return; // 이미 열려있으면 중단
		const targetId = $targetEl.attr('id');
		const eventNamespace = '.tooltipClose.' + targetId;

		$targetEl.addClass(settings.activeClass);
		$btn.attr('aria-expanded', 'true');
		$targetEl.attr('aria-hidden', 'false');
		_updatePosition($btn, $targetEl, settings); // 위치 계산
		activeTooltips[targetId] = { $btn: $btn, $tooltipEl: $targetEl, settings: settings }; // 활성 목록 추가

		setTimeout(() => { // 외부 클릭 닫기 바인딩
			$(document).on(eventNamespace, function (e) {
				if ($targetEl.hasClass(settings.activeClass) && $(e.target).closest($targetEl).length === 0 && !$(e.target).is($btn) && $(e.target).closest($btn).length === 0) {
					_close($targetEl, $btn, settings); // 내부 닫기 함수 호출
				}
			});
		}, 0);
	}

	// 툴팁 닫기 로직
	function _close($tooltipToClose, $btn, settings) {
		if (!$tooltipToClose || !$tooltipToClose.length || !$tooltipToClose.hasClass(settings.activeClass)) return; // 이미 닫혀있으면 중단
		const targetId = $tooltipToClose.attr('id');
		const eventNamespace = '.tooltipClose.' + targetId;

		$tooltipToClose.removeClass(settings.activeClass);
		$tooltipToClose.attr('aria-hidden', 'true');
		if (targetId) delete activeTooltips[targetId]; // 활성 목록 제거

		const $openerButton = $btn || (targetId ? $(`[aria-controls="${targetId}"]`) : $());
		if ($openerButton.length) {
			$openerButton.attr('aria-expanded', 'false');
		}
		$(document).off(eventNamespace); // 외부 클릭 리스너 제거
	}

	// --- ✨ Debounced 리사이즈/스크롤 핸들러 (IIFE 스코프) ---
	const handleResizeOrScroll = debounce(() => {
		$.each(activeTooltips, (id, refs) => {
			if (refs.$tooltipEl.hasClass(refs.settings.activeClass)) {
				_updatePosition(refs.$btn, refs.$tooltipEl, refs.settings);
			} else {
				delete activeTooltips[id];
			}
		});
	}, 100);

	// 리사이즈/스크롤 리스너 추가 (한 번만)
	if (!window.tooltipResizeListenerAttached) {
		$(window).on('resize.tooltipControl scroll.tooltipControl', handleResizeOrScroll);
		window.tooltipResizeListenerAttached = true;
	}


	//////////////////
	//selectbox custom
	$.fn.customSelect = function () {
		return this.each(function () {
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

		});
	};

	//segment control
	$.fn.segmentControl = function () {
		return this.each(function () {
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
		});
	};

	$.fn.modalOpen = function (options) {
		const settings = $.extend({
			activeClass: 'show',
			modalSelector: '.hwf-modal, .hwf-bottom-sheet' // 닫을 다른 모달 대상
		}, options);

		return this.each(function () {
			const $btn = $(this);
			const targetId = $btn.attr('aria-controls');

			if (targetId) {
				const $targetEl = $('#' + targetId);
				if ($targetEl.length) {
					// 1. 다른 열린 모달/바텀시트 닫기
					// $(settings.modalSelector + '.' + settings.activeClass).not($targetEl).modalClose(); // 아래 정의된 닫기 플러그인 호출

					// 2. 대상 모달 열기
					$targetEl.addClass(settings.activeClass);
					$btn.attr('aria-expanded', 'true');

					// 3. 바깥 영역 클릭 시 닫기 이벤트 바인딩 (네임스페이스 사용)
					const eventNamespace = '.modalClose.' + targetId;

					setTimeout(() => {
						$(document).on(eventNamespace, function (e) {
							// 클릭된 요소가 모달 내부 요소가 아니고, 열기 버튼도 아닐 경우
							if ($targetEl.hasClass(settings.activeClass) && $(e.target).closest($targetEl).length === 0 && !$(e.target).is($btn) && $(e.target).closest($btn).length === 0) {
								$targetEl.modalClose(); // 자신을 닫음
							}
						});
					}, 0);
				}
			}
		});
	};
	$.fn.modalClose = function (options) {
		const settings = $.extend({
			activeClass: 'show',
			modalSelector: '.hwf-modal, .hwf-bottom-sheet' // 닫을 대상 셀렉터
		}, options);

		return this.each(function () {
			const $el = $(this); // 닫기 버튼 또는 모달 자체
			let $modalToClose = null;
			let targetId = null;
			let $openBtn = null;

			if ($el.is('.btn-close')) {
				const directTargetId = $el.attr('aria-controls');
				if (directTargetId) {
					$modalToClose = $('#' + directTargetId);
					targetId = directTargetId;
				} else {
					$modalToClose = $el.closest(settings.modalSelector);
					if ($modalToClose.length) targetId = $modalToClose.attr('id');
				}
			} else if ($el.is(settings.modalSelector)) {
				$modalToClose = $el;
				targetId = $modalToClose.attr('id');
			}

			// 닫을 모달을 찾았을 경우
			if ($modalToClose && $modalToClose.length) {
				$modalToClose.removeClass(settings.activeClass); // 모달 닫기

				// 바깥 영역 클릭 이벤트 해제
				if (targetId) {
					$openBtn = $(`[aria-controls="${targetId}"]`);

					if ($openBtn.length) {
						$openBtn.attr('aria-expanded', 'false');
					}
					const eventNamespace = '.modalClose.' + targetId;
					$(document).off(eventNamespace);
				}
			}
		});
	};

	// --- 툴팁/팝오버 토글 ---
	$.fn.tooltipToggle = function (options) {
		const settings = $.extend({
			activeClass: 'active',
			tooltipSelector: '.hwf-tooltip' // 대상 셀렉터
		}, options);

		return this.each(function () {
			const $btn = $(this);
			const targetId = $btn.attr('aria-controls');

			if (targetId) {
				const $targetEl = $('#' + targetId);
				if ($targetEl.length) {

					// 대상 요소의 활성 상태 토글
					const isActive = $targetEl.hasClass(settings.activeClass);
					const eventNamespace = '.tooltipClose.' + targetId;

					if (isActive) {
						$targetEl.removeClass(settings.activeClass);
						$btn.attr('aria-expanded', 'false');
						$targetEl.attr('aria-hidden', 'true');
						$(document).off(eventNamespace);
						delete activeTooltips[targetId];
					} else {
						$targetEl.addClass(settings.activeClass);
						$btn.attr('aria-expanded', 'true');
						$targetEl.attr('aria-hidden', 'false');

						_updatePosition($btn, $targetEl, settings);
						activeTooltips[targetId] = { $btn: $btn, $tooltipEl: $targetEl, settings: settings };

						setTimeout(() => {
							$(document).on(eventNamespace, function (e) {
								if ($targetEl.hasClass(settings.activeClass) && $(e.target).closest($targetEl).length === 0 && !$(e.target).is($btn) && $(e.target).closest($btn).length === 0) {
									$targetElement.tooltipClose();
								}
							});
						}, 0);
					}
				}
			}
		});
	};

	// --- 툴팁/팝오버 닫기 (토글 플러그인과 연동) ---
	$.fn.tooltipClose = function (options) {
		const settings = $.extend({
			activeClass: 'active',
			tooltipSelector: '.hwf-tooltip'
		}, options);

		return this.each(function () {
			const $el = $(this); // 닫기 버튼 또는 툴팁 자체
			let $tooltipToClose = null;
			let targetId = null;
			let $openBtn = null;

			if ($el.is('.btn-close-tooltip')) {
				const directTargetId = $el.attr('aria-controls');
				if (directTargetId) {
					$tooltipToClose = $('#' + directTargetId);
					targetId = directTargetId;
				} else {
					$tooltipToClose = $el.closest(settings.tooltipSelector);
					if ($tooltipToClose.length) targetId = $tooltipToClose.attr('id');
				}
			} else if ($el.is(settings.tooltipSelector)) {
				$tooltipToClose = $el;
				targetId = $tooltipToClose.attr('id');
			}

			if ($tooltipToClose && $tooltipToClose.length) {
				$tooltipToClose.removeClass(settings.activeClass);
				$tooltipToClose.attr('aria-hidden', 'true');

				if (targetId) delete activeTooltips[targetId];

				if (targetId) {
					$openBtn = $(`[aria-controls="${targetId}"]`);
					if ($openBtn.length) {
						$openBtn.attr('aria-expanded', 'false');
					}
					$(document).off('.tooltipClose.' + targetId);
				}
			}
		});
	};

	$.fn.tooltip = function (methodOrOptions = {}) {
		const defaultSettings = {
			activeClass: 'active',
			tooltipSelector: '.hwf-tooltip, .hwf-popover',
			gap: 20
		};

		// --- 메서드 호출 처리 ---
		if (typeof methodOrOptions === 'string') {
			const methodName = methodOrOptions;
			const args = Array.prototype.slice.call(arguments, 1);

			return this.each(function () {
				const $element = $(this);
				const $btn = $element.is('[aria-controls]') ? $element : $(`[aria-controls="${$element.attr('id')}"]`);
				const settings = $btn.data('tooltip-settings') || defaultSettings; // 저장된 설정 가져오기
				let $tooltipEl = null;
				const targetId = $element.attr('aria-controls') || ($element.is(settings.tooltipSelector) ? $element.attr('id') : null);
				if (targetId) $tooltipEl = $('#' + targetId);

				switch (methodName) {
					case 'open':
						if ($btn.length && $tooltipEl && $tooltipEl.length) {
							_open($btn, $tooltipEl, settings);
						}
						break;
					case 'close':
						if ($tooltipEl && $tooltipEl.length) {
							_close($tooltipEl, $btn, settings);
						} else if ($element.is('.btn-close-tooltip')) { // 닫기 버튼 직접 처리
							const $closestTooltip = $element.closest(settings.tooltipSelector);
							if ($closestTooltip.length) {
								const closeTargetId = $closestTooltip.attr('id');
								const $closeOpener = closeTargetId ? $(`[aria-controls="${closeTargetId}"]`) : $();
								_close($closestTooltip, $closeOpener, settings);
							}
						}
						break;
					case 'toggle':
						if ($btn.length && $tooltipEl && $tooltipEl.length) {
							if ($tooltipEl.hasClass(settings.activeClass)) {
								_close($tooltipEl, $btn, settings);
							} else {
								_open($btn, $tooltipEl, settings);
							}
						}
						break;
					case 'updatePosition':
						if ($btn.length && $tooltipEl && $tooltipEl.length && $tooltipEl.hasClass(settings.activeClass)) {
							_updatePosition($btn, $tooltipEl, settings);
						}
						break;
				}
			});
		}

		// --- 초기화 또는 기본 토글 처리 ---
		const options = methodOrOptions; // 옵션 객체
		const settings = $.extend({}, defaultSettings, options);

		return this.each(function () {
			const $btn = $(this); // 토글 버튼
			if (!$btn.is('button, a, [role="button"]') || !$btn.attr('aria-controls')) return; // 버튼 요소가 아니거나 aria-controls 없으면 무시

			const targetId = $btn.attr('aria-controls');

			// 중복 초기화 방지 및 설정 저장
			if ($btn.data('tooltip-settings')) return;
			$btn.data('tooltip-settings', settings);
			$btn.data('tooltip-target-id', targetId); // 타겟 ID 저장

			if (targetId) {
				const $targetEl = $('#' + targetId);
				if ($targetEl.length) {
					const isActiveInitially = $targetEl.hasClass(settings.activeClass);

					// const isActive = $targetEl.hasClass(settings.activeClass);
					// if (isActive) {
					// 	_close($targetEl, $btn, settings);
					// }
					if (isActiveInitially) { // 이미 active 클래스가 있으면:
						$btn.attr('aria-expanded', 'true');
						$targetEl.attr('aria-hidden', 'false');
						_updatePosition($btn, $targetEl, settings);
						activeTooltips[targetId] = { $btn: $btn, $tooltipEl: $targetEl, settings: settings };

						const eventNamespace = '.tooltipClose.' + targetId;

						setTimeout(() => {
							$(document).on(eventNamespace, function (e) {
								if (
									$targetEl.hasClass(settings.activeClass) &&
									$(e.target).closest($targetEl).length === 0 &&
									!$(e.target).is($btn) && $(e.target).closest($btn).length === 0) {
									_close($targetEl, $btn, settings);
								}
							});
						}, 0);
					} else {// active 클래스가 없으면 (닫힌 상태):
						$btn.attr('aria-expanded', 'false');
						$targetEl.attr('aria-hidden', 'true');
					}
				}
			}
		});

	}



	// 실행
	$(function () {
		projectName = 'hwf';

		$(`.${projectName}-form-select`).customSelect();
		$(`.${projectName}-segment-control`).segmentControl();

		$('#test-select').val('test2').trigger('change');

		// 모달/바텀시트 열기 버튼
		$(document).on('click', '.btn-open-modal, .btn-open-bottom-sheet', function (e) {
			e.preventDefault();
			$(this).modalOpen();
		});

		// 모달/바텀시트 닫기 버튼
		$(document).on('click', '.btn-close-modal, .btn-close-bottom-sheet', function (e) {
			e.preventDefault();
			$(this).modalClose();
		});

		// // 툴팁/팝오버 열기/닫기 버튼 (토글)
		// $(document).on('click', '.btn-toggle-tooltip, .btn-toggle-popover', function (e) {
		// 	e.preventDefault();
		// 	e.stopPropagation();
		// 	$(this).tooltipToggle();
		// });

		// // 툴팁/팝오버 내부의 닫기 버튼
		// $(document).on('click', `.btn-close-tooltip`, function (e) {
		// 	e.preventDefault();
		// 	$(this).tooltipClose();
		// });

		$('.btn-toggle-tooltip, .btn-toggle-popover').tooltip();

		// 툴팁/팝오버 열기/닫기 버튼 (토글)
		$(document).on('click', '.btn-toggle-tooltip, .btn-toggle-popover', function (e) {
			e.preventDefault();
			e.stopPropagation();
			$(this).tooltip('toggle');
		});

		// 툴팁/팝오버 내부의 닫기 버튼
		$(document).on('click', '.btn-close-tooltip', function (e) {
			e.preventDefault();
			$(this).tooltip('close');
		});
	});

})(jQuery);