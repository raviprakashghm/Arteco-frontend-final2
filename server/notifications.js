const PDFDocument = require('pdfkit');
const nodemailer = require('nodemailer');
const twilio = require('twilio');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Twilio Setup
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioWhatsappFrom = process.env.TWILIO_WHATSAPP_FROM || 'whatsapp:+14155238886'; // Twilio sandbox

// Nodemailer Setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

async function generatePDF(order) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50 });
      const orderId = order.order_id || order.id || 'UNKNOWN';
      const filename = `order_${orderId}.pdf`;
      const filepath = path.join('/tmp', filename);
      const stream = fs.createWriteStream(filepath);

      doc.pipe(stream);

      // Header
      doc.fontSize(22).fillColor('#C9A14A').text('ARTECO', { align: 'center' });
      doc.fontSize(10).fillColor('#888888').text('Built by Architects for Architectural Students', { align: 'center' });
      doc.moveDown();
      doc.moveTo(50, doc.y).lineTo(545, doc.y).strokeColor('#333333').stroke();
      doc.moveDown();

      // Order Info
      doc.fontSize(16).fillColor('#FFFFFF').text('Order Confirmation', { align: 'center' });
      doc.moveDown(0.5);
      doc.fontSize(11).fillColor('#CCCCCC');
      doc.text(`Order ID: ${orderId}`);
      doc.text(`Customer Email: ${order.user_email}`);
      doc.text(`Amount Paid: Rs. ${order.amount}`);
      doc.text(`Expected Delivery: ${order.expected_delivery_date || 'Within 6 days'}`);
      doc.text(`Status: ${order.status || 'Order Placed'}`);

      if (order.shipping_address) {
        doc.moveDown(0.5);
        doc.text(`Shipping Address: ${order.shipping_address}`);
      }

      // Items
      doc.moveDown();
      doc.moveTo(50, doc.y).lineTo(545, doc.y).strokeColor('#333333').stroke();
      doc.moveDown(0.5);
      doc.fontSize(13).fillColor('#C9A14A').text('Items Ordered:');
      doc.moveDown(0.3);

      const items = Array.isArray(order.items) ? order.items : [];
      items.forEach(item => {
        doc.fontSize(10).fillColor('#CCCCCC').text(
          `• ${item.name || 'Item'} × ${item.quantity || 1}  —  Rs. ${item.price || 0}`
        );
      });

      // Footer
      doc.moveDown(2);
      doc.moveTo(50, doc.y).lineTo(545, doc.y).strokeColor('#333333').stroke();
      doc.moveDown(0.5);
      doc.fontSize(10).fillColor('#888888').text('Thank you for shopping with Arteco!', { align: 'center' });
      doc.text('Track your order at arteco website.', { align: 'center' });

      doc.end();

      stream.on('finish', () => resolve(filepath));
      stream.on('error', reject);
    } catch (err) {
      reject(err);
    }
  });
}

async function sendEmail(order) {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log('[Email] Skipped — EMAIL_USER/EMAIL_PASS not configured');
    return;
  }

  try {
    const pdfPath = await generatePDF(order);
    const orderId = order.order_id || order.id;

    await transporter.sendMail({
      from: `"Arteco" <${process.env.EMAIL_USER}>`,
      to: order.user_email,
      subject: `✅ Order Confirmed — #${orderId} | Arteco`,
      html: `
        <div style="background:#111; color:#eee; font-family:Arial,sans-serif; padding:32px; border-radius:12px; max-width:560px; margin:auto">
          <h2 style="color:#C9A14A; margin-bottom:4px">Order Confirmed ✅</h2>
          <p style="color:#aaa; margin-top:0">Arteco — Built by Architects for Architectural Students</p>
          <hr style="border-color:#333; margin:16px 0"/>
          <p><b>Order ID:</b> ${orderId}</p>
          <p><b>Amount Paid:</b> ₹${order.amount}</p>
          <p><b>Expected Delivery:</b> ${order.expected_delivery_date || 'Within 6 business days'}</p>
          ${order.shipping_address ? `<p><b>Shipping To:</b> ${order.shipping_address}</p>` : ''}
          <hr style="border-color:#333; margin:16px 0"/>
          <p style="color:#aaa; font-size:13px">Your invoice PDF is attached below. Thank you for shopping with Arteco!</p>
        </div>
      `,
      attachments: [{ filename: `order_${orderId}.pdf`, path: pdfPath }]
    });

    console.log(`[Email] ✅ Sent to ${order.user_email}`);

    // Cleanup temp PDF
    try { fs.unlinkSync(pdfPath); } catch (_) {}
  } catch (err) {
    console.error('[Email] ❌ Failed:', err.message);
  }
}

async function sendWhatsApp(order) {
  if (!accountSid || !authToken || accountSid === 'undefined') {
    console.log('[WhatsApp] Skipped — Twilio credentials not configured');
    return;
  }

  // Use the phone from order, fallback to env var
  const userPhone = order.phone || process.env.TWILIO_TEST_TO;
  if (!userPhone) {
    console.log('[WhatsApp] Skipped — No user phone number available');
    return;
  }

  // Ensure proper format
  const toNumber = userPhone.startsWith('whatsapp:')
    ? userPhone
    : `whatsapp:+91${userPhone.replace(/\D/g, '').slice(-10)}`;

  try {
    const client = twilio(accountSid, authToken);
    const orderId = order.order_id || order.id;

    await client.messages.create({
      from: twilioWhatsappFrom,
      to: toNumber,
      body: `🎉 *Order Confirmed!*\n\nHi! Your Arteco order *#${orderId}* has been placed successfully.\n\n📦 *Amount:* ₹${order.amount}\n🚚 *Expected Delivery:* ${order.expected_delivery_date || 'Within 6 business days'}\n\nTrack your order on our website. Thank you for shopping with Arteco!`
    });

    console.log(`[WhatsApp] ✅ Sent to ${toNumber}`);
  } catch (err) {
    console.error('[WhatsApp] ❌ Failed:', err.message);
  }
}

// Main function — called from routes. Respects emailEnabled/whatsappEnabled flags
async function sendOrderConfirmation(order, { emailEnabled = true, whatsappEnabled = true } = {}) {
  try {
    const promises = [];

    if (emailEnabled && order.user_email) {
      promises.push(sendEmail(order));
    }

    if (whatsappEnabled) {
      promises.push(sendWhatsApp(order));
    }

    // Fire both in parallel without blocking the response
    await Promise.allSettled(promises);
  } catch (err) {
    console.error('[Notifications] Error:', err);
  }
}

module.exports = { sendOrderConfirmation };
