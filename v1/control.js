
exports.first_F = function (file_set) {

    //最初に流量調節計の値をセットする
    let c = set_F(file_set);

    return c;
}

function set_F(file_set) {
    let err_counter = 0;
    let res = {};

    let Control = file_set["Control"];
    Control.forEach(function (obj) {
        let target = obj["target"];
        let arr = target.split("__");
        let kiki = arr[0];
        let kiki_id = arr[1];
        let kiki_con = arr[2];
        let sub = obj["sub"];

        //console.log(arr, sub);

        if (sub == "F" && file_set[kiki]) {
            let kiki_arr = file_set[kiki];

            let k = kiki_arr.find((v) => v.id == kiki_id);
            //console.log(k);
            if (k) {
                if (!res[kiki]) res[kiki] = {};
                if (!res[kiki][kiki_id]) res[kiki][kiki_id] = {};
                if (!res[kiki][kiki_id][kiki_con]) res[kiki][kiki_id][kiki_con] = {};

                let rsp = obj["SP"];
                let status = k["status"];
                let sp = decide_sp(sub, status, rsp);

                res[kiki][kiki_id][kiki_con][sub] = sp;

            } else {
                err_counter++;
            }

        } else {
            err_counter++;
        }

    });

    return {
        "data": res,
        "err_counter": err_counter,
    };
}

function decide_sp(sub, status, rsp) {
    //console.log(sub, status, rsp);
    let sp = 0;
    if (sub == "F") {
        if (status == "1") {
            sp = rsp;
        }
    }
    return sp;
}