/**
 * ゆるっとミツ確 - スプレッドシート作成・整形スクリプト（GAS用）
 *
 * 使い方:
 * 1. Google Apps Script (https://script.google.com/) で新しいプロジェクトを作成
 * 2. このコードを貼り付け
 * 3. createFormattedSpreadsheet() 関数を実行
 * 4. 初回実行時、権限を承認
 * 5. 実行ログにスプレッドシートURLとIDが表示される
 */

function createFormattedSpreadsheet() {
  // スプレッドシート作成
  const spreadsheet = SpreadsheetApp.create('ゆるっとミツ確 - 相談依頼データ');
  const sheet = spreadsheet.getSheets()[0];
  sheet.setName('相談依頼');

  const spreadsheetId = spreadsheet.getId();
  const spreadsheetUrl = spreadsheet.getUrl();

  Logger.log('✅ スプレッドシート作成完了');
  Logger.log('📋 スプレッドシートID: ' + spreadsheetId);
  Logger.log('🔗 URL: ' + spreadsheetUrl);

  // ヘッダー設定
  const headers = [
    '受信日時', 'ステータス', 'お名前', 'メールアドレス',
    '目的', '業種', '業種詳細', 'デザインスタイル',
    '選択ページ一覧', 'ページ数', 'ブログ機能', 'ギャラリー機能',
    '基本料金', '追加ページ料金', 'ブログ機能料金', 'ギャラリー機能料金', '見積もり総額（税別）',
    '既存サイトURL', '参考サイト1', '参考サイト2', '参考サイト3',
    '添付ファイル', '追加のご要望'
  ];

  const columnWidths = [
    160, 100, 120, 200,
    150, 120, 150, 120,
    300, 80, 200, 200,
    100, 120, 120, 140, 140,
    250, 250, 250, 250,
    300, 400
  ];

  // 1. ヘッダー行を設定
  const headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setValues([headers]);

  // 2. ヘッダー行のスタイル設定
  headerRange
    .setBackground('#2d4259')
    .setFontColor('#ffffff')
    .setFontWeight('bold')
    .setFontSize(10)
    .setHorizontalAlignment('center')
    .setVerticalAlignment('middle');

  // 3. ヘッダー行の高さ設定
  sheet.setRowHeight(1, 40);

  // 4. 列幅の設定
  for (let i = 0; i < columnWidths.length; i++) {
    sheet.setColumnWidth(i + 1, columnWidths[i]);
  }

  // 5. 固定行・列の設定
  sheet.setFrozenRows(1); // ヘッダー行を固定
  sheet.setFrozenColumns(2); // 受信日時・ステータス列を固定

  // 6. ステータス列（B列）にドロップダウンを設定
  const statusRange = sheet.getRange(2, 2, 999, 1); // B2:B1000
  const rule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['未対応', '対応中', '完了'], true)
    .setAllowInvalid(false)
    .build();
  statusRange.setDataValidation(rule);

  // 7. 金額列（M〜Q列）の通貨形式設定
  for (let col = 13; col <= 17; col++) { // M列(13) 〜 Q列(17)
    const range = sheet.getRange(2, col, 999, 1);
    range.setNumberFormat('¥#,##0');
  }

  // 8. URL列とテキスト列の折り返し設定
  // R〜W列（18〜23列）
  for (let col = 18; col <= 23; col++) {
    const range = sheet.getRange(2, col, 999, 1);
    range.setWrap(true);
    range.setVerticalAlignment('top');
  }

  // 9. 交互背景色（縞模様）を設定
  const dataRange = sheet.getRange(2, 1, 999, headers.length);
  dataRange.applyRowBanding(SpreadsheetApp.BandingTheme.LIGHT_GREY, false, false);

  // 10. シート全体のフォント設定
  sheet.getRange(1, 1, 1000, headers.length).setFontFamily('Noto Sans JP');

  Logger.log('✅ フォーマット設定完了');
  Logger.log('');
  Logger.log('📝 次のステップ:');
  Logger.log('1. スプレッドシートを開く: ' + spreadsheetUrl);
  Logger.log('2. 「共有」からGASのサービスアカウントに編集権限を付与');
  Logger.log('3. スプレッドシートIDをメモ: ' + spreadsheetId);

  // スプレッドシートを開く（オプション）
  // SpreadsheetApp.openById(spreadsheetId);

  return {
    id: spreadsheetId,
    url: spreadsheetUrl
  };
}

/**
 * サンプルデータを追加（テスト用）
 */
function addSampleData() {
  const spreadsheetId = 'YOUR_SPREADSHEET_ID'; // ← ここに作成したスプレッドシートIDを入力
  const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
  const sheet = spreadsheet.getSheetByName('相談依頼');

  const sampleData = [
    [
      new Date(), // 受信日時
      '未対応', // ステータス
      '山田太郎', // お名前
      'yamada@example.com', // メールアドレス
      '会社・事業の紹介', // 目的
      '美容・健康', // 業種
      '整骨院', // 業種詳細
      'シンプル・ミニマル', // デザインスタイル
      'トップページ, お問い合わせ, 会社概要, アクセス', // 選択ページ一覧
      4, // ページ数
      'お知らせ・ニュース', // ブログ機能
      '実績・事例紹介, お客様の声', // ギャラリー機能
      50000, // 基本料金
      20000, // 追加ページ料金
      20000, // ブログ機能料金
      45000, // ギャラリー機能料金
      135000, // 見積もり総額
      'https://example.com', // 既存サイトURL
      'https://reference1.com', // 参考サイト1
      '', // 参考サイト2
      '', // 参考サイト3
      'https://drive.google.com/file/xxx', // 添付ファイル
      '納期は2ヶ月程度を希望しています。' // 追加のご要望
    ]
  ];

  sheet.getRange(2, 1, 1, sampleData[0].length).setValues(sampleData);
  Logger.log('✅ サンプルデータを追加しました');
}
