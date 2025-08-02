/* eslint-disable */
import { createCard } from './create-card';

export default async function handler(req, res) {
  const query = req.query.q || '';
  
  // 네이버 API 호출 (필요에 따라 node-fetch 설치하거나 Vercel 내장 fetch 사용)
  const response = await fetch(`https://openapi.naver.com/v1/search/book.json?query=${encodeURIComponent(query)}&start=${queryVariables.start}&display=${display}`, {
    method: 'GET',
    headers: {
      'X-Naver-Client-Id': process.env.NAVER_CLIENT_ID,
      'X-Naver-Client-Secret': process.env.NAVER_CLIENT_SECRET,
    },
  })
  .then((res) => res.json())
      .then((data) => {
        if (isNewSearch) {
          container.innerHTML = '';
          noResult.textContent = '';
          // 결과 텍스트
          bookCount.textContent = data.total;
          bookName.textContent = cleanQuery;
        }
        if (data.items.length === 0) {
          noResult.textContent = '검색 결과가 없습니다.';
  
          bookListResultWrapper.appendChild(noResult);
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