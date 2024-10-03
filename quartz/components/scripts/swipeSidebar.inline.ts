let startX: number | null = null
let startY: number | null = null
const threshold = 50 // 스와이프 감지 임계값

function handleTouchStart(e: TouchEvent) {
  startX = e.touches[0].clientX
  startY = e.touches[0].clientY
}

function handleTouchMove(e: TouchEvent) {
  if (!startX || !startY) return

  const x = e.touches[0].clientX
  const y = e.touches[0].clientY
  const diffX = startX - x
  const diffY = startY - y

  // 수직 스크롤이 더 크면 사이드바 동작을 하지 않음
  if (Math.abs(diffY) > Math.abs(diffX)) return

  const leftSidebar = document.querySelector('.left-sidebar')
  const rightSidebar = document.querySelector('.right-sidebar')

  if (!leftSidebar || !rightSidebar) return

  if (Math.abs(diffX) > threshold) {
    if (diffX > 0) {
      // 왼쪽으로 스와이프
      if (leftSidebar.classList.contains('open')) {
        leftSidebar.classList.remove('open')
      } else if (!rightSidebar.classList.contains('open')) {
        rightSidebar.classList.add('open')
      }
    } else {
      // 오른쪽으로 스와이프
      if (rightSidebar.classList.contains('open')) {
        rightSidebar.classList.remove('open')
      } else if (!leftSidebar.classList.contains('open')) {
        leftSidebar.classList.add('open')
      }
    }
    startX = null
    startY = null
  }
}

function closeSidebars() {
  document.querySelector('.left-sidebar')?.classList.remove('open')
  document.querySelector('.right-sidebar')?.classList.remove('open')
}

document.addEventListener('touchstart', handleTouchStart, false)
document.addEventListener('touchmove', handleTouchMove, false)
document.addEventListener('click', (e) => {
  if (!(e.target as Element).closest('.swipe-sidebar')) {
    closeSidebars()
  }
}, false)

export default `
  let startX = null;
  let startY = null;
  const threshold = 50;

  function handleTouchStart(e) {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
  }

  function handleTouchMove(e) {
    if (!startX || !startY) return;

    const x = e.touches[0].clientX;
    const y = e.touches[0].clientY;
    const diffX = startX - x;
    const diffY = startY - y;

    if (Math.abs(diffY) > Math.abs(diffX)) return;

    const leftSidebar = document.querySelector('.left-sidebar');
    const rightSidebar = document.querySelector('.right-sidebar');

    if (!leftSidebar || !rightSidebar) return;

    if (Math.abs(diffX) > threshold) {
      if (diffX > 0) {
        if (leftSidebar.classList.contains('open')) {
          leftSidebar.classList.remove('open');
        } else if (!rightSidebar.classList.contains('open')) {
          rightSidebar.classList.add('open');
        }
      } else {
        if (rightSidebar.classList.contains('open')) {
          rightSidebar.classList.remove('open');
        } else if (!leftSidebar.classList.contains('open')) {
          leftSidebar.classList.add('open');
        }
      }
      startX = null;
      startY = null;
    }
  }

  function closeSidebars() {
    document.querySelector('.left-sidebar')?.classList.remove('open');
    document.querySelector('.right-sidebar')?.classList.remove('open');
  }

  document.addEventListener('touchstart', handleTouchStart, false);
  document.addEventListener('touchmove', handleTouchMove, false);
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.swipe-sidebar')) {
      closeSidebars();
    }
  }, false);
`