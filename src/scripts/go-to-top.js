  const topButton = document.querySelector('.goToTopButton')
  const bookListWrapper = document.querySelector('.jsbookListWrapper')

  topButton.addEventListener('click', () => {
    bookListWrapper.scrollTop = 0
  })