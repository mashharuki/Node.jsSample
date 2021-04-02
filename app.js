// node.jsを使ってwebアプリケーションを構築するサンプル
// httpモジュールを読み込んでインスタンス化する。
const http = require('http');
const fs = require('fs');
const ejs = require('ejs');
// urlモジュールを読み込んでインスタンス化する。
const url = require('url');

// ejsファイルの読み込み
const index_page = fs.readFileSync('./index.ejs', 'utf8');
const other_page = fs.readFileSync('./other.ejs', 'utf8')
// cssファイルの読み込み
const test_css = fs.readFileSync('./test.css', 'utf8');
// サーバーオブジェクトを構築する。
var server = http.createServer (getFromClient);
// ポート3000で展開する。(待ち受け状態にする。)
server.listen(3000);
// コンソールログを表示する。
console.log('Server start!');

// サーバー構築用の関数
function getFromClient(request, response) {
    // URLを構築するための変数を用意
    var url_parts = url.parse(request.url);
    switch (url_parts.pathname) {
        // index画面
        case '/':
            // index.ejsをレンダリングする。
            var content = ejs.render(index_page, {
                title: "Indexページ",
                content: "これはテンプレートを使ったサンプルページです。",
            });
            response.writeHead(200, { 'Content-Type': 'text/html' });
            response.write(content);
            response.end();
            break;

        // other画面
        case '/other':
            var content = ejs.render(other_page, {
                title: "Other",
                content: "これは新しく用意したWebページです。",
            });
            response.writeHead(200, { 'Content-Type': 'text/html' });
            response.write(content);
            response.end();
            break;    

        case '/test.css':
            response.writeHead(200, { 'Content-Type': 'text/css' });
            response.write(test_css);
            response.end();
            break;
        
        default:
            response.writeHead(200, { 'Content-Type': 'text/plain' });
            response.write('no pages...');
    }
}