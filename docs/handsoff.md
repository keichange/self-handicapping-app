以下をそのまま Codex に渡せる開発ドキュメントとして使ってください。
ファイル名を付けるなら、まずは `docs/requirements.md` か、リポジトリ直下の `README.md` に貼るのがよいです。

````md
# 戻るボタン MVP 開発ドキュメント

## 1. 背景

このアプリは、セルフハンディキャッピングを減らすための個人用Webアプリである。

ユーザーは、夜更かし、スマホ、YouTube、SNS、別タスク、情報収集などによって、やるべきことから逃げることがある。  
これらの行動は単なる怠惰ではなく、失敗したときに「本気を出していなかった」「寝不足だった」「時間がなかった」などの言い訳を作るための行動になっている。

スプレッドシートで記録する案もあったが、管理が面倒になり継続しづらい。  
そこで、セルフハンディキャッピングに特化した、スマホで素早く使える簡易アプリを作成する。

このアプリの目的は、立派なタスク管理ではない。  
目的は、逃げそうな瞬間に気づき、記録し、15分だけ本来の行動に戻ることである。

---

## 2. アプリ名

仮称：

**戻るボタン**

名前の意味：

逃げそうになったときに、説教したり反省させたりするのではなく、  
「本来やるべきことに15分だけ戻る」ためのボタンとして機能させる。

---

## 3. アプリのコンセプト

### 一言で言うと

> 今日の自分が、明日の自分に言い訳を渡さないためのアプリ

### 詳細

セルフハンディキャッピングは、やるべきことを避けるだけではない。  
未来の自分に対して、失敗したときの言い訳をあらかじめ渡す行為である。

例：

- 夜更かしする  
  → 明日「寝不足だったから仕方ない」と言える

- スマホやYouTubeを見る  
  → 明日「時間がなかった」と言える

- 情報収集ばかりする  
  → 「もっと良いやり方を探していた」と言える

- 別のタスクを始める  
  → 「忙しかった」と言える

このアプリでは、そうした行動を責めるのではなく、以下の流れで扱う。

1. 逃げそうな瞬間に気づく
2. 逃げ先と言い訳を簡単に記録する
3. 15分だけ本来の行動に戻る
4. 逃げたとしても記録を残す
5. 7日間の傾向を見て、自分の逃げパターンを把握する

---

## 4. 今回のMVPで作るもの

今回は、最小限のMVPを作成する。  
バックエンド、ログイン、AI分析、通知などは作らない。

### 技術スタック

- React
- Vite
- TypeScript
- LocalStorage
- React Router
- HashRouter
- GitHub Pages

### ホスティング

GitHub Pages を使う。

理由：

- 無料
- HTTPSで公開できる
- スマホからアクセスしやすい
- 静的サイトとしてReactアプリを配置できる
- MVPとして十分
- バックエンドを持たないため構成が軽い

### バックエンドについて

今回のMVPでは NestJS は使わない。  
ただし、将来的にNestJS APIへ移行しやすいように、型定義やデータ構造はある程度きれいに分ける。

NestJSを使うのは、以下の段階になってからでよい。

- 複数端末で同期したい
- ログインしたい
- データをDBに保存したい
- AI分析を追加したい
- 通知機能を追加したい
- 週次レポートをサーバー側で生成したい

---

## 5. 今回作らないもの

MVPでは以下を作らない。

- ログイン機能
- ユーザー管理
- NestJS API
- DB保存
- 通知機能
- AI分析
- カレンダー連携
- 複雑なタスク管理
- 複数プロジェクト管理
- 長文日記機能
- 高度なグラフ
- アニメーションに凝ったUI
- PWAの本格対応
- クラウド同期

今回の目的は、アプリとして完成度を上げることではなく、  
「スマホで開いて、逃げそうな瞬間に10秒以内で記録し、15分だけ戻れるか」を検証すること。

---

## 6. MVPの主要機能

### 機能1：今日の重要行動を登録する

ユーザーは、今日一番大事な行動を1つだけ登録できる。

登録項目：

- 今日の一番大事なこと
- 最初の15分でやること
- 今日渡したくない言い訳

