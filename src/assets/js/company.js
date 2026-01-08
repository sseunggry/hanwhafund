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

    tl.to($allTexts, {
      backgroundPosition: "0% 0",
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
    const $titLines = $section.find(".tit"); 
    const $subTit = $section.find(".sub-tit");
    const $allTexts = $section.find(".txt-gradient");
    
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: $section,
        start: "top 50%", 
        toggleActions: "play none none reverse", 
      }
    });

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
  }
};
const gsapSloganAni = {
  init: function () {
    const $sloganSection = $(".section-slogan");
    if (!$sloganSection.length) return;

    const $subDesc = $sloganSection.find(".sub-desc");
    const $tit = $sloganSection.find(".tit");
    const $decoTit = $sloganSection.find(".deco-tit");

    if ($tit.length) gsap.set($tit, { y: 50, opacity: 0 });
    gsap.set($decoTit, { xPercent: -50, yPercent: 50, scale: 2.5 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: $sloganSection,
        start: "top 50%",
        toggleActions: "play none none reverse",
        markers: false
      }
    });

    if ($tit.length) {
      tl.to($tit, {
        y: 0,
        opacity: 1,
        duration: 0.5,
        ease: "power2.out"
      });
    }
    tl.to($decoTit, {
      y: function () {
        const subTop = $subDesc.offset().top;      
        const subHeight = $subDesc.outerHeight();  
        const subMargin = parseFloat($subDesc.css("marginBottom")) || 0;
        const targetTop = subTop + subHeight + subMargin;
        const currentTop = $decoTit.offset().top;

        return targetTop - currentTop; 
      },
      scale: 1, 
      yPercent: 0,
      opacity: 1,
      duration: 1,
      ease: "power2.out" 
    }, $tit.length ? "+=0.1" : "0")
    
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

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: $section,
        start: "top 40%",
        toggleActions: "restart none none reverse",
      }
    });

    tl.fromTo($subDesc,
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: "power3.inOut" }
    );
    tl.addLabel("startContent", "-=0.5"); 

    tl.fromTo($listItems,
      { y: 50, opacity: 0 },
      { 
        y: 0, 
        opacity: 1, 
        duration: 0.8, 
        ease: "power2.out",
      },
      "startContent"
    );
  }
};
const gsapInfoAni = {
	init: function () {
		const $section = $(".section-info");
		if (!$section.length) return;

		const $subDesc = $section.find(".sub-desc");
    const $tit = $section.find(".tit"); 
		const $dl = $section.find(".txt-wrap dl");

		const dlDuration = 0.8;

		const tl = gsap.timeline({
			scrollTrigger: {
				trigger: $section[0],
				start: "top 40%",
				toggleActions: "restart none none reverse",
			}
		});

		tl.fromTo($subDesc, 
      { y: 50, opacity: 0 }, 
      { y: 0, opacity: 1, duration: 1, ease: "power2.out" }
    )
    .fromTo($tit, 
      { y: 50, opacity: 0 }, 
      { y: 0, opacity: 1, duration: 1, ease: "power2.out"}, 
      "-=0.8"
    )
		.fromTo($dl.eq(0),
			{ y: 50, opacity: 0 },
			{ y: 0, opacity: 1, duration: dlDuration, ease: "power2.out" },
			"<"
		);
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
	gsapVisionAni.init();
	gsapMissionAni.init();

	gsapValueAni.init();
	gsapSloganAni.init();
	gsapInfoAni.init();
	gsapHistoryTextFillAni.init();

	historyLnb.init();
});