const Screen = require('./screen')
const MAX_NUM_SEATS = 100
const EXCEED_MAX_NUM_SEATS = 'Exceeded max capacity'

class ScreenList {

    constructor() {
        this.list = []
    }

    checkScreen(screenName) {
        return this.list.find(film => film.isScreenName(screenName)) !== undefined
    }

   
    addScreen(screenName, capacity) {
        if (capacity > MAX_NUM_SEATS) {
            return EXCEED_MAX_NUM_SEATS
        }

        if (this.checkScreen(screenName)) {
            return 'Screen already exists'
        }
        
        this.list.push(new Screen(screenName, capacity))
    }
}

module.exports = ScreenList