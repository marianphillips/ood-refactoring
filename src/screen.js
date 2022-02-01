class Screen {
    constructor(screenName, capacity) {
        this.name = screenName
        this.capacity = capacity
        this.showings = []
    }

    isScreenName(nameOfScreen) {
        return this.name === nameOfScreen
    }
}


module.exports = Screen