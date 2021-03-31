// node.jsを使ってwebアプリケーションを構築するサンプル
// httpモジュールを読み込んでインスタンス化する。
const http = require('http');

// サーバーオブジェクトを構築する。
var server = http.createServer (
    (request, response) => {
        // テキストをクライアントに送信して終了する。
        response.end('<html><body><h1>Hello</h1><p>Welcome to Node.js</p></body></html>');
    }
);
// ポート3000で展開する。(待ち受け状態にする。)
server.listen(3000);