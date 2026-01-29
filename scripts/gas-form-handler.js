/**
 * ゆるっとミツ確 - フォーム送信ハンドラー（GAS Webアプリ）
 *
 * 使い方:
 * 1. https://script.google.com/ で新しいプロジェクトを作成
 * 2. このコードを貼り付け
 * 3. 「デプロイ」→「新しいデプロイ」
 * 4. 種類: Webアプリ
 * 5. アクセス権: 「全員」
 * 6. デプロイURLをコピーしてNext.js側に設定
 */

// ========================================
// 設定
// ========================================
const CONFIG = {
  SPREADSHEET_ID: '1JdIACemS4miy50cQZfjjeE8qUkMN7_yy6KdR0h-HhsA',
  ADMIN_EMAIL: 'studio.earthsigns@gmail.com',
  CC_EMAIL: 'lin_xiaoling10@yahoo.co.jp',
  DRIVE_FOLDER_NAME: 'ゆるっとミツ確_添付ファイル',
  SHEET_NAME: '相談依頼',
};

// ========================================
// メイン処理: POSTリクエスト受信
// ========================================
function doPost(e) {
  try {
    // CORSヘッダー設定
    const output = ContentService.createTextOutput();
    output.setMimeType(ContentService.MimeType.JSON);

    // リクエストデータの解析
    let requestData;
    try {
      requestData = JSON.parse(e.postData.contents);
    } catch (parseError) {
      return createResponse(output, false, 'Invalid JSON format');
    }

    // データの検証
    if (!requestData.name || !requestData.email) {
      return createResponse(output, false, 'Name and email are required');
    }

    Logger.log('📨 フォーム受信: ' + requestData.name);

    // 1. メール送信（優先処理）
    try {
      sendNotificationEmail(requestData);
      Logger.log('✅ メール送信完了');
    } catch (emailError) {
      Logger.log('❌ メール送信失敗: ' + emailError.message);
      return createResponse(output, false, 'Email sending failed');
    }

    // 2. すぐにレスポンスを返す（ユーザーは待たない）
    const response = createResponse(output, true, 'Form submitted successfully');

    // 3. 非同期処理（スプレッドシート記録 + ファイル保存）
    // GASでは真の非同期はないが、処理を続行
    try {
      const driveLinks = saveFilesToDrive(requestData.files, requestData.name);
      saveToSpreadsheet(requestData, driveLinks);
      Logger.log('✅ スプレッドシート記録完了');
    } catch (saveError) {
      Logger.log('⚠️ スプレッドシート記録失敗: ' + saveError.message);
      // エラーでもユーザーには成功を返す（メール送信済みのため）
    }

    return response;

  } catch (error) {
    Logger.log('❌ エラー: ' + error.message);
    const output = ContentService.createTextOutput();
    output.setMimeType(ContentService.MimeType.JSON);
    return createResponse(output, false, error.message);
  }
}

// ========================================
// GETリクエスト（テスト用）
// ========================================
function doGet() {
  return ContentService.createTextOutput('ゆるっとミツ確 API is running');
}

