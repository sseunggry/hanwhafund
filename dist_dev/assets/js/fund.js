"use strict";

const uiDetailSearch = {
  init: function () {
    $(document).on("click.uiDetailSearch", ".search-option-btn .btn", function (e) {
      e.preventDefault();

      const $btn = $(this);
      const $optionWrap = $btn.parents('.search-option-btn').siblings('.search-option-wrap');

      $btn.toggleClass('active');
      $optionWrap.toggleClass('active');
    });
  }
};
const uiFundListChk = {
  init: function () {
    $(document).on("change.fundListChk", ".fund-list-wrap .fund-item input[type='checkbox']", function () {
      const $chk = $(this);
      const $fundContent = $chk.closest('.fund-content');
      const $floatingBox = $fundContent.siblings('.fund-compare-floating');
      const $allCheckboxes = $fundContent.find(".fund-list-wrap .fund-item input[type='checkbox']");
      const checkedCount = $allCheckboxes.filter(':checked').length;

      $floatingBox.toggleClass('active', checkedCount > 0)
    });
  }
}
const uiSort = {
  init: function () {
    $(document).on("click.uiSort", ".sort-list .btn", function (e) {
      e.preventDefault();

      const $clickedButton = $(this);
      const $sortList = $clickedButton.closest('.sort-list');

      const $allButtons = $sortList.find('.sort-item .btn, .period-list .btn');

      const wasActive = $clickedButton.hasClass('active');

      if (wasActive) {
        $clickedButton.toggleClass('sort-asc');
      } else {
        $allButtons.removeClass('active sort-asc').removeAttr('data-order-by');
        $clickedButton.addClass('active sort-asc');
      }

      const orderValue = $clickedButton.hasClass('sort-asc') ? 'asc' : 'desc';
      $clickedButton.attr('data-order-by', orderValue);
    });
  }
};
const uiRangeSlider = {
  init: function () {
    const $sliders = $('.range-slider[data-grid]');
    
    if (!$sliders.length || !$.fn.slider) return;

    $sliders.each(function () {
      const $slider = $(this);

      const valueMap = [-10, 0, 20, 40, 60, 80];
      const options = $slider.data('grid') || {};
      const sliderOptions = {
        range: true,
        min: options.min || 0, 
        max: options.max || (valueMap.length - 1), 
        step: options.step || 1,
        values: options.values || [1, 5] 
      };

      const handleset = (event, ui) => {
        const $handles = $slider.find('.ui-slider-handle');
        const $rangeBar = $slider.find('.ui-slider-range');
        const $altText = $slider.find('.blind.alt');
        const values = ui.values || sliderOptions.values;

        let altValues = []; 

        $handles.each(function(index) {
          const $handle = $(this);
          const indexValue = values[index];
          
          const realValue = valueMap[indexValue];
          altValues.push(realValue);

          $handle.find('.amount').val(realValue);
        });
        $altText.text(`수익률 ${altValues[0]}% ~ ${altValues[1]}% 사이 선택`);
      };
      
      $slider.slider({
        ...sliderOptions,
        create: function(event, ui) {
          const $handles = $slider.find('.handle');
          $(event.target).find('.ui-slider-handle').each(function(index) {
            $(this).html($handles.eq(index).html());
          });
          handleset(event, { values: sliderOptions.values });
          
          const $legend = $(event.target).find('.range-legend');
          const $spans = $legend.find('span');
          const totalItems = $spans.length;

          const totalIntervals = (sliderOptions.max - sliderOptions.min) / sliderOptions.step;

          $spans.each(function(index) {
            const $span = $(this);
            const percentage = (index / totalIntervals) * 100;
            $span.css({'left': percentage + '%',});
          });
        },
        slide: handleset,
        change: handleset
      });
    });
  }
};
const uiSortWrapSticky = {
  init: function () {
    const $stickyEl = $('.sort-wrap');
    if (!$stickyEl.length) return;

    const $window = $(window);
    let stickyOffsetTop = 0;
    let stickyHeight = 0;

    const updateDimensions = () => {
      if (!$stickyEl.hasClass('is-fixed')) {
        stickyOffsetTop = $stickyEl.offset().top;
        stickyHeight = $stickyEl.outerHeight();
      }
    };

    const handleScroll = () => {
      if (window.innerWidth <= 1400) {
        if ($stickyEl.hasClass('is-fixed')) {
          $stickyEl.removeClass('is-fixed');
          $stickyEl.parent().css('padding-top', 0);
        }
        return;
      }

      const scrollTop = $window.scrollTop();

      if (scrollTop >= stickyOffsetTop) {
        if (!$stickyEl.hasClass('is-fixed')) {
          $stickyEl.addClass('is-fixed');
          $stickyEl.parent().css('padding-top', stickyHeight);
        }
      } else {
        if ($stickyEl.hasClass('is-fixed')) {
          $stickyEl.removeClass('is-fixed');
          $stickyEl.parent().css('padding-top', 0);
        }
      }
    };

    updateDimensions();
    handleScroll();

    $window.on('scroll', handleScroll);
    $window.on('resize', () => {
      $stickyEl.removeClass('is-fixed').parent().css('padding-top', 0);
      updateDimensions();
      handleScroll();
    });
  }
};

$(function() {
  uiDetailSearch.init();
  uiFundListChk.init();
  uiSort.init();
  uiRangeSlider.init();
  uiSortWrapSticky.init();
});