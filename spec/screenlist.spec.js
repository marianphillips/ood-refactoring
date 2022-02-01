const Screen = require("../src/screen")
const ScreenList = require("../src/screenlist")

describe("ScreenList", () => {
    let screens

    beforeEach(() => {
        screens = new ScreenList()
    })

    it("creates new screens", () => {
        screens.addScreen("Screen 1", 20)
        screens.addScreen("Screen 2", 25)
        const screen1 = new Screen("Screen 1", 20)
        const screen2 = new Screen("Screen 2", 25)
        const expected = [screen1, screen2]

        expect(screens.list).toEqual(expected)
    })

    it("returns error trying to create duplicate screen", () => {
        screens.addScreen("Screen 1", 20)
        const result = screens.addScreen("Screen 1", 25)

        const expected = "Screen already exists"

        expect(result).toEqual(expected)
    })

    it("returns error trying to create screen with over max capacity", () => {
        const result = screens.addScreen("Screen 1", 110)

        const expected = 'Exceeded max capacity'

        expect(result).toEqual(expected)
    })

})