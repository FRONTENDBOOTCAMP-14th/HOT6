import { createBookModal, openBookModal, modalClose } from '../utils/modal';
import { getFavoriteBookFromCard } from '../utils/get-favorite-book-from-card';
import { getFavoriteBookFromModal } from '../utils/get-favorite-book-from-modal';
import { createCard } from '../utils/create-card';

const favoritesContainer = document.querySelector('.bookListWrapper');
const favoriteComment = document.querySelector('.favoriteComment');

const dataListKey = 'favoriteBooks';
const dataList = JSON.parse(localStorage.getItem(dataListKey)) || [];

// 화면에 카드 렌더링

if (dataList.length > 0) {
  dataList.forEach((item) => createCard(favoritesContainer, item));
}
// 즐겨찾기 목록이 없을 경우, 안내 멘트 생성
else {
  favoriteComment.textContent = '즐겨찾기 목록이 비어있습니다.';
}

// 모달 생성
const modal = createBookModal();

// 모달 열기 및 즐겨찾기 버튼에 대한 클릭 이벤트
favoritesContainer.addEventListener('click', (e) => {
  const favoriteButton = e.target.closest('.favoriteButton');
  const openFavButtonCondition = favoriteButton || e.target.closest('.favoriteIcon');
  const card = e.target.closest('.cardComponent');
  const openModalCondition = !openFavButtonCondition && card;
  if (openModalCondition) openBookModal(modal, card);

  if (openFavButtonCondition) {
    getFavoriteBookFromCard(favoriteButton);
  }
});

favoritesContainer.addEventListener('keydown', (e) => {
  if (
    (e.target.classList.contains('cardTextContentsTitle') ||
      e.target.classList.contains('openModal')) &&
    (e.key === 'Enter' || e.key === ' ')
  ) {
    e.preventDefault();

    const card = e.target.closest('.cardComponent');
    if (!card) return;

    openBookModal(modal, card);
  }
});

// 모달 닫기
modal.querySelector('.closeModal').addEventListener('click', () => {
  modalClose(modal);
});

modal.addEventListener('click', (e) => {
  if (!e.target.closest('.modalContent')) {
    modalClose(modal);
  }

  const favoriteButton = e.target.closest('.favoriteButton');
  const favoriteModal = e.currentTarget;
  getFavoriteBookFromModal(favoriteButton, favoriteModal);
});

modal.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    modalClose(modal);
  }
});
