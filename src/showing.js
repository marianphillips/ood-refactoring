class Showing {
    constructor(film, startTime, endHour, endMin) {
            this.film = film,
            this.startTime = startTime,
            this.endTime = endHour + ":" + endMin
    }
}

module.exports = Showing