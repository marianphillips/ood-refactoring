const Film = require("../src/film")
const INVALID_RATING = 'Invalid rating'
const INVALID_DURATION = 'Invalid duration'
const FILM_ALREADY_EXISTS = 'Film already exists'
const RATINGS = ["U", "PG", "12", "15", "18"]

class FilmList {
    constructor() {
        this.list = []
    }

    checkFilm(movieName) {
        return this.list.find(movie => movie.isFilmName(movieName)) !== undefined
      }
  
      addFilm(movieName, rating, duration) {
  
        if (this.checkFilm(movieName)) {
            return FILM_ALREADY_EXISTS
        }
  
        if (this.isNotRating(rating)) {
            return INVALID_RATING
        }
  
        const result = this.checkValidTime(duration)
        if (result == null) {
            return INVALID_DURATION
        }
  
        const hours = parseInt(result[1])
        const mins = parseInt(result[2])
        if (hours <= 0 || mins > 60) {
        return INVALID_DURATION
        }
  
          this.list.push(new Film(movieName, rating, duration))
      }
  
      isNotRating(rating) { 
          return !RATINGS.includes(rating)
      }
  
      checkValidTime(time) {
          return /^(\d?\d):(\d\d)$/.exec(time)
      }
}

module.exports = FilmList