// node.jsを使ってwebアプリケーションを構築するサンプル
// httpモジュールを読み込んでインスタンス化する。
const http = require('http');
const fs = require('fs');
const ejs = require('ejs');
// urlモジュールを読み込んでインスタンス化する。
const url = require('url');
const qs = require('querystring')

// ejsファイルの読み込み
const index_page = fs.readFileSync('./index.ejs', 'utf8');
const other_page = fs.readFileSync('./other.ejs', 'utf8')
// cssファイルの読み込み
const test_css = fs.readFileSync('./test.css', 'utf8');
// オブジェクト変数 dataを用意する。
var data = {
    'Taro': '09-999-999',
    'Hanako': '080-888-999',
    'Sachiko': '070-777-777',
    'Ichiro': '060-666-666'
};
// サーバーオブジェクトを構築する。
var server = http.createServer (getFromClient);
// ポート3000で展開する。(待ち受け状態にする。)
server.listen(3000);
// コンソールログを表示する。
console.log('Server start!');

// サーバー構築用の関数
function getFromClient(request, response) {
    // URLを構築するための変数を用意
    var url_parts = url.parse(request.url, true);
    switch (url_parts.pathname) {
        // index画面
        case '/':
            response_index(request, response);
            break;

        // other画面
        case '/other':
            response_other(request, response);
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

    // index画面のアクセス処理
    function response_index(request, response){
        // 値をセットする。
        var msg = "これはIndexページです。";
        // index.ejsをレンダリングする。
        var content = ejs.render(index_page, {
            title: "Index",
            content: msg,
            data: data,
            filename: 'data_item'
        });
        response.writeHead(200, { 'Content-Type': 'text/html' });
        response.write(content);
        response.end();
    }

    // other画面のアクセス処理
    function response_other(request, response) {
        var msg = "これはOtherページです。";
        // POSTアクセス時の処理
        if (request.method == 'POST') {
            var body = '';
            // データ受信のイベント処理
            request.on ('data', (data) => {
                body += data;
            });
            // データ受信完了後のイベント処理
            request.on('end', () => {
                var post_data = qs.parse(body);
                msg += 'あなたは、 「' + post_data.msg + '」と書きました。';
                response_other(request, response);
                var content = ejs.render(other_page, {
                    title: "Other",
                    content: msg,
                });
                response.writeHead(200, { 'Content-Type': 'text/html' });
                response.write(content);
                response.end();
            });
        } else {
            var msg = "ページがありません。";
            // 画面をレンダリングする。
            var content = ejs.render(other_page, {
                title: "Other",
                content: msg,
            });
            response.writeHead(200, { 'Content-Type': 'text/html' });
            response.write(content);
            response.end();
        }    
    }
}