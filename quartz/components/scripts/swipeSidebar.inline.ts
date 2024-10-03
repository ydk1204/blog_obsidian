function isMobile() {
  return window.innerWidth <= 800;
}

function initSwipeSidebar() {
  if (!isMobile()) return;

  let startX: number | null = null;
  let startY: number | null = null;
  const threshold = 50;
  let isAnimating = false;
  let openSidebar: 'left' | 'right' | null = null;

  function handleTouchStart(e: TouchEvent) {
    if (isAnimating) return;
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
    console.log('Touch start:', startX, startY);
  }

  function handleTouchMove(e: TouchEvent) {
    if (startX === null || startY === null || isAnimating) return;

    const x = e.touches[0].clientX;
    const y = e.touches[0].clientY;
    const diffX = startX - x;
    const diffY = startY - y;

    console.log('Touch move:', x, y, 'Diff:', diffX, diffY);

    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > threshold) {
      isAnimating = true;
      e.preventDefault();

      const leftSidebar = document.querySelector('.left-sidebar') as HTMLElement;
      const rightSidebar = document.querySelector('.right-sidebar') as HTMLElement;

      if (!leftSidebar || !rightSidebar) return;

      const swipeDirection = diffX > 0 ? 'left' : 'right';

      if (openSidebar === null) {
        // 열린 사이드바가 없을 때
        if (swipeDirection === 'left') {
          openSidebar = 'right';
          openSidebarElement(rightSidebar);
        } else {
          openSidebar = 'left';
          openSidebarElement(leftSidebar);
        }
      } else {
        // 이미 열린 사이드바가 있을 때
        if (openSidebar === 'left') {
          closeSidebarElement(leftSidebar);
        } else {
          closeSidebarElement(rightSidebar);
        }
        openSidebar = null;
      }

      console.log('Sidebar action performed');

      startX = null;
      startY = null;
    }
  }

  function handleTouchEnd() {
    console.log('Touch end');
    startX = null;
    startY = null;
    setTimeout(() => {
      isAnimating = false;
    }, 50);
  }

  function openSidebarElement(sidebar: HTMLElement) {
    sidebar.style.transition = 'transform 0.3s ease';
    sidebar.classList.add('open');
    sidebar.style.transform = 'translateX(0)';
    console.log('Opening sidebar:', sidebar.classList.contains('left-sidebar') ? 'left' : 'right');
    setTimeout(() => {
      isAnimating = false;
      sidebar.style.transition = '';
    }, 300);
  }

  function closeSidebarElement(sidebar: HTMLElement) {
    sidebar.style.transition = 'transform 0.3s ease';
    sidebar.classList.remove('open');
    sidebar.style.transform = sidebar.classList.contains('left-sidebar') ? 'translateX(-100%)' : 'translateX(100%)';
    console.log('Closing sidebar:', sidebar.classList.contains('left-sidebar') ? 'left' : 'right');
    setTimeout(() => {
      isAnimating = false;
      sidebar.style.transition = '';
    }, 300);
  }

  document.addEventListener('touchstart', handleTouchStart, { passive: true });
  document.addEventListener('touchmove', handleTouchMove, { passive: false });
  document.addEventListener('touchend', handleTouchEnd, { passive: true });
}

function initialize() {
  initSwipeSidebar();
  window.addEventListener('resize', initSwipeSidebar);
}

(function() {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    initialize();
  }
})();

export default `
  ${isMobile.toString()}
  ${initSwipeSidebar.toString()}
  ${initialize.toString()}
  (${(function() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initialize);
    } else {
      initialize();
    }
  }).toString()})();
`


