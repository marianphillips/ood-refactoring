const Screen = require('./screen')
const Film = require('./film')
const Showing = require('./showing')
const MAX_NUM_SEATS = 100
const EXCEED_MAX_NUM_SEATS = 'Exceeded max capacity'
const INVALID_RATING = 'Invalid rating'
const INVALID_DURATION = 'Invalid duration'
const INVALID_START_TIME = 'Invalid start time'
const FILM_ALREADY_EXISTS = 'Film already exists'
const INVALID_END_TIME = 'Invalid end time'

class Cinema {

    constructor() {
        this.films = []
        this.screens = []
    }

    checkScreen(screenName) {
        for (let i = 0; i < this.screens.length; i++) {
          let screen = this.screens[i]
            if (screen.isScreenName(screenName)) {
                return true
            }
        }
        return false
    }

    //Add a new screen
    addScreen(screenName, capacity) {
        if (capacity > MAX_NUM_SEATS) {
            return EXCEED_MAX_NUM_SEATS
        }

        //Check the screen doesn't already exist
        if (this.checkScreen(screenName)) {
            return 'Screen already exists'
        }


        this.screens.push(new Screen(screenName, capacity))
    }

    checkFilm(movieName) {
      for (let i = 0; i < this.films.length; i++) {
        let film = this.films[i]
        if (film.isFilmName(movieName)) {
            return true
        }
    }
    return false
    }

    //Add a new film
    addFilm(movieName, rating, duration) {

        //Check the film doesn't already exist
            if (this.checkFilm(movieName)) {
                return FILM_ALREADY_EXISTS
            }

        //Check the rating is valid
        if (this.isNotRating(rating)) {
            return INVALID_RATING
        }

        //Check duration
        const result = this.checkValidTime(duration)
        if (result == null) {
            return INVALID_DURATION
        }

        const hours = parseInt(result[1])
        const mins = parseInt(result[2])
        if (hours <= 0 || mins > 60) {
            return INVALID_DURATION
        }

        this.films.push(new Film(movieName, rating, duration))
    }

    isNotRating(rating) {
        const array = ["U", "PG", "12", "15", "18"]
        return (!array.includes(rating))
    }

    checkValidTime(time) {
        return /^(\d?\d):(\d\d)$/.exec(time)
    }


    //Add a showing for a specific film to a screen at the provided start time
    addShowing(movie, screenName, startTime) {

        let result = this.checkValidTime(startTime)
        if (result == null) {
            return INVALID_START_TIME
        }

        const intendedStartTimeHours = parseInt(result[1])
        const intendedStartTimeMinutes = parseInt(result[2])
        if (intendedStartTimeHours <= 0 || intendedStartTimeMinutes > 60) {
            return INVALID_START_TIME
        }



        let film = null
            //Find the film by name
        for (let i = 0; i < this.films.length; i++) {
            if (this.films[i].name == movie) {
                film = this.films[i]
            }
        }

        if (film === null) {
            return 'Invalid film'
        }


        //From duration, work out intended end time
        //if end time is over midnight, it's an error
        //Check duration
        result = this.checkValidTime(film.duration)
        if (result == null) {
            return INVALID_DURATION
        }

        const durationHours = parseInt(result[1])
        const durationMins = parseInt(result[2])

        //Add the running time to the duration
        let intendedEndTimeHours = intendedStartTimeHours + durationHours

        //It takes 20 minutes to clean the screen so add on 20 minutes to the duration 
        //when working out the end time
        let intendedEndTimeMinutes = intendedStartTimeMinutes + durationMins + 20
        if (intendedEndTimeMinutes >= 60) {
            intendedEndTimeHours += Math.floor(intendedEndTimeMinutes / 60)
            intendedEndTimeMinutes = intendedEndTimeMinutes % 60
        }

        if (intendedEndTimeHours >= 24) {
            return 'Invalid start time - film ends after midnight'
        }

        //Find the screen by name
        let screen = null
        for (let i = 0; i < this.screens.length; i++) {
            if (this.screens[i].name == screenName) {
                screen = this.screens[i]
            }
        }

        if (screen === null) {
            return 'Invalid screen'
        }

        //Go through all existing showings for this film and make
        //sure the start time does not overlap 
        let error = false
        for (let i = 0; i < screen.showings.length; i++) {

            //Get the start time in hours and minutes
            const startTime = screen.showings[i].startTime
            result = this.checkValidTime(startTime)
            if (result == null) {
                return INVALID_START_TIME
            }

            const startTimeHours = parseInt(result[1])
            const startTimeMins = parseInt(result[2])
            if (startTimeHours <= 0 || startTimeMins > 60) {
                return INVALID_START_TIME
            }

            //Get the end time in hours and minutes
            const endTime = screen.showings[i].endTime
            result = this.checkValidTime(endTime)
            if (result == null) {
                return INVALID_END_TIME
            }

            const endTimeHours = parseInt(result[1])
            const endTimeMins = parseInt(result[2])
            if (endTimeHours <= 0 || endTimeMins > 60) {
                return INVALID_END_TIME
            }

            //if intended start time is between start and end
            const d1 = new Date()
            d1.setMilliseconds(0)
            d1.setSeconds(0)
            d1.setMinutes(intendedStartTimeMinutes)
            d1.setHours(intendedStartTimeHours)

            const d2 = new Date()
            d2.setMilliseconds(0)
            d2.setSeconds(0)
            d2.setMinutes(intendedEndTimeMinutes)
            d2.setHours(intendedEndTimeHours)

            const d3 = new Date()
            d3.setMilliseconds(0)
            d3.setSeconds(0)
            d3.setMinutes(startTimeMins)
            d3.setHours(startTimeHours)

            const d4 = new Date()
            d4.setMilliseconds(0)
            d4.setSeconds(0)
            d4.setMinutes(endTimeMins)
            d4.setHours(endTimeHours)

            if ((d1 > d3 && d1 < d4) || (d2 > d3 && d2 < d4) || (d1 < d3 && d2 > d4)) {
                error = true
                break
            }
        }

        if (error) {
            return 'Time unavailable'
        }

        screen.showings.push(new Showing(film, startTime, intendedEndTimeHours, intendedEndTimeMinutes))
    }

    allShowings() {
        let showings = {}
        for (let i = 0; i < this.screens.length; i++) {
            const screen = this.screens[i]
            for (let j = 0; j < screen.showings.length; j++) {
                const showing = screen.showings[j]
                if (!showings[showing.film.name]) {
                    showings[showing.film.name] = []
                }
                showings[showing.film.name].push(`${screen.name} ${showing.film.name} (${showing.film.rating}) ${showing.startTime} - ${showing.endTime}`)
            }
        }

        return showings
    }
}

module.exports = Cinema