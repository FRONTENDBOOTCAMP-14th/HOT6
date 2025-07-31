import { createCard } from './create-card';

const clientId = import.meta.env.VITE_NAVER_CLIENT_ID;
const clientSecret = import.meta.env.VITE_NAVER_CLIENT_SECRET;

/**
 * 도서 검색 함수
 * @param {*} isNewSearch 첫 검색인지 추가 검색인지 구분해줌
 * @returns
 */
export function searchBooks(
  queryVariables,
  isNewSearch = false,
  container,
  bookCount,
  bookName,
  resultCount
) {
  let { cleanQuery, display } = queryVariables;
  if (queryVariables.isLoading || !queryVariables.moreBooks) return;
  queryVariables.isLoading = true;
  fetch(
    `/api/v1/search/book.json?query=${encodeURIComponent(cleanQuery)}&start=${queryVariables.start}&display=${display}`,
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
        container.innerHTML = '';
        // 결과 텍스트
        bookCount.textContent = data.total;
        bookName.textContent = cleanQuery;
      }
      if (data.items.length === 0) {
        resultCount.innerHTML = `<p>검색 결과가 없습니다.</p>`;
        queryVariables.moreBooks = false;
        return;
      }

      data.items.forEach((item) => createCard(container, item));

      queryVariables.start += display;
      queryVariables.moreBooks = data.total > queryVariables.start;
    })
    .finally(() => {
      queryVariables.isLoading = false;
    });
}
