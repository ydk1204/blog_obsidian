const NavBar = () => {
  return (
    <nav class="navBar">
      <div class="container">
        <div class="title">
          <a href="/">간단메모</a>
        </div>
        <div class="spacer"></div>
        <div id="navbar-links" class="links">
          <button class="close-menu">✖</button>
          <div class="dropdown">
            <a href="https://ydkblog.vercel.app" class="link">이전블로그</a>
          </div>
          <div class="dropdown">
            <a href="#" class="dropbtn">Category</a>
            <div class="dropdown-content">
              <a href="/컴퓨터공학/네트워크">네트워크</a>
              <a href="/컴퓨터공학/알고리즘">알고리즘</a>
              <a href="/게임">게임</a>
              <a href="/프로젝트">프로젝트</a>
            </div>
          </div>
        </div>
        <button id="toggle-menu" class="button">☰</button>
      </div>
    </nav>
  );
};

export const navbarScript = `
document.addEventListener('DOMContentLoaded', function() {
  const menuButton = document.getElementById('toggle-menu');
  const linksContainer = document.getElementById('navbar-links');
  const closeButton = document.querySelector('.close-menu');

  menuButton.addEventListener('click', function() {
    linksContainer.classList.add('active'); // 메뉴 활성화
    disableScroll(); // 스크롤 비활성화
  });

  linksContainer.addEventListener('click', function(e) {
    if (e.target.tagName === 'A') return; // 링크 클릭 시 스크롤 비활성화 유지
    linksContainer.classList.remove('active'); // 메뉴 비활성화
    enableScroll(); // 스크롤 활성화
  });

  closeButton.addEventListener('click', function() {
    linksContainer.classList.remove('active'); // 메뉴 비활성화
    enableScroll(); // 스크롤 활성화
  });
});

let scrollPosition = 0;

function disableScroll() {
  scrollPosition = window.pageYOffset;
  document.body.style.position = 'fixed';
  document.body.style.top = \`-\${scrollPosition}px\`;
  document.body.style.left = '0';
  document.body.style.right = '0';
  document.body.style.overflow = 'hidden';
}

function enableScroll() {
  document.body.style.position = '';
  document.body.style.top = '';
  document.body.style.left = '';
  document.body.style.right = '';
  document.body.style.overflow = '';
  window.scrollTo(0, scrollPosition);
}
`;

export default NavBar;