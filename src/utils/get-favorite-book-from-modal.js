/**
 * 카드 컴포넌트의 즐겨찾기 버튼을 다루는 함수(로컬저장소에 추가/클래스 추가)
 * @param {*} button 즐겨찾기 버튼
 * @param {*} modal 모달 다이얼로그
 */
export function getFavoriteBookFromModal(button, modal) {
  if (!modal) return;
  if (modal) {
    if (button !== modal.querySelector('.favoriteButton')) return;
    const favoriteBookData = {
      title: modal.querySelector('.bookTitle').textContent,
      image: modal.querySelector('.bookCover').src,
      author: modal.querySelector('.bookAuthor').textContent,
      publisher: modal.querySelector('.bookPublisher').textContent,
      discount: modal.querySelector('.bookPrice').textContent,
      isbn: modal.querySelector('.bookDetails').dataset.isbn,
      description: modal.querySelector('.bookDescription').textContent,
    };

    const cards =
      modal.previousElementSibling.previousElementSibling.querySelectorAll('.cardComponent');

    const selectedCard = Array.from(cards).find((card) => card.dataset.isbn === modal.dataset.isbn);

    const dataListKey = 'favoriteBooks';
    const dataList = JSON.parse(localStorage.getItem(dataListKey)) || [];
    const SELECTED_CLASSNAME = 'isClicked';

    const index = dataList.findIndex((item) => item.isbn === favoriteBookData.isbn);
    if (index === -1) {
      // 아이템이 없으면
      dataList.push(favoriteBookData);

      button.classList.add(SELECTED_CLASSNAME);
      selectedCard.querySelector('.favoriteButton').classList.add(SELECTED_CLASSNAME);
    } else {
      // 아이템이 이미 있으면
      dataList.splice(index, 1);
      button.classList.remove(SELECTED_CLASSNAME);
      selectedCard.querySelector('.favoriteButton').classList.remove(SELECTED_CLASSNAME);
    }
    localStorage.setItem(dataListKey, JSON.stringify(dataList));
  }
}
