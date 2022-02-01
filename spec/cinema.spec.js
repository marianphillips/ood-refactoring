const Cinema = require("../src/cinema")
const Film = require("../src/film")
const FilmList = require("../src/filmlist")
const ScreenList = require("../src/screenlist")

let screens = new ScreenList()
screens.addScreen("Screen #1", 20)
screens.addScreen("Screen #2", 20)


describe("Cinema", () => {
    let cinema

    beforeEach(() => {
        cinema = new Cinema(screens.list)
    })

    it("adds new films", () => {
        cinema.addFilm("Nomad Land", "12", "1:48")
        cinema.addFilm("The Power of the Dog", "15", "2:08")

        const expected = [new Film("Nomad Land", "12", "1:48"), new Film("The Power of the Dog", "15", "2:08")]

        expect(cinema.films).toEqual(expected)
    })

    it("returns error trying to create duplicate film", () => {
        cinema.addFilm("Nomad Land", "12", "1:48")
        const result = cinema.addFilm("Nomad Land", "15", "2:08")

        const expected = "Film already exists"

        expect(result).toEqual(expected)
    })

    it("returns error trying to create film with invalid rating", () => {
        const invalidRatings = ["20", "0", "UUU"]
        const validRatings = ["U", "PG", "12", "15", "18"]

        for (const invalidRating of invalidRatings) {
            const result = cinema.addFilm("Invalid film", invalidRating, "2:08")
            const expected = "Invalid rating"
            expect(result).toEqual(expected)
        }

        for (const validRating of validRatings) {
            const result = cinema.addFilm("Film " + validRating, validRating, "2:08")
            expect(result).toBeUndefined()
        }
    })

    it("returns error trying to create film with invalid durations", () => {
        const invalidDurations = ["0:00", "abc", "4", "1:61", "1:1"]

        for (const duration of invalidDurations) {
            cinema = new Cinema()
            const result = cinema.addFilm("Film", "12", duration)
            const expected = "Invalid duration"
            expect(result).withContext(duration).toEqual(expected)
        }
    })

    it("returns error trying to schedule showing when film does not exist", () => {
        cinema.addFilm("Film1", "12", "1:20")
        const expected = "Invalid film"
        const result = cinema.addShowing("Film doesnt exist!", "Screen #1", "10:00")
        expect(result).toBe(expected)
    })

    it("returns error trying to schedule showing when screen does not exist", () => {
        cinema.addFilm("Film1", "12", "1:20")
        const expected = "Invalid screen"
        const result = cinema.addShowing("Film1", "Screen Doesnt exist", "10:00")
        expect(result).toBe(expected)
    })

    it("schedules single film", () => {
        cinema.addFilm("Film1", "12", "1:20")
        const expected = {
            "Film1": [
                "Screen #1 Film1 (12) 10:00 - 11:40"
            ]
        }

        cinema.addShowing("Film1", "Screen #1", "10:00")

        const result = cinema.allShowings()
        expect(result).toEqual(expected)
    })

    it("schedules same film on same screen", () => {
        cinema.addFilm("Film1", "12", "1:20")

        const expected = {
            "Film1": [
                "Screen #1 Film1 (12) 10:00 - 11:40",
                "Screen #1 Film1 (12) 12:10 - 13:50"
            ]
        }

        cinema.addShowing("Film1", "Screen #1", "10:00")
        cinema.addShowing("Film1", "Screen #1", "12:10")

        const result = cinema.allShowings()
        expect(result).toEqual(expected)
    })

    it("schedules same film on multiple screens", () => {
        cinema.addFilm("Film1", "12", "1:20")

        const expected = {
            "Film1": [
                "Screen #1 Film1 (12) 10:00 - 11:40",
                "Screen #2 Film1 (12) 10:00 - 11:40"
            ]
        }

        cinema.addShowing("Film1", "Screen #1", "10:00")
        cinema.addShowing("Film1", "Screen #2", "10:00")

        const result = cinema.allShowings()
        expect(result).toEqual(expected)
    })

    it("schedules multiple films on multiple screens", () => {
        cinema.addFilm("Film1", "12", "1:20")
        cinema.addFilm("Film2", "15", "2:00")

        const expected = {
            "Film1": [
                "Screen #1 Film1 (12) 10:00 - 11:40",
                "Screen #2 Film1 (12) 12:00 - 13:40"
            ],
            "Film2": [
                "Screen #1 Film2 (15) 12:00 - 14:20",
                "Screen #2 Film2 (15) 09:00 - 11:20"
            ]
        }

        cinema.addShowing("Film1", "Screen #1", "10:00")
        cinema.addShowing("Film1", "Screen #2", "12:00")

        cinema.addShowing("Film2", "Screen #1", "12:00")
        cinema.addShowing("Film2", "Screen #2", "09:00")


        const result = cinema.allShowings()
        expect(result).toEqual(expected)
    })

    it("returns error when film screening overlaps start", () => {
        cinema.addFilm("Film1", "12", "1:00")

        cinema.addShowing("Film1", "Screen #1", "10:00")
        const result = cinema.addShowing("Film1", "Screen #1", "11:00")
        const expected = 'Time unavailable'
        expect(result).toEqual(expected)
    })

    it("returns error when film screening overlaps end", () => {
        cinema.addFilm("Film1", "12", "1:00")

        cinema.addShowing("Film1", "Screen #1", "10:00")
        const result = cinema.addShowing("Film1", "Screen #1", "09:10")
        const expected = 'Time unavailable'
        expect(result).toEqual(expected)
    })

    it("returns error when film screening overlaps all", () => {
        cinema.addFilm("Film1", "12", "1:00")
        cinema.addFilm("Film2", "12", "4:00")

        cinema.addShowing("Film1", "Screen #1", "10:00")
        const result = cinema.addShowing("Film2", "Screen #1", "08:30")
        const expected = 'Time unavailable'
        expect(result).toEqual(expected)
    })
})