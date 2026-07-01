// Vercel / Next.js API Route 예시
// 파일명: /api/contact.js (Next.js 프로젝트에 복사)
// 환경변수 필요: SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, TO_EMAIL

import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  const { name, email, message } = req.body || {};
  if (!name || !email || !message) return res.status(400).json({ error: 'Missing fields' });

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    secure: process.env.SMTP_PORT === '465',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const mailOptions = {
    from: `${name} <${email}>`,
    to: process.env.TO_EMAIL || '0518tune@gmail.com',
    subject: `포트폴리오 문의: ${name}`,
    text: `이름: ${name}\n이메일: ${email}\n\n메시지:\n${message}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Mail send error:', err);
    return res.status(500).json({ error: 'Mail send failed' });
  }
}
