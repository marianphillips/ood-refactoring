const Showing = require('./showing')
const INVALID_DURATION = 'Invalid duration'
const INVALID_START_TIME = 'Invalid start time'
const INVALID_END_TIME = 'Invalid end time'
const INVALID_FILM = 'Invalid film'
const INVALID_SCREEN = 'Invalid screen'
const AFTER_MIDNIGHT = 'Invalid start time - film ends after midnight'
const CLEANING_TIME = 20

class WhatsOn {

    constructor(films, screens) {
        this.films = films
        this.screens = screens
    }

    checkValidTime(time) {
        return /^(\d?\d):(\d\d)$/.exec(time)
    }

    findEndTime() {
        return 1
    }

    //Add a showing for a specific film to a screen at the provided start time
    addShowing(movie, screenName, startTime) {
        if(!this.films.checkFilm(movie)) {
            return INVALID_FILM
        }

        if(!this.screens.checkScreen(screenName)) {
            return INVALID_SCREEN
        }

        let start = this.checkValidTime(startTime)
        if (start == null) {
            return INVALID_START_TIME
        }

        const intendedStartTimeHours = parseInt(start[1])
        const intendedStartTimeMinutes = parseInt(start[2])
        if (intendedStartTimeHours <= 0 || intendedStartTimeMinutes > 60) {
            return INVALID_START_TIME
        }


        //From duration, work out intended end time
        //if end time is over midnight, it's an error
        //Check duration

        let result = []
        for (let i = 0; i < this.films.length; i++) {
            if(this.films[i].name === movie){
        result.push(this.checkValidTime(this.films[i].duration))
        }
        }

        result.flat() 
        const durationHours = parseInt(result[1])
        const durationMins = parseInt(result[2])

        //Add the running time to the duration
        let intendedEndTimeHours = intendedStartTimeHours + durationHours

        //It takes 20 minutes to clean the screen so add on 20 minutes to the duration 
        //when working out the end time
        let intendedEndTimeMinutes = intendedStartTimeMinutes + durationMins + CLEANING_TIME
        if (intendedEndTimeMinutes >= 60) {
            intendedEndTimeHours += Math.floor(intendedEndTimeMinutes / 60)
            intendedEndTimeMinutes = intendedEndTimeMinutes % 60
        }

        if (intendedEndTimeHours >= 24) {
            return AFTER_MIDNIGHT
        }


        //Go through all existing showings for this film and make
        //sure the start time does not overlap 
        let error = false
        for (let j = 0; j < this.screens.length; j++) {
            const screen = this.screens[j]
            if (screen === screenName) {
        for (let i = 0; i < screen.showings.length; i++) {

            //Get the start time in hours and minutes
            const startTime = screen.showings[i].startTime
            let result2 = this.checkValidTime(startTime)
            if (result2 == null) {
                return INVALID_START_TIME
            }

            const startTimeHours = parseInt(result2[1])
            const startTimeMins = parseInt(result2[2])
            if (startTimeHours <= 0 || startTimeMins > 60) {
                return INVALID_START_TIME
            }

            //Get the end time in hours and minutes
            const endTime = screen.showings[i].endTime
            let result3 = this.checkValidTime(endTime)
            if (result3 == null) {
                return INVALID_END_TIME
            }

            const endTimeHours = parseInt(result3[1])
            const endTimeMins = parseInt(result3[2])
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
    }
}

        if (error) {
            return 'Time unavailable'
        }

        for (let j = 0; j < this.screens.length; j++) {
            const screen = this.screens[j]
            if (screen === screenName) {
        screen.showings.push(new Showing(film, startTime, intendedEndTimeHours, intendedEndTimeMinutes))
            }
        }
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

module.exports = WhatsOn