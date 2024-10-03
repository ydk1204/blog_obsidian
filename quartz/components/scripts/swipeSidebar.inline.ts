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
      leftSidebar.classList.remove('open')
      if (!rightSidebar.classList.contains('open')) {
        rightSidebar.classList.add('open')
      }
    } else {
      // 오른쪽으로 스와이프
      rightSidebar.classList.remove('open')
      if (!leftSidebar.classList.contains('open')) {
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
  // 위의 TypeScript 코드를 그대로 JavaScript로 변환하여 여기에 넣으세요.
`