例：

```txt
今日の一番大事なこと：
基本情報の過去問を15分やる

最初の15分でやること：
問題集アプリを開いて5問解く

今日渡したくない言い訳：
寝不足だったから
````

ポイント：

* タスクは1つだけにする
* 複数タスク管理にしない
* 今日の主戦場を明確にする
* 最初の行動を小さくする

---

### 機能2：逃げそうログを記録する

ユーザーは「逃げそう」ボタンを押して、逃げそうな瞬間を記録できる。

記録項目：

* 逃げ先
* 言い訳
* メモ任意
* 15分戻るかどうか

逃げ先の選択肢：

```txt
smartphone: スマホ
youtube: YouTube
sns: SNS
game: ゲーム
sleep_delay: 夜更かし
cleaning: 片付け
research: 情報収集
other_task: 別タスク
food: 食事・間食
other: その他
```

言い訳の選択肢：

```txt
tired: 疲れている
sleepy: 眠い
no_time: 時間がない
not_ready: 準備不足
better_method: もっと良いやり方を探したい
fear_failure: 失敗したくない
low_motivation: やる気がない
unclear: 何をすればいいか曖昧
other: その他
```

重要：

* 入力はできるだけ選択式にする
* 自由入力は任意
* 記録に10秒以上かからないようにする
* 逃げたことを責めるUIにしない

---

### 機能3：15分タイマー

ユーザーは「15分やる」ボタンから、15分だけ本来の行動に戻る。

タイマー画面には以下を表示する。

* 今やること
* 残り時間
* 中断ボタン
* 終了ボタン

15分経過後、または中断時に結果を記録する。

結果の選択肢：

```txt
completed: やった
escaped: 途中で逃げた
not_started: 始められなかった
```

重要：

* 成果の良し悪しは問わない
* 「15分逃げずに着手した」ことを重視する
* 点数や成果入力は必須にしない
* メモは任意

---

### 機能4：記録一覧

今日または過去のログを一覧で見られる。

表示対象：

* 今日の重要行動
* 逃げそうログ
* 15分セッションログ
* 夜のチェックログ

MVPでは、まず全ログを時系列で表示できればよい。

表示例：

```txt
2026-05-26

10:12 逃げそう
逃げ先：スマホ
言い訳：疲れている
戻れた：はい

12:45 15分実行
結果：やった

22:30 夜のチェック
明日に渡したくない言い訳：寝不足だったから
```

---

### 機能5：7日間振り返り

過去7日間の傾向を簡易表示する。

表示項目：

* 逃げそうログ数
* 15分戻れた回数
* 戻れた率
* 多い逃げ先ランキング
* 多い言い訳ランキング

表示例：

```txt
過去7日間

逃げそうログ：18回
15分戻れた：9回
戻れた率：50%

多い逃げ先
1位：スマホ 7回
2位：情報収集 5回
3位：夜更かし 3回

多い言い訳
1位：疲れている 6回
2位：時間がない 4回
3位：失敗したくない 3回
```

重要：

* グラフは必須ではない
* まずはテキスト表示でよい
* 分析を凝りすぎない
* 自分の逃げパターンを見られれば十分

---

### 機能6：夜のチェック

夜に簡単な振り返りを行う。

入力項目：

* 今日、明日の自分に言い訳を渡したか
* 主な言い訳材料
* メモ任意
* 明日の一番大事なこと
* 明日の最初の15分でやること
* 明日に渡したくない言い訳

選択肢：

```txt
gaveExcuseLevel:
none: 渡していない
little: 少し渡した
yes: 渡した
```

目的：

* 今日を責めるのではなく、明日に繋げる
* 次の日の重要行動を先に決めておく
* 夜更かしなどの言い訳材料を意識化する

---

## 7. 画面構成

画面は3つにする。

```txt
/
  今日画面

/logs
  記録一覧画面

/review
  7日間振り返り画面
```

スマホ利用を前提に、下部タブを設置する。

```txt
[ 今日 ] [ 記録 ] [ 振り返り ]
```

---

## 8. 今日画面

### 目的

今日の重要行動を確認し、すぐに15分行動または逃げそうログを記録できるようにする。

### 表示内容

```txt
今日の一番大事なこと
[基本情報の過去問を15分やる]

