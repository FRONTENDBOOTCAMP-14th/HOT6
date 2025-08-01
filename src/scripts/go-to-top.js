const topButton = document.querySelector('.goToTopButton');
const ListWrapper = document.querySelector('.jsListWrapper');

if (topButton && ListWrapper) {
  topButton.addEventListener('click', () => {
    ListWrapper.scrollTo({
      top: 0,
      behavior: 'smooth',
    });

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  });
}
