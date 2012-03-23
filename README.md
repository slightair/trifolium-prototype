
trifolium
====
なんか何人もいる勇者がちょこちょこと動いていて、そのうち世界とか救ってくれたらいいなと見守るだけのゲーム。
タイトル未定。

ひつようなもの
----
* node.js - http://nodejs.org/
* CoffeeScript - http://coffeescript.org/

今のところ CoffeeScript で書かれていて node.js で動きます。
ゲームクライントはブラウザで動くようにするつもりですが、スマートフォン向けのクライアントも作れたらよいなと考えています。
スマートフォン向けがメインになるかもしれない。

開発者向け情報
----
### 前提条件
node やら npm が使える。

### 動かし方

1.コードを取得する

    > git clone git@bitbucket.org:slightair/trifolium.git

2.依存する node のパッケージをインストールする

    > npm install

3.CoffeeScriptで書かれたコードをJavaScriptにコンパイルする

    > cake server
    > cake browser
    > cake express

か

    > cake all

4.ゲームサーバを起動する

    > node game-server.js

5.Webアプリケーション を起動する

    node app.js

6.http://localhost:3000 にブラウザでアクセスする。

動きましたか？

###images
    pull on img.
