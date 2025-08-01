import { createBookModal, openBookModal, modalClose } from '../utils/modal';

const clientId = import.meta.env.VITE_NAVER_CLIENT_ID;
const clientSecret = import.meta.env.VITE_NAVER_CLIENT_SECRET;

let modal;
let bookData = [];
let currentIsMobile = window.innerWidth < 700;

function renderBooks() {
  const isMobile = window.innerWidth < 700;
  currentIsMobile = isMobile;

  const containerMobile = document.querySelector('.bookListWrapperMobile');
  const containerPC = document.querySelector('.bookListWrapperPC');

  if (containerMobile) containerMobile.innerHTML = '';
  if (containerPC) containerPC.innerHTML = '';

  const container = isMobile ? containerMobile : containerPC;
  if (!container || bookData.length === 0) return;

  bookData.forEach((item) => {
    const card = document.createElement('div');
    card.className = 'cardImageContents';

    card.dataset.title = item.title || '제목 없음';
    card.dataset.author = item.author || '작가 없음';
    card.dataset.publisher = item.publisher || '출판사 없음';
    card.dataset.discount = item.discount || '가격 없음';
    card.dataset.image = item.image || '';
    card.dataset.description = item.description || '설명 없음';
    card.dataset.isbn = item.isbn || '';

    card.innerHTML = `
      <picture class="openModal" aria-haspopup="dialog" aria-controls="bookModal" tabindex="0">
        <img src="${item.image || '../../assets/images/others/book-example.jpg'}" width="117" height="137" alt="도서" />
      </picture>
    `;

    card.querySelector('.openModal').addEventListener('click', () => {
      openBookModal(modal, card);
    });

    card.querySelector('.openModal').addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openBookModal(modal, card);
      }
    });

    container.appendChild(card);
  });
}

function getRandomQuery() {
  const queries = [
    '프론트엔드',
    'html',
    '자바스크립트',
    '웹디자인',
    '리액트',
    'ux',
    'ui',
    'html',
    'css',
    'javascript',
  ];
  const randomIndex = Math.floor(Math.random() * queries.length);
  return queries[randomIndex];
}

function fetchBooksAndRender() {
  const query = getRandomQuery();
  const display = 12;

  fetch(`/api/v1/search/book.json?query=${encodeURIComponent(query)}&display=${display}`, {
    method: 'GET',
    headers: {
      'X-Naver-Client-Id': clientId,
      'X-Naver-Client-Secret': clientSecret,
    },
  })
    .then((res) => {
      if (!res.ok) throw new Error(`API 호출 실패: ${res.status}`);
      return res.json();
    })
    .then((data) => {
      bookData = data.items;
      renderBooks();
    })
    .catch((error) => {
      console.error(error);
      const allContainers = document.querySelectorAll('.bookListWrapperMobile, .bookListWrapperPC');
      allContainers.forEach((c) => (c.innerHTML = '<p>도서 정보를 불러오지 못했습니다.</p>'));
    });
}

document.addEventListener('DOMContentLoaded', () => {
  modal = createBookModal();
  fetchBooksAndRender();

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

  window.addEventListener('resize', () => {
    const isMobile = window.innerWidth < 700;
    if (isMobile !== currentIsMobile) {
      renderBooks();
    }
  });
});
