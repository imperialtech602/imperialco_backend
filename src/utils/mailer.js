import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { Resend } from 'resend'
import nodemailer from 'nodemailer'
import { env } from '../config/env.js'

const logoPath = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../../assets/imperial-logo-full.png',
)
const LOGO_CID = 'imperial-logo'

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

function display(value) {
  const text = String(value ?? '').trim()
  return text || '—'
}

function productListHtml(order) {
  if (!order.products?.length) {
    return '<p style="margin:0;color:#64748b;">No catalog products selected.</p>'
  }
  return `<ul style="margin:0;padding-left:18px;">${order.products
    .map(
      (p, i) =>
        `<li style="margin:0 0 8px;">
          <strong>${i + 1}. ${escapeHtml(p.itemName)}</strong><br/>
          Qty: ${Number(p.quantity) || 1}
          ${p.manufacturer ? ` · ${escapeHtml(p.manufacturer)}` : ''}
          ${
            p.countryOfOrigin
              ? ` · ${escapeHtml(String(p.countryOfOrigin).toUpperCase())}`
              : ''
          }
          ${p.dosageForm ? ` · ${escapeHtml(p.dosageForm)}` : ''}
          ${p.therapeuticClass ? ` · ${escapeHtml(p.therapeuticClass)}` : ''}
          ${p.itemId ? `<br/><span style="color:#64748b;">ID: ${escapeHtml(p.itemId)}</span>` : ''}
        </li>`,
    )
    .join('')}</ul>`
}

function productListText(order) {
  if (!order.products?.length) return 'No catalog products selected.'
  return order.products
    .map((p, i) => {
      const parts = [
        `${i + 1}. ${p.itemName}`,
        `Qty: ${Number(p.quantity) || 1}`,
        p.manufacturer,
        p.countryOfOrigin ? String(p.countryOfOrigin).toUpperCase() : '',
        p.dosageForm,
        p.itemId ? `ID: ${p.itemId}` : '',
      ].filter(Boolean)
      return parts.join(' · ')
    })
    .join('\n')
}

function logoAttachment() {
  if (!fs.existsSync(logoPath)) return null
  return {
    filename: 'imperial-logo.png',
    path: logoPath,
    cid: LOGO_CID,
    contentId: LOGO_CID,
    contentType: 'image/png',
    contentDisposition: 'inline',
  }
}

function customerHeaderHtml() {
  if (!fs.existsSync(logoPath)) {
    return '<p style="margin:0;color:#282a74;font-size:18px;font-weight:700;">Imperial Co</p>'
  }
  return `<img src="cid:${LOGO_CID}" alt="Imperial Co" width="180" height="48" style="display:block;width:180px;height:48px;border:0;outline:none;text-decoration:none;" />`
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
      <div style="background:#ffffff;padding:20px 24px;border:1px solid #e8e9ff;border-bottom:none;border-radius:12px 12px 0 0;">
        ${customerHeaderHtml()}
        <p style="margin:10px 0 0;color:#64748b;font-size:13px;">Request acknowledgement</p>
      </div>
      <div style="border:1px solid #e8e9ff;border-top:none;padding:24px;border-radius:0 0 12px 12px;">
        <p style="margin:0 0 12px;">Hi ${escapeHtml(order.firstName)},</p>
        <p style="margin:0 0 12px;">
          Thank you for your quote request. We have received order
          <strong>${escapeHtml(order.orderNumber)}</strong> and our customer team will follow up
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

  const attachment = logoAttachment()
  return {
    from: env.mailFrom,
    to: order.email,
    subject: `We received your request — ${order.orderNumber}`,
    text,
    html,
    ...(attachment ? { attachments: [attachment] } : {}),
  }
}

