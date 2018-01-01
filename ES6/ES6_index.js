import spline from 'cubic-spline';
import splitArray from 'split-array';

export default function interpolateArray(data, n) {
    //interploation of simple row or column
    function interpoalateDirection(axis, Z, n) {
        let ZNew = [];
        for (let i = 0; i < Z.length - 1; i++) {
            ZNew.push(Z[i]);
            for (let j = 0; j < n; j++) {
                ZNew.push(spline(axis[i] + (axis[i + 1] - axis[i]) / (n + 1) * (j + 1), axis, Z));
            }
        }
        ZNew.push(Z[Z.length - 1]);
        return ZNew;
    }
    //interpolate arguments array (axis)
    function interpolateAxis(axis, n) {
        let newAxis = [];
        for (let i = 0; i < axis.length - 1; i++) {
            newAxis.push(axis[i]);
            for (let j = 0; j < n; j++) {
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

    data.sort((a, b) => {
        //sort firstly by 1st column, if equal then sort by second column
        return a.x - b.x || a.y - b.y;
    });


    //dissasemble object
    let X = [];
    let Y = [];
    let Z = [];
    let X2 = [];
    let Y2 = [];
    let Z2 = [];
    let Z3 = [];
    let dataInt = [];
    data.map((record) => {
        if (X.indexOf(record.x) === -1) {
            X.push(record.x)
        }
        return (record);
    });
    data.map((record) => {
        if (Y.indexOf(record.y) === -1) {
            Y.push(record.y)
        }
        return (record);
    });
    data.map((record) => {
        if (Z.indexOf(record.z) === -1) {
            Z.push(record.z)
        }
        return record.z;
    })
    Z = splitArray(Z, X.length);

    //interpolate along columns
    let interpColumns = [];
    for (let i = 0; i < Y.length; i++) {
        let tempZ = [];
        for (let j = 0; j < X.length; j++) {
            tempZ.push(Z[i][j]);
        }
        interpColumns.push(interpoalateDirection(X, tempZ, n));
    }

    //interpolate along rows
    for (let i = 0; i < interpColumns[0].length; i++) {
        let row = [];
        for (let j = 0; j < interpColumns.length; j++) {
            row.push(interpColumns[j][i]);
        }
        Z2.push(row);
    }
    Z3 = Z2.map(row => {
        return (interpoalateDirection(Y, row, n));
    });

    //interpolate arguments x and y
    X2 = interpolateAxis(X, n);
    Y2 = interpolateAxis(Y, n);

    //assemble data object
    for (let x = 0; x < X2.length; x++) {
        for (let y = 0; y < Y2.length; y++) {
            dataInt.push({
                x: X2[x],
                y: Y2[y],
                z: Z3[y][x]
            });
        }
    }
    
    return dataInt;
    
};