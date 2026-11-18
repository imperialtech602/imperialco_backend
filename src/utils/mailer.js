import { Resend } from 'resend'
import nodemailer from 'nodemailer'
import { env } from '../config/env.js'

let resendClient = null
let transporter = null

function getResend() {
  if (resendClient) return resendClient
  if (!env.resendApiKey) return null
  resendClient = new Resend(env.resendApiKey)
  return resendClient
}

function getTransporter() {
  if (transporter) return transporter
  if (!env.smtpHost || !env.smtpUser || !env.smtpPass) return null

  transporter = nodemailer.createTransport({
    host: env.smtpHost,
    port: env.smtpPort,
    secure: env.smtpSecure,
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 15_000,
    auth: {
      user: env.smtpUser,
      pass: env.smtpPass,
    },
  })
  return transporter
}

export function isMailConfigured() {
  return Boolean(env.mailFrom && (env.resendApiKey || (env.smtpHost && env.smtpUser && env.smtpPass)))
}

function buildAcknowledgementContent(order) {
  const productLines =
    order.products?.length > 0
      ? order.products
          .map(
            (p, i) =>
              `<li><strong>${i + 1}. ${escapeHtml(p.itemName)}</strong> — Qty: ${Number(p.quantity) || 1}${
                p.manufacturer ? ` · ${escapeHtml(p.manufacturer)}` : ''
              }${
                p.countryOfOrigin
                  ? ` · ${escapeHtml(String(p.countryOfOrigin).toUpperCase())}`
                  : ''
              }</li>`,
          )
          .join('')
      : ''

  const customBlock = order.customProduct?.trim()
    ? `<p style="margin:16px 0 0;"><strong>Custom requirements</strong><br/>${escapeHtml(order.customProduct)}</p>`
    : ''

  const html = `
    <div style="font-family:Manrope,Arial,sans-serif;max-width:560px;margin:0 auto;color:#1a1a2e;">
      <div style="background:#282a74;padding:20px 24px;border-radius:12px 12px 0 0;">
        <p style="margin:0;color:#fff;font-size:18px;font-weight:700;">Imperial Co</p>
        <p style="margin:4px 0 0;color:rgba(255,255,255,0.75);font-size:13px;">Request acknowledgement</p>
      </div>
      <div style="border:1px solid #e8e9ff;border-top:none;padding:24px;border-radius:0 0 12px 12px;">
        <p style="margin:0 0 12px;">Hi ${escapeHtml(order.firstName)},</p>
        <p style="margin:0 0 12px;">
          Thank you for your quote request. We have received order
          <strong>${escapeHtml(order.orderNumber)}</strong> and our sourcing team will follow up
          with availability, lead time, and shipping options.
        </p>
        ${
          productLines
            ? `<p style="margin:16px 0 8px;font-weight:700;">Catalog selections</p><ul style="margin:0;padding-left:18px;">${productLines}</ul>`
            : ''
        }
        ${customBlock}
        <p style="margin:20px 0 0;font-size:13px;color:#64748b;">
          Questions? Email
          <a href="mailto:cs@imperialco.biz" style="color:#282a74;">cs@imperialco.biz</a>
          or WhatsApp
          <a href="https://wa.me/971541620118" style="color:#282a74;">+971 54 162 0118</a>.
        </p>
      </div>
    </div>
  `

  const text = [
    `Hi ${order.firstName},`,
    '',
    `Thank you for your quote request. We have received order ${order.orderNumber}.`,
    'Our sourcing team will follow up with availability, lead time, and shipping options.',
    '',
    'Imperial Co · cs@imperialco.biz',
  ].join('\n')

  return {
    from: env.mailFrom,
    to: order.email,
    subject: `We received your request — ${order.orderNumber}`,
    text,
    html,
  }
}

export async function sendOrderAcknowledgement(order) {
  if (!env.mailFrom) {
    console.warn('[mailer] MAIL_FROM missing — skipping acknowledgement email')
    return { skipped: true }
  }

  if (!order?.email) {
    console.warn('[mailer] Order has no email — skipping acknowledgement')
    return { skipped: true }
  }

  const payload = buildAcknowledgementContent(order)
  const resend = getResend()

  if (resend) {
    const { data, error } = await resend.emails.send(payload)
    if (error) {
      console.error('[mailer] Resend error:', error)
      throw new Error(error.message || 'Resend send failed')
    }
    console.log('[mailer] Acknowledgement sent via Resend:', data?.id, '→', order.email)
    return { skipped: false, messageId: data?.id, provider: 'resend' }
  }

  const transport = getTransporter()
  if (!transport) {
    console.warn(
      '[mailer] Email not configured — set RESEND_API_KEY + MAIL_FROM (or SMTP_*). Skipping.',
    )
    return { skipped: true }
  }

  const info = await transport.sendMail(payload)
  console.log('[mailer] Acknowledgement sent via SMTP:', info.messageId, '→', order.email)
  return { skipped: false, messageId: info.messageId, provider: 'smtp' }
}

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}
