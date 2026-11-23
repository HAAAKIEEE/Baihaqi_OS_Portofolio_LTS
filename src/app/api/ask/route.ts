import { NextResponse } from 'next/server';
import { matchPortfolioQuestion } from '@/data/qa';

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => ({}))) as { question?: string };
    const question = typeof body.question === 'string' ? body.question.trim() : '';

    if (!question) {
      return NextResponse.json(
        { error: 'Pertanyaan tidak boleh kosong.' },
        { status: 400 }
      );
    }

    const answer = matchPortfolioQuestion(question);
    return NextResponse.json(answer, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: 'Gagal memproses pertanyaan di asisten Baihaqi OS.' },
      { status: 500 }
    );
  }
}
