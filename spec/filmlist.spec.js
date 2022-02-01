const Film = require("../src/film")
const FilmList = require("../src/filmlist")

describe("FilmList", () => {
    let films

    beforeEach(() => {
        films = new FilmList()
    })

    it("adds new films", () => {
        films.addFilm("Nomad Land", "12", "1:48")
        films.addFilm("The Power of the Dog", "15", "2:08")

        const expected = [new Film("Nomad Land", "12", "1:48"), new Film("The Power of the Dog", "15", "2:08")]

        expect(films.list).toEqual(expected)
    })

    it("returns error trying to create duplicate film", () => {
        films.addFilm("Nomad Land", "12", "1:48")
        const result = films.addFilm("Nomad Land", "15", "2:08")

        const expected = "Film already exists"

        expect(result).toEqual(expected)
    })

    it("returns error trying to create film with invalid rating", () => {
        const invalidRatings = ["20", "0", "UUU"]
        const validRatings = ["U", "PG", "12", "15", "18"]

        for (const invalidRating of invalidRatings) {
            const result = films.addFilm("Invalid film", invalidRating, "2:08")
            const expected = "Invalid rating"
            expect(result).toEqual(expected)
        }

        for (const validRating of validRatings) {
            const result = films.addFilm("Film " + validRating, validRating, "2:08")
            expect(result).toBeUndefined()
        }
    })

    it("returns error trying to create film with invalid durations", () => {
        const invalidDurations = ["0:00", "abc", "4", "1:61", "1:1"]

        for (const duration of invalidDurations) {
            films = new FilmList()
            const result = films.addFilm("Film", "12", duration)
            const expected = "Invalid duration"
            expect(result).withContext(duration).toEqual(expected)
        }
    })

})