"use strict";

const gsapVisionAni = {
  init: function () {
    const $section = $(".section-vision");
    if (!$section.length) return;

    const $subDesc = $section.find(".sub-desc");
    const $tit = $section.find(".tit");
    const $subTit = $section.find(".sub-tit");
    const $allTexts = $section.find(".txt-gradient");
    const $dimmed = $section.find(".dimmed");
		const $header = $(".page-company:has(.company-main) .header");

		if ($header.length) {
			gsap.set($header, { transition: "none" }); 
		}

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: $section,
        start: "top 60%",
        toggleActions: "play none none reverse",
      }
    });

    // 1. 딤드 & 텍스트 동시 등장
    tl.fromTo($dimmed, 
      { opacity: 0 }, 
      { opacity: 1, duration: 1.2, ease: "power3.inOut" }
    );
		if ($header.length) {
      tl.to($header, {
        top: "-100%",
        duration: 2,
        ease: "power3.inOut",
        overwrite: true, 

        onComplete: function() {
          gsap.set($header, { clearProps: "all" });
          $header.addClass('is-fixed is-hide').removeClass('is-show');
        },

        onReverseComplete: function() {
           gsap.set($header, { clearProps: "all" });
           $header.removeClass('is-fixed is-hide').addClass('is-show');
        }
      }, "<"); 
    }
    tl.fromTo($subDesc, 
      { y: 50, opacity: 0 }, 
      { y: 0, opacity: 1, duration: 1, ease: "power2.out" }, 
      "<0.2"
    )
    .fromTo($tit, 
      { y: 50, opacity: 0 }, 
      { y: 0, opacity: 1, duration: 1, ease: "power2.out" }, 
      "<0.2"
    )
    .fromTo($subTit, 
      { y: 50, opacity: 0 }, 
      { y: 0, opacity: 1, duration: 1, ease: "power2.out" }, 
      "<0.2"
    );

    // 2. 그라디언트 채우기 (텍스트 정착 후)
    tl.to($allTexts, {
      backgroundPosition: "0% 0", // 색상 채우기
      duration: 1.5,
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
    
    // 이미지 리스트 전체 선택
    const $bgImages = $section.find(".img-list li");

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: $section,
        start: "top 60%", 
        toggleActions: "play none none reverse", 
      }
    });

    // 1. 텍스트 등장 애니메이션
    tl.fromTo($subDesc, 
      { y: 50, opacity: 0 }, 
      { y: 0, opacity: 1, duration: 1, ease: "power2.out" }
    )
    .fromTo($titLines, 
      { y: 50, opacity: 0 }, 
      { y: 0, opacity: 1, duration: 1, ease: "power2.out", stagger: 0.2 }, 
      "-=0.8"
    )
    .fromTo($subTit, 
      { y: 50, opacity: 0 }, 
      { y: 0, opacity: 1, duration: 1, ease: "power2.out" }, 
      "-=0.8"
    )
    .to($allTexts, {
      backgroundPosition: "0% 0", 
      duration: 1.5,
      ease: "power2.out"
    }, "-=0.2");

    // 2. 배경 이미지 순차 전환 (자동 루프)
    if ($bgImages.length > 1) {
      $bgImages.each(function(index, item) {
        if (index === 0) return;

        // 두 번째 이미지 (index 1) : 시작 타이밍을 직접 지정
        if (index === 1) {
          tl.to(item, {
            opacity: 1,
            duration: 1,
            ease: "power1.inOut"
          }, 0.5);
        } 
        // 세 번째 이미지부터 나머지 전체 (index 2 ~ 끝)
        else {
          tl.to(item, {
            opacity: 1,
            duration: 1,
            ease: "power1.inOut"
          }, ">-0.5"); // 바로 앞 이미지 애니메이션이 끝나기 0.5초 전에 시작 (자연스러운 겹침)
        }

      });
    }
  }
};
const gsapSloganAni = {
  init: function () {
    const $sloganSection = $(".section-slogan");
    if (!$sloganSection.length) return;

    const $tit = $sloganSection.find(".tit");
    const $decoTit = $sloganSection.find(".deco-tit");

    gsap.set($tit, { y: 50, opacity: 0 });
		gsap.set($decoTit, { xPercent: -50, yPercent: 50, scale: 1.5 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: $sloganSection,
        start: "top 20%",
        end: "bottom top",
        toggleActions: "play none none reverse",
        markers: false
      }
    });

    // 2. 애니메이션 시퀀스
    // [Step 1] '앞서가는 내일(.tit)' 텍스트가 아래서 슥 올라옴
    tl.to($tit, {
      y: 0,
      opacity: 1,
      duration: 0.5,
      ease: "power2.out"
    });

    // [Step 2] .deco-tit이 .tit 위치로 올라가면서 덮어씀 (tit은 사라짐)
    tl.to($decoTit, {
      y: function () {
        const titTop = $tit.offset().top; 
        const decoTop = $decoTit.offset().top;
        return titTop - decoTop; 
      },
      scale: 1, 
			yPercent: 0,
      opacity: 1,
      duration: 1.5,
      ease: "power2.out" 
    }, "+=0.1") 
		
    .to($tit, {
      opacity: 0,
      y: -50,
      duration: 0.5,
      ease: "power2.in"
    }, "<");
  }
};
const gsapValueAni = {
  init: function () {
    const $section = $(".section-value");
    if (!$section.length) return;

    const $subDesc = $section.find(".sub-desc");
    const $listItems = $section.find(".value-list li");
    const $bgImages = $section.find(".img-list li");

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: $section,
        start: "top 20%",
        toggleActions: "restart none none reverse",
      }
    });

    // 1. 텍스트 애니메이션
    // 1-1. 타이틀 등장
    tl.fromTo($subDesc,
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: "power3.inOut" }
    );
    tl.addLabel("startContent", "-=0.5"); 

    // 1-2. 리스트 아이템 일괄 등장 (개수 무관)
    tl.fromTo($listItems,
      { y: 50, opacity: 0 },
      { 
        y: 0, 
        opacity: 1, 
        duration: 0.8, 
        ease: "power2.out", 
        stagger: 0.15 
      },
      "startContent"
    );

    // 2. 배경 이미지 애니메이션 (텍스트와 별도로 독립 실행)
    if ($bgImages.length > 1) {
      let imgDelay = 0; 

      $bgImages.each(function (index, item) {
        if (index === 0) return;

        tl.to(item, {
          opacity: 1,
          duration: 2,
          ease: "power1.inOut"
        }, `startContent+=${imgDelay}`);

        imgDelay += 1.2; 
      });
    }
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