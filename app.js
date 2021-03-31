// node.jsを使ってwebアプリケーションを構築するサンプル
// httpモジュールを読み込んでインスタンス化する。
const http = require('http');
const fs = require('fs');

// サーバーオブジェクトを構築する。
var server = http.createServer (getFromClient);
// ポート3000で展開する。(待ち受け状態にする。)
server.listen(3000);
// コンソールログを表示する。
console.log('Server start!');

// サーバー構築用の関数
function getFromClient(request, response) {
    // htmlファイルを読み込む
        fs.readFile('./index.html', 'UTF-8', 
        // エラーの場合の処理
        (error, data) => {
        response.writeHead(200, { 'Content-Type': 'text/html' });
        response.write(data);
        response.end();
    });
}