// node.jsを使ってwebアプリケーションを構築するサンプル
// httpモジュールを読み込んでインスタンス化する。
const http = require('http');
const fs = require('fs');
const ejs = require('ejs');
// urlモジュールを読み込んでインスタンス化する。
const url = require('url');
const qs = require('querystring');

// ejsファイルの読み込み
const index_page = fs.readFileSync('./index.ejs', 'utf8');
const other_page = fs.readFileSync('./other.ejs', 'utf8')
// cssファイルの読み込み
const test_css = fs.readFileSync('./test.css', 'utf8');
// オブジェクト変数 dataを用意する。
var data = { msg: 'no message...' };
// オブジェクト変数 data2を用意する。
var data2 = {
    'Taro': ['taro@yamada', '09-999-999', 'Tokyo'],
    'Hanako': ['hanako@flower', '080-888-999', 'Yokohama'],
    'Sachiko': ['sachi@happy', '070-777-777', 'Nagoya'],
    'Ichiro': ['ichi@baseball', '060-666-666', 'USA'],
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
        // POSTアクセス時の処理
        if (request.method == 'POST') {
            var body = '';
             // データ受信のイベント処理
            request.on ('data', (data) => {
                body += data;
            });
            // データ受信完了後のイベント処理
            request.on('end', () => {
                // データの解析
                data = qs.parse(body);
                // クッキーの保存
                setCookie('msg', data.msg, response);
                // メソッドの呼び出し
                write_index(request, response);
            });
        } else {
            // メソッドの呼び出し
            write_index(request, response);
        }
    }

    // other画面のアクセス処理
    function response_other(request, response) {
        var msg = "これはOtherページです。";
        // POSTアクセス時の処理
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
                data: data2,
                filename: 'data_item'
            });
            response.writeHead(200, { 'Content-Type': 'text/html' });
            response.write(content);
            response.end();
        });
    }

    // Index画面の作成表示画面
    function write_index(request, response) {
        // 値をセットする。
        var msg = "※伝言を表示します。";
        // クッキーデータを取得する。
        var cookie_data = getCookie('msg', request);
        // index.ejsをレンダリングする。
        var content = ejs.render(index_page, {
            title: "Index",
            content: msg,
            data: data,
            cookie_data: cookie_data,
        });
        response.writeHead(200, { 'Content-Type': 'text/html' });
        response.write(content);
        response.end();
    }

    // クッキーの値を設定
    function setCookie (key, value, response) {
        // エスケープ処理を施す
        var cookie = escape (value);
        // ヘッダーにクッキー情報をセット
        response.setHeader('Set-Cookie', [key + '=' + cookie]);
    }

    // クッキーの値を取得
    function getCookie (key, request) {
        // クッキーデータを取得する
        var cookie_data = request.headers.cookie != undefined ? request.headers.cookie : '';
        // ; で分割する。
        var data = cookie_data.split(';');
        
        for ( var i in data){
            // 前後の余白を取り除く
            if(data[i].trim().startsWith(key + '=')) {
                var result = data[i].trim().substring(key.length + 1);
                return unescape(result);
            }
        }
        return '';
    }
}