// ========================================
// メール送信
// ========================================
function sendNotificationEmail(data) {
  const subject = `【ゆるっとミツ確】新規相談依頼：${data.name}様`;

  // 選択ページ一覧を作成
  const selectedPages = [];
  if (data.hearingData.pages.topPage) selectedPages.push('トップページ');
  if (data.hearingData.pages.contactForm) selectedPages.push('お問い合わせ');
  if (data.hearingData.pages.companyProfile) selectedPages.push('会社概要');
  if (data.hearingData.pages.serviceIntro) selectedPages.push('サービス紹介');
  if (data.hearingData.pages.productMenu) selectedPages.push('商品・メニュー');
  if (data.hearingData.pages.facilityIntro) selectedPages.push('施設紹介');
  if (data.hearingData.pages.pricing) selectedPages.push('料金・プラン');
  if (data.hearingData.pages.staffIntro) selectedPages.push('スタッフ紹介');
  if (data.hearingData.pages.access) selectedPages.push('アクセス');
  if (data.hearingData.pages.faq) selectedPages.push('FAQ・よくある質問');
  if (data.hearingData.pages.recruitment) selectedPages.push('採用情報');
  if (data.hearingData.pages.other > 0) selectedPages.push(`その他 (${data.hearingData.pages.other}ページ)`);

  // ブログ機能一覧
  const blogFeatures = [];
  if (data.hearingData.blogFeatures.news) blogFeatures.push('お知らせ・ニュース');
  if (data.hearingData.blogFeatures.blog) blogFeatures.push('ブログ・コラム');
  if (data.hearingData.blogFeatures.activityReport) blogFeatures.push('活動報告');
  if (data.hearingData.blogFeatures.eventInfo) blogFeatures.push('イベント情報');
  if (data.hearingData.blogFeatures.other > 0) blogFeatures.push(`その他 (${data.hearingData.blogFeatures.other}種類)`);

  // ギャラリー機能一覧
  const galleryFeatures = [];
  if (data.hearingData.galleryFeatures.portfolio) galleryFeatures.push('実績・事例紹介');
  if (data.hearingData.galleryFeatures.products) galleryFeatures.push('商品紹介');
  if (data.hearingData.galleryFeatures.testimonials) galleryFeatures.push('お客様の声');
  if (data.hearingData.galleryFeatures.staff) galleryFeatures.push('スタッフ紹介');
  if (data.hearingData.galleryFeatures.photoGallery) galleryFeatures.push('フォトギャラリー');
  if (data.hearingData.galleryFeatures.other > 0) galleryFeatures.push(`その他 (${data.hearingData.galleryFeatures.other}種類)`);

  const body = `
ゆるっとミツ確より新規相談依頼がありました。

━━━━━━━━━━━━━━━━━━━━
■ お客様情報
━━━━━━━━━━━━━━━━━━━━
お名前: ${data.name}
メールアドレス: ${data.email}

━━━━━━━━━━━━━━━━━━━━
■ ヒアリング内容
━━━━━━━━━━━━━━━━━━━━
【目的】
${data.hearingData.objective}

【業種】
${data.hearingData.industry}${data.hearingData.industryDetail ? ' (' + data.hearingData.industryDetail + ')' : ''}

【デザインスタイル】
${data.hearingData.designStyle}

【選択ページ】
${selectedPages.join(', ')}
（合計: ${data.priceBreakdown.totalPageCount}ページ）

${blogFeatures.length > 0 ? `【ブログ機能】\n${blogFeatures.join(', ')}` : ''}

${galleryFeatures.length > 0 ? `【ギャラリー機能】\n${galleryFeatures.join(', ')}` : ''}

━━━━━━━━━━━━━━━━━━━━
■ お見積もり
━━━━━━━━━━━━━━━━━━━━
基本料金: ¥${data.priceBreakdown.basePrice.toLocaleString()}
追加ページ料金: ¥${data.priceBreakdown.additionalPagesPrice.toLocaleString()}
ブログ機能料金: ¥${data.priceBreakdown.blogFeaturesPrice.toLocaleString()}
ギャラリー機能料金: ¥${data.priceBreakdown.galleryFeaturesPrice.toLocaleString()}

【見積もり総額（税別）】
¥${data.priceBreakdown.subtotal.toLocaleString()}

━━━━━━━━━━━━━━━━━━━━
■ 追加情報
━━━━━━━━━━━━━━━━━━━━
${data.existingUrl ? `【既存サイトURL】\n${data.existingUrl}\n\n` : ''}${data.referenceUrls && data.referenceUrls.length > 0 ? `【参考サイト】\n${data.referenceUrls.filter(url => url).join('\n')}\n\n` : ''}${data.additionalRequests ? `【追加のご要望】\n${data.additionalRequests}\n\n` : ''}${data.files && data.files.length > 0 ? `【添付ファイル】\n${data.files.length}件の添付ファイルがあります\n※Googleドライブに保存されます\n\n` : ''}
━━━━━━━━━━━━━━━━━━━━

詳細はスプレッドシートをご確認ください：
https://docs.google.com/spreadsheets/d/${CONFIG.SPREADSHEET_ID}/edit

--
ゆるっとミツ確 自動送信メール
  `;

  // メール送信
  MailApp.sendEmail({
    to: CONFIG.ADMIN_EMAIL,
    cc: CONFIG.CC_EMAIL,
    subject: subject,
    body: body,
  });
}

