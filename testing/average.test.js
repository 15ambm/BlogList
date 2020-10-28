
const average = require('../utils/for_testing').average

describe('average', () => {
    test('one value array has average equal to itself', () => {
        const result = average([5])
        expect(result).toBe(5)
    })
    test('multi value array has correct average', () => {
        const result = average([1,2,3,4,5,6])
        expect(result).toBe(3.5)
    })
    test('empty array is 0', () => {
        const result = average([])
        expect(result).toBe(0)
    })

})