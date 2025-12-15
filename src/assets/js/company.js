"use strict";

const gsapVisual2 = {
  init: function() {
    const $section = $(".section-visual");
    const texts = gsap.utils.toArray(".section-visual .company-tit-wrap"); 
		const $header = $(".header");

    if (!$section.length || texts.length < 2) return;

    const winHeight = window.innerHeight;

    // [수정 1] 주석 해제 및 초기값 설정
    gsap.set(texts, { y: winHeight, opacity: 1, zIndex: 1 }); 
    gsap.set(texts[0], { y: 0, opacity: 1, zIndex: 1 }); 

    // 2. 타임라인 생성
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: $section,
        start: "top top", 
        end: "+=" + (texts.length * 50) + "%",
        pin: true,
        scrub: 1, 

				onUpdate: (self) => {
          // self.progress: 0 (시작) ~ 1 (끝)
          // 스크롤이 거의 끝났을 때 (예: 95% 지점) 헤더를 숨김
          if (self.progress > 0.95) {
            $header.addClass("is-hidden");
          } else {
            $header.removeClass("is-hidden");
          }
        },
        
        onLeave: () => $header.addClass("is-hidden"),
        onEnterBack: () => $header.removeClass("is-hidden"),
      }
    });

    // 3. 애니메이션 시퀀스
    texts.forEach((text, i) => {
      if (i === 0) return; 
      const prevText = texts[i - 1];

      tl.to(prevText, { 
        y: -100,
        opacity: 0, 
        duration: 1, 
        ease: "none" 
      })
      .to(text, { 
        y: 0, 
        opacity: 1, 
        zIndex: i + 1,
        duration: 1, 
        ease: "none" 
      }, "<");
    });
  }
};

const gsapVisual = {
  init: function() {
    const $section = $(".section-visual");
    const $nextSection = $(".section-message"); // 덮으면서 올라올 다음 섹션
    const $header = $(".header");
    const texts = gsap.utils.toArray(".section-visual .company-tit-wrap"); 

    if (!$section.length || texts.length < 2) return;

    const winHeight = window.innerHeight;

    // 1. 초기값 설정
    gsap.set(texts, { y: winHeight, opacity: 1, zIndex: 1 }); 
    gsap.set(texts[0], { y: 0, opacity: 1, zIndex: 1 }); 

    // [핵심 계산] 텍스트 개수에 따른 스크롤 거리 계산
    // 예: 텍스트 3개 * 50% = 150% (1.5배 화면 높이만큼 애니메이션 진행)
    const animDurationPercent = texts.length * 50; 
    
    // [핵심 설정] 다음 섹션을 애니메이션 시간만큼 아래로 밀어둠
    // pinSpacing: false로 인해 사라진 공간을 margin으로 다시 만들어주는 원리
    gsap.set($nextSection, { marginTop: animDurationPercent + "vh" });

    // 2. 타임라인 생성
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: $section,
        start: "top top", 
        
        // 종료 지점: (텍스트 애니메이션 거리) + (다음 섹션이 덮는 거리 100%)
        end: "+=" + (animDurationPercent + 100) + "%", 
        
        pin: true,
        pinSpacing: false, // [핵심] 고정될 때 자리를 차지하지 않게 함 (다음 섹션이 겹칠 수 있게)
        scrub: 1, 

        // onUpdate: (self) => {
        //   if (self.progress > 0.95) $header.addClass("is-hidden");
        //   else $header.removeClass("is-hidden");
        // },
        // onLeave: () => $header.addClass("is-hidden"),
        // onEnterBack: () => $header.removeClass("is-hidden"),
      }
    });

    // 3. 애니메이션 시퀀스
    texts.forEach((text, i) => {
      if (i === 0) return; 
      const prevText = texts[i - 1];

      tl.to(prevText, { 
        y: -100,
        opacity: 0, 
        duration: 1, 
        ease: "none" 
      })
      .to(text, { 
        y: 0, 
        opacity: 1, 
        zIndex: i + 1,
        duration: 1, 
        ease: "none" 
      }, "<");
    });

    // [중요] 4. 마지막 대기 시간 (빈 애니메이션)
    // 이 시간이 흐르는 동안 .section-message가 margin 영역을 지나 위로 올라옴
    // duration을 animDurationPercent 비율에 맞춰 적절히 조절
    tl.to({}, { duration: texts.length * 0.5 }); 
  }
};

// const gsapVisual = {
//   init: function() {
//     const $section = $(".section-visual");
//     const $spacer = $(".visual-spacer"); 
//     const texts = gsap.utils.toArray(".section-visual .company-tit-wrap");

//     if (!$spacer.length || texts.length < 2) return;

//     const winHeight = window.innerHeight;

//     // 1. 초기값 설정
//     gsap.set(texts, { y: winHeight * 0.5, opacity: 0 }); 
//     gsap.set(texts[0], { y: 0, opacity: 1 }); 

//     // 2. 타임라인 생성
//     const tl = gsap.timeline({
//       scrollTrigger: {
//         trigger: $spacer,
//         start: "top top",
//         end: "bottom bottom",
//         scrub: 1,
        
//         // [핵심] 스크롤 시작/종료 시 z-index 제어
//         onEnter: () => $section.addClass("is-active"), // 시작하면 비주얼을 맨 앞으로
//         onLeaveBack: () => $section.removeClass("is-active"), // 위로 빠지면 원상복구
        
//         // [핵심] 스크롤이 거의 끝날 때(메시지 섹션 만날 때) 비주얼을 뒤로 보냄
//         onUpdate: (self) => {
//            // 진행률이 99% 넘어가면 z-index를 낮춰서 메시지 섹션 밑으로 가게 함
//            if (self.progress > 0.99) {
//              $section.removeClass("is-active");
//            } else {
//              $section.addClass("is-active");
//            }
//         }
//       }
//     });

//     // 3. 애니메이션 시퀀스
//     texts.forEach((text, i) => {
//       if (i === 0) return; 
//       const prevText = texts[i - 1];

//       tl.to(prevText, { 
//         y: -winHeight * 0.5, 
//         opacity: 0, 
//         duration: 1, 
//         ease: "none" 
//       })
//       .to(text, { 
//         y: 0, 
//         opacity: 1, 
//         duration: 1, 
//         ease: "none" 
//       }, "<"); 
//     });

//     // 4. 마지막 대기 (메시지가 덮을 때까지 마지막 텍스트 유지)
//     tl.to({}, { duration: 0.5 }); 
//   }
// };

$(function() {
  // gsapVisual.init();
});