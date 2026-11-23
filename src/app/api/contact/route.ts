import { NextResponse } from 'next/server';

interface ContactPayload {
  scope?: string;
  name?: string;
  email?: string;
  brief?: string;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => ({}))) as ContactPayload;
    const scope = typeof body.scope === 'string' ? body.scope.trim() : 'Otomasi AI & Agen';
    const name = typeof body.name === 'string' ? body.name.trim() : '';
    const email = typeof body.email === 'string' ? body.email.trim() : '';
    const brief = typeof body.brief === 'string' ? body.brief.trim() : '';

    if (!name || !email || !brief) {
      return NextResponse.json(
        { ok: false, error: 'Nama, email, dan ringkasan kebutuhan wajib diisi.' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { ok: false, error: 'Format email tidak valid.' },
        { status: 400 }
      );
    }

    const webhookUrl = process.env.N8N_WEBHOOK_URL;
    if (webhookUrl) {
      await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source: 'baihaqi-os-portfolio',
          scope,
          name,
          email,
          brief,
          submittedAt: new Date().toISOString(),
        }),
      }).catch(() => {
        // Non-blocking fallback so portfolio inquiry confirmation remains reliable
      });
    }

    return NextResponse.json(
      {
        ok: true,
        message: '[200 OK] Brief berhasil dikirim ke antrean Baihaqi OS. Terima kasih!',
        ticketId: `REQ-${Date.now().toString().slice(-4)}`,
      },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { ok: false, error: 'Terjadi gangguan saat mengirim brief proyek.' },
      { status: 500 }
    );
  }
}
