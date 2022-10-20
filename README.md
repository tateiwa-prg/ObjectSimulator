# ObjectSimulator

## 使用方法
1. 設定ファイルの修正
2. 計算実行
3. 計算結果の確認

完成形は、コントローラがSPや運転機器の決定を自動で行なう（今は手動）

<br>

## 設定ファイル
保存場所↓↓↓↓
```
/ObjectSet
```

| ファイル名        | val                |
| ----------------- | ------------------ |
| Control.csv       | 調節計の設定       |
| Pump.csv          | ポンプの設定       |
| Tee.csv           | チーズの設定       |
| TR.csv            | ターボ冷凍機の設定 |
| update coming.csv | update coming...   |

<br>

### Control.csv
| key       | type  | 説明                    | 例              |
| --------- | ----- | ----------------------- | --------------- |
| id        | str   | 調節計のID              | t-1             |
| sub       | str   | コントロール対象物理量  | T, F, P, ・・・ |
| target    | str   | コントロール対象ID      | Pump__1__out    |
| SP        | float | 設定値                  | 123.4           |
| status_id | bool  | 調節計ONOFF条件の機器ID | Pump__1         |
 - F:流量調節計
   - run=true
     - PV=SPとする
   - run=false
     - PV=0
 - T:温度調節計
   - run=true
     - 流量あり
       - PV=SP
     - 流量なし
       - PV=前回値保持
   - run=false
     - 流量あり
       - PV=流れてくる方向の温度
     - 流量なし
       - PV=前回値保持
 - P:圧力調節計
   - coming soon...

<br>

### Tee.csv
![Tee](/image/Tee.png)
| key      | type | 説明                  | 例             |
| -------- | ---- | --------------------- | -------------- |
| id       | str  | チーズのID            | 1-3            |
| target_0 | str  | 接続ポイント0の接続先 | Pump__1__in    |
| target_1 | str  | 接続ポイント1の接続先 | Tee__1-5__0    |
| target_2 | str  | 接続ポイント2の接続先 | Pump__2-2__out |

<br>

### Pump.csv
![Tee](/image/Pump.png)
| key        | type  | 説明                  | 例          |
| ---------- | ----- | --------------------- | ----------- |
| id         | str   | ポンプのID            | 1-2         |
| TPE        | float | 定格消費電力          | 15.2        |
| TF         | float | 定格流量              | 123.4       |
| target_in  | str   | in側の接続先          | Tee__c2__2  |
| target_out | str   | out側の接続先         | Tee__1-5__0 |
| status     | bool  | 運転状態（temporary） | 0, 1        |

<br>

### TR.csv
![Tee](/image/TR.png)
| key        | type  | 説明                  | 例          |
| ---------- | ----- | --------------------- | ----------- |
| id         | str   | ターボ冷凍機のID      | 5           |
| TPE        | float | 定格消費電力          | 195.2       |
| TQc        | float | 定格能力              | 2.4         |
| SP_TWc_out | float | 冷水出口温度設定      | 7           |
| target_in  | str   | in側の接続先          | Tee__c2__2  |
| target_out | str   | out側の接続先         | Tee__1-5__0 |
| status     | bool  | 運転状態（temporary） | 0, 1        |

<br>

## 計算実行
main.bat ダブルクリック


<br>

## 結果の確認
保存場所↓↓↓↓
```
/Output
```
ファイル名：output_[epoc].csv

<br>

## デフォルト設定の系統図
![Def](/image/Def2.png)

