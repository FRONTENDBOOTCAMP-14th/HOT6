{
  const searchBars = document.querySelectorAll('.jsSearchBar');

  searchBars.forEach((searchBar) => {
    const form = searchBar.querySelector('form');
    const clearButton = form.querySelector('.clearButton');

    form.addEventListener('input', () => {
      const input = form.querySelector('input');
      if (isWebkit()) return;
      clearButton.style.display = input.value ? 'block' : 'none';

      clearButton.addEventListener('click', () => {
        input.value = '';
        clearButton.style.display = 'none';
        input.focus();
      });
    });
  });

  /**
   * Webkit 브라우저 여부를 확인하는 식을 반환하는 함수
   */
  function isWebkit() {
    return /AppleWebKit/.test(navigator.userAgent);
  }
}
