function isMobile() {
  return window.innerWidth <= 800;
}

let scrollPosition = 0;

function createOverlay() {
  const overlay = document.createElement('div');
  overlay.className = 'sidebar-overlay';
  document.body.appendChild(overlay);
  return overlay;
}

function removeOverlay(overlay: HTMLElement) {
  document.body.removeChild(overlay);
}

function disableMainScroll() {
  scrollPosition = window.pageYOffset;
  document.documentElement.style.overflow = 'hidden';
  document.body.style.overflow = 'hidden';
}

function enableMainScroll() {
  document.documentElement.style.overflow = '';
  document.body.style.overflow = '';
}

function initSwipeSidebar() {
  if (!isMobile()) return;

  let startX: number | null = null;
  let startY: number | null = null;
  const threshold = 50;
  let isAnimating = false;
  let openSidebar: 'left' | 'right' | null = null;
  let overlay: HTMLElement | null = null;

  function handleTouchStart(e: TouchEvent) {
    if (isAnimating) return;
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
  }

  function handleTouchMove(e: TouchEvent) {
    if (startX === null || startY === null || isAnimating) return;

    const x = e.touches[0].clientX;
    const y = e.touches[0].clientY;
    const diffX = startX - x;
    const diffY = startY - y;

    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > threshold) {
      isAnimating = true;
      e.preventDefault();

      const leftSidebar = document.querySelector('.left-sidebar') as HTMLElement;
      const rightSidebar = document.querySelector('.right-sidebar') as HTMLElement;

      if (!leftSidebar || !rightSidebar) return;

      const swipeDirection = diffX > 0 ? 'left' : 'right';

      if (openSidebar === null) {
        if (swipeDirection === 'left') {
          openSidebar = 'right';
          openSidebarElement(rightSidebar);
        } else {
          openSidebar = 'left';
          openSidebarElement(leftSidebar);
        }
      } else {
        if (
          (openSidebar === 'left' && swipeDirection === 'left') ||
          (openSidebar === 'right' && swipeDirection === 'right')
        ) {
          if (openSidebar === 'left') {
            closeSidebarElement(leftSidebar);
          } else {
            closeSidebarElement(rightSidebar);
          }
        }
      }

      startX = null;
      startY = null;
    }
  }

  function handleTouchEnd() {
    startX = null;
    startY = null;
    setTimeout(() => {
      isAnimating = false;
    }, 300);
  }

  function openSidebarElement(sidebar: HTMLElement) {
    if (isAnimating) return;
    isAnimating = true;
    sidebar.style.transition = 'transform 0.3s ease';
    sidebar.classList.add('open');
    sidebar.style.transform = 'translateX(0)';
    disableMainScroll();
    overlay = createOverlay();
    sidebar.style.overflowY = 'auto';
    setTimeout(() => {
      isAnimating = false;
      sidebar.style.transition = '';
    }, 300);
  }

  function closeSidebarElement(sidebar: HTMLElement) {
    if (isAnimating) return;
    isAnimating = true;
    sidebar.style.transition = 'transform 0.3s ease';
    sidebar.classList.remove('open');
    sidebar.style.transform = sidebar.classList.contains('left-sidebar')
      ? 'translateX(-100%)'
      : 'translateX(100%)';
    enableMainScroll();
    if (overlay) {
      removeOverlay(overlay);
      overlay = null;
    }
    setTimeout(() => {
      isAnimating = false;
      sidebar.style.transition = '';
      openSidebar = null;
    }, 300);
  }

  function handlePageNavigation() {
    if (openSidebar !== null) {
      const sidebar = document.querySelector(`.${openSidebar}-sidebar`) as HTMLElement;
      if (sidebar) {
        closeSidebarElement(sidebar);
      }
    }
  }

  function handleTocClick(e: Event) {
    const target = e.target as HTMLElement;
    if (target.tagName === 'A' && target.closest('.toc')) {
      e.preventDefault();
      const href = target.getAttribute('href');
      if (href) {
        const element = document.querySelector(href);
        if (element) {
          handlePageNavigation();
          setTimeout(() => {
            element.scrollIntoView({ behavior: 'smooth' });
          }, 300);
        }
      }
    }
  }

  document.addEventListener('touchstart', handleTouchStart, { passive: true });
  document.addEventListener('touchmove', handleTouchMove, { passive: false });
  document.addEventListener('touchend', handleTouchEnd, { passive: true });
  document.addEventListener('click', handleTocClick, { capture: true });

  window.addEventListener('popstate', handlePageNavigation);
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    if (target.tagName === 'A' && target.getAttribute('href')) {
      handlePageNavigation();
    }
  });
}

function initialize() {
  initSwipeSidebar();
  window.addEventListener('resize', initSwipeSidebar);
}

(function () {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    initialize();
  }
})();

export default `
  ${isMobile.toString()}
  ${createOverlay.toString()}
  ${removeOverlay.toString()}
  ${disableMainScroll.toString()}
  ${enableMainScroll.toString()}
  ${initSwipeSidebar.toString()}
  ${initialize.toString()}
  (${(function () {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initialize);
    } else {
      initialize();
    }
  }).toString()})();
`;