// ========================================
// Googleドライブにファイル保存
// ========================================
function saveFilesToDrive(files, customerName) {
  if (!files || files.length === 0) {
    return '';
  }

  try {
    // メインフォルダを取得または作成
    let mainFolder = getOrCreateFolder(CONFIG.DRIVE_FOLDER_NAME);

    // 顧客専用フォルダを作成（日時_名前）
    const timestamp = Utilities.formatDate(new Date(), 'Asia/Tokyo', 'yyyyMMdd_HHmmss');
    const customerFolderName = `${timestamp}_${customerName}`;
    const customerFolder = mainFolder.createFolder(customerFolderName);

    // 各ファイルを保存
    files.forEach((file, index) => {
      try {
        // Base64デコード
        const decoded = Utilities.base64Decode(file.data);
        const blob = Utilities.newBlob(decoded, file.mimeType, file.name);

        // ファイルを保存
        customerFolder.createFile(blob);

        Logger.log(`✅ ファイル保存: ${file.name}`);
      } catch (fileError) {
        Logger.log(`⚠️ ファイル保存失敗 (${file.name}): ${fileError.message}`);
      }
    });

    // フォルダの共有リンクを返す
    customerFolder.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    return customerFolder.getUrl();

  } catch (error) {
    Logger.log(`❌ ドライブ保存エラー: ${error.message}`);
    return '';
  }
}

// ========================================
// フォルダを取得または作成
// ========================================
function getOrCreateFolder(folderName) {
  const folders = DriveApp.getFoldersByName(folderName);
  if (folders.hasNext()) {
    return folders.next();
  } else {
    return DriveApp.createFolder(folderName);
  }
}

