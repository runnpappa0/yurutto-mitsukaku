/**
 * スプレッドシートのデータをクリア（ヘッダー行は保持）
 *
 * 使い方:
 * 1. Google Apps Scriptエディタで新規プロジェクトを作成
 * 2. このコードを貼り付け
 * 3. clearDataRows関数を実行
 *
 * 実行すると、1行目（ヘッダー）を残して、2行目以降のデータ内容をすべてクリアします。
 * 行自体は削除せず、内容のみをクリアします。
 */

function clearDataRows() {
  const SPREADSHEET_ID = '1JdIACemS4miy50cQZfjjeE8qUkMN7_yy6KdR0h-HhsA';
  const SHEET_NAME = '相談依頼';

  try {
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = spreadsheet.getSheetByName(SHEET_NAME);

    if (!sheet) {
      Logger.log(`シート「${SHEET_NAME}」が見つかりません`);
      return;
    }

    const lastRow = sheet.getLastRow();
    const lastColumn = sheet.getLastColumn();

    // データがない場合（ヘッダー行のみ）は何もしない
    if (lastRow <= 1) {
      Logger.log('データ行がありません');
      return;
    }

    // 2行目以降のデータ内容をクリア（行は残す）
    const dataRange = sheet.getRange(2, 1, lastRow - 1, lastColumn);
    dataRange.clearContent();

    Logger.log(`2行目以降のデータ内容をクリアしました`);
    Logger.log('ヘッダー行（1行目）は保持されています');

  } catch (error) {
    Logger.log('エラーが発生しました: ' + error.message);
  }
}
