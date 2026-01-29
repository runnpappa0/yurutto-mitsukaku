/**
 * ゆるっとミツ確 - スプレッドシート作成スクリプト
 *
 * 使い方:
 * 1. Google Cloud Consoleでプロジェクト作成
 * 2. Google Sheets API有効化
 * 3. サービスアカウント作成 & JSONキーダウンロード
 * 4. credentials.json として保存
 * 5. npm install googleapis を実行
 * 6. node scripts/createSpreadsheet.js
 */

const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

// 認証設定
const CREDENTIALS_PATH = path.join(__dirname, 'credentials.json');
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

// スプレッドシート設計
const HEADERS = [
  { name: '受信日時', width: 160 },
  { name: 'ステータス', width: 100 },
  { name: 'お名前', width: 120 },
  { name: 'メールアドレス', width: 200 },
  { name: '目的', width: 150 },
  { name: '業種', width: 120 },
  { name: '業種詳細', width: 150 },
  { name: 'デザインスタイル', width: 120 },
  { name: '選択ページ一覧', width: 300 },
  { name: 'ページ数', width: 80 },
  { name: 'ブログ機能', width: 200 },
  { name: 'ギャラリー機能', width: 200 },
  { name: '基本料金', width: 100 },
  { name: '追加ページ料金', width: 120 },
  { name: 'ブログ機能料金', width: 120 },
  { name: 'ギャラリー機能料金', width: 140 },
  { name: '見積もり総額（税別）', width: 140 },
  { name: '既存サイトURL', width: 250 },
  { name: '参考サイト1', width: 250 },
  { name: '参考サイト2', width: 250 },
  { name: '参考サイト3', width: 250 },
  { name: '添付ファイル', width: 300 },
  { name: '追加のご要望', width: 400 },
];

// カラーパレット（ゆるっとミツ確のデザイン）
const COLORS = {
  primary: { red: 0.87, green: 0.33, blue: 0.38 }, // #de5361
  secondary: { red: 0.18, green: 0.26, blue: 0.35 }, // #2d4259
  headerBg: { red: 0.18, green: 0.26, blue: 0.35 }, // #2d4259
  headerText: { red: 1, green: 1, blue: 1 }, // white
  oddRow: { red: 0.98, green: 0.98, blue: 0.98 }, // #fafafa
  evenRow: { red: 1, green: 1, blue: 1 }, // white
};

