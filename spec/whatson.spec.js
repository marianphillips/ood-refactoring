const WhatsOn = require("../src/whatson")
const FilmList = require("../src/filmlist")
const ScreenList = require("../src/screenlist")

let screens = new ScreenList()
screens.addScreen("Screen #1", 20)
screens.addScreen("Screen #2", 20)

let films = new FilmList()
films.addFilm("Film1", "12", "1:20")
films.addFilm("Film2", "15", "2:00")

describe("WhatsOn", () => {
    let whatson

    beforeEach(() => {
        whatson = new WhatsOn(films, screens)
    })


    it("returns error trying to schedule showing when film does not exist", () => {
        const expected = "Invalid film"
        const result = whatson.addShowing("Film doesnt exist!", "Screen #1", "10:00")
        expect(result).toBe(expected)
    })

    it("returns error trying to schedule showing when screen does not exist", () => {
        const expected = "Invalid screen"
        const result = whatson.addShowing("Film1", "Screen Doesnt exist", "10:00")
        expect(result).toBe(expected)
    })

    it("schedules single film", () => {
        const expected = {
            "Film1": [
                "Screen #1 Film1 (12) 10:00 - 11:40"
            ]
        }
        whatson.addShowing("Film1", "Screen #1", "10:00")
        const result = whatson.allShowings()
        expect(result).toEqual(expected)
    })

    it("schedules same film on same screen", () => {
        const expected = {
            "Film1": [
                "Screen #1 Film1 (12) 10:00 - 11:40",
                "Screen #1 Film1 (12) 12:10 - 13:50"
            ]
        }

        whatson.addShowing("Film1", "Screen #1", "10:00")
        whatson.addShowing("Film1", "Screen #1", "12:10")

        const result = whatson.allShowings()
        console.log(result)
        expect(result).toEqual(expected)
    })

    it("schedules same film on multiple screens", () => {
        const expected = {
            "Film1": [
                "Screen #1 Film1 (12) 10:00 - 11:40",
                "Screen #2 Film1 (12) 10:00 - 11:40"
            ]
        }

        whatson.addShowing("Film1", "Screen #1", "10:00")
        whatson.addShowing("Film1", "Screen #2", "10:00")

        const result = whatson.allShowings()
        expect(result).toEqual(expected)
    })

    it("schedules multiple films on multiple screens", () => {
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

        whatson.addShowing("Film1", "Screen #1", "10:00")
        whatson.addShowing("Film1", "Screen #2", "12:00")

        whatson.addShowing("Film2", "Screen #1", "12:00")
        whatson.addShowing("Film2", "Screen #2", "09:00")


        const result = whatson.allShowings()
        console.log(result)
        expect(result).toEqual(expected)
    })

    it("returns error when film screening overlaps start", () => {
        whatson.addShowing("Film1", "Screen #1", "10:00")
        const result = whatson.addShowing("Film1", "Screen #1", "11:00")
        const expected = 'Time unavailable'
        expect(result).toEqual(expected)
    })

    it("returns error when film screening overlaps end", () => {
        whatson.addShowing("Film1", "Screen #1", "10:00")
        const result = whatson.addShowing("Film1", "Screen #1", "09:10")
        const expected = 'Time unavailable'
        expect(result).toEqual(expected)
    })

    it("returns error when film screening overlaps all", () => {
        whatson.addShowing("Film1", "Screen #1", "10:00")
        const result = whatson.addShowing("Film2", "Screen #1", "08:30")
        const expected = 'Time unavailable'
        expect(result).toEqual(expected)
    })
})