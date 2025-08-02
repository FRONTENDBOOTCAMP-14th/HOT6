import DOMPurify from '../modules/dompurify';
import { createBookModal, openBookModal, modalClose } from '../utils/modal';
import { searchBooks } from '../utils/search-book';
import { getFavoriteBookFromCard } from '../utils/get-favorite-book-from-card';
import { getFavoriteBookFromModal } from '../utils/get-favorite-book-from-modal';

const form = document.querySelector('.searchBar form');
const input = document.getElementById('searchInput');
const resultContainer = document.querySelector('.bookListWrapperHome');
const countElement = document.getElementById('searchBookCount');
const nameElement = document.getElementById('searchBookName');

const queryVariables = {
  cleanQuery: '',
  start: 1,
  display: 12,
  isLoading: false,
  moreBooks: true,
};

const modal = createBookModal();

// 리디렉션 검색
let query = new URLSearchParams(window.location.search).get('query');

if (query) {
  const cleanQuery = DOMPurify.sanitize(decodeURIComponent(query.trim()));
  input.value = cleanQuery;
  queryVariables.cleanQuery = cleanQuery;
  searchBooks(queryVariables, true, resultContainer, countElement, nameElement);
}

// 검색 이벤트
form.addEventListener('submit', (e) => {
  e.preventDefault();
  query = input.value.trim();
  queryVariables.cleanQuery = DOMPurify.sanitize(query);
  if (!queryVariables.cleanQuery) return alert('검색어 입력은 필수입니다.');

  queryVariables.start = 1;
  queryVariables.moreBooks = true;
  searchBooks(queryVariables, true, resultContainer, countElement, nameElement);
});

resultContainer.addEventListener('click', (e) => {
  const favoriteButton = e.target.closest('.favoriteButton');
  const openFavButtonCondition = favoriteButton || e.target.closest('.favoriteIcon');
  const card = e.target.closest('.cardComponent');
  const openModalCondition = !openFavButtonCondition && card;
  if (openModalCondition) openBookModal(modal, card);

  if (openFavButtonCondition) {
    getFavoriteBookFromCard(favoriteButton);
  }
});

resultContainer.addEventListener('keydown', (e) => {
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

// 닫기 이벤트
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

// 무한 스크롤
resultContainer.addEventListener('scroll', () => {
  const scrollTop = resultContainer.scrollTop;
  const scrollHeight = resultContainer.scrollHeight;
  const clientHeight = resultContainer.clientHeight;
  if (
    scrollTop + clientHeight >= scrollHeight - 100 &&
    !queryVariables.isLoading &&
    queryVariables.moreBooks
  ) {
    searchBooks(queryVariables, false, resultContainer, countElement, nameElement);
  }
});