最初の15分でやること
[問題集アプリを開いて5問解く]

今日渡したくない言い訳
[寝不足だったから]

[15分やる]
[逃げそう]
[夜のチェック]
```

今日の重要行動が未登録の場合は、入力フォームを表示する。

入力項目：

* 今日の一番大事なこと
* 最初の15分でやること
* 今日渡したくない言い訳

---

## 9. 逃げそうログ入力UI

今日画面の「逃げそう」ボタンから表示する。

モーダルまたは画面内パネルでよい。

### 表示内容

```txt
今、何に逃げそう？

[スマホ]
[YouTube]
[SNS]
[ゲーム]
[夜更かし]
[片付け]
[情報収集]
[別タスク]
[食事・間食]
[その他]

今の言い訳は？

[疲れている]
[眠い]
[時間がない]
[準備不足]
[もっと良いやり方を探したい]
[失敗したくない]
[やる気がない]
[何をすればいいか曖昧]
[その他]

メモ
[任意入力]

本来やることに15分戻る？

[戻る]
[今日は無理。記録だけ残す]
```

「戻る」を押したら、逃げそうログを保存したうえで15分タイマーへ移動する。
「今日は無理」を押したら、逃げそうログを保存して今日画面へ戻る。

---

## 10. 15分タイマー画面

### 表示内容

```txt
15分だけやる

今やること：
問題集アプリを開いて5問解く

残り時間：
14:32

[中断する]
[終了する]
```

### 終了時の結果入力

```txt
15分やった？

[やった]
[途中で逃げた]
[始められなかった]

メモ
[任意入力]

[保存]
```

結果保存後は今日画面へ戻る。

---

## 11. 記録一覧画面

### 目的

過去のログを確認する。

### 表示内容

* 日付ごとにグルーピング
* 新しいものを上に表示
* ログ種別が分かるように表示

ログ種別：

* DailyPlan
* HandicapLog
* FocusSession
* NightlyReview

MVPでは、最低限以下を表示する。

#### HandicapLog

* 日時
* 逃げ先
* 言い訳
* 戻れたか
* メモ

#### FocusSession

* 開始時刻
* 終了時刻
* 結果
* メモ

#### NightlyReview

* 日付
* 言い訳を渡したか
* 主な言い訳材料
* 明日のタスク

---

## 12. 7日間振り返り画面

### 目的

セルフハンディキャッピングのパターンを把握する。

### 表示内容

* 過去7日間の逃げそうログ数
* 15分戻れた回数
* 戻れた率
* 逃げ先ランキング
* 言い訳ランキング

### 計算仕様

#### 過去7日間

現在日を含む直近7日間を対象とする。

#### 逃げそうログ数

対象期間内の HandicapLog 件数。

#### 15分戻れた回数

HandicapLog の `returnedToTask === true` の件数。

#### 戻れた率

```txt
15分戻れた回数 / 逃げそうログ数 * 100
```

逃げそうログ数が0の場合は、0%または「データなし」と表示する。

#### 逃げ先ランキング

HandicapLog の `triggerType` ごとの件数を集計する。

#### 言い訳ランキング

HandicapLog の `excuseType` ごとの件数を集計する。

---

## 13. データ型

### DailyPlan

```ts
export type DailyPlan = {
  id: string;
  date: string; // YYYY-MM-DD
  mainTask: string;
  firstAction: string;
  avoidExcuse: string;
  status: 'active' | 'completed' | 'skipped';
  createdAt: string;
  updatedAt: string;
};
```

### HandicapLog

```ts
export type TriggerType =
  | 'smartphone'
  | 'youtube'
  | 'sns'
  | 'game'
  | 'sleep_delay'
  | 'cleaning'
  | 'research'
  | 'other_task'
  | 'food'
  | 'other';

export type ExcuseType =
  | 'tired'
  | 'sleepy'
  | 'no_time'
  | 'not_ready'
  | 'better_method'
  | 'fear_failure'
  | 'low_motivation'
  | 'unclear'
  | 'other';

