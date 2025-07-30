const clientId = import.meta.env.VITE_NAVER_CLIENT_ID;
const clientSecret = import.meta.env.VITE_NAVER_CLIENT_SECRET;

document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('.searchBar form');
  const input = document.getElementById('searchInput');
  const resultContainer = document.querySelector('.bookListWrapperHome');
  const searchBookComment = document.querySelector('.searchBookComment');
  const countElement = document.getElementById('searchBookCount');
  const nameElement = document.getElementById('searchBookName');

  let query = '';
  let start = 1;
  const display = 12;
  let isLoading = false;
  let moreBooks = true;

  // 모달 생성
  const modal = document.createElement('dialog');
  modal.className = 'modal';
  modal.setAttribute('aria-modal', 'true');
  modal.style.display = 'none';

  modal.innerHTML = `
    <article class="modalContent bookModal">
      <h2 class="sr-only">도서 정보 안내창</h2>
      <header class="bookHeader">
        <button class="closeModal" aria-label="닫기">&times;</button>
        <div class="bookImageWrapper">
          <img src="" alt="책 표지" class="bookCover" width="117" height="137" />
        </div>
      </header>
      <section class="bookDetails" data-isbn="">
        <h3 class="sr-only">도서 상세정보</h3>
        <p class="bookTitle">제목</p>
        <p class="bookAuthorPublisher">
          <span class="bookAuthor">작가</span> | <span class="bookPublisher">출판사</span>
        </p>
        <p class="bookPrice">가격</p>
        <p class="bookDescription">설명 없음</p>
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
      </section>
    </article>
  `;
  document.body.appendChild(modal);

  // 검색 이벤트
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    query = input.value.trim();
    if (!query) return alert('검색어 입력은 필수입니다.');

    start = 1;
    moreBooks = true;
    searchBooks(true);
  });

  // 모달 열기
  resultContainer.addEventListener('click', (e) => {
    const favoriteButton = e.target.closest('.favoriteButton');
    const openFavButtonCondition = favoriteButton || e.target.closest('.favoriteIcon');
    const card = e.target.closest('.cardComponent');
    const openModalCondition = !openFavButtonCondition && card;
    if (openModalCondition) openBookModal(card);

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

      openBookModal(card);
    }
  });

  // 닫을때 속성 주기 함수
  function modalClose() {
    modal.querySelector('.bookDetails').scrollTop = 0;
    modal.style.display = 'none';
    document.body.style.overflow = '';
    const cards =
      modal.previousElementSibling.previousElementSibling.querySelectorAll('.cardComponent');
    const selectedCard = cards.find((card) => card.dataset.isbn === modal.dataset.isbn);
    // console.log(modal.dataset.isbn);
    // console.log(selectedCardId)
    syncFavorite(selectedCard, modal);
  }
  // 닫기 이벤트
  modal.querySelector('.closeModal').addEventListener('click', () => {
    modalClose();
  });

  modal.addEventListener('click', (e) => {
    if (!e.target.closest('.modalContent')) {
      modalClose();
    }
    const favoriteButton = e.target.closest('.favoriteButton');
    const favoriteModal = e.currentTarget;
    console.log(1, favoriteButton);
    // console.log(favoriteModal)

    if (!favoriteModal) return;
    if (favoriteModal) {
      if (favoriteButton !== e.currentTarget.querySelector('.favoriteButton')) return;
      const favoriteBookData = {
        title: favoriteModal.querySelector('.bookTitle').textContent,
        image: favoriteModal.querySelector('.bookCover').src,
        author: favoriteModal.querySelector('.bookAuthor').textContent,
        publisher: favoriteModal.querySelector('.bookPublisher').textContent,
        discount: favoriteModal.querySelector('.bookPrice').textContent,
        isbn: favoriteModal.querySelector('.bookDetails').dataset.isbn,
        description: favoriteModal.querySelector('.bookDescription').textContent,
      };

      const dataListKey = 'favoriteBooks';
      const dataList = JSON.parse(localStorage.getItem(dataListKey)) || [];
      const SELECTED_CLASSNAME = 'isClicked';

      const index = dataList.findIndex((item) => item.isbn === favoriteBookData.isbn); // 배열에서 뺄 아이템 인덱스 찾기~
      if (index === -1) {
        console.log(2, favoriteButton);
        // 아이템이 없으면
        dataList.push(favoriteBookData); //  배열에 추가
        // localStorage.setItem(dataListKey, JSON.stringify(dataList)); // 저장소에 추가
        favoriteButton.classList.add(SELECTED_CLASSNAME); // 색입히기
      } else {
        console.log(3, favoriteButton);
        // 아이템이 이미 있으면
        dataList.splice(index, 1); // 배열에서 빼기
        favoriteButton.classList.remove(SELECTED_CLASSNAME); // 색빼기
      }
      localStorage.setItem(dataListKey, JSON.stringify(dataList)); // 저장소에 추가
    }
  });

  modal.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      modalClose();
    }
  });

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
      `/v1/search/book.json?query=${encodeURIComponent(query)}&start=${start}&display=${display}`,
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
        <img src="${image || '../../assets/images/others/book-example.jpg'}" width="117" height="137" alt="도서" />
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
        <p class="cardTextContentsTitle" tabindex="0">${shortTitle}</p>
        
        <div class="divider"></div>
        <p>${author || '작가 정보 없음'}</p>
        <div class="divider"></div>
        <p>${publisher || '출판사 정보 없음'}</p>
        <div class="divider"></div>
        <p>${discount ? discount + '원' : '가격 정보 없음'}</p>
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

  /**
   * 모달을 열면 아래 내용들이 모달로 대입
   * @param {*} card 이벤트가 작동된 카드
   */
  function openBookModal(card) {
    modal.querySelector('.bookTitle').textContent = card.dataset.title || '제목 없음';
    modal.querySelector('.bookAuthor').textContent = card.dataset.author || '작가 없음';
    modal.querySelector('.bookPublisher').textContent = card.dataset.publisher || '출판사 없음';
    modal.querySelector('.bookPrice').textContent = card.dataset.discount + '원' || '가격 없음';
    modal.querySelector('.bookCover').src = card.dataset.image || '';
    modal.querySelector('.bookDescription').textContent = card.dataset.description || '설명 없음';
    modal.querySelector('.bookDetails').dataset.isbn = card.dataset.isbn || '';
    modal.dataset.isbn = card.dataset.isbn;

    modal.style.display = 'flex';
    addColorToModalFav(modal);

    const closeBtn = modal.querySelector('.closeModal');
    if (closeBtn) closeBtn.focus();

    // 모달이 열렸을 때, 해당 카드의 도서식별번호
    // const selectedCardId = modal.previousElementSibling.previousElementSibling.querySelector('.cardComponent').dataset.isbn

    // 포커스 트랩 함수 호출
    trapFocus(modal);
  }

  /**
   * 포커스 트랩 함수
   * @param {*} modal 이벤트가 작동된 모달
   */
  function trapFocus(modal) {
    const focusableElement = modal.querySelectorAll('button');
    const firstElement = focusableElement[0];
    const lastElement = focusableElement[focusableElement.length - 1];

    modal.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          // Shift + Tab
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          // Tab
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    });
  }

  function getFavoriteBookFromCard(button) {
    // container.addEventListener('click', (e) => {
    const favoriteButton = button;

    //   if (favoriteButton) {
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
      // 아이템이 없으면
      dataList.push(favoriteBookData); //  배열에 추가
      localStorage.setItem(dataListKey, JSON.stringify(dataList)); // 저장소에 추가
      favoriteButton.classList.add(SELECTED_CLASSNAME); // 색입히기
    } else {
      // 아이템이 이미 있으면
      dataList.splice(index, 1); // 배열에서 빼기
      localStorage.setItem(dataListKey, JSON.stringify(dataList)); // 저장소에 추가
      favoriteButton.classList.remove(SELECTED_CLASSNAME); // 색빼기
    }
    // favoriteButton.classList.toggle(SELECTED_CLASSNAME); // 색 조정
    // }
    // });
  }
  // function getFavoriteBookFromModal(button) {
  //   // container.addEventListener('click', (e) => {
  //   const favoriteButton = button

  //   //   if (favoriteButton) {
  //   const favoriteCard = favoriteButton.closest('.cardComponent');
  //   if (!favoriteCard) return;
  //   const favoriteBookData = {
  //     title: favoriteCard.dataset.title,
  //     image: favoriteCard.dataset.image,
  //     author: favoriteCard.dataset.author,
  //     publisher: favoriteCard.dataset.publisher,
  //     discount: favoriteCard.dataset.discount,
  //     isbn: favoriteCard.dataset.isbn,
  //     description: favoriteCard.dataset.description,
  //   };

  //   const dataListKey = 'favoriteBooks';
  //   const dataList = JSON.parse(localStorage.getItem(dataListKey)) || [];
  //   const SELECTED_CLASSNAME = 'isClicked';

  //   const index = dataList.findIndex((item) => item.isbn === favoriteBookData.isbn); // 배열에서 뺄 아이템 인덱스 찾기~
  //   if (index === -1) {
  //     // 아이템이 없으면
  //     dataList.push(favoriteBookData); //  배열에 추가
  //     localStorage.setItem(dataListKey, JSON.stringify(dataList)); // 저장소에 추가
  //     favoriteButton.classList.add(SELECTED_CLASSNAME); // 색입히기
  //   } else {
  //     // 아이템이 이미 있으면
  //     dataList.splice(index, 1); // 배열에서 빼기
  //     localStorage.setItem(dataListKey, JSON.stringify(dataList)); // 저장소에 추가
  //     favoriteButton.classList.remove(SELECTED_CLASSNAME); // 색빼기
  //   }
  //   // favoriteButton.classList.toggle(SELECTED_CLASSNAME); // 색 조정
  //   // }
  //   // });
  // }

  // 도서 목록 전체 컨테이너에 클릭 이벤트리스너 연결
  // favorite 버튼 찾고, 해당 카드 찾음. -> 해당 카드의 데이터 객체로 저장
  // 로컬 스토리지에서 키(객체명) 가져오거나, 없다면 빈 배열 가져옴.
  // index에 해당 도서 위치 탐색
  //    없으면 -> push + className 추가 -> 저장소에 반영
  //    있으면 -> splice + className 제거 -> 저장소에 반영

  // 카드에 클릭이벤트를 걸고
  // 해당 카드의 도서정보를 가져오고
  // 버튼에 클릭이벤트 연결
  // 좋아요()
  // modal.addEventListener('click', (e) => {
  //   const favoriteButton = e.target.closest('.favoriteButton');
  //   console.log(favoriteButton)

  //   if (favoriteButton) {
  //     const favoriteModal = favoriteButton.closest('.bookModal');
  //     const favoriteCard = favoriteButton.closest('.cardContent');
  //     if (!favoriteModal) return;
  //     const favoriteBookData = {
  //       title: favoriteCard.dataset.title,
  //       image: favoriteCard.dataset.image,
  //       author: favoriteCard.dataset.author,
  //       publisher: favoriteCard.dataset.publisher,
  //       discount: favoriteCard.dataset.discount,
  //       isbn: favoriteCard.dataset.isbn,
  //       description: favoriteCard.dataset.description,
  //     };

  //     const dataListKey = 'favoriteBooks';
  //     const dataList = JSON.parse(localStorage.getItem(dataListKey)) || [];
  //     const SELECTED_CLASSNAME = 'isClicked';

  //     const index = dataList.findIndex((item) => item.isbn === favoriteBookData.isbn); // 배열에서 뺄 아이템 인덱스 찾기~
  //     if (index === -1) {
  //       // 아이템이 없으면
  //       dataList.push(favoriteBookData); //  배열에 추가
  //       localStorage.setItem(dataListKey, JSON.stringify(dataList)); // 저장소에 추가
  //       favoriteButton.classList.add(SELECTED_CLASSNAME); // 색입히기
  //     } else {
  //       // 아이템이 이미 있으면
  //       dataList.splice(index, 1); // 배열에서 빼기
  //       localStorage.setItem(dataListKey, JSON.stringify(dataList)); // 저장소에 추가
  //       favoriteButton.classList.remove(SELECTED_CLASSNAME); // 색빼기
  //     }
  //     // favoriteButton.classList.toggle(SELECTED_CLASSNAME); // 색 조정
  //   }
  // });

  /**
   * 카드 뿌릴 때 즐겨찾기 등록 여부를 확인해 클래스를 추가해주는 함수
   * @param {Element} card
   */
  function addColorToCardFav(card) {
    const favoriteButton = card.querySelector('.favoriteButton');
    const dataListKey = 'favoriteBooks';
    const dataList = JSON.parse(localStorage.getItem(dataListKey)) || [];
    const SELECTED_CLASSNAME = 'isClicked';

    const index = dataList.findIndex((item) => item.isbn === card.dataset.isbn); // 배열에서 뺄 아이템 인덱스 찾기~
    if (index === -1) return;
    favoriteButton.classList.add(SELECTED_CLASSNAME); // 색빼기
  }
  function addColorToModalFav(modal) {
    const favoriteButton = modal.querySelector('.favoriteButton');
    const dataListKey = 'favoriteBooks';
    const dataList = JSON.parse(localStorage.getItem(dataListKey)) || [];
    const SELECTED_CLASSNAME = 'isClicked';
    const modalId = modal.querySelector('.bookDetails').dataset.isbn;

    const index = dataList.findIndex((item) => item.isbn === modalId); // 배열에서 뺄 아이템 인덱스 찾기~
    if (index === -1) return;
    favoriteButton.classList.add(SELECTED_CLASSNAME); // 색 넣기
  }
  function syncFavorite(card, modal) {
    const favoriteButtonCard = card.querySelector('.favoriteButton');
    const favoriteButtonModal = modal.querySelector('.favoriteButton');
    const SELECTED_CLASSNAME = 'isClicked';

    if (favoriteButtonModal.classList.contains(SELECTED_CLASSNAME)) {
      favoriteButtonCard.classList.add(SELECTED_CLASSNAME);
    } else {
      favoriteButtonCard.classList.remove(SELECTED_CLASSNAME);
    }
  }

  // 추가로 할 일 --------------------------------------------------------------------------
  // 함수로 정의
  // favorite 탭에 뿌려주기
  // --------------------------------------------------------------------------

  /*  localStorage에 저장된 데이터 양식
  DataList = [
  {title: "윈드 브레이커 1",…}, 
  {title: "윈드 브레이커 1",…}
  ]
  */
});
