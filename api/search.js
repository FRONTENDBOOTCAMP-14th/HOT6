/* eslint-disable */

export default async function handler(req, res) {
  const query = req.query.q || '';
  
  // 네이버 API 호출 (필요에 따라 node-fetch 설치하거나 Vercel 내장 fetch 사용)
try {  const response = await fetch(`https://openapi.naver.com/v1/search/book.json?query=${encodeURIComponent(query)}`, {
    headers: {
      'X-Naver-Client-Id': process.env.NAVER_CLIENT_ID,
      'X-Naver-Client-Secret': process.env.NAVER_CLIENT_SECRET,
    },
  });

    const data = await apiRes.text(); // 디버깅을 위해 text()로 받음

    if (!apiRes.ok) {
      return res.status(apiRes.status).send(`네이버 API 에러: ${apiRes.status}\n${data}`);
    }

    return res.status(200).send(data); // 임시로 text 출력
  } catch (e) {
    return res.status(500).send(`서버 오류 발생\n${e.message}`);
  }

}