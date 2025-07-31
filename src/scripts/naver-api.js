import DOMPurify from '../modules/dompurify';
import { createBookModal, openBookModal, modalClose } from '../utils/modal';
import { createCard } from '../utils/create-card';
import { getFavoriteBookFromCard } from '../utils/get-favorite-book-from-card';
import { getFavoriteBookFromModal } from '../utils/get-favorite-book-from-modal';

const clientId = import.meta.env.VITE_NAVER_CLIENT_ID;
const clientSecret = import.meta.env.VITE_NAVER_CLIENT_SECRET;

document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('.searchBar form');
  const input = document.getElementById('searchInput');
  const resultContainer = document.querySelector('.bookListWrapperHome');
  const searchBookComment = document.querySelector('.searchBookComment');
  const countElement = document.getElementById('searchBookCount');
  const nameElement = document.getElementById('searchBookName');

  let cleanQuery = '';
  let query = '';
  let start = 1;
  const display = 12;
  let isLoading = false;
  let moreBooks = true;

  const modal = createBookModal();

  // 검색 이벤트
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    query = input.value.trim();
    cleanQuery = DOMPurify.sanitize(query);
    if (!cleanQuery) return alert('검색어 입력은 필수입니다.');

    start = 1;
    moreBooks = true;
    searchBooks(true);
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
    }

    openBookModal(modal, card);
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
    if (scrollTop + clientHeight >= scrollHeight - 100 && !isLoading && moreBooks) {
      searchBooks();
    }
  });

  /**
   * 도서 검색 함수
   * @param {*} isNewSearch 첫 검색인지 추가 검색인지 구분해줌
   * @returns
   */
  function searchBooks(isNewSearch = false) {
    if (isLoading || !moreBooks) return;
    isLoading = true;
    fetch(
      `/api/v1/search/book.json?query=${encodeURIComponent(cleanQuery)}&start=${start}&display=${display}`,
      {
        headers: {
          'X-Naver-Client-Id': clientId,
          'X-Naver-Client-Secret': clientSecret,
        },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        if (isNewSearch) {
          resultContainer.innerHTML = '';
          // 결과 텍스트
          countElement.textContent = data.total;
          nameElement.textContent = query;
        }
        if (data.items.length === 0) {
          searchBookComment.innerHTML = `<p>검색 결과가 없습니다.</p>`;
          moreBooks = false;
          return;
        }

        data.items.forEach((item) => createCard(resultContainer, item));

        start += display;
        moreBooks = data.total > start;
      })
      .finally(() => {
        isLoading = false;
      });
  }
});
