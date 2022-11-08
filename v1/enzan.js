//globalなfilesetを取得
var pipe_set;
exports.get_pipe_set = function (data) {
    pipe_set = data;
    console.log("pipe:", pipe_set);
}

exports.job = function (fuka) {
    delete fuka["dt"];
    console.log(fuka);
    gokei_fuka(fuka);
}

var FWc_fuka;//二次側負荷流量
var QWc_fuka;//二次側負荷熱量


function gokei_fuka(obj) {
    FWc_fuka = 0;
    QWc_fuka = 0;

    let n = Object.keys(obj).length / 3;
    for (let i = 0, l = n; i < l; i++) {
        let index = i + 1;
        let str = "fuka" + index + "_";
        let f = Number(obj[str + "F"]);
        let dt = Number(obj[str + "dt"]);
        let q = f * dt * 4.18605 / 1000;

        FWc_fuka += f;
        QWc_fuka += q;
    }
    console.log(FWc_fuka, QWc_fuka);
}

//1.入出力　片方なかったらセット　（同じになるモノ）ポンプ　冷凍機　熱交・・・
exports.in_out = function (idata) {
    //data, err_counter
    let data = idata["data"];
    let err_counter = idata["err_counter"];

    let kikis = ["Pump", "TR"];
    kikis.forEach(function (kiki) {
        if (data[kiki]) {
            let input_data = JSON.parse(JSON.stringify(data[kiki]));

            Object.keys(input_data).forEach(function (id) {
                let obj = input_data[id];
                //console.log(JSON.stringify(obj));

                //in の　F がある場合
                if (obj["in"] && obj["in"]["F"] != null) {
                    if (!(obj["out"] && obj["out"]["F"] != null)) {
                        if (!data[kiki][id]["out"]) {
                            data[kiki][id]["out"] = {};
                        }
                        data[kiki][id]["out"]["F"] = -obj["in"]["F"];
                    }
                }


                //out の　F がある場合
                if (obj["out"] && obj["out"]["F"] != null) {
                    //console.log("out F");
                    //in の　F　がない時
                    //obj["in"] = { F: 12 };
                    if (!(obj["in"] && obj["in"]["F"] != null)) {
                        if (!data[kiki][id]["in"]) {
                            data[kiki][id]["in"] = {};
                        }
                        data[kiki][id]["in"]["F"] = -obj["out"]["F"];
                    }
                }

            });

        }

    });


    //console.log(JSON.stringify(data));

    return {
        data: data,
        err_counter: err_counter
    };
}

//2.接続先　なかったらセット
exports.connect_to = function (idata, file_set) {
    let data = idata["data"];
    let data2 = JSON.parse(JSON.stringify(data));
    let err_counter = idata["err_counter"];

    let kikis = ["Pump", "Tee", "TR"];
    //let kikis = ["Pump"];

    kikis.forEach(function (kiki) {
        if (data[kiki]) {
            let input_data = JSON.parse(JSON.stringify(data[kiki]));
            let fs = file_set[kiki];
            //console.log(input_data);
            //console.log(fs);

            Object.keys(input_data).forEach(function (id) {
                let io = input_data[id];//{"in":{F:x,T:y},"out":{}}
                Object.keys(io).forEach(function (point) {
                    let bobj = io[point];//{F:x,T:y,P:z}
                    let key_from = kiki + "__" + id + "__" + point;

                    let k = fs.find((v) => v.id == id);
                    if (k) {
                        let target_key = "target_" + point;
                        let key_to = k[target_key];
                        //console.log(key_from, "--to--", key_to);
                        //console.log(bobj);
                        data2 = set_val(data, key_to, bobj);
                    }

                });

            });
        }
    });

    return {
        data: data2,
        err_counter: err_counter
    };
}

exports.sum_tee = function (idata, file_set) {
    let data = idata["data"];
    let data2 = JSON.parse(JSON.stringify(data));
    let err_counter = idata["err_counter"];

    if (data["Tee"]) {
        let Tee_data = JSON.parse(JSON.stringify(data["Tee"]));
        Object.keys(Tee_data).forEach(function (id) {
            let io = Tee_data[id];//{"in":{F:x,T:y},"out":{}}

            let point_num = Object.keys(io).length;
            //console.log(id, point_num);
            //point2個決まってたら残りはsum
            if (point_num == 2) {
                let sum_point = 0;
                let F = 0;
                Object.keys(io).forEach(function (point) {
                    sum_point += Number(point);
                    let bobj = io[point];
                    F += bobj["F"];
                });
                let rest_point = 3 - sum_point;
                console.log("Tee", id, rest_point, -F);
                data2["Tee"][id][String(rest_point)] = { F: -F };
            }
        })
    }


    return {
        data: data2,
        err_counter: err_counter
    };
}


function set_val(gdata, key, from_bobj) {
    let key_arr = key.split("__");
    let kiki = key_arr[0];
    let id = key_arr[1];
    let point = key_arr[2];
    if (!gdata[kiki]) {
        gdata[kiki] = {};
    }
    if (!gdata[kiki][id]) {
        gdata[kiki][id] = {};
    }
    if (!gdata[kiki][id][point]) {
        gdata[kiki][id][point] = {};
    }

    if (gdata[kiki][id][point]["F"] == null) {
        gdata[kiki][id][point]["F"] = -from_bobj["F"];
        console.log("set:", key);
    }
    return gdata;
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