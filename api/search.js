/* eslint-disable */

export default async function handler(req, res) {
  const query = req.query.q || '';
  
  // 네이버 API 호출 (필요에 따라 node-fetch 설치하거나 Vercel 내장 fetch 사용)
  const response = await fetch(`https://openapi.naver.com/v1/search/book.json?query=${encodeURIComponent(query)}&start=${queryVariables.start}&display=${display}`, {
    headers: {
      'X-Naver-Client-Id': process.env.NAVER_CLIENT_ID,
      'X-Naver-Client-Secret': process.env.NAVER_CLIENT_SECRET,
    },
  });

  if (!response.ok) {
    return res.status(response.status).json({ error: 'Failed to fetch from Naver API' });
  }

  const data = await response.json();
  res.status(200).json(data);
}