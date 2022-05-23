let news = [];
let menus = document.querySelectorAll('.menus button');

menus.forEach((menu) =>
  menu.addEventListener('click', (event) => getNewsByTopic(event))
);

let searchButton = document.getElementById('search-button');
let url;

// 리팩토링
// 각 함수에서 필요한 url을 만든다.
// API 호출 함수를 부른다.

const getNews = async () => {
  try {
    let header = new Headers({
      'x-api-key': 'Um2kMQz9MkXqMQCYh_-Bk7DuOHIP9rcJTuzqZ4OJ-5s',
    });
    let response = await fetch(url, { headers: header });
    let data = await response.json();
    if (response.status == 200) {
      if (data.total_hits == 0) {
        throw new Error('검색된 결과값이 없습니다.');
      }
      //   console.log('받은 데이터는', data);
      news = data.articles;
      console.log(news);
      render();
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    console.log('잡힌 에러는', error.message);
    errorRender(error.message);
  }
};

const getLatestNews = async () => {
  url = new URL(
    `https://api.newscatcherapi.com/v2/latest_headlines?countries=US&topic=business&page_size=5`
  );

  getNews();
};

const getNewsByTopic = async (event) => {
  console.log('클릭됨', event.target.textContent);
  let topic = event.target.textContent.toLowerCase();
  url = new URL(
    `https://api.newscatcherapi.com/v2/latest_headlines?countries=KR&page_size=5&topic=${topic}`
  );

  getNews();
};

const getNewsByKeyword = async () => {
  // 1. 검색 키워드 읽어오기
  // 2. URL에 검색 키워드 붙히기
  // 3. 헤더준비
  // 4. url 부르기
  // 5. 데이터 가져오기
  // 6. 데이터 보여주기

  let keyword = document.getElementById('search-input').value;
  url = new URL(
    `https://api.newscatcherapi.com/v2/search?q=${keyword}&page_size=5`
  );

  getNews();
};

const render = () => {
  let newsHTML = '';
  newsHTML = news
    .map((item) => {
      return `<div class="row news">
      <div class="col-lg-4">
        <img
          class="news-img-size"
          src="${item.media}"
        />
      </div>
      <div class="col-lg-8">
        <h2>${item.title}</h2>
        <p>${item.summary}</p>
        <div>${item.rights} * ${item.published_date}</div>
      </div>
    </div>`;
    })
    .join('');

  document.getElementById('news-board').innerHTML = newsHTML;
};

const errorRender = (message) => {
  let errorHTML = `<div class="alert alert-danger text-center" role="alert">
  ${message}
</div>`;
  document.getElementById('news-board').innerHTML = errorHTML;
};

searchButton.addEventListener('click', getNewsByKeyword);
getLatestNews();
