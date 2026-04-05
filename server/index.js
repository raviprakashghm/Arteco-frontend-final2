const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const twilio = require('twilio');
const { supabase } = require('./db');
const { sendOrderConfirmation } = require('./notifications');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'rzp_test_secret_placeholder',
});

// ─── In-Memory OTP Store (email → { code, expiresAt }) ──────────────────────
const otpStore = new Map();

const nodemailer = require('nodemailer');
const emailTransporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Send OTP via Email (FREE — uses Gmail/Nodemailer already configured)
app.post('/api/otp/send', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email required' });

  // Generate secure 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes

  otpStore.set(email, { otp, expiresAt });

  try {
    await emailTransporter.sendMail({
      from: `"Arteco" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `${otp} — Your Arteco Verification Code`,
      html: `
        <div style="background:#111;color:#eee;font-family:Arial,sans-serif;padding:36px;border-radius:12px;max-width:480px;margin:auto">
          <h2 style="color:#C9A14A;margin-bottom:4px">Arteco</h2>
          <p style="color:#aaa;margin:0 0 24px">Built by Architects for Architectural Students</p>
          <p style="font-size:15px">Your email verification code is:</p>
          <div style="background:#1a1a1a;border:2px solid #C9A14A;border-radius:10px;padding:24px;text-align:center;margin:20px 0">
            <span style="font-size:42px;font-weight:bold;letter-spacing:12px;color:#C9A14A">${otp}</span>
          </div>
          <p style="color:#aaa;font-size:13px">This code is valid for <strong style="color:#eee">5 minutes</strong>. Do not share it with anyone.</p>
          <p style="color:#555;font-size:12px;margin-top:24px">If you didn't request this, ignore this email.</p>
        </div>
      `
    });
    console.log(`[OTP] Sent to ${email}: ${otp}`);
    res.json({ success: true });
  } catch (err) {
    console.error('[OTP] Email error:', err.message);
    res.status(500).json({ error: 'Failed to send OTP email. Check EMAIL_USER and EMAIL_PASS on server.' });
  }
});

// Verify OTP
app.post('/api/otp/verify', (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) return res.status(400).json({ error: 'Email and OTP required' });

  const record = otpStore.get(email);
  if (!record) return res.status(400).json({ error: 'No OTP found. Please request a new one.' });
  if (Date.now() > record.expiresAt) {
    otpStore.delete(email);
    return res.status(400).json({ error: 'OTP has expired. Please request a new one.' });
  }
  if (record.otp !== otp.toString()) {
    return res.status(400).json({ error: 'Incorrect OTP. Please check and try again.' });
  }

  otpStore.delete(email);
  res.json({ success: true });
});


// Create Order (Razorpay)
app.post('/api/payment/create-order', async (req, res) => {
  try {
    const { amount, receipt } = req.body; // amount in INR
    const options = {
      amount: amount * 100, // amount in smallest currency unit
      currency: "INR",
      receipt: receipt || `receipt_${Date.now()}`
    };
    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Verify Payment and Place Order
app.post('/api/payment/verify-payment', async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderDetails } = req.body;
    const { emailEnabled = true, whatsappEnabled = true } = req.body;
    
    // Verify signature
    const text = razorpay_order_id + "|" + razorpay_payment_id;
    const generated_signature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'rzp_test_secret_placeholder')
      .update(text.toString())
      .digest('hex');

    if (generated_signature === razorpay_signature) {
      // Payment is successful
      
      // Calculate expected delivery: 6 days ahead
      const deliveryDate = new Date();
      deliveryDate.setDate(deliveryDate.getDate() + 6);
      const expectedDeliveryStr = deliveryDate.toISOString().split('T')[0];

      // Save order to DB (Supabase)
      const uniqueCode = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      
      const { data: savedOrder, error } = await supabase
        .from('orders')
        .insert([
          {
            order_id: uniqueCode,
            razorpay_order_id,
            razorpay_payment_id,
            user_email: orderDetails.email,
            items: orderDetails.items,
            amount: orderDetails.amount,
            status: 'Placed',
            expected_delivery_date: expectedDeliveryStr,
            shipping_address: orderDetails.address,
            phone: orderDetails.phone || '',
            created_at: new Date()
          }
        ])
        .select()
        .single();
      
      if (error) {
        // We log error but still return success for payment if inserted failed due to missing table
        console.error('Supabase Error:', error);
      }

      const finalOrder = savedOrder || { 
        id: uniqueCode, 
        user_email: orderDetails.email, 
        amount: orderDetails.amount * 100, 
        expected_delivery_date: expectedDeliveryStr,
        items: orderDetails.items 
      };

      // Fire notifications in background — respects user toggle preferences
      sendOrderConfirmation(
        { ...finalOrder, phone: orderDetails?.phone },
        { emailEnabled, whatsappEnabled }
      );

      res.json({ success: true, message: 'Payment verified and order placed.', order: finalOrder });
    } else {
      res.status(400).json({ success: false, message: 'Invalid payment signature.' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// COD Endpoint to trigger emails and save
app.post('/api/payment/cod', async (req, res) => {
  try {
    const { orderDetails, order_id, emailEnabled = true, whatsappEnabled = true } = req.body;
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 6);
    const expectedDeliveryStr = deliveryDate.toISOString().split('T')[0];

    const { data: savedOrder, error } = await supabase
      .from('orders')
      .insert([
        {
          order_id: order_id,
          razorpay_order_id: 'COD',
          razorpay_payment_id: 'COD',
          user_email: orderDetails.email,
          items: orderDetails.items,
          amount: orderDetails.amount,
          status: 'Processing',
          expected_delivery_date: expectedDeliveryStr,
          shipping_address: orderDetails.address,
          phone: orderDetails.phone || '',
          created_at: new Date()
        }
      ])
      .select()
      .single();

    if (error) console.error('Supabase Error:', error);

    const finalOrder = savedOrder || { 
      id: order_id, 
      user_email: orderDetails.email, 
      amount: orderDetails.amount * 100, 
      expected_delivery_date: expectedDeliveryStr,
      items: orderDetails.items 
    };

    // Fire notifications in background — respects user toggle preferences
    sendOrderConfirmation(
      { ...finalOrder, phone: orderDetails?.phone },
      { emailEnabled, whatsappEnabled }
    );

    res.json({ success: true, message: 'COD Order placed successfully.', order: finalOrder });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ---- Admin Users CRUD ----
app.get('/api/admin/users', async (req, res) => {
  const { data, error } = await supabase.from('users').select('*');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.get('/api/admin/deleted-users', async (req, res) => {
  const { data, error } = await supabase.from('deleted_accounts').select('*');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// ---- Activity Logs ----
app.get('/api/admin/logs', async (req, res) => {
  const { data, error } = await supabase.from('activity_logs').select('*').order('created_at', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.post('/api/logs', async (req, res) => {
  const { user_email, action, details } = req.body;
  await supabase.from('activity_logs').insert([{ user_email, action, details, created_at: new Date() }]);
  res.json({ success: true });
});

// ---- Site Content CMS ----
app.get('/api/content', async (req, res) => {
  const { data, error } = await supabase.from('site_content').select('*');
  if (error) return res.status(500).json({ error: error.message });
  const contentMap = data.reduce((acc, curr) => ({ ...acc, [curr.key]: curr.value }), {});
  res.json(contentMap);
});

app.post('/api/content', async (req, res) => {
  const { key, value } = req.body;
  const { data, error } = await supabase.from('site_content').upsert([{ key, value }]).select();
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true, data });
});

app.post('/api/admin/users/delete', async (req, res) => {
  const { id, email } = req.body;
  // Move to deleted_accounts archive with timestamp
  await supabase.from('deleted_accounts').insert([{ user_id: id, email, created_at: new Date() }]);
  // Delete from users table
  const { error } = await supabase.from('users').delete().eq('id', id);
  if (error) {
    // Also try by email
    await supabase.from('users').delete().eq('email', email);
  }
  // Log it
  await supabase.from('activity_logs').insert([{ user_email: email, action: 'ACCOUNT_DELETED', details: 'User deleted their account', created_at: new Date() }]);
  res.json({ success: true });
});

// Create User in DB manually
app.post('/api/users/sync', async (req, res) => {
  const { id, email, name, phone } = req.body;
  const { data, error } = await supabase.from('users').upsert([{ id, email, name, phone, created_at: new Date() }]).select();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data[0]);
});

// ---- Admin Products CRUD ----
app.get('/api/admin/products', async (req, res) => {
  const { data, error } = await supabase.from('products').select('*');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.post('/api/admin/products', async (req, res) => {
  const { data, error } = await supabase.from('products').insert([req.body]).select();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data[0]);
});

app.put('/api/admin/products/:id', async (req, res) => {
  const { data, error } = await supabase.from('products').update(req.body).eq('id', req.params.id).select();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data[0]);
});

app.delete('/api/admin/products/:id', async (req, res) => {
  const { data, error } = await supabase.from('products').delete().eq('id', req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
});

// ---- Orders Tracking & Admin ----
app.get('/api/orders', async (req, res) => {
  const { email } = req.query;
  let query = supabase.from('orders').select('*').order('created_at', { ascending: false });
  if (email) {
    query = query.eq('user_email', email);
  }
  const { data, error } = await query;
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.put('/api/orders/:id/status', async (req, res) => {
  const { status } = req.body;
  const { id } = req.params;
  
  // Try matching by id or order_id
  let { data, error } = await supabase.from('orders').update({ status }).eq('order_id', id).select();
  if (!data?.length) {
    ({ data, error } = await supabase.from('orders').update({ status }).eq('id', id).select());
  }
  
  if (error) return res.status(500).json({ error: error.message });
  
  const order = data?.[0];
  if (order) {
    // Fire notifications background
    sendOrderConfirmation(order, { emailEnabled: true, whatsappEnabled: true });
  }
  
  res.json(order || { success: true });
});

app.put('/api/orders/:id/amount', async (req, res) => {
  const { amount } = req.body;
  let { data, error } = await supabase.from('orders').update({ amount }).eq('order_id', req.params.id).select();
  if (!data?.length) {
    ({ data, error } = await supabase.from('orders').update({ amount }).eq('id', req.params.id).select());
  }
  if (error) return res.status(500).json({ error: error.message });
  res.json(data?.[0] || { success: true });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
