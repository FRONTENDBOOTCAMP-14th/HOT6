/**
 * 카드 컴포넌트의 즐겨찾기 버튼을 다루는 함수(로컬저장소에 추가/클래스 추가)
 * @param {*} button 즐겨찾기 버튼
 */
export function getFavoriteBookFromCard(button) {
  const favoriteButton = button;

  const favoriteCard = favoriteButton.closest('.cardComponent');
  if (!favoriteCard) return;
  const favoriteBookData = {
    title: favoriteCard.dataset.title,
    image: favoriteCard.dataset.image,
    author: favoriteCard.dataset.author,
    publisher: favoriteCard.dataset.publisher,
    discount: favoriteCard.dataset.discount,
    isbn: favoriteCard.dataset.isbn,
    description: favoriteCard.dataset.description,
  };

  const dataListKey = 'favoriteBooks';
  const dataList = JSON.parse(localStorage.getItem(dataListKey)) || [];
  const SELECTED_CLASSNAME = 'isClicked';

  const index = dataList.findIndex((item) => item.isbn === favoriteBookData.isbn); // 배열에서 뺄 아이템 인덱스 찾기~
  if (index === -1) {
    dataList.push(favoriteBookData);
    localStorage.setItem(dataListKey, JSON.stringify(dataList));
    favoriteButton.classList.add(SELECTED_CLASSNAME);
  } else {
    dataList.splice(index, 1);
    localStorage.setItem(dataListKey, JSON.stringify(dataList));
    favoriteButton.classList.remove(SELECTED_CLASSNAME);
  }

}