function buildInternalNotificationContent(order) {
  const rows = [
    ['Order number', order.orderNumber],
    ['Source', order.source],
    ['Submitted', order.createdAt ? new Date(order.createdAt).toLocaleString() : 'Just now'],
    ['First name', order.firstName],
    ['Last name', order.lastName],
    ['Company', order.company],
    ['Job title', order.jobTitle],
    ['Email', order.email],
    ['Country', order.country],
    ['Custom requirements', order.customProduct],
    ['Notes', order.notes],
    ['Packs', order.packs],
    ['Origin preference', order.originPreference],
    ['Intended use', order.intendedUse],
    ['Target market', order.targetMarket],
    [
      'Required by',
      order.requiredBy ? new Date(order.requiredBy).toLocaleDateString() : '',
    ],
    ['Attachment', order.attachmentName || (order.attachmentPath ? 'Yes' : '')],
  ]

  const detailsHtml = rows
    .map(
      ([label, value]) => `
      <tr>
        <td style="padding:8px 10px;border-bottom:1px solid #e8e9ff;color:#64748b;width:38%;vertical-align:top;">${escapeHtml(label)}</td>
        <td style="padding:8px 10px;border-bottom:1px solid #e8e9ff;color:#1a1a2e;vertical-align:top;white-space:pre-wrap;">${escapeHtml(display(value))}</td>
      </tr>`,
    )
    .join('')

  const html = `
    <div style="font-family:Manrope,Arial,sans-serif;max-width:640px;margin:0 auto;color:#1a1a2e;">
      <div style="background:#282a74;padding:20px 24px;border-radius:12px 12px 0 0;">
        <p style="margin:0;color:#fff;font-size:18px;font-weight:700;">New RFQ submission</p>
        <p style="margin:4px 0 0;color:rgba(255,255,255,0.75);font-size:13px;">${escapeHtml(order.orderNumber)}</p>
      </div>
      <div style="border:1px solid #e8e9ff;border-top:none;padding:20px 24px;border-radius:0 0 12px 12px;">
        <table style="width:100%;border-collapse:collapse;font-size:14px;">${detailsHtml}</table>
        <p style="margin:20px 0 8px;font-weight:700;">Catalog products</p>
        ${productListHtml(order)}
      </div>
    </div>
  `

  const text = [
    `New RFQ submission — ${order.orderNumber}`,
    '',
    ...rows.map(([label, value]) => `${label}: ${display(value)}`),
    '',
    'Catalog products:',
    productListText(order),
  ].join('\n')

  return {
    from: env.mailFrom,
    to: env.mailNotifyTo,
    replyTo: order.email || undefined,
    subject: `New RFQ ${order.orderNumber} — ${display(order.company)}`,
    text,
    html,
  }
}

async function sendMailPayload(payload, label) {
  if (!env.mailFrom) {
    console.warn(`[mailer] MAIL_FROM missing — skipping ${label}`)
    return { skipped: true }
  }
  if (!payload.to) {
    console.warn(`[mailer] No recipient for ${label} — skipping`)
    return { skipped: true }
  }

  const resend = getResend()
  if (resend) {
    const { attachments, ...rest } = payload
    const resendPayload = { ...rest }
    if (attachments?.length) {
      resendPayload.attachments = attachments.map((file) => ({
        filename: file.filename,
        content: file.content || fs.readFileSync(file.path),
        contentType: file.contentType,
        contentId: file.contentId || file.cid,
      }))
    }
    const { data, error } = await resend.emails.send(resendPayload)
    if (error) {
      console.error(`[mailer] Resend error (${label}):`, error)
      throw new Error(error.message || 'Resend send failed')
    }
    console.log(`[mailer] ${label} sent via Resend:`, data?.id, '→', payload.to)
    return { skipped: false, messageId: data?.id, provider: 'resend' }
  }

  const transport = getTransporter()
  if (!transport) {
    console.warn(
      `[mailer] Email not configured — set RESEND_API_KEY + MAIL_FROM. Skipping ${label}.`,
    )
    return { skipped: true }
  }

  const { attachments, ...rest } = payload
  const info = await transport.sendMail({
    ...rest,
    attachments: (attachments || []).map(({ contentId, ...file }) => file),
  })
  console.log(`[mailer] ${label} sent via SMTP:`, info.messageId, '→', payload.to)
  return { skipped: false, messageId: info.messageId, provider: 'smtp' }
}

export async function sendOrderAcknowledgement(order) {
  return sendMailPayload(buildAcknowledgementContent(order), 'acknowledgement')
}

export async function sendOrderInternalNotification(order) {
  return sendMailPayload(buildInternalNotificationContent(order), 'internal notification')
}

/** Customer ack + full details to cs@imperialco.biz */
export async function sendOrderEmails(order) {
  const results = { acknowledgement: null, internal: null }

  try {
    results.acknowledgement = await sendOrderAcknowledgement(order)
  } catch (error) {
    console.error('[mailer] acknowledgement failed:', error.message || error)
    results.acknowledgement = { skipped: false, error: error.message || String(error) }
  }

  try {
    results.internal = await sendOrderInternalNotification(order)
  } catch (error) {
    console.error('[mailer] internal notification failed:', error.message || error)
    results.internal = { skipped: false, error: error.message || String(error) }
  }

  return results
}

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}
