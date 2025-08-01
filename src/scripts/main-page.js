const clientId = import.meta.env.VITE_NAVER_CLIENT_ID;
const clientSecret = import.meta.env.VITE_NAVER_CLIENT_SECRET;

let bookData = []; // 데이터를 저장해두는 변수
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
    card.innerHTML = `
      <picture class="openModal" aria-haspopup="dialog" aria-controls="bookModal" tabindex="0">
        <img src="${item.image || '../../assets/images/others/book-example.jpg'}" width="117" height="137" alt="도서" />
      </picture>
    `;
    container.appendChild(card);
  });
}

function fetchBooksAndRender() {
  const query = '프론트엔드';
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
      bookData = data.items; // 데이터를 저장만 해둠
      renderBooks(); // 현재 화면에 맞춰 렌더링
    })
    .catch((error) => {
      console.error(error);
      const allContainers = document.querySelectorAll('.bookListWrapperMobile, .bookListWrapperPC');
      allContainers.forEach((c) => (c.innerHTML = '<p>도서 정보를 불러오지 못했습니다.</p>'));
    });
}

document.addEventListener('DOMContentLoaded', () => {
  fetchBooksAndRender();

  window.addEventListener('resize', () => {
    const isMobile = window.innerWidth < 700;
    if (isMobile !== currentIsMobile) {
      renderBooks(); // fetch 하지 않고 기존 데이터로 다시 렌더링만!
    }
  });
});
