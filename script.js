let searchUrl = "http://www.omdbapi.com/?apikey=9f202434&s=";
let detailUrl = "http://www.omdbapi.com/?apikey=9f202434&i=";

let searchButton = document.querySelector('.search-button');


searchButton.addEventListener('click', async function() {
    try {
        inputKeyword = document.querySelector('.input-keyword');
        let movies = await getMovies(inputKeyword.value);
        updateUI(movies);
    } catch(err) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: err
        });
    }
});


// Get data from API
function getMovies(keyword) {
    let movies = fetch(searchUrl + keyword)
        .then(results => {
            if(!results.ok) {
                throw new Error(results.statusText);
            }
            return results.json();
        })
        .then(results => {
            if(results.Response === "False") {
                throw new Error(results.Error);
            }
            return results.Search;
        });

        return movies;
}


// Inject data to html elements
function updateUI(movies) {
    let cards = '';
    movies.map(movie => cards += showCards(movie));
    let content = document.querySelector('.content-movies');
    content.innerHTML = cards;
}


// Event binding
document.addEventListener('click', async function(el) {
    try {
        if(el.target.classList.contains('modal-button')) {
            let imdbId = el.target.dataset.imdbid;        
            let movieDetail = await getMovieDetail(imdbId);
            updateDetail(movieDetail);
        }
    } catch(err) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: err
        });
    }
});


// Get movie details
function getMovieDetail(imdbid) {
    let details = fetch(detailUrl + imdbid)
    .then(detail => {
        if(!detail.ok) {
            throw new Error(detail.statusText);
        }
        return detail.json();
    })
    .then(detail => {
        if(detail.Response === "False") {
            throw new Error(detail.Response);
        }
        return detail;
    });

    return details;
}

// Update detail
function updateDetail(details) {
    let movieDetail = showModal(details);
    let modalBody = document.querySelector('.modal-body');
    modalBody.innerHTML = movieDetail;
}



// Function show cards
function showCards(movie) {
    return `<div class="col-md-4 mx-auto">
                <div class="card">
                <img src="${movie.Poster}" class="card-img-top">
                <div class="card-body">
                    <h5 class="card-title">${movie.Title}</h5>
                    <h6 class="text-muted">${movie.Year}</h6>
                    <a href="#" class="btn btn-primary modal-button" data-bs-toggle="modal" data-bs-target="#modalDetail" data-imdbId="${movie.imdbID}">Show Details</a>
                </div>
                </div>
            </div>`;
}

// Function to show modal detail
function showModal(details) {
    return `<div class="container-fluid">
            <div class="row detail-contents">

            <div class="col-md-3">
                <img src="${details.Poster}" alt="" class="img-fluid">
            </div>

            <div class="col-md">
                <ul class="list-group">
                <li class="list-group-item"><h4>Title : ${details.Title} (${details.Year})</h4></li>
                <li class="list-group-item"><strong>Director : </strong>${details.Director}</li>
                <li class="list-group-item"><strong>Actors : </strong>${details.Actors}</li>
                <li class="list-group-item"><strong>Writer : </strong>${details.Writer}</li>
                <li class="list-group-item"><strong>Plot : </strong>${details.Plot}</li>
                </ul>
            </div>

            </div>
        </div>`;
}