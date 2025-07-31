/**
 * 카드 리스트 렌더링 시 즐겨찾기 등록 여부를 확인해 클래스를 추가해주는 함수
 * @param {Element} card 카드 컴포넌트
 */
export function addColorToCardFav(card) {
  const favoriteButton = card.querySelector('.favoriteButton');
  const dataListKey = 'favoriteBooks';
  const dataList = JSON.parse(localStorage.getItem(dataListKey)) || [];
  const SELECTED_CLASSNAME = 'isClicked';

  const index = dataList.findIndex((item) => item.isbn === card.dataset.isbn); // 배열에서 뺄 아이템 인덱스 찾기~
  if (index === -1) {
    favoriteButton.classList.remove(SELECTED_CLASSNAME);
  } else {
    favoriteButton.classList.add(SELECTED_CLASSNAME);
  }
}
