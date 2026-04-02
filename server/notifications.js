const PDFDocument = require('pdfkit');
const nodemailer = require('nodemailer');
const twilio = require('twilio');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Twilio Setup
const accountSid = process.env.TWILIO_ACCOUNT_SID || 'placeholder_sid';
const authToken = process.env.TWILIO_AUTH_TOKEN || 'placeholder_token';
const client = twilio(accountSid, authToken);

// Nodemailer Setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'your_email@gmail.com',
    pass: process.env.EMAIL_PASS || 'your_password'
  }
});

async function generatePDF(order) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument();
      const filename = `order_${order.id}.pdf`;
      const filepath = path.join(__dirname, filename);
      const stream = fs.createWriteStream(filepath);

      doc.pipe(stream);
      
      doc.fontSize(20).text('Order Confirmation - Arteco', { align: 'center' });
      doc.moveDown();
      doc.fontSize(14).text(`Order ID: ${order.id}`);
      doc.text(`User Email: ${order.user_email}`);
      doc.text(`Amount Paid: Rs. ${order.amount / 100}`);
      doc.text(`Expected Delivery Date: ${order.expected_delivery_date}`);
      doc.moveDown();
      doc.text('Items:');
      order.items.forEach(item => {
        doc.text(`- ${item.name} x ${item.quantity}`);
      });
      doc.moveDown();
      doc.text('Thank you for shopping with Arteco!', { align: 'center' });

      doc.end();

      stream.on('finish', () => {
        resolve(filepath);
      });
    } catch (err) {
      reject(err);
    }
  });
}

async function sendOrderConfirmation(order) {
  try {
    const pdfPath = await generatePDF(order);

    // Send Email
    if (order.user_email) {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: order.user_email,
        subject: `Order Confirmation - ${order.id}`,
        text: `Your order ${order.id} has been placed successfully. Please find the receipt attached.`,
        attachments: [
          {
            filename: `order_${order.id}.pdf`,
            path: pdfPath
          }
        ]
      }).catch(err => console.log('Email send failed:', err.message));
    }

    // Send WhatsApp Message 
    // Usually via twilio whatsapp api: whatsapp:+14155238886 -> whatsapp:+919448925051
    await client.messages.create({
      from: 'whatsapp:+14155238886', // Twilio sandbox number
      to: 'whatsapp:+919448925051', // User's requested number
      body: `Hi! Your order with Arteco (Order ID: ${order.id}) has been placed. Expected delivery is on ${order.expected_delivery_date}. Check email for receipt. Track order on our website.`
    }).catch(err => console.log('WhatsApp send failed:', err.message));

    // Cleanup PDF if needed or leave it
    // fs.unlinkSync(pdfPath);
    
  } catch (err) {
    console.error('Error sending confirmation:', err);
  }
}

module.exports = {
  sendOrderConfirmation
};
