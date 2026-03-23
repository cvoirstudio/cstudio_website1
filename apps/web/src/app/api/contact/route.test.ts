import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'

// ─── Mocks ────────────────────────────────────────────────────────────────────

// vi.hoisted ensures mockSend is available when vi.mock factory runs (vi.mock is hoisted)
const { mockSend } = vi.hoisted(() => ({ mockSend: vi.fn() }))

vi.mock('resend', () => ({
  Resend: class MockResend {
    emails = { send: mockSend }
  },
}))

// Import after mocks are set up
import { POST, ipMap } from '@/app/api/contact/route'

// ─── Helpers ─────────────────────────────────────────────────────────────────

const validPayload = {
  name: 'Jane Doe',
  email: 'jane@example.com',
  service: 'photography',
  message: 'This is a valid message with enough characters to pass validation.',
  consent: true,
}

function makeRequest(body: unknown, ip = '1.2.3.4'): NextRequest {
  return new NextRequest('http://localhost/api/contact', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-forwarded-for': ip,
    },
    body: JSON.stringify(body),
  })
}

beforeEach(() => {
  mockSend.mockReset()
  ipMap.clear()
  // Provide a Resend key so the email path is exercised
  vi.stubEnv('RESEND_API_KEY', 'test-key')
  vi.stubEnv('CONTACT_EMAIL', 'studio@cvoirstudio.com')
})

// ─── Validation ───────────────────────────────────────────────────────────────

describe('POST /api/contact — validation', () => {
  it('returns 400 when name is too short', async () => {
    const res = await POST(makeRequest({ ...validPayload, name: 'A' }))
    expect(res.status).toBe(400)
    const json = await res.json()
    expect(json.error).toBeDefined()
  })

  it('returns 400 for invalid email', async () => {
    const res = await POST(makeRequest({ ...validPayload, email: 'not-an-email' }))
    expect(res.status).toBe(400)
  })

  it('returns 400 when service is missing', async () => {
    const { service: _service, ...rest } = validPayload
    const res = await POST(makeRequest(rest))
    expect(res.status).toBe(400)
  })

  it('returns 400 for unknown service value', async () => {
    const res = await POST(makeRequest({ ...validPayload, service: 'catering' }))
    expect(res.status).toBe(400)
  })

  it('returns 400 when message is too short', async () => {
    const res = await POST(makeRequest({ ...validPayload, message: 'Short.' }))
    expect(res.status).toBe(400)
  })

  it('returns 400 when consent is false', async () => {
    const res = await POST(makeRequest({ ...validPayload, consent: false }))
    expect(res.status).toBe(400)
  })

  it('returns 400 when consent is missing', async () => {
    const { consent: _consent, ...rest } = validPayload
    const res = await POST(makeRequest(rest))
    expect(res.status).toBe(400)
  })
})

// ─── Happy path ───────────────────────────────────────────────────────────────

describe('POST /api/contact — success', () => {
  it('returns 200 with valid payload', async () => {
    mockSend.mockResolvedValue({ data: { id: 'email-id' }, error: null })

    const res = await POST(makeRequest(validPayload))

    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.success).toBe(true)
  })

  it('sends two emails (studio + client confirmation)', async () => {
    mockSend.mockResolvedValue({ data: { id: 'email-id' }, error: null })

    await POST(makeRequest(validPayload))

    expect(mockSend).toHaveBeenCalledTimes(2)
  })

  it('sends studio email with reply-to set to submitter email', async () => {
    mockSend.mockResolvedValue({ data: { id: 'email-id' }, error: null })

    await POST(makeRequest(validPayload))

    const studioCall = mockSend.mock.calls.find(
      (call) => call[0].to?.includes('studio@cvoirstudio.com')
    )
    expect(studioCall).toBeDefined()
    expect(studioCall![0].replyTo).toBe(validPayload.email)
  })

  it('sends confirmation to the submitter', async () => {
    mockSend.mockResolvedValue({ data: { id: 'email-id' }, error: null })

    await POST(makeRequest(validPayload))

    const confirmCall = mockSend.mock.calls.find(
      (call) => call[0].to?.includes(validPayload.email)
    )
    expect(confirmCall).toBeDefined()
  })

  it('succeeds without sending email when RESEND_API_KEY is absent', async () => {
    vi.stubEnv('RESEND_API_KEY', '')

    const res = await POST(makeRequest(validPayload, '9.9.9.9'))

    expect(res.status).toBe(200)
    expect(mockSend).not.toHaveBeenCalled()
  })

  it('accepts optional fields (phone, budget, projectDate)', async () => {
    mockSend.mockResolvedValue({ data: { id: 'email-id' }, error: null })

    const res = await POST(
      makeRequest({
        ...validPayload,
        phone: '+1 555 000 0000',
        budget: '5k-15k',
        projectDate: '2025-09-01',
      }, '5.5.5.5')
    )

    expect(res.status).toBe(200)
  })
})

// ─── Rate limiting ────────────────────────────────────────────────────────────

describe('POST /api/contact — rate limiting', () => {
  it('returns 429 after 3 submissions from the same IP', async () => {
    mockSend.mockResolvedValue({ data: { id: 'email-id' }, error: null })
    const ip = '10.0.0.99'

    // First 3 should succeed
    for (let i = 0; i < 3; i++) {
      const res = await POST(makeRequest(validPayload, ip))
      expect(res.status).toBe(200)
    }

    // 4th should be rate-limited
    const res = await POST(makeRequest(validPayload, ip))
    expect(res.status).toBe(429)
  })
})
