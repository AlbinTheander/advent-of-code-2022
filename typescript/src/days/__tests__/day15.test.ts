import { removeSpanFromSingleSpan } from "../day15"

describe('day15', () => {
    test('removeSingleSpan do good things', ()=> {
        expect(removeSpanFromSingleSpan([10, 20], [0,9])).toEqual([[10, 20]])
        expect(removeSpanFromSingleSpan([10, 20], [21, 30])).toEqual([[10, 20]])
        expect(removeSpanFromSingleSpan([10, 20], [5, 15])).toEqual([[16, 20]])
        expect(removeSpanFromSingleSpan([10, 20], [15, 25])).toEqual([[10, 14]])
        expect(removeSpanFromSingleSpan([10, 20], [13, 17])).toEqual([[10, 12], [18, 20]])
        expect(removeSpanFromSingleSpan([10, 20], [10, 12])).toEqual([[13, 20]])
        expect(removeSpanFromSingleSpan([10, 20], [10, 10])).toEqual([[11, 20]])
        expect(removeSpanFromSingleSpan([10, 20], [18, 20])).toEqual([[10, 17]])
        expect(removeSpanFromSingleSpan([10, 20], [20, 20])).toEqual([[10, 19]])
        expect(removeSpanFromSingleSpan([10, 20], [5, 22])).toEqual([])
        expect(removeSpanFromSingleSpan([10, 20], [10, 20])).toEqual([])
    })
})