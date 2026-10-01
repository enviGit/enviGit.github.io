// Entry point: boots every module once the DOM is ready.
// Each init runs in isolation so one failing module cannot take down the rest.
document.addEventListener("DOMContentLoaded", () => {
    function safeInit(init) {
        try {
            init();
        } catch (error) {
            console.error(`Error in ${init.name}:`, error);
        }
    }

    safeInit(initPerformanceMode);
    safeInit(initMotionPreference);
    safeInit(initTheme);
    safeInit(initYear);
    safeInit(initVisibility);
    safeInit(initTimeline);
    safeInit(initCopyEmail);
    safeInit(initScrollState);
    safeInit(initPauseAnimations);
    safeInit(initNavigation);
    safeInit(initBackToTop);
    safeInit(initTextAnimation);
    safeInit(initSlider);

    const hasFinePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const isTabletUp = window.matchMedia("(min-width: 768px)").matches;
    const reducedEffects = document.body.classList.contains("reduce-fx");

    if (hasFinePointer) {
        safeInit(initButtonEffects);
        safeInit(initScrollbar);
        if (!reducedEffects) {
            safeInit(initCursor);
            safeInit(initSpotlight);
            safeInit(initHeroTilt);
        }
    }

    if (hasFinePointer && isTabletUp) {
        safeInit(initTerminalSystem);
        safeInit(initHeroTerminalLink);
    }
});
