// 1. データベースの初期化とファイル読み込み
let db = null;

async function loadFile(file) {
    const SQL = await initSqlJs({
        locateFile: file => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.6.2/${file}`
    });
    const arrayBuffer = await file.arrayBuffer();
    db = new SQL.Database(new Uint8Array(arrayBuffer));
    console.log("Database Loaded!");
    displayData();
}

// 2. データの表示（kvテーブルに特化）
function displayData() {
    const res = db.exec("SELECT key, value FROM kv");
    const container = document.getElementById('output');
    
    let html = '<table>';
    res[0].values.forEach(row => {
        html += `<tr>
            <td>${row[0]}</td>
            <td><input type="text" value='${row[1]}' onchange="updateRecord('${row[0]}', this.value)"></td>
        </tr>`;
    });
    html += '</table>';
    container.innerHTML = html;
}

// 3. データの書き換え（SQLのUPDATE文を実行）
function updateRecord(key, newValue) {
    db.run("UPDATE kv SET value = ? WHERE key = ?", [newValue, key]);
    console.log(`Updated ${key} to ${newValue}`);
}

// 4. 編集したDBをバイナリとして保存（ダウンロード）
function exportDB() {
    const binaryArray = db.export();
    const blob = new Blob([binaryArray], { type: 'application/octet-stream' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'jsb.sqlite';
    link.click();
}
