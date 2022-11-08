
//#################GLOBAL start#################//
const fs = require('fs');
const csv = require('csv');

const filename_arr = ["pipe", "fuka"]
//#################GLOBAL end#################//

var file_obj = {};

filename_arr.forEach(function (filename) {

    let path = './v1/set/' + filename + '.csv';

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
    let res = false;
    if (Object.keys(file_obj).length >= filename_arr.length) {
        res = file_obj;
    }
    return res;
}

const createCsvWriter = require('csv-writer').createObjectCsvWriter;

exports.make_csv = function (data) {
    //console.log("csv input data:", data);

    let output_file_path = "./Output/T" + (new Date()).getTime() + '.csv'
    let csvWriter = createCsvWriter({
        path: output_file_path,// 保存する先のパス(すでにファイルがある場合は上書き保存)
        header: csv_header,  // 出力する項目(ここにない項目はスキップされる)
        //encoding:'shift_jis',
    });

    let csv_data = [];
    Object.keys(data).forEach(function (kiki) {
        let obj = data[kiki];
        Object.keys(obj).forEach(function (id) {
            let io = obj[id];
            Object.keys(io).forEach(function (point) {
                let bobj = io[point];
                let wdata = {
                    kiki: kiki,
                    id: id,
                    point: point,
                    F: f = (bobj["F"] == null) ? 0 : bobj["F"],
                    T: f = (bobj["T"] == null) ? 0 : bobj["T"],
                    P: f = (bobj["P"] == null) ? 0 : bobj["P"],
                };
                csv_data.push(wdata);
            });
        });

    });
    //console.log(csv_data);
    csvWriter.writeRecords(csv_data).then(() => {
        console.log('done');
    });
}
const csv_header = [
    { id: 'kiki', title: 'kiki' },
    { id: 'id', title: 'id' },
    { id: 'point', title: 'point' },
    { id: 'F', title: 'F' },
    { id: 'T', title: 'T' },
    { id: 'P', title: 'P' },
];
