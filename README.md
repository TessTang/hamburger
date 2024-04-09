# Hamburger

---

> [此專案為速食外送網站，主打快速、方便和美味。無論您在家、辦公室或任何地方，只需幾個網路訂餐，即可享受到新鮮熱辣的速食美食。]


---

## 網址連結
https://tesstang.github.io/hamburger/

---

## 簡介與頁面介紹
* 以 React.js 框架實作網站
* 會員制度，有專屬資料、購物車與訂單功能
* 豐富的產品與專欄文章內容
* 架設 Node.js 串接 Line Pay
* 以 Framer Motion 製作多樣化的動畫效果

### 頁面功能:
1. 首頁：
    - [x] 判定是否已登入
    - [x] 漢堡動畫效果
    - [x] 豐富的介紹與互動動畫
    - [x] 每次進入隨機推薦三種產品

2. 登入：
    - [x] 可以直覺切換登入/註冊按鈕
    - [x] 串聯 Google 帳號可直接註冊登入

3. 產品：
    - [x] 左側種類清單可直接更改產品種類分頁
    - [x] 排序選項讓使用者輕鬆依需求排序
    - [x] 產品頁面內有相同種類產品推薦

4. 購物車：
    - [x] 判定是否已登入/是否已將產品加入購物車
    - [x] 直接進行更改產品件數與刪除品項
    - [x] 加入優惠卷並判定是否符合使用資格

5. 訂單確認：
    - [x] 直接代入會員資料避免重複填寫
    - [x] 若選擇 Line Pay 將轉入付款頁面(目前使用 Node.js 使用 Render 部屬，可能會有三十秒喚醒時間)

6. 會員：
    - [x] 若未填寫會員資料將會直接轉入新增資料頁面
    - [x] 過去訂單倒序排列，且可查看每筆詳情且也可連結 Line Pay 付款

7. 專欄：
    - [x] 依照日期倒序排列
    - [x] 可單獨查看各分類、標籤文章
    - [x] 點入各篇下方可以直接連結至前後篇文章

8. 後台：
    - [x] 可管理文章、產品、訂單、折扣碼


## 畫面

---
* 首頁 -大量動畫效果增加網頁互動感
![image](https://github.com/TessTang/hamburger/blob/main/src/assets/Index.gif)

* 產品 -多樣且有分類與排序方便觀看
![image](https://github.com/TessTang/hamburger/blob/main/src/assets/Product.gif)

* Blog -多篇文章增加網頁豐富度
![image](https://github.com/TessTang/hamburger/blob/main/src/assets/Blog.gif)



## 安裝流程

---

1. 開啟終端機，執行以下指令：
`$ git clone https://github.com/TessTang/hamburger.git`

2. 進入專案資料夾:
` $ cd hamburger`

3. 使用 npm 安裝套件
`$ npm install`

4. 執行專案
`$ npm start`

## 資料夾說明
* public - 靜態檔案放置處
* src
    * assets - 圖片放置處
    * components - React 元件放置處
    * pages - 頁面元件放置處
    * store - 共有 function 與 context放置處
    * stylesheets - scss 放置處
    * utils - 放置 firebase 資訊 與 Framer Motion共有動畫

## 聯絡作者
你可以透過以下方式與我聯絡

email: z8937200@gmail.com
This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
