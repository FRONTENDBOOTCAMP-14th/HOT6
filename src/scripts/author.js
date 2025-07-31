const authors = [
  {
    name: '한강',
    displayName: 'Han Kang',
    wiki: 'https://namu.wiki/w/한강(소설가)',
    img: 'Han_Kang',
    nationality: 'korean',
  },
  {
    name: '김금희',
    displayName: 'Kim Keum-Hee',
    wiki: 'https://namu.wiki/w/김금희',
    img: 'Kim_Keum_Hee',
    nationality: 'korean',
  },
  {
    name: '김애란',
    displayName: 'Kim Ae-Ran',
    wiki: 'https://namu.wiki/w/김애란',
    img: 'Kim_Ae_Ran',
    nationality: 'korean',
  },
  {
    name: '김영하',
    displayName: 'Kim Young-Ha',
    wiki: 'https://namu.wiki/w/김영하',
    img: 'Kim_Young_Ha',
    nationality: 'korean',
  },
  {
    name: '성해나',
    displayName: 'Sung Hae-Na',
    wiki: 'https://namu.wiki/w/성해나',
    img: 'Sung_Hae_Na',
    nationality: 'korean',
  },
  {
    name: '황석영',
    displayName: 'Hwang Sok-Yong',
    wiki: 'https://namu.wiki/w/황석영',
    img: 'Hwang_Sok_yong',
    nationality: 'korean',
  },
  {
    name: '앙투안 드 생택쥐페리',
    displayName: 'Antoine de Saint-Exupery',
    wiki: 'https://namu.wiki/w/앙투안%20드%20생텍쥐페리',
    img: 'Saint_Exupery',
    nationality: 'international',
  },
  {
    name: '어니스트 헤밍웨이',
    displayName: 'Ernest Miller Hemingway',
    wiki: 'https://namu.wiki/w/어니스트%20헤밍웨이',
    img: 'Hemingway',
    nationality: 'international',
  },
  {
    name: 'J.K.롤링',
    displayName: 'J.K. Rowling',
    wiki: 'https://namu.wiki/w/J.%20K.%20롤링',
    img: 'Joanne_K',
    nationality: 'international',
  },
  {
    name: '헤르만 헤세',
    displayName: 'Hermann Hesse',
    wiki: 'https://namu.wiki/w/헤르만%20헤세',
    img: 'Herman_Hesse',
    nationality: 'international',
  },
  {
    name: '레프 톨스토이',
    displayName: 'Leo Tolstoy',
    wiki: 'https://namu.wiki/w/레프%20톨스토이',
    img: 'Tolstoy',
    nationality: 'international',
  },
  {
    name: '베르나르 베르베르',
    displayName: 'Bernard Werber',
    wiki: 'https://namu.wiki/w/베르나르%20베르베르',
    img: 'Bernard_Werber',
    nationality: 'international',
  },
];

/**
 * 한국 작가인지 확인
 */
function isKorean(author) {
  return author.nationality === 'korean';
}

/**
 * 해당 작가가 국제적인 작가인지 확인
 */
function isInternational(author) {
  return author.nationality === 'international';
}

/**
 * 작가 데이터를 받아 프로필 렌더링
 */
function renderAuthors(list, containerId) {
  const container = document.getElementById(containerId);
  list.forEach(function (author) {
    const article = document.createElement('article');
    article.innerHTML = `
      <a href="${author.wiki}" target="_blank" rel="noopener noreferrer">
        <figure>
          <picture>
            <source type="image/webp"
              srcset="/src/assets/images/author/author_${author.img}_webp.webp 1x,
                      /src/assets/images/author/author_${author.img}_webp_2x.webp 2x" />
            <img src="/src/assets/images/author/author_${author.img}.png"
                 srcset="/src/assets/images/author/author_${author.img}.png 1x,
                         /src/assets/images/author/author_${author.img}_2x.png 2x"
                 alt="${author.name}의 나무위키로 이동" />
          </picture>
          <figcaption>${author.displayName}</figcaption>
        </figure>
      </a>
    `;
    container.appendChild(article);
  });
}

const korean = authors.filter(isKorean);
const international = authors.filter(isInternational);

renderAuthors(korean, 'koreanAuthors');
renderAuthors(international, 'internationalAuthors');
