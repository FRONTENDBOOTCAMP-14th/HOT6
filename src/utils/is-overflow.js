/**
 * 텍스트 길이를 판단하고 자동 슬라이드 애니메이션을 없애는 함수
 */
export function isOverflow() {
  const titleElement = document.querySelectorAll('.cardTextContentsTitle');
  titleElement.forEach((title) => {
    const isOverflowing = title.scrollWidth > title.clientWidth;
    if (!isOverflowing) {
      title.style.animation = 'none';
    }
  });
}