async function createSpreadsheet() {
  try {
    // 認証
    const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH));
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: SCOPES,
    });

    const sheets = google.sheets({ version: 'v4', auth });

    console.log('📊 スプレッドシートを作成中...');

    // スプレッドシート作成
    const spreadsheet = await sheets.spreadsheets.create({
      requestBody: {
        properties: {
          title: 'ゆるっとミツ確 - 相談依頼データ',
          locale: 'ja_JP',
          timeZone: 'Asia/Tokyo',
        },
        sheets: [{
          properties: {
            title: '相談依頼',
            gridProperties: {
              rowCount: 1000,
              columnCount: HEADERS.length,
              frozenRowCount: 1, // ヘッダー行を固定
              frozenColumnCount: 2, // 受信日時・ステータスを固定
            },
          },
        }],
      },
    });

    const spreadsheetId = spreadsheet.data.spreadsheetId;
    const sheetId = spreadsheet.data.sheets[0].properties.sheetId;

    console.log(`✅ スプレッドシート作成完了: ${spreadsheet.data.spreadsheetUrl}`);
    console.log(`📋 スプレッドシートID: ${spreadsheetId}`);

    // バッチ更新リクエストを準備
    const requests = [];

    // 1. ヘッダー行のデータ入力
    const headerValues = HEADERS.map(h => h.name);
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: '相談依頼!A1:W1',
      valueInputOption: 'RAW',
      requestBody: {
        values: [headerValues],
      },
    });

    // 2. 列幅の設定
    HEADERS.forEach((header, index) => {
      requests.push({
        updateDimensionProperties: {
          range: {
            sheetId,
            dimension: 'COLUMNS',
            startIndex: index,
            endIndex: index + 1,
          },
          properties: {
            pixelSize: header.width,
          },
          fields: 'pixelSize',
        },
      });
    });

    // 3. ヘッダー行のスタイル設定
    requests.push({
      repeatCell: {
        range: {
          sheetId,
          startRowIndex: 0,
          endRowIndex: 1,
          startColumnIndex: 0,
          endColumnIndex: HEADERS.length,
        },
        cell: {
          userEnteredFormat: {
            backgroundColor: COLORS.headerBg,
            textFormat: {
              foregroundColor: COLORS.headerText,
              fontSize: 10,
              bold: true,
            },
            horizontalAlignment: 'CENTER',
            verticalAlignment: 'MIDDLE',
          },
        },
        fields: 'userEnteredFormat(backgroundColor,textFormat,horizontalAlignment,verticalAlignment)',
      },
    });

    // 4. ヘッダー行の高さ設定
    requests.push({
      updateDimensionProperties: {
        range: {
          sheetId,
          dimension: 'ROWS',
          startIndex: 0,
          endIndex: 1,
        },
        properties: {
          pixelSize: 40,
        },
        fields: 'pixelSize',
      },
    });

    // 5. データ行の交互背景色（縞模様）
    requests.push({
      addConditionalFormatRule: {
        rule: {
          ranges: [{
            sheetId,
            startRowIndex: 1,
            endRowIndex: 1000,
            startColumnIndex: 0,
            endColumnIndex: HEADERS.length,
          }],
          booleanRule: {
            condition: {
              type: 'CUSTOM_FORMULA',
              values: [{ userEnteredValue: '=MOD(ROW(),2)=0' }],
            },
            format: {
              backgroundColor: COLORS.oddRow,
            },
          },
        },
        index: 0,
      },
    });

    // 6. ステータス列（B列）にデータ検証（ドロップダウン）
    requests.push({
      setDataValidation: {
        range: {
          sheetId,
          startRowIndex: 1,
          endRowIndex: 1000,
          startColumnIndex: 1, // B列
          endColumnIndex: 2,
        },
        rule: {
          condition: {
            type: 'ONE_OF_LIST',
            values: [
              { userEnteredValue: '未対応' },
              { userEnteredValue: '対応中' },
              { userEnteredValue: '完了' },
            ],
          },
          showCustomUi: true,
          strict: true,
        },
      },
    });

    // 7. 金額列（M〜Q列）の書式設定（通貨形式）
    for (let col = 12; col <= 16; col++) { // M列(12) 〜 Q列(16)
      requests.push({
        repeatCell: {
          range: {
            sheetId,
            startRowIndex: 1,
            endRowIndex: 1000,
            startColumnIndex: col,
            endColumnIndex: col + 1,
          },
          cell: {
            userEnteredFormat: {
              numberFormat: {
                type: 'CURRENCY',
                pattern: '¥#,##0',
              },
            },
          },
          fields: 'userEnteredFormat.numberFormat',
        },
      });
    }

    // 8. URL列（R〜U列）のテキスト折り返し設定
    for (let col = 17; col <= 20; col++) { // R列(17) 〜 U列(20)
      requests.push({
        repeatCell: {
          range: {
            sheetId,
            startRowIndex: 1,
            endRowIndex: 1000,
            startColumnIndex: col,
            endColumnIndex: col + 1,
          },
          cell: {
            userEnteredFormat: {
              wrapStrategy: 'WRAP',
            },
          },
          fields: 'userEnteredFormat.wrapStrategy',
        },
      });
    }

    // 9. 添付ファイル列（V列）と追加要望列（W列）のテキスト折り返し
    for (let col = 21; col <= 22; col++) { // V列(21) 〜 W列(22)
      requests.push({
        repeatCell: {
          range: {
            sheetId,
            startRowIndex: 1,
            endRowIndex: 1000,
            startColumnIndex: col,
            endColumnIndex: col + 1,
          },
          cell: {
            userEnteredFormat: {
              wrapStrategy: 'WRAP',
              verticalAlignment: 'TOP',
            },
          },
          fields: 'userEnteredFormat(wrapStrategy,verticalAlignment)',
        },
      });
    }

    // バッチ更新実行
    console.log('🎨 フォーマットを適用中...');
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: { requests },
    });

    console.log('✅ フォーマット適用完了！');
    console.log('\n📝 次のステップ:');
    console.log('1. スプレッドシートのURLをブラウザで開く');
    console.log('2. 「共有」ボタンからGASのサービスアカウントに編集権限を付与');
    console.log('3. スプレッドシートIDをGASコードに設定');
    console.log(`\nスプレッドシートURL: ${spreadsheet.data.spreadsheetUrl}`);
    console.log(`スプレッドシートID: ${spreadsheetId}`);

    // 設定ファイルに保存
    const config = {
      spreadsheetId,
      spreadsheetUrl: spreadsheet.data.spreadsheetUrl,
      createdAt: new Date().toISOString(),
    };

    fs.writeFileSync(
      path.join(__dirname, 'spreadsheet-config.json'),
      JSON.stringify(config, null, 2)
    );

    console.log('\n💾 設定ファイルを保存しました: scripts/spreadsheet-config.json');

  } catch (error) {
    console.error('❌ エラーが発生しました:', error.message);
    if (error.errors) {
      console.error('詳細:', error.errors);
    }
  }
}

// 実行
createSpreadsheet();
