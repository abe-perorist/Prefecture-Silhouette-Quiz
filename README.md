# 🗾 都道府県シルエットクイズ

日本の都道府県のシルエットを見て、どこの都道府県かを当てるクイズアプリケーションです。

## 📋 機能

- **ランダム出題**: 都道府県のシルエットがランダムに出題されます
- **4択形式**: 4つの選択肢から正解を選択
- **即時フィードバック**: 回答後、正誤を即座に表示
- **結果表示**: 全問題終了後、正答数と正答率を表示
- **レスポンシブデザイン**: スマートフォンでも快適に利用可能

## 🚀 使い方

1. ブラウザで `index.html` を開く
2. 表示されたシルエットを見て、4つの選択肢から正しい都道府県を選択
3. 「回答する」ボタンをクリック
4. 正誤を確認後、「次の問題へ」ボタンで次の問題に進む
5. 5問終了後、結果が表示されます

## 📁 ファイル構成

```
Prefecture-Silhouette-Quiz/
├── index.html          # メインHTMLファイル
├── style.css           # スタイルシート
├── script.js           # JavaScriptロジック
├── README.md           # このファイル
└── images/             # 画像フォルダ（以下の画像を配置してください）
    ├── hokkaido_silhouette.png
    ├── kyoto_silhouette.png
    ├── tokyo_silhouette.png
    ├── okinawa_silhouette.png
    ├── nagano_silhouette.png
    ├── osaka_silhouette.png
    └── fukuoka_silhouette.png
```

## 🖼️ 画像の準備

このアプリケーションを動作させるには、各都道府県のシルエット画像が必要です。

### 必要な画像ファイル

`images/` フォルダを作成し、以下の画像ファイルを配置してください：

1. `hokkaido_silhouette.png` - 北海道
2. `kyoto_silhouette.png` - 京都府
3. `tokyo_silhouette.png` - 東京都
4. `okinawa_silhouette.png` - 沖縄県
5. `nagano_silhouette.png` - 長野県
6. `osaka_silhouette.png` - 大阪府
7. `fukuoka_silhouette.png` - 福岡県

### 画像の推奨仕様

- **形式**: PNG（透過背景推奨）
- **サイズ**: 300x300px 程度
- **色**: 黒または濃いグレーのシルエット

### 画像の入手方法

1. **フリー素材サイトから入手**
   - いらすとや
   - ICOOON MONO
   - などのフリー素材サイト

2. **自作する場合**
   - 都道府県の地図データからシルエットを作成
   - 画像編集ソフトでトレース

## 🛠️ 技術スタック

- **HTML5**: 構造
- **CSS3**: スタイリング（グラデーション、アニメーション、レスポンシブデザイン）
- **JavaScript (Vanilla)**: ロジック実装

## ✨ 特徴

- サーバー不要：すべてクライアントサイドで動作
- シンプルなコード構成：3ファイルのみ
- モダンなUI：グラデーション、アニメーション、ホバーエフェクト
- レスポンシブ対応：PCからスマートフォンまで対応

## 🎨 カスタマイズ

### 問題数の変更

`script.js` の `totalQuestions` 変数を変更してください：

```javascript
let totalQuestions = 5; // 1ゲームあたりの問題数
```

### 都道府県データの追加

`script.js` の `quizData` 配列に新しいデータを追加してください：

```javascript
{
  id: 8,
  answer: "新しい都道府県名",
  image: "images/new_prefecture_silhouette.png",
  incorrect_choices: ["誤答1", "誤答2", "誤答3"]
}
```

### デザインの変更

`style.css` を編集して、色やレイアウトをカスタマイズできます。

## 📝 ライセンス

このプロジェクトはMITライセンスの下で公開されています。

## 🤝 貢献

バグ報告や機能追加の提案は大歓迎です！

---

&copy; 2025 都道府県シルエットクイズ

