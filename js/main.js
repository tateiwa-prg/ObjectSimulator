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
const control_module = require('./control');
const pump_module = require('./pump');
const repeat_num = 1;

var data;

first_job();

async function first_job() {
    console.log("waiting...");
    await common.await_function(1000);
    console.log("start...");
    let file_set = file.file_set();
    console.log(file_set);

    let c_res = control_module.first_F(file_set);
    console.log("control__err:", JSON.stringify(c_res["err_counter"]));
    if (c_res["err_counter"] == 0) {
        console.log(JSON.stringify(c_res["data"]));

        let repeat_res = repeat_job(file_set, c_res["data"]);
        //console.log(JSON.stringify(repeat_res["data"]));
    }

}

function repeat_job(file_set, data) {
    //1.ポンプの入出力　片方なかったらセット
    //2.接続先　なかったらセット
    //3.チーズ　残り1個ならセット

    let err_counter = 0;

    for (let i = 0, l = repeat_num; i < l; i++) {
        let pump_inout = pump_module.in_out(data, err_counter);
        console.log(JSON.stringify(pump_inout));
        err_counter = pump_inout["err_counter"];

    }


    console.log(err_counter);

}