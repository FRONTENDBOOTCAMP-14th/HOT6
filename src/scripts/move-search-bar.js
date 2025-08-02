const logo = document.querySelector('.mainPageLogoPC');
const searchBar = document.querySelector('.searchBar');

const originalParent = searchBar.parentNode;
const originalNextSibling = searchBar.nextSibling;

function moveSearchBar() {
    const windowWidth = window.innerWidth;

    if (windowWidth >= 700) {
      // 로고 아래로 이동
      if (logo.nextElementSibling !== searchBar) {
        logo.insertAdjacentElement('afterend', searchBar);
      }
    } else {
      // 원래 위치로 복원
      if (searchBar.parentNode !== originalParent) {
        if (originalNextSibling) {
          originalParent.insertBefore(searchBar, originalNextSibling);
        } else {
          originalParent.appendChild(searchBar);
        }
      }
    }
}

// 창 크기 변경될 때도 처리
window.addEventListener('resize', moveSearchBar);
