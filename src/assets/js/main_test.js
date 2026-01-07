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
      }
    });

    tl.fromTo($imagesWrap, 
      { opacity: 0 },
      { opacity: 1, duration: 0.5, ease: "power2.out" }
    );
    tl.fromTo($images.eq(0), 
      { scale: 1.1, opacity: 0 },
      { scale: 1, opacity: 1, duration: imgDuration, ease: "power2.out" }
    );
    tl.fromTo($dl.eq(0), 
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: dlDuration, ease: "power3.out" },
      "<0.2"
    ); 
    tl.to(counters, { 
      counter1: endNum1,
      duration: counterDuration, 
      snap: "counter1",
      ease: "ease-in-out", 
      onUpdate: () => $counters.eq(0).text(Math.round(counters.counter1))
    }, "<");

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
        trigger: $sectionMsgContainer,
        start: "top top", 
        endTrigger: $sectionBiz,
        end: `top ${msgHeight / 2}px`,
        pin: $sectionMsgContainer, 
        pinSpacing: false, 
        scrub: 1, 
      }
    })
    .to($sectionMsgText, {
      ease: "none"
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
const gsapBusinessAniTest = {
  init: function() {
    const $sectionBiz = $(".page-main.test .section-business");
    if (!$sectionBiz.length) return;

    // 모든 아이템, 버튼, 컨텐츠 선택
    const $allItems = $sectionBiz.find(".accordion-item");
    const $allButtons = $sectionBiz.find(".btn-accordion");
    const $allContents = $sectionBiz.find(".accordion-collapse");

    if (!$allItems.length) return;

    $allItems.addClass("active");         
    $allButtons.attr("aria-expanded", "true");
    $allContents.show();                    

    $allButtons.css({
        "pointer-events": "none", 
        "cursor": "default" 
    });

    $allButtons.off("click");
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
      }
    });

    tl.from($infoBox, {
      y: 120,
      opacity: 1,
      duration: 1.0,
      ease: "power3.out"
    });
    tl.from($newsItems, {
      y: 50,
      opacity: 0,
      duration: 0.8,
      ease: "power3.out",
      stagger: 0.2
    }, 
    "<0.3");
  }
};
const gsapInsightAniTest = {
  init: function() {
    const $visualBox = $(".page-main.test .section-insight .visual-box"); 
    const $infoBox = $(".page-main.test .section-insight .info-box");
    if (!$visualBox.length || !$infoBox.length) return;

		const tl = gsap.timeline({
      scrollTrigger: {
        trigger: $visualBox[0], 
        start: "top 70%",      
        toggleActions: "restart none none reverse", 
      }
    });

		tl.from($visualBox, {
      y: 50,      
      opacity: 0, 
      duration: 1,
      ease: "power3.out",
    }, 0);

		tl.from($infoBox, {
      y: 50,     
      opacity: 0, 
      duration: 1,
      ease: "power3.out",
      force3D: false, 
      onStart: () => { gsap.set($visualBox, { willChange: "transform, opacity" }); },
      onComplete: () => { gsap.set($visualBox, { willChange: "auto" }); }
    }, 0);
  }
};
const gsapBannerTextFillAni = {
  init: function() {
    const $bannerTit = $(".section-banner .tit");
    if (!$bannerTit.length) return;

    gsap.to($bannerTit, {
      backgroundPosition: "0% 0",
      duration: 1.5,             
      ease: "power2.out",         
      scrollTrigger: {
        trigger: $bannerTit[0],
        start: "top 50%",     
        toggleActions: "restart none none reverse", 
      }
    });
  }
};

$(function () {
  gsapPartnerAni.init();
  gsapMessageAni.init();
  gsapBannerTextFillAni.init();
	
  uiFooterBanner.init();

  gsapBusinessAni.init();
  // gsapBusinessAniTest.init();
  gsapInsightAniTest.init();
});