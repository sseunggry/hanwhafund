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

    // 필요한 요소 선택
    const $subDesc = $sloganSection.find(".sub-desc");
    const $tit = $sloganSection.find(".tit");
    const $decoTit = $sloganSection.find(".deco-tit");

    // 1. 초기 세팅
    // tit이 있을 때만 세팅
    if ($tit.length) {
      gsap.set($tit, { y: 50, opacity: 0 });
    }
    // decoTit은 항상 세팅
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

    // [Step 1] '앞서가는 내일(.tit)' 등장 (있을 경우에만)
    if ($tit.length) {
      tl.to($tit, {
        y: 0,
        opacity: 1,
        duration: 0.5,
        ease: "power2.out"
      });
    }

    // [Step 2] .deco-tit 이동 모션
    // tit이 있든 없든 무조건 sub-desc 밑으로 이동시킵니다.
    tl.to($decoTit, {
      y: function () {
        // 1. 기준이 되는 sub-desc의 위치 정보
        const subTop = $subDesc.offset().top;           // sub-desc 윗변
        const subHeight = $subDesc.outerHeight();       // sub-desc 높이
        const subMargin = parseFloat($subDesc.css("marginBottom")) || 0; // sub-desc 아래 마진
        
        // 2. 목표 지점 = (윗변 + 높이 + 마진) -> 요소의 바로 아래 시작점
        const targetTop = subTop + subHeight + subMargin;

        // 3. 현재 deco-tit의 위치
        const currentTop = $decoTit.offset().top;

        // 4. 이동 거리 반환
        return targetTop - currentTop; 
      },
      scale: 1, 
      yPercent: 0, // [중요] yPercent 초기화 (Top 라인 맞춤)
      opacity: 1,
      duration: 1.5,
      ease: "power2.out" 
    }, $tit.length ? "+=0.1" : "0") // tit이 있으면 딜레이 주고, 없으면 바로 시작
    
    // [Step 3] tit 사라짐 (있을 경우에만)
    if ($tit.length) {
      tl.to($tit, {
        opacity: 0,
        y: -50,
        duration: 0.5,
        ease: "power2.in"
      }, "<");
    }
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

		const endNum1 = parseFloat($counters.eq(0).data('num')) || 0; 
    const endNum2 = parseFloat($counters.eq(1).data('num')) || 0;
    const endNum3 = parseFloat($counters.eq(2).data('num')) || 0;

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
			ease: "ease-in-out",
			onUpdate: () => {
				if (Number.isInteger(endNum1)) {
					$counters.eq(0).text(Math.round(counters.counter1));
				} else {
					$counters.eq(0).text(counters.counter1.toFixed(1)); 
				}
			}
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