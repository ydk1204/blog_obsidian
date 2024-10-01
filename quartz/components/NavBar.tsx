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
}

export const navbarScript = `
document.addEventListener('DOMContentLoaded', function() {
const menuButton = document.getElementById('toggle-menu');
const linksContainer = document.getElementById('navbar-links');
const closeButton = document.querySelector('.close-menu');

menuButton.addEventListener('click', function() {
  linksContainer.classList.add('active'); // 메뉴 활성화
    document.body.classList.add('scroll-disable'); // 모달 배경 스크롤 방지
});

linksContainer.addEventListener('click', function() {
    linksContainer.classList.remove('active'); // 메뉴 비활성화
    document.body.classList.remove('scroll-disable');  // 모달 배경 스크롤 방지
});

closeButton.addEventListener('click', function() {
  linksContainer.classList.remove('active'); // 메뉴 비활성화
  document.body.classList.remove('scroll-disable');  // 모달 배경 스크롤 방지
});
});
`

export default NavBar;