export type HandicapLog = {
  id: string;
  dailyPlanId: string;
  triggerType: TriggerType;
  excuseType: ExcuseType;
  note?: string;
  returnedToTask: boolean | null;
  createdAt: string;
};
```

### FocusSession

```ts
export type FocusSessionResult =
  | 'completed'
  | 'escaped'
  | 'not_started';

export type FocusSession = {
  id: string;
  dailyPlanId: string;
  startedAt: string;
  endedAt?: string;
  durationMinutes: number;
  result: FocusSessionResult;
  memo?: string;
  createdAt: string;
};
```

### NightlyReview

```ts
export type GaveExcuseLevel =
  | 'none'
  | 'little'
  | 'yes';

export type NightlyReview = {
  id: string;
  date: string;
  gaveExcuseLevel: GaveExcuseLevel;
  mainExcuseSource?: string;
  memo?: string;
  tomorrowTask?: string;
  tomorrowFirstAction?: string;
  tomorrowAvoidExcuse?: string;
  createdAt: string;
};
```

### AppState

LocalStorageには、ひとまずまとめて保存する。

```ts
export type AppState = {
  dailyPlans: DailyPlan[];
  handicapLogs: HandicapLog[];
  focusSessions: FocusSession[];
  nightlyReviews: NightlyReview[];
};
```

---

## 14. LocalStorage仕様

### 保存キー

```txt
return-button:appState
```

### 初期値

```ts
const initialAppState: AppState = {
  dailyPlans: [],
  handicapLogs: [],
  focusSessions: [],
  nightlyReviews: [],
};
```

### 注意点

* JSON.stringifyして保存する
* JSON.parseに失敗した場合は初期値を返す
* 将来的なマイグレーションを考慮して、storage操作は専用関数に閉じ込める
* コンポーネントから直接localStorageを触らない

---

## 15. 推奨ディレクトリ構成

```txt
src/
├─ app/
│  ├─ App.tsx
│  └─ router.tsx
├─ features/
│  ├─ dailyPlan/
│  │  ├─ components/
│  │  ├─ hooks/
│  │  ├─ dailyPlanService.ts
│  │  └─ types.ts
│  ├─ handicapLog/
│  │  ├─ components/
│  │  ├─ hooks/
│  │  ├─ handicapLogService.ts
│  │  └─ types.ts
│  ├─ focusSession/
│  │  ├─ components/
│  │  ├─ hooks/
│  │  ├─ focusSessionService.ts
│  │  └─ types.ts
│  ├─ nightlyReview/
│  │  ├─ components/
│  │  ├─ hooks/
│  │  ├─ nightlyReviewService.ts
│  │  └─ types.ts
│  └─ review/
│     ├─ components/
│     ├─ hooks/
│     └─ reviewService.ts
├─ pages/
│  ├─ TodayPage.tsx
│  ├─ LogsPage.tsx
│  └─ ReviewPage.tsx
├─ shared/
│  ├─ components/
│  │  ├─ BottomNav.tsx
│  │  ├─ Button.tsx
│  │  └─ Card.tsx
│  ├─ constants/
│  │  ├─ labels.ts
│  │  └─ options.ts
│  ├─ storage/
│  │  └─ appStorage.ts
│  ├─ types/
│  │  └─ appState.ts
│  └─ utils/
│     ├─ date.ts
│     └─ id.ts
├─ main.tsx
└─ index.css
```

ただし、MVPなので必要に応じて簡略化してよい。
重要なのは、storage処理、型定義、画面表示を最低限分離すること。

---

## 16. ルーティング

GitHub Pagesにデプロイするため、React Routerは `HashRouter` を使う。

理由：

GitHub Pagesでは、`/review` のようなURLを直接開くと404になりやすい。
HashRouterなら以下のようなURLになり、静的ホスティングでも壊れにくい。

```txt
https://ユーザー名.github.io/return-button/#/review
```

ルート：

```txt
/
  TodayPage

/logs
  LogsPage

/review
  ReviewPage
