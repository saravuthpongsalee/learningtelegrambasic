// 🔐 ใส่ TOKEN ของบอท Telegram ของคุณที่ได้จาก @BotFather
const TELEGRAM_TOKEN = '8138304707:AAGUCHJm7RHl0u4kIslGDzPw7zx4cj5JjEw';
const TELEGRAM_API_URL = `https://api.telegram.org/bot${TELEGRAM_TOKEN}`;

// 🔗 ใส่ URL ของ Web App ที่ deploy แล้ว
const WEBHOOK_URL = 'https://script.google.com/macros/s/AKfycbzBJ10k_Ggk7qCGg7nrOM6FHcbbNJ_OSeWHYiR14J6frGoB2W0xMc76TFXEOtJ1NnnV/exec';

// 📨 ส่งข้อความไปยัง Telegram
function sendMessageToTelegram(message, chatId) {
  if (!message || message.trim() === '' || !chatId) {
    Logger.log("❌ ไม่สามารถส่งข้อความว่าง หรือไม่มี chatId");
    return;
  }

  const url = `${TELEGRAM_API_URL}/sendMessage`;
  const payload = {
    chat_id: chatId,
    text: message,
  };

  const options = {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify(payload),
  };

  try {
    const response = UrlFetchApp.fetch(url, options);
    Logger.log("📤 ส่งข้อความแล้ว: " + response.getContentText());
  } catch (error) {
    Logger.log("❌ ส่งข้อความล้มเหลว: " + error);
  }
}

// ✅ ส่งข้อความคงที่ไปยัง chat ล่าสุด
function sendText() {
  const chatId = getChatId();  // ดึง chat ล่าสุดจาก getUpdates()

  if (chatId) {
    const message = "📨 นี้คือข้อความจาก Telegram ในโปรแกรมผม";
    sendMessageToTelegram(message, chatId);
  } else {
    Logger.log("❌ ไม่พบ chat ID สำหรับส่งข้อความ");
  }
}

// ⚙️ ตั้งค่า Webhook
function setWebhook() {
  const url = `${TELEGRAM_API_URL}/setWebhook?url=${encodeURIComponent(WEBHOOK_URL)}`;
  const response = UrlFetchApp.fetch(url);
  Logger.log("📡 ตั้ง webhook แล้ว: " + response.getContentText());
}

// ❌ ลบ Webhook
function deleteWebhook() {
  const url = `${TELEGRAM_API_URL}/deleteWebhook`;
  const response = UrlFetchApp.fetch(url);
  Logger.log("🗑️ ลบ webhook แล้ว: " + response.getContentText());
}

// 🔍 ตรวจสอบข้อมูล Bot (token ใช้งานได้หรือไม่)
function getBotInfo() {
  const url = `${TELEGRAM_API_URL}/getMe`;
  const response = UrlFetchApp.fetch(url);
  Logger.log("ℹ️ ข้อมูลบอท: " + response.getContentText());
}

// 🧾 หาค่า Chat ID จากข้อความล่าสุด
function getChatId() {
  const url = `${TELEGRAM_API_URL}/getUpdates`;
  const response = UrlFetchApp.fetch(url);
  const data = JSON.parse(response.getContentText());

  if (data.ok && data.result.length > 0) {
    const chatId = data.result[data.result.length - 1].message.chat.id;
    Logger.log("🆔 Chat ID: " + chatId);
    return chatId;
  } else {
    Logger.log("❌ ไม่พบข้อความใด ๆ");
    return null;
  }
}

// 📥 รับข้อความจาก Webhook แล้วตอบกลับ
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const message = data.message;

    if (!message || !message.chat || !message.chat.id || !message.text) {
      Logger.log("⚠️ ไม่มีข้อความ หรือ chat id ที่ใช้งานได้");
      return;
    }

    const chatId = message.chat.id;
    const text = message.text;

    // 📤 ส่งข้อความตอบกลับ
    sendMessageToTelegram(`คุณพิมพ์ว่า: ${text}`, chatId);
  } catch (error) {
    Logger.log("❌ doPost error: " + error);
  }
}
