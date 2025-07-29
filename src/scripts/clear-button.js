const searchBar = document.querySelector('.searchBar')
const form = searchBar.querySelector('form')
const clearButton = form.querySelector('.clearButton')

function isWebkit() {
  return /AppleWebKit/.test(navigator.userAgent)
}

form.addEventListener('input', () => {
  const input = form.querySelector('input')
  if (isWebkit()) return
  clearButton.style.display = input.value ? 'block' : 'none'

  clearButton.addEventListener('click', () => {
    input.value = ''
    clearButton.style.display = 'none'
  })
})
