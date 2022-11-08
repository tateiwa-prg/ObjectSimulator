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
//const repeat_num = 1;
//const job_interval = 2 * 1000//ms
//var file_set;

/** 
setInterval(() => {
    job();
}, job_interval);
*/

async function job() {
    let file_set = file.file_set();
    if (file_set) {
        console.log("start calculate");
        enzan.get_pipe_set(file_set["pipe"]);

        for (let i = 0, l = file_set["fuka"].length; i < l; i++) {
            let row = file_set["fuka"][i];
            //console.log(row);
            let output_data = enzan.job(row);
        }
    } else {
        console.log("no file.");
        await common.await_function(1000);
        job();
    }
    /** 
    if (!file_set) {
        console.log("attempt to get fileset...");
        file_set = file.file_set();
        //console.log(file_set);
        enzan.get_pipe_set(file_set["pipe"]);
    } else {
        console.log("normal job");
        repeat_job();
    }
    */
}

job();
