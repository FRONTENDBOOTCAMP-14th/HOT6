  const topButton = document.querySelector('.goToTopButton')
  const bookListWrapper = document.querySelector('.jsbookListWrapper')

 if (topButton && bookListWrapper) {
  topButton.addEventListener('click', () => {
    bookListWrapper.scrollTop = 0;
  });
}