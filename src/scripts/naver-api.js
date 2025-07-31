import DOMPurify from '../modules/dompurify';
import { createBookModal, openBookModal, modalClose } from '../utils/modal';
import { addColorToCardFav } from '../utils/add-color-to-card-fav';
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

        data.items.forEach((item) => createCard(item));

        start += display;
        moreBooks = data.total > start;
      })
      .finally(() => {
        isLoading = false;
      });
  }

  /**
   * 카드 아이템들을 만들어주는 함수
   * @param {*} item API에서 받아온 정보
   */
  function createCard(item) {
    const title = item.title;
    const isMobile = window.innerWidth < 700;
    const maxLength = isMobile ? 7 : 100;
    const shortTitle = title.length > maxLength ? title.slice(0, maxLength) + '...' : title;

    const image = item.image;
    const author = item.author;
    const publisher = item.publisher;
    const discount = item.discount;
    const isbn = item.isbn;
    const description = item.description;

    const card = document.createElement('div');
    card.dataset.title = title;
    card.dataset.image = image;
    card.dataset.author = author;
    card.dataset.publisher = publisher;
    card.dataset.discount = discount;
    card.dataset.isbn = isbn;
    card.dataset.description = description;
    card.className = 'cardComponent';
    card.innerHTML = `
      <picture class="openModal">
        <img src="${DOMPurify.sanitize(image) || '../../assets/images/others/book-example.jpg'}" width="117" height="137" alt="도서" />
        <button class="favoriteButton" type="button" aria-label="즐겨찾기 추가/삭제">
          <svg
            class="favoriteIcon"
            xmlns="http://www.w3.org/2000/svg"
            id="Layer_1"
            data-name="Layer 1"
            viewBox="0 0 24 24"
            aria-hidden="true"
            >
            <path
                d="M16.074,3.781c-1.39-1.106-2.703-2.152-3.691-3.333L12.006-.002l-.384,.444c-1.491,1.722-1.905,3.821-2.238,5.508-.405,2.051-.654,3.037-1.884,3.037-.198,0-.35-.069-.492-.224-.607-.663-.687-2.586-.594-3.643l.123-1.403-.98,1.011c-1.418,1.463-4.057,4.186-4.057,8.771,0,5.79,4.71,10.5,10.5,10.5s10.5-4.71,10.5-10.5c0-4.603-3.267-7.204-6.426-9.719Zm-6.902,18.048c-1.56-1.562-1.56-4.101-.022-5.639l2.851-2.522,2.828,2.502c1.559,1.561,1.559,4.1,0,5.659-1.559,1.559-4.097,1.561-5.657,0Zm6.643,.365c1.642-1.962,1.563-4.888-.301-6.752l-3.513-3.11-3.536,3.13c-1.843,1.842-1.921,4.766-.279,6.731-3.343-1.473-5.685-4.813-5.685-8.694,0-3.233,1.37-5.396,2.888-7.122,.036,1.015,.221,2.338,.882,3.06,.329,.359,.753,.549,1.229,.549,2.107,0,2.476-1.867,2.865-3.844,.294-1.492,.624-3.164,1.655-4.595,.984,1.066,2.177,2.016,3.431,3.014,2.974,2.368,6.049,4.816,6.049,8.937,0,3.882-2.343,7.222-5.686,8.695Z"
            />
          </svg>
        </button>
      </picture>
      <div class="textContents">
        <p class="cardTextContentsTitle" tabindex="0">${DOMPurify.sanitize(shortTitle)}</p>
        
        <div class="divider"></div>
        <p>${DOMPurify.sanitize(author) || '작가 정보 없음'}</p>
        <div class="divider"></div>
        <p>${DOMPurify.sanitize(publisher) || '출판사 정보 없음'}</p>
        <div class="divider"></div>
        <p>${discount ? DOMPurify.sanitize(discount) + '원' : '가격 정보 없음'}</p>
      </div>
    `;
    resultContainer.appendChild(card);
    addColorToCardFav(card);

    isOverflow();
  }

  /**
   * 텍스트 길이를 판단하고 자동 슬라이드 애니메이션을 없애는 함수
   */
  function isOverflow() {
    const titleElement = document.querySelectorAll('.cardTextContentsTitle');
    titleElement.forEach((title) => {
      const isOverflowing = title.scrollWidth > title.clientWidth;
      if (!isOverflowing) {
        title.style.animation = 'none';
      }
    });
  }
});
