"use strict";

const uiFooterBanner = {
  init: function() {
    const $pageMain = $('.page-main');
    if ($pageMain.length === 0) return;

    this.$banner = $pageMain.find('.section-banner');
    this.$footer = $pageMain.find('.footer');

    if (this.$banner.length && this.$footer.length) {
      this.updateHeight();

      $(window).on('resize.footerBanner', this.updateHeight.bind(this));
    }
  },

  updateHeight: function() {
    if (this.$banner && this.$footer) {
      const footerHeight = this.$footer.outerHeight();
      this.$banner.css('--main-banner-footer-height', footerHeight + 'px');
    }
  }
};
const gsapPartnerAni = {
  init: function() {
    const $section = $(".section-partner");
    if (!$section.length) return;

    const $counters = $section.find(".counter");
    const $dl = $section.find(".txt-wrap dl");
    const $imagesWrap = $section.find(".img-wrap");
    const $images = $section.find(".img-list li");

    const endNum1 = $counters.eq(0).data('num') || 0;
    const endNum2 = $counters.eq(1).data('num') || 0;
    const endNum3 = $counters.eq(2).data('num') || 0;
    
    const counters = { counter1: 0, counter2: 0, counter3: 0 };
    const imgDuration = 0.8;
    const dlDuration = 0.5;
    const counterDuration = 0.8;
    
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: $section[0],
        start: "top 10%",
        toggleActions: "restart none none reverse",
        // markers: true,
      }
    });

    // 3.자동 재생 시퀀스 (fromTo 사용)
    // Part 1
    // 이미지
    tl.fromTo($imagesWrap, 
      { opacity: 0 },
      { opacity: 1, duration: 0.5, ease: "power2.out" }
    );
    tl.fromTo($images.eq(0), 
      { scale: 1.1, opacity: 0 },
      { scale: 1, opacity: 1, duration: imgDuration, ease: "power2.out" }
    );
    // 텍스트
    tl.fromTo($dl.eq(0), 
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: dlDuration, ease: "power3.out" },
      "<0.2"
    ); 
    // 카운터
    tl.to(counters, { 
      counter1: endNum1,
      duration: counterDuration, 
      snap: "counter1",
      ease: "ease-in-out", 
      onUpdate: () => $counters.eq(0).text(Math.round(counters.counter1))
    }, "<");

    // Part 2
    tl.fromTo($images.eq(1), 
      { scale: 1.1, opacity: 0 },
      { scale: 1, opacity: 1, duration: imgDuration, ease: "power2.out" },
      "+=0.1"
    );
    tl.fromTo($dl.eq(1),
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: dlDuration, ease: "power3.out" },
      "<0.1"
    );
    tl.to(counters, {
      counter2: endNum2,
      duration: counterDuration,
      snap: "counter2",
      ease: "ease-in-out",
      onUpdate: () => $counters.eq(1).text(Math.round(counters.counter2))
    }, "<");

    // Part 3: (Part 2가 끝나고 0.5초 후)
    tl.fromTo($images.eq(2), 
      { scale: 1.1, opacity: 0 },
      { scale: 1, opacity: 1, duration: imgDuration, ease: "power2.out" },
      "+=0.1"
    );
    tl.fromTo($dl.eq(2),
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: dlDuration, ease: "power3.out" },
      "<0.1"
    );
    tl.to(counters, {
      counter3: endNum3,
      duration: counterDuration,
      snap: "counter3",
      ease: "ease-in-out",
      onUpdate: () => $counters.eq(2).text(Math.round(counters.counter3))
    }, "<");
  }
};
const gsapMessageAni = {
  init: function() {
    const $sectionMsgContainer = $(".section-message");
    const $sectionMsgText = $(".section-message .tit");
    const $sectionBiz = $(".section-business");
    if (!$sectionMsgContainer.length || !$sectionMsgText.length || !$sectionBiz.length) return;
    const msgHeight = $sectionMsgText.outerHeight();

    gsap.timeline({
      scrollTrigger: {
        trigger: $sectionMsgContainer, // 트리거 .section-message가 뷰포트 상단에 닿을 때 시작
        start: "top top", 
        endTrigger: $sectionBiz, // 종료: .section-business의 'top'이 뷰포트의 'top + (msgHeight / 2)px' 지점에 닿을 때
        end: `top ${msgHeight / 2}px`,
        pin: $sectionMsgContainer, // 고정 : section-message를 고정(pin)
        pinSpacing: false, // 고정 시 여백(padding)을 추가X
        scrub: 1, 
        // markers: true // (디버깅 시 true로 변경)
      }
    })
    .to($sectionMsgText, {
      // y: -(msgHeight / 2),
      ease: "none" // 스크롤과 동일한 속도로 이동
    });
  }
};
const gsapBusinessAni = {
  init: function() {
    const $sectionBiz = $(".section-business");
    if (!$sectionBiz.length) return;

    const $allItems = $sectionBiz.find(".accordion-item");
    const $allButtons = $sectionBiz.find(".btn-accordion");
    const $allContents = $sectionBiz.find(".accordion-collapse");

    const $firstItem = $allItems.first();
    const $firstButton = $allButtons.first();
    const $firstContent = $firstItem.find(".accordion-collapse");

    if (!$firstItem.length) return;

    $allItems.removeClass("active");
    $allContents.hide();
    
    // 2. 타임라인 생성
    ScrollTrigger.create({
      trigger: $sectionBiz,
      start: "top 20%", 
      toggleActions: "play none none reverse", 
      onEnter: () => {
        $firstItem.addClass("active");
        $firstButton.attr("aria-expanded", "true");
        
        $firstContent.stop().slideDown(500);
      },
      onLeaveBack: () => {
        $firstItem.removeClass("active");
        $firstButton.attr("aria-expanded", "false");
        
        $firstContent.stop().slideUp(500);
      }
    });
  }
};
const gsapInsightAni = {
  init: function() {
    const $visualBox = $(".section-insight .visual-box"); 
    const $infoBox = $(".section-insight .info-box"); 
    const $newsItems = $infoBox.find(".news-item");
    if (!$visualBox.length || !$infoBox.length || !$newsItems.length) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: $visualBox[0], 
        start: "top 30%",     
        toggleActions: "restart none none reverse", 
        // markers: true 
      }
    });

    tl.from($infoBox, {
      y: 120,
      opacity: 1,
      duration: 1.0,
      ease: "power3.out"
    });
    tl.from($newsItems, {
      y: 50,      // 50px 아래에서
      opacity: 0,
      duration: 0.8,
      ease: "power3.out",
      stagger: 0.2 // 0.2초 간격으로 순차 재생
    }, 
    "<0.3");
  }
};
const gsapBannerTextFillAni = {
  init: function() {
    const $bannerTit = $(".section-banner .tit");
    if (!$bannerTit.length) return;

    gsap.to($bannerTit, {
      backgroundPosition: "0% 0", // 배경 이미지를 왼쪽 끝으로 이동시켜 색상이 채워지는 효과
      duration: 1.5,              // 1.5초 동안
      ease: "power2.out",         // 부드러운 가속/감속
      scrollTrigger: {
        trigger: $bannerTit[0],
        start: "top 50%",     
        toggleActions: "restart none none reverse", 
        // markers: true // (디버깅 시 true로 변경)
      }
    });
  }
};

$(function () {
  gsapPartnerAni.init();
  gsapMessageAni.init();
  gsapBusinessAni.init();
  gsapInsightAni.init();
  gsapBannerTextFillAni.init();

  uiFooterBanner.init();
});