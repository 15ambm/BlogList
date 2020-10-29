
const { TestScheduler } = require('jest')
const listHelper = require('../utils/list_helper')

test('dummy returns one ', () => {
    const result = listHelper.dummy([1,2])
    expect(result).toBe(1)
})