// favoriteCount
const dataListKey = 'favoriteBooks';
const dataList = JSON.parse(localStorage.getItem(dataListKey)) || [];

const favoritesBookCount = document.getElementById('favoritesBookCount');

// 내비게이션에 숫자 업데이트
const favoriteListCount = dataList.length;
favoritesBookCount.textContent = favoriteListCount;
