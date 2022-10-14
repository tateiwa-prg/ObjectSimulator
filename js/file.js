
//#################GLOBAL start#################//
const fs = require('fs');
const csv = require('csv');

const filename_arr = ["Control", "Tee", "Pump"]
//#################GLOBAL end#################//

var file_obj = {};

filename_arr.forEach(function (filename) {

    let path = './ObjectSet/' + filename + '.csv';

    //json化 read
    fs.createReadStream(path).pipe(csv.parse({ columns: true }, function (err, data) {
        //console.log(err);
        //console.log(data);
        if (err == undefined) {
            file_obj[filename] = data;
        }
    }));

});

exports.file_set = function () {
    return file_obj;
}
