import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
const FROM = 'Velour <hello@velour.live>'

export async function POST(req: NextRequest) {
  try {
    const { attendeeName, attendeeEmail, hostName, hostEmail, gatheringTitle, gatheringDate, gatheringTime, gatheringLocation } = await req.json()

    // Email to attendee
    const attendeeEmail_ = resend.emails.send({
      from: FROM,
      to: attendeeEmail,
      subject: `You're in — ${gatheringTitle}`,
      html: `
        <div style="font-family:sans-serif;max-width:480px;margin:0 auto;color:#1c1917">
          <div style="background:#ff750d;padding:24px;border-radius:16px 16px 0 0;text-align:center">
            <span style="color:white;font-size:28px;font-weight:800;letter-spacing:-1px">Velour</span>
          </div>
          <div style="background:#fffbf7;border:1px solid #f4ecd3;border-top:none;padding:32px;border-radius:0 0 16px 16px">
            <h1 style="font-size:24px;font-weight:700;margin:0 0 8px">You're in, ${attendeeName}! 🎉</h1>
            <p style="color:#57534e;margin:0 0 24px">You've joined <strong>${gatheringTitle}</strong>. Here's what to know:</p>
            <div style="background:#fff8f0;border:1px solid #ffd9a8;border-radius:12px;padding:20px;margin-bottom:24px">
              <p style="margin:0 0 8px;font-size:14px"><strong>📅 When:</strong> ${gatheringDate} at ${gatheringTime}</p>
              <p style="margin:0 0 8px;font-size:14px"><strong>📍 Where:</strong> ${gatheringLocation} — <em>exact address sent 24h before</em></p>
              <p style="margin:0;font-size:14px"><strong>👤 Host:</strong> ${hostName}</p>
            </div>
            <p style="color:#57534e;font-size:14px;margin:0 0 24px">The exact address will be sent to this email 24 hours before the gathering. Keep an eye out!</p>
            <p style="color:#78716c;font-size:12px;margin:0">You received this because you RSVPed on Velour. Questions? Reply to this email.</p>
          </div>
        </div>
      `,
    })

    // Email to host
    const hostEmail_ = hostEmail ? resend.emails.send({
      from: FROM,
      to: hostEmail,
      subject: `New RSVP — ${attendeeName} is joining your gathering`,
      html: `
        <div style="font-family:sans-serif;max-width:480px;margin:0 auto;color:#1c1917">
          <div style="background:#ff750d;padding:24px;border-radius:16px 16px 0 0;text-align:center">
            <span style="color:white;font-size:28px;font-weight:800;letter-spacing:-1px">Velour</span>
          </div>
          <div style="background:#fffbf7;border:1px solid #f4ecd3;border-top:none;padding:32px;border-radius:0 0 16px 16px">
            <h1 style="font-size:24px;font-weight:700;margin:0 0 8px">Someone's joining! 👋</h1>
            <p style="color:#57534e;margin:0 0 24px"><strong>${attendeeName}</strong> just RSVPed for <strong>${gatheringTitle}</strong>.</p>
            <div style="background:#fff8f0;border:1px solid #ffd9a8;border-radius:12px;padding:20px;margin-bottom:24px">
              <p style="margin:0 0 8px;font-size:14px"><strong>Attendee:</strong> ${attendeeName}</p>
              <p style="margin:0 0 8px;font-size:14px"><strong>Contact:</strong> ${attendeeEmail}</p>
              <p style="margin:0;font-size:14px"><strong>Gathering:</strong> ${gatheringDate} at ${gatheringTime}</p>
            </div>
            <p style="color:#78716c;font-size:12px;margin:0">Manage your gathering at <a href="https://velour.live/admin" style="color:#ff750d">velour.live/admin</a></p>
          </div>
        </div>
      `,
    }) : Promise.resolve()

    await Promise.all([attendeeEmail_, hostEmail_])
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('email error', err)
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
  }
}
