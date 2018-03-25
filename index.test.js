const should = require('chai').should();
const interpolateArray = require('./index').default;
const data = [
    {
        x: 1,
        y: 1,
        z: 1
    },
    {
        x: 1,
        y: 2,
        z: 2
    },
    {
        x: 2,
        y: 1,
        z: 1.5
    },
    {
        x: 2,
        y: 2,
        z: 3.2
    }
];
describe('2d-bicubic-spline', () => {
    it('should return untouched array if n=0', () => {
        interpolateArray(data, 0).should.equal(data);
    });
    it('should interpolate given square 2d array', () => {
        interpolateArray(data, 4).should.have.lengthOf(36);
    });
    it('should return correct values', () => {
        interpolateArray(data, 7)[2].z.should.equal(1.125);
        interpolateArray(data, 7)[10].z.should.equal(1.1984375);
        interpolateArray(data, 12)[129].y.should.equal(1.6923076923076923);
    });
});