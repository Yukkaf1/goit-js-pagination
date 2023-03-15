import './css/styles.css';
import _debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import axios from 'axios';
import geoWeatherApp from './appWeather';
import searchPagination from './paginator';



const BASE_URL = 'https://pixabay.com/api/';
const KEY = '33761438-9314d2b90b41fb92b07a88ae9';

const lightbox = new SimpleLightbox('.gallery a', {
    captionsData: 'alt',
    captionDelay: 500,
  });

let page = 1;

  const inputForm = document.querySelector('input');
  const loadBtn = document.querySelector('#load-more');
  const searchForm = document.querySelector('#search-form');
  const gallery = document.querySelector('.gallery');

  async function fetchPicture(clientRequest, page) {

      try {
      return axios.get(
       `${ BASE_URL}/?key=${KEY}&q=${clientRequest}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=40`
  )}
  catch (error) {
    console.log('ERROR: ' , error);
}

//   .then(responce => {
//     console.log(responce);
//     return responce;
//   })
//   .catch(error => {
//     console.log('ERROR: ' + error);
//   });

};

function onSearch(event) {
    event.preventDefault();
    gallery.innerHTML = '';
    // loadBtn.classList.add('is-hidden');
    
    const input = inputForm.value.trim();
    if (input.length !== 0) {
      page = 1;
      fetchPicture(input, page)
        .then(renderGallery)
        .catch(error => {});
    }
  };

  function renderGallery(images) {
    // let totalPage = images.data.totalHits/40;  
    // loadBtn.classList.remove('is-hidden');

    // if (images.data.totalHits === 0) {
    //   Notiflix.Notify.failure(
    //     'Sorry, there are no images matching your search query. Please try again.'
    //   );
    //   gallery.innerHTML = '';
    // }
    // if (images.data.totalHits !== 0) {
    //   Notiflix.Notify.success(`Hooray! We found ${images.data.totalHits} images.`);
      const markup = images.data.hits
        .map(
          ({
            largeImageURL,
            webformatURL,
            tags,
            likes,
            views,
            comments,
            downloads,
          }) => {
            return `
                <div class="photo-card">
                <a href='${largeImageURL}'><img src="${webformatURL}" alt="${tags}" loading="lazy" width=310 height=205/></a>
                <div class="info">
                  <p class="info-item"><b>Likes</b>${likes}</p>
                  <p class="info-item"><b>Views</b>${views}</p>
                  <p class="info-item"><b>Comments</b>${comments}</p>
                  <p class="info-item"><b>Downloads</b>${downloads}</p>
                </div>
              </div>`;
          }
        )
        .join('');
      gallery.insertAdjacentHTML('beforeend', markup);
      lightbox.refresh();
    //   loadBtn.classList.remove('is-hidden');
    // }
    // if (page > totalPage) {
    //     loadBtn.classList.add('is-hidden'); 
    // }
  }


  // function loadGallery(images) {
  //   let totalPage = images.data.totalHits/40;  

  //   if (images.data.totalHits !== 0) {
  //     Notiflix.Notify.success(`Hooray! We found ${images.data.totalHits} images.`);
  //     const markup = images.data.hits
  //       .map(
  //         ({
  //           largeImageURL,
  //           webformatURL,
  //           tags,
  //           likes,
  //           views,
  //           comments,
  //           downloads,
  //         }) => {
  //           return `
  //               <div class="photo-card">
  //               <a href='${largeImageURL}'><img src="${webformatURL}" alt="${tags}" loading="lazy" width=310 height=205/></a>
  //               <div class="info">
  //                 <p class="info-item"><b>Likes</b>${likes}</p>
  //                 <p class="info-item"><b>Views</b>${views}</p>
  //                 <p class="info-item"><b>Comments</b>${comments}</p>
  //                 <p class="info-item"><b>Downloads</b>${downloads}</p>
  //               </div>
  //             </div>`;
  //         }
  //       )
  //       .join('');
  //     gallery.insertAdjacentHTML('beforeend', markup);
  //     lightbox.refresh();
  //       }
  //       if (page > totalPage) {
  //           Notiflix.Notify.warning("We're sorry, but you've reached the end of search results.")
  //           loadBtn.classList.add('is-hidden')}
  // }

  // function onLoadBtn(images) {
  //   const input = inputForm.value.trim();
  //     fetchPicture(input, (page += 1))
  //       .then(loadGallery)
  //       .catch(error => {});
  // }
  
  // loadBtn.addEventListener('click', onLoadBtn)

  searchForm.addEventListener('submit', onSearch);



// ------------------------- Paginator --------------------------

// async function getData() {
//   const response = await fetch('https://jsonplaceholder.typicode.com/posts');
//   const data = await response.json();
//   return data;
// }

async function main() {
  const postsData = await fetchPicture();
  let currentPage = 1;


  // function displayList(arrData, rowPerPage, page) {
  //   const postsEl = document.querySelector('.posts');
  //   postsEl.innerHTML = "";
  //   page--;

  //   const start = rowPerPage * page;
  //   const end = start + rowPerPage;
  //   const paginatedData = arrData.slice(start, end);

  //   paginatedData.forEach((el) => {
  //     const postEl = document.createElement("div");
  //     postEl.classList.add("post");
  //     postEl.innerText = `${el.title}`;
  //     postsEl.appendChild(postEl);
  //   })
  // }

  function displayPagination() {
    const paginationEl = document.querySelector('.pagination');
    const pagesCount = 5;
    const ulEl = document.createElement("ul");
    ulEl.classList.add('pagination__list');

    for (let i = 0; i < pagesCount; i++) {
      const liEl = displayPaginationBtn(i + 1);
      ulEl.appendChild(liEl)
    }
    paginationEl.appendChild(ulEl)
  }

  function displayPaginationBtn(page) {
    const liEl = document.createElement("li");
    liEl.classList.add('pagination__item')
    liEl.innerText = page

    if (currentPage == page) liEl.classList.add('pagination__item--active');

    liEl.addEventListener('click', () => {
      currentPage = page
      displayList(postsData, rows, currentPage)

      let currentItemLi = document.querySelector('li.pagination__item--active');
      currentItemLi.classList.remove('pagination__item--active');

      liEl.classList.add('pagination__item--active');
    })

    return liEl;
  }

  // displayList(postsData, rows, currentPage);
  displayPagination();
}

main();