exports.await_function = function (ms) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(true);
        }, ms);
    })
}

//配列分割
exports.sliceByNumber = function (array, number) {
    const length = Math.ceil(array.length / number);
    return new Array(length).fill().map((_, i) =>
        array.slice(i * number, (i + 1) * number)
    );
}
