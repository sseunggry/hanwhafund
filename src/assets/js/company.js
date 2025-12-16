"use strict";

const gsapVisionAni = {
  init: function () {
    const $section = $(".section-vision");
    if (!$section.length) return;

    const $subDesc = $section.find(".sub-desc");
    const $tit = $section.find(".tit");
    const $subTit = $section.find(".sub-tit");

    // 타임라인 생성
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: $section,
        start: "top 60%",
        toggleActions: "play none none reverse",
        markers: false
      }
    });

    tl.fromTo($subDesc, 
      { y: -80, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: "power2.out" }
    )
    .fromTo($tit, 
      { y: -80, opacity: 0 }, 
      { y: 0, opacity: 1, duration: 1, ease: "power2.out" }, 
      "-=0.8"
    )
    .fromTo($subTit, 
      { y: 80, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: "power2.out" }, 
      "-=0.8"
    )

    // 2. 등장이 다 끝난 뒤, 그라디언트 채우기
    .to(".section-vision .txt-gradient", {
      backgroundPosition: "0% 0",
      duration: 1.2,
      ease: "power2.out"
    }, "-=0.2");
  }
};
const gsapMissionAni = {
  init: function () {
    const $section = $(".section-mission");
    if (!$section.length) return;

    const $subDesc = $section.find(".sub-desc");
    const $titLines = $section.find(".tit p"); 
    const $subTit = $section.find(".sub-tit");
    const $allTexts = $section.find(".txt-gradient");
    const $bgImages = $section.find(".img-list li");

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: $section,
        start: "top 60%", 
        toggleActions: "play none none reverse", 
      }
    });

    // 1. 텍스트 등장 애니메이션 (기존 로직 유지)
    tl.fromTo($subDesc, 
      { y: 30, opacity: 0 }, 
      { y: 0, opacity: 1, duration: 1, ease: "power2.out" }
    )
    .fromTo($titLines, 
      { y: 30, opacity: 0 }, 
      { y: 0, opacity: 1, duration: 1, ease: "power2.out", stagger: 0.2 }, 
      "-=0.8"
    )
    .fromTo($subTit, 
      { y: 30, opacity: 0 }, 
      { y: 0, opacity: 1, duration: 1, ease: "power2.out" }, 
      "-=0.8"
    )
    .to($allTexts, {
      backgroundPosition: "0% 0", 
      duration: 1.5,
      ease: "power2.out"
    }, "-=0.2");

    // 2. 배경 이미지 순차 전환 (한 번만 실행 후 정지)
    if ($bgImages.length > 1) {
      tl.to($bgImages.eq(1), {
        opacity: 1,
        duration: 2,
        ease: "power1.inOut"
      }, 0); // 타임라인 시작 0.5초 지점에 시작 (텍스트와 함께 은은하게 바뀜)
      if ($bgImages.length > 2) {
        tl.to($bgImages.eq(2), {
          opacity: 1,
          duration: 2,
          ease: "power1.inOut"
        }, ">-0.5"); // 앞 이미지(Image 2)가 끝나기 0.5초 전에 시작 (자연스러운 연결)
      }
    }
  }
};
const gsapSloganAni = {
  init: function () {
    const $sloganSection = $(".section-slogan");
    if (!$sloganSection.length) return;

    gsap.set(".section-slogan .deco-tit", { scale: 1.5 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: $sloganSection,
        start: "top 30%",
        end: "bottom top",
        toggleActions: "play none none reverse",
        markers: false
      }
    });

    // 1. 위에 2개 (.sub-desc, .tit) 사라지기
    tl.to(".section-slogan .sub-desc, .section-slogan .tit", {
      y: -50,
      opacity: 0,
      duration: 1.2,
      ease: "power2.out" 
    })
      // 2. .deco-tit을 중앙으로 이동하면서 Scale 1로 줄이기
      .to(".section-slogan .deco-tit", {
        y: function () {
          const containerHeight = $sloganSection.outerHeight();
          const $target = $(".section-slogan .deco-tit");

          if (!$target.length) return 0;

          const targetHeight = $target.outerHeight();
          const targetTop = $target.position().top;

          const centerPosition = (containerHeight / 2) - (targetHeight / 2);
          return centerPosition - targetTop;
        },
        
        scale: 1,
        duration: 1.5,
        ease: "power2.out"
      }, "<"); // 동시에 시작
  }
};
const gsapValueAni = {
  init: function () {
    const $section = $(".section-value");
    if (!$section.length) return;

    // 요소 선택
    const $subDesc = $section.find(".sub-desc");
    const $listItems = $section.find(".value-list li");
    const $bgImages = $section.find(".img-list li"); 
    const $gradientTexts = $section.find(".txt-gradient");

    // 타임라인 생성
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: $section,
        start: "top 60%",
        toggleActions: "restart none none reverse", 
      }
    });

    // 1. Core Value 타이틀 등장
    tl.fromTo($subDesc,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: "power2.out" }
    );

    // 2. 리스트 & 배경이미지 순차 등장
    $listItems.each(function (index, item) {
      // 2-1. 리스트 아이템 등장 (텍스트)
      tl.fromTo(item,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" },
        index === 0 ? "-=0.5" : "-=0.6"
      );

      // 2-2. 배경 이미지 전환 (첫번째 이미지는 이미 보임)
      if (index > 0 && $bgImages.eq(index).length) {
        tl.to($bgImages.eq(index), {
          opacity: 1,
          duration: 1.5,
          ease: "power1.inOut"
        }, "<"); // 리스트가 나오는 순간 배경도 같이 변경 시작
      }
    });
  }
};
const gsapInfoAni = {
	init: function () {
		const $section = $(".section-info");
		if (!$section.length) return;

		const $counters = $section.find(".counter");
		const $dl = $section.find(".txt-wrap dl");

		const endNum1 = $counters.eq(0).data('num') || 0;
		const endNum2 = $counters.eq(1).data('num') || 0;
		const endNum3 = $counters.eq(2).data('num') || 0;

		const counters = { counter1: 0, counter2: 0, counter3: 0 };
		const spinOffset = 50;
		const dlDuration = 1;
		const counterDuration = 1;

		const tl = gsap.timeline({
			scrollTrigger: {
				trigger: $section[0],
				start: "top 30%",
				toggleActions: "restart none none reverse",
				// markers: true,
			}
		});

		// 3.자동 재생 시퀀스 (fromTo 사용)
		// Part 1
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
		tl.fromTo($dl.eq(1),
			{ y: 50, opacity: 0 },
			{ y: 0, opacity: 1, duration: dlDuration, ease: "power3.out" },
			">0.2"
		);
		tl.to(counters, {
			counter2: endNum2 + spinOffset,
			duration: counterDuration,
			snap: "counter2",
			ease: "ease-in-out",
			onUpdate: () => {
				const showNum = Math.round(counters.counter2) % 10;
        $counters.eq(1).text(showNum);
			}
		}, "<");

		// Part 3
		tl.fromTo($dl.eq(2),
			{ y: 50, opacity: 0 },
			{ y: 0, opacity: 1, duration: dlDuration, ease: "power3.out" },
			">0.2"
		);
		tl.to(counters, {
			counter3: endNum3 + spinOffset,
			duration: counterDuration,
			snap: "counter3",
			ease: "ease-in-out",
			onUpdate: () => {
				const showNum = Math.round(counters.counter3) % 10;
        $counters.eq(2).text(showNum);
			}
		}, "<");
	}
};
const gsapHistoryTextFillAni = {
	init: function () {
		const $tit = $(".section-history .company-tit-wrap .desc");
		if (!$tit.length) return;

		gsap.to($tit, {
			backgroundPosition: "0% 0",
			duration: 1.5,
			ease: "power2.out",
			scrollTrigger: {
				trigger: $tit[0],
				start: "top 50%",
				toggleActions: "restart none none reverse",
			}
		});
	}
};
const historyLnb = {
	init: function () {
		const OFFSET = 30;

		$('.timeline-wrap').each(function () {
			const $wrap = $(this);
			const $scrollContainer = $wrap.find('.timeline-list');
			const $sidebarLinks = $wrap.find('.timeline-sidebar ul li a');
			const $sidebarItems = $wrap.find('.timeline-sidebar ul li');
			const $sections = $wrap.find('.timeline-list li[id]');

			$sidebarLinks.on('click', function (e) {
				e.preventDefault();

				let targetId = $(this).attr('href');
				let $target = $(targetId);

				if ($target.length && $scrollContainer.length) {
					let scrollPosition = $scrollContainer.scrollTop() + $target.offset().top - $scrollContainer.offset().top - OFFSET;

					$scrollContainer.stop().animate({
						scrollTop: scrollPosition
					}, 500);
				}
			});

			$scrollContainer.on('scroll', function () {
				let containerTop = $scrollContainer.offset().top + OFFSET;
				let currentId = '';

				$sections.each(function () {
					let $this = $(this);
					let sectionTop = $this.offset().top;

					if (sectionTop <= containerTop) {
						currentId = $this.attr('id');
					}
				});

				if (currentId) {
					$sidebarItems.removeClass('active');
					$wrap.find('.timeline-sidebar ul li a[href="#' + currentId + '"]').parent().addClass('active');
				}
			});

			$scrollContainer.trigger('scroll');
		});
	}
};

$(function () {
	// gsapVisual.init();
	// missionAni.init();

	gsapVisionAni.init();
	gsapMissionAni.init();

	gsapValueAni.init();
	gsapSloganAni.init();
	gsapInfoAni.init();
	gsapHistoryTextFillAni.init();

	historyLnb.init();
});