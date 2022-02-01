class Film {
    constructor(movieName,rating,duration) {
        this.name = movieName 
        this.rating = rating
        this.duration = duration
    }

    isFilmName(nameOfFilm) {
        return this.name === nameOfFilm
    }
}

module.exports = Film