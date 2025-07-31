const favoritesBookCount = document.getElementById('favoritesBookCount');
const favoritesContainer = document.querySelector('.bookListWrapper');
const favoriteComment = document.querySelector('.favoriteComment');

const dataListKey = 'favoriteBooks';
const dataList = JSON.parse(localStorage.getItem(dataListKey)) || [];

// 내비게이션에 숫자 업데이트
const favoriteListCount = dataList.length;
favoritesBookCount.textContent = favoriteListCount;

// 화면에 카드 렌더링

if (favoriteListCount > 0) {
  dataList.forEach((item) => createFavoriteCard(item));
}
// 즐겨찾기 목록이 없을 경우, 안내 멘트 생성
else {
  favoriteComment.textContent = '즐겨찾기 목록이 비어있습니다.';
}

// 카드 생성
function createFavoriteCard(item) {
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
        <button class="favoriteButton isClicked" type="button" aria-label="즐겨찾기 추가/삭제">
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
  favoritesContainer.appendChild(card);

  // isOverflow();
}

// 모달 열기

// 모달 닫기