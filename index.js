Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = interpolateArray;
var _cubicSpline = require('cubic-spline');
var _cubicSpline2 = _interopRequireDefault(_cubicSpline);
var _splitArray = require('split-array');
var _splitArray2 = _interopRequireDefault(_splitArray);
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function interpolateArray(data, n) {
    //interploation of simple row or column
    function interpoalateDirection(axis, Z, n) {
        var ZNew = [];
        for (var i = 0; i < Z.length - 1; i++) {
            ZNew.push(Z[i]);
            for (var j = 0; j < n; j++) {
                ZNew.push((0, _cubicSpline2.default)(axis[i] + (axis[i + 1] - axis[i]) / (n + 1) * (j + 1), axis, Z));
            }
        }
        ZNew.push(Z[Z.length - 1]);
        return ZNew;
    }
    //interpolate arguments array (axis)
    function interpolateAxis(axis, n) {
        var newAxis = [];
        for (var i = 0; i < axis.length - 1; i++) {
            newAxis.push(axis[i]);
            for (var j = 0; j < n; j++) {
                newAxis.push(axis[i] + (axis[i + 1] - axis[i]) / (n + 1) * (j + 1));
            }
        }
        newAxis.push(axis[axis.length - 1]);
        return newAxis;
    }
    /*data = [
        {x: x1, y:y1, z:z1},
        {x: xn, y:yn, z:zn}
    ];
    n is a number of points, that will be inserted between data points
    */
    //sort data firstly by x and then by y
    data.sort(function (a, b) {
        //sort firstly by 1st column, if equal then sort by second column
        return a.x - b.x || a.y - b.y;
    });
    //dissasemble object
    var X = [];
    var Y = [];
    var Z = [];
    var X2 = [];
    var Y2 = [];
    var Z2 = [];
    var Z3 = [];
    var dataInt = [];
    data.map(function (record) {
        if (X.indexOf(record.x) === -1) {
            X.push(record.x);
        }
        return record;
    });
    data.map(function (record) {
        if (Y.indexOf(record.y) === -1) {
            Y.push(record.y);
        }
        return record;
    });
    data.map(function (record) {
        if (true) {
            Z.push(record.z);
        }
        return record.z;
    });
    Z = (0, _splitArray2.default)(Z, Y.length);
    //interpolate along columns
    var interpColumns = [];
    for (var i = 0; i < Y.length; i++) {
        var tempZ = [];
        for (var j = 0; j < X.length; j++) {
            tempZ.push(Z[j][i]);
        }
        interpColumns.push(interpoalateDirection(X, tempZ, n));
    }
    //interpolate along rows
    for (var _i = 0; _i < interpColumns[0].length; _i++) {
        var row = [];
        for (var _j = 0; _j < interpColumns.length; _j++) {
            row.push(interpColumns[_j][_i]);
        }
        Z2.push(row);
    }
    Z3 = Z2.map(function (row) {
        return interpoalateDirection(Y, row, n);
    });
    //interpolate arguments x and y
    X2 = interpolateAxis(X, n);
    Y2 = interpolateAxis(Y, n);
    //assemble data object
    for (var y = 0; y < Y2.length; y++) {
        for (var x = 0; x < X2.length; x++) {
            dataInt.push({
                x: X2[x],
                y: Y2[y],
                z: Z3[x][y]
            });
        }
    }
    if (n===0) {
        return data;
    } else {
        return dataInt;
    }
};