

//1.ポンプの入出力　片方なかったらセット
exports.in_out = function (data, err_counter) {

    let input_data = {};
    if (data["Pump"]) {
        input_data = JSON.parse(JSON.stringify(data["Pump"]));
    }
    //console.log(input_data);

    Object.keys(input_data).forEach(function (id) {
        let obj = input_data[id];
        //console.log(JSON.stringify(obj));

        //in の　F がある場合
        if (obj["in"] && obj["in"]["F"] != null) {
            if (!(obj["out"] && obj["out"]["F"] != null)) {
                if (!data["Pump"][id]["out"]) {
                    data["Pump"][id]["out"] = {};
                }
                data["Pump"][id]["out"]["F"] = -obj["in"]["F"];
            }
        }


        //out の　F がある場合
        if (obj["out"] && obj["out"]["F"] != null) {
            //console.log("out F");
            //in の　F　がない時
            //obj["in"] = { F: 12 };
            if (!(obj["in"] && obj["in"]["F"] != null)) {
                if (!data["Pump"][id]["in"]) {
                    data["Pump"][id]["in"] = {};
                }
                data["Pump"][id]["in"]["F"] = -obj["out"]["F"];
            }
        }

    });
    //console.log(JSON.stringify(data));

    return {
        data: data,
        err_counter: err_counter
    };
}