// ========================================
// スプレッドシートに記録
// ========================================
function saveToSpreadsheet(data, driveLinks) {
  const spreadsheet = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
  const sheet = spreadsheet.getSheetByName(CONFIG.SHEET_NAME);

  // 選択ページ一覧を作成
  const selectedPages = [];
  if (data.hearingData.pages.topPage) selectedPages.push('トップページ');
  if (data.hearingData.pages.contactForm) selectedPages.push('お問い合わせ');
  if (data.hearingData.pages.companyProfile) selectedPages.push('会社概要');
  if (data.hearingData.pages.serviceIntro) selectedPages.push('サービス紹介');
  if (data.hearingData.pages.productMenu) selectedPages.push('商品・メニュー');
  if (data.hearingData.pages.facilityIntro) selectedPages.push('施設紹介');
  if (data.hearingData.pages.pricing) selectedPages.push('料金・プラン');
  if (data.hearingData.pages.staffIntro) selectedPages.push('スタッフ紹介');
  if (data.hearingData.pages.access) selectedPages.push('アクセス');
  if (data.hearingData.pages.faq) selectedPages.push('FAQ・よくある質問');
  if (data.hearingData.pages.recruitment) selectedPages.push('採用情報');
  if (data.hearingData.pages.other > 0) selectedPages.push(`その他(${data.hearingData.pages.other})`);

  // ブログ機能一覧
  const blogFeatures = [];
  if (data.hearingData.blogFeatures.news) blogFeatures.push('お知らせ・ニュース');
  if (data.hearingData.blogFeatures.blog) blogFeatures.push('ブログ・コラム');
  if (data.hearingData.blogFeatures.activityReport) blogFeatures.push('活動報告');
  if (data.hearingData.blogFeatures.eventInfo) blogFeatures.push('イベント情報');
  if (data.hearingData.blogFeatures.other > 0) blogFeatures.push(`その他(${data.hearingData.blogFeatures.other})`);

  // ギャラリー機能一覧
  const galleryFeatures = [];
  if (data.hearingData.galleryFeatures.portfolio) galleryFeatures.push('実績・事例紹介');
  if (data.hearingData.galleryFeatures.products) galleryFeatures.push('商品紹介');
  if (data.hearingData.galleryFeatures.testimonials) galleryFeatures.push('お客様の声');
  if (data.hearingData.galleryFeatures.staff) galleryFeatures.push('スタッフ紹介');
  if (data.hearingData.galleryFeatures.photoGallery) galleryFeatures.push('フォトギャラリー');
  if (data.hearingData.galleryFeatures.other > 0) galleryFeatures.push(`その他(${data.hearingData.galleryFeatures.other})`);

  // 参考サイトURLを結合
  const referenceUrlsText = data.referenceUrls ? data.referenceUrls.filter(url => url).join('\n') : '';

  // データ行を作成（23列）
  const rowData = [
    new Date(), // A: 受信日時
    '未対応', // B: ステータス
    data.name, // C: お名前
    data.email, // D: メールアドレス
    data.hearingData.objective, // E: 目的
    data.hearingData.industry, // F: 業種
    data.hearingData.industryDetail, // G: 業種詳細
    data.hearingData.designStyle, // H: デザインスタイル
    selectedPages.join(', '), // I: 選択ページ一覧
    data.priceBreakdown.totalPageCount, // J: ページ数
    blogFeatures.join(', '), // K: ブログ機能
    galleryFeatures.join(', '), // L: ギャラリー機能
    data.priceBreakdown.basePrice, // M: 基本料金
    data.priceBreakdown.additionalPagesPrice, // N: 追加ページ料金
    data.priceBreakdown.blogFeaturesPrice, // O: ブログ機能料金
    data.priceBreakdown.galleryFeaturesPrice, // P: ギャラリー機能料金
    data.priceBreakdown.subtotal, // Q: 見積もり総額（税別）
    data.existingUrl || '', // R: 既存サイトURL
    data.referenceUrls ? data.referenceUrls[0] || '' : '', // S: 参考サイト1
    data.referenceUrls ? data.referenceUrls[1] || '' : '', // T: 参考サイト2
    data.referenceUrls ? data.referenceUrls[2] || '' : '', // U: 参考サイト3
    driveLinks, // V: 添付ファイル
    data.additionalRequests || '', // W: 追加のご要望
  ];

  // 最終行の次に追加
  sheet.appendRow(rowData);

  Logger.log('✅ スプレッドシート記録完了');
}

// ========================================
// レスポンス作成
// ========================================
function createResponse(output, success, message) {
  const response = {
    success: success,
    message: message,
    timestamp: new Date().toISOString(),
  };

  output.setContent(JSON.stringify(response));
  return output;
}

// ========================================
// テスト用関数
// ========================================
function testEmail() {
  const testData = {
    name: 'テスト太郎',
    email: 'test@example.com',
    hearingData: {
      objective: '会社・事業の紹介',
      industry: '美容・健康',
      industryDetail: '整骨院',
      designStyle: 'シンプル・ミニマル',
      pages: {
        topPage: true,
        contactForm: true,
        companyProfile: true,
        serviceIntro: false,
        productMenu: false,
        facilityIntro: false,
        pricing: false,
        staffIntro: false,
        access: true,
        faq: false,
        recruitment: false,
        other: 0,
      },
      blogFeatures: {
        news: true,
        blog: false,
        activityReport: false,
        eventInfo: false,
        other: 0,
      },
      galleryFeatures: {
        portfolio: true,
        products: false,
        testimonials: true,
        staff: false,
        photoGallery: false,
        other: 0,
      },
    },
    priceBreakdown: {
      basePrice: 50000,
      additionalPagesPrice: 20000,
      blogFeaturesPrice: 20000,
      galleryFeaturesPrice: 45000,
      subtotal: 135000,
      totalPageCount: 4,
    },
    existingUrl: 'https://example.com',
    referenceUrls: ['https://ref1.com', '', ''],
    additionalRequests: '納期は2ヶ月程度を希望しています。',
  };

  sendNotificationEmail(testData);
  Logger.log('✅ テストメール送信完了');
}