```

---

## 17. Vite設定

リポジトリ名を `return-button` と仮定する。

`vite.config.ts` は以下のようにする。

```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/return-button/',
});
```

リポジトリ名が異なる場合は `base` を変更する。

---

## 18. GitHub Pages デプロイ

GitHub Actionsでデプロイする。

`.github/workflows/deploy.yml`

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches:
      - main

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build

    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

GitHub側では、PagesのSourceを `GitHub Actions` に設定する。

---

## 19. UI方針

### 全体方針

* スマホファースト
* 片手で操作しやすくする
* 入力は最小限
* 選択式を中心にする
* 長文入力を要求しない
* 逃げたことを責めない
* ただし、事実は曖昧にしない

### トーン

このアプリはユーザーを励ましすぎない。
説教もしない。
冷静に事実を記録して、次の15分に戻す。

良い文言例：

```txt
逃げそうなログを残しました。
次の15分だけ、本来の行動に戻しますか？
```

```txt
本当に休息が必要なら休む。
逃げなら15分だけ戻る。
```

```txt
成果ではなく、逃げずに着手できたかを見ます。
```

避ける文言：

```txt
また逃げましたね
もっと頑張りましょう
意志が弱いです
今日も失敗です
```

---

## 20. デザイン方針

凝ったデザインは不要。
ただし、毎日開くアプリなので、最低限見やすくする。

### 推奨

* 背景は薄いグレーまたは白
* カードUIを使う
* ボタンは大きめ
* 下部ナビゲーションを固定
* 文字サイズはスマホで読みやすく
* 入力欄は少なく
* 重要ボタンは押しやすく

### 主要ボタン

今日画面の主要ボタン：

```txt
[15分やる]
[逃げそう]
[夜のチェック]
```

「逃げそう」は押しやすい位置に置く。

---

## 21. 実装順序

以下の順番で実装する。

### Step 1：初期構築

* Vite + React + TypeScript プロジェクト作成
* React Router導入
* HashRouter設定
* 下部ナビゲーション作成
* 3画面の空ページ作成

完了条件：

* `/`
* `/logs`
* `/review`

をタブで移動できる。

---

### Step 2：型定義とLocalStorage実装

* AppState型を作成
* DailyPlan型を作成
* HandicapLog型を作成
* FocusSession型を作成
* NightlyReview型を作成
* appStorage.tsを作成

完了条件：

* LocalStorageからAppStateを取得できる
* LocalStorageへAppStateを保存できる
* parse失敗時に初期値へ戻せる

---

### Step 3：今日の重要行動登録

* 今日画面に入力フォームを作成
* DailyPlanを保存
* 今日の日付のDailyPlanを表示
* 既存のDailyPlanがある場合は表示モードにする

完了条件：

* 今日の一番大事なことを登録できる
* 最初の15分でやることを登録できる
* 渡したくない言い訳を登録できる
* リロードしても残る

---

### Step 4：逃げそうログ登録

* 逃げそうボタンを作成
* 逃げそうログ入力モーダルを作成
* triggerTypeを選択できる
* excuseTypeを選択できる
* 任意メモを入力できる
* returnedToTaskを保存できる

完了条件：

* 逃げ先と言い訳を選んで保存できる
* 「戻る」を選んだ場合は15分タイマーへ進める
* 「今日は無理」を選んだ場合はログだけ保存できる
* リロードしても残る

---

### Step 5：15分タイマー

* 15分タイマー画面またはコンポーネントを作成
* カウントダウン表示
* 中断
* 終了
* 結果保存

完了条件：

* 15分タイマーを開始できる
* 中断できる
* 終了できる
* completed / escaped / not_started の結果を保存できる
* FocusSessionとしてLocalStorageに保存される

---

### Step 6：夜のチェック

* 夜のチェックフォームを作成
* gaveExcuseLevelを選択できる
* mainExcuseSourceを入力または選択できる
* memoを任意入力できる
* 明日のタスク情報を入力できる

完了条件：

* NightlyReviewを保存できる
* 明日のタスク情報も保存できる
* 最低限、ログ一覧で確認できる

---

### Step 7：記録一覧画面

* dailyPlans
* handicapLogs
* focusSessions
* nightlyReviews

を時系列で表示する。

完了条件：

* 各ログが日付ごとに見られる
* 新しいログが上に出る
* 逃げ先や言い訳が日本語ラベルで表示される

---

### Step 8：7日間振り返り画面

* 過去7日間のHandicapLogを集計
* 逃げそうログ数を表示
* 15分戻れた回数を表示
* 戻れた率を表示
* 逃げ先ランキングを表示
* 言い訳ランキングを表示

完了条件：

* 過去7日間の傾向が見られる
* データがない場合も表示が崩れない

---

### Step 9：GitHub Pagesデプロイ

* vite.config.tsにbase設定
* GitHub Actions作成
* GitHub Pages設定
* mainブランチpushでデプロイ

完了条件：

* GitHub Pages上でアプリが開ける
* スマホからアクセスできる
* 画面遷移できる
* リロードしても404にならない

---

## 22. MVPの完成条件

MVP完成の条件は以下。

```txt
スマホでGitHub Pagesを開ける
今日の重要行動を登録できる
逃げそうログを10秒以内に登録できる
15分タイマーを開始できる
結果を保存できる
記録一覧を確認できる
過去7日の逃げパターンが見える
```

見た目が完璧である必要はない。
AI分析も不要。
通知も不要。
バックエンドも不要。

このアプリのMVPは、実際に1週間使ってセルフハンディキャッピングの傾向を記録できれば成功。

---

## 23. 開発時の注意

このアプリの開発自体が、セルフハンディキャッピングにならないように注意する。

やってはいけないこと：

* UIに凝りすぎる
* 状態管理を過剰設計する
* 最初からNestJSを入れる
* DB設計を始める
* AI分析を入れようとする
* 認証を入れようとする
* グラフを凝る
* タスク管理アプリ化する
* 完璧なアーキテクチャを目指す

今回のゴールは、立派なアプリを作ることではなく、
「逃げそうな瞬間に開ける小さな道具」を作ること。

---

## 24. 将来的な拡張案

MVPを1〜2週間使って、継続できそうなら以下を検討する。

### Version 0.2

* IndexedDB対応
* PWA対応
* ホーム画面追加対応
* データエクスポート
* 逃げ先と言い訳のカスタマイズ
* 週次レビューの改善

### Version 1.0

* NestJS API
* PostgreSQL または MySQL
* 認証
* 複数端末同期
* バックアップ
* グラフ表示
* AIによる週次要約
* AIによる次週対策提案
* 通知機能

---

## 25. Codexへの実装指示

このドキュメントに従って、React + Vite + TypeScript でMVPを実装してください。

優先順位は以下です。

1. スマホで使いやすいこと
2. 逃げそうログを素早く残せること
3. 15分だけ本来の行動に戻れること
4. LocalStorageに保存されること
5. 7日間の傾向が見えること
6. GitHub Pagesにデプロイできること

過剰な設計や不要な機能追加は避けてください。
特に、今回のMVPではNestJS、ログイン、DB、AI分析、通知は実装しないでください。

UIはシンプルで構いません。
ただし、スマホでボタンが押しやすく、毎日開いてもストレスが少ない見た目にしてください。

````

さらに Codex に最初に投げるなら、上のドキュメントに加えて、次の短い指示を添えると動かしやすいです。

```md
まずはこのドキュメントを読んで、MVPを実装してください。

最初に以下を行ってください。

1. React + Vite + TypeScript の構成を確認
2. 不足していれば必要な依存関係を追加
3. HashRouterで3画面を作成
4. LocalStorage保存の土台を作成
5. 今日画面、逃げそうログ、15分タイマー、記録一覧、7日間振り返りの順に実装

実装後、以下を報告してください。

- 実装した機能
- 変更したファイル
- 起動方法
- GitHub Pagesにデプロイするために必要な設定
- 未実装または簡略化した点
````

このまま渡せば、かなりブレずに作れるはずです。
注意点として、Codexが勝手にNestJSやDBまで広げ始めたら止めた方がいいです。今回のMVPでは、そこは明確に不要です。
