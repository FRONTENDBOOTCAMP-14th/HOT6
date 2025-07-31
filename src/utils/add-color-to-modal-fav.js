/**
 * 카드 뿌릴 때 즐겨찾기 등록 여부를 확인해 클래스를 추가해주는 함수
 * @param {Element} modal 선택된 카드에 대한 모달
 */
export function addColorToModalFav(modal) {
  const favoriteButton = modal.querySelector('.favoriteButton');
  const dataListKey = 'favoriteBooks';
  const dataList = JSON.parse(localStorage.getItem(dataListKey)) || [];
  const SELECTED_CLASSNAME = 'isClicked';
  const modalId = modal.querySelector('.bookDetails').dataset.isbn;

  const index = dataList.findIndex((item) => item.isbn === modalId);
  if (index === -1) {
    favoriteButton.classList.remove(SELECTED_CLASSNAME);
  } else {
    favoriteButton.classList.add(SELECTED_CLASSNAME);
  }
}
