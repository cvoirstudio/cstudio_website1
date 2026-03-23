import { NextResponse, type NextRequest } from 'next/server'
import { z } from 'zod'
import { Resend } from 'resend'

const contactSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().optional(),
  service: z.enum(['photography', 'videography', 'web-development', 'other']),
  budget: z.enum(['<5k', '5k-15k', '15k-50k', '50k+']).optional(),
  projectDate: z.string().optional(),
  message: z.string().min(20).max(2000),
  consent: z.literal(true),
})

// Simple in-memory rate limiter: 3 submissions per IP per hour
export const ipMap = new Map<string, { count: number; resetAt: number }>()

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const window = 60 * 60 * 1000 // 1 hour
  const limit = 3

  const entry = ipMap.get(ip)
  if (!entry || now > entry.resetAt) {
    ipMap.set(ip, { count: 1, resetAt: now + window })
    return true
  }
  if (entry.count >= limit) return false
  entry.count++
  return true
}

function studioEmail(data: z.infer<typeof contactSchema>): string {
  const serviceLabels: Record<string, string> = {
    photography: 'Photography',
    videography: 'Videography',
    'web-development': 'Web Development',
    other: 'Other',
  }
  const rows = [
    ['Name', data.name],
    ['Email', data.email],
    ...(data.phone ? [['Phone', data.phone]] : []),
    ['Service', serviceLabels[data.service] ?? data.service],
    ...(data.budget ? [['Budget', data.budget]] : []),
    ...(data.projectDate ? [['Project Date', data.projectDate]] : []),
  ]

  return `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8" /></head>
    <body style="font-family: 'DM Sans', system-ui, sans-serif; color: #0A0A0A; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
      <div style="border-left: 3px solid #B8922A; padding-left: 20px; margin-bottom: 32px;">
        <p style="font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; color: #B8922A; margin: 0 0 8px;">New Enquiry</p>
        <h1 style="font-family: Georgia, serif; font-weight: 300; font-size: 28px; margin: 0;">Contact from ${data.name}</h1>
      </div>

      <table style="width: 100%; border-collapse: collapse; margin-bottom: 32px;">
        ${rows.map(([k, v]) => `
          <tr>
            <td style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.15em; color: #6B7280; padding: 8px 0; width: 120px; vertical-align: top;">${k}</td>
            <td style="font-size: 14px; color: #0A0A0A; padding: 8px 0;">${v}</td>
          </tr>
        `).join('')}
      </table>

      <div style="background: #F5F0E8; padding: 20px; margin-bottom: 32px;">
        <p style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.15em; color: #6B7280; margin: 0 0 8px;">Message</p>
        <p style="font-size: 14px; line-height: 1.7; color: #0A0A0A; margin: 0; white-space: pre-wrap;">${data.message}</p>
      </div>

      <a href="mailto:${data.email}" style="display: inline-block; background: #B8922A; color: #F5F0E8; text-decoration: none; font-size: 12px; letter-spacing: 0.15em; text-transform: uppercase; padding: 12px 24px;">
        Reply to ${data.name}
      </a>

      <p style="font-size: 11px; color: #9CA3AF; margin-top: 40px;">Cvoir Studio · studio@cvoirstudio.com</p>
    </body>
    </html>
  `
}

function confirmationEmail(name: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8" /></head>
    <body style="font-family: 'DM Sans', system-ui, sans-serif; color: #0A0A0A; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
      <div style="margin-bottom: 32px;">
        <p style="font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; color: #B8922A; margin: 0 0 8px;">Cvoir Studio</p>
        <h1 style="font-family: Georgia, serif; font-weight: 300; font-size: 32px; margin: 0;">We've received<br/>your message.</h1>
      </div>

      <p style="font-size: 14px; line-height: 1.8; color: #6B7280;">
        Hi ${name}, thank you for reaching out. We'll review your enquiry and be in touch within 1–2 business days.
      </p>
      <p style="font-size: 14px; line-height: 1.8; color: #6B7280;">
        In the meantime, explore our latest work at cvoirstudio.com.
      </p>

      <div style="border-top: 1px solid #D6D0C6; margin-top: 40px; padding-top: 20px;">
        <p style="font-size: 11px; color: #9CA3AF; margin: 0;">Cvoir Studio</p>
        <p style="font-size: 11px; color: #9CA3AF; margin: 4px 0 0;">Vision, Captured. Crafted.</p>
      </div>
    </body>
    </html>
  `
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      )
    }

    // Validate body
    const body = await request.json()
    const parsed = contactSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid form data.', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const data = parsed.data
    const studioTo = process.env.CONTACT_EMAIL ?? 'studio@cvoirstudio.com'

    // Only send email if Resend key is present
    if (process.env.RESEND_API_KEY) {
      const resend = new Resend(process.env.RESEND_API_KEY)

      await Promise.all([
        // Email to studio
        resend.emails.send({
          from: 'Cvoir Studio <noreply@cvoirstudio.com>',
          to: [studioTo],
          replyTo: data.email,
          subject: `New enquiry from ${data.name} — ${data.service}`,
          html: studioEmail(data),
        }),
        // Confirmation to client
        resend.emails.send({
          from: 'Cvoir Studio <noreply@cvoirstudio.com>',
          to: [data.email],
          subject: 'We received your message — Cvoir Studio',
          html: confirmationEmail(data.name),
        }),
      ])
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[contact]', error)
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 })
  }
}
