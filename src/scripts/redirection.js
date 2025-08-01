import DOMPurify from '../modules/dompurify';

document.querySelectorAll('.jsSearchBar form').forEach((form) => {
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const input = form.querySelector('input[name="keyword"]');
    const dirtyKeyword = input.value.trim();
    if (!dirtyKeyword) {
      alert('검색어를 입력해주세요.');
      return;
    }
    const cleanKeyword = DOMPurify.sanitize(dirtyKeyword);
    const keyword = encodeURIComponent(cleanKeyword);
    if (keyword) {
      window.location.href = `/src/pages/home/home.html?query=${keyword}`;
    }
  });
});
