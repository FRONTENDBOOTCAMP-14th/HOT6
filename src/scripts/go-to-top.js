
  const topButton = document.querySelector('.goToTopButton')
  const bookListSectionHome = document.querySelector('.bookListWrapperHome')
  const bookListSectionFav = document.querySelector('.bookListWrapper')
  const bookListSectionMainMobile = document.querySelector('.bookListWrapperMobile')
  const bookListSectionMainPC = document.querySelector('.bookListWrapperPC')

  topButton.addEventListener('click', () => {
    bookListSectionHome.scrollTop = 0
  })

  topButton.addEventListener('click', () => {
    bookListSectionFav.scrollTop = 0
  })

  topButton.addEventListener('click', () => {
    bookListSectionMainMobile.scrollTop = 0
  })

  topButton.addEventListener('click', () => {
    bookListSectionMainPC.scrollTop = 0
  })
