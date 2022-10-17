// サーバー実装の前に、エラーハンドリングを記載します。
//これでサーバーはとりあえず落ちないけど、よろしくない
var error_counter = 0;
process.on('uncaughtException', function (err) {
    error_counter++;
    if (error_counter > 100000) {
        error_counter = 0;
    }
    console.log("#######Error!!!#######");
    console.log("#######error_counter:", error_counter);
    console.log(err);
    console.log("#######Error!!!#######");
});


console.log("hello");

const file = require('./file');
const common = require('./common');
const enzan = require('./enzan');
//const control_module = require('./control');
//const pump_module = require('./pump');
const repeat_num = 3;

var data;

first_job();

async function first_job() {
    console.log("waiting...");
    await common.await_function(1000);
    console.log("start...");
    let file_set = file.file_set();
    console.log(file_set);
    //console.log(JSON.stringify(file_set["Pump"]));
    //console.log(JSON.stringify(file_set["Tee"]));

    let c_res = enzan.first_F(file_set);
    console.log("control__err:", JSON.stringify(c_res["err_counter"]));
    if (c_res["err_counter"] == 0) {
        console.log(JSON.stringify(c_res["data"]));
        let repeat_res = repeat_job(file_set, c_res["data"]);

        file.make_csv(repeat_res["data"]);
    }
}

function repeat_job(file_set, data) {
    //1.入出力　片方なかったらセット　（同じになるモノ）
    //2.接続先　なかったらセット
    //3.チーズ　残り1個ならセット

    let wdata = {
        data: JSON.parse(JSON.stringify(data)),
        err_counter: 0,
    };

    for (let i = 0, l = repeat_num; i < l; i++) {
        wdata = enzan.in_out(wdata);
        wdata = enzan.connect_to(wdata, file_set);
        wdata = enzan.sum_tee(wdata, file_set);
        console.log("Repeat" + i + ":", JSON.stringify(wdata["data"]));
    }


    //console.log(JSON.stringify(wdata["data"]));

    return wdata;
}