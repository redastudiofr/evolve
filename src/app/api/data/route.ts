import { NextResponse } from 'next/server';
import { hasDatabase, readData, writeData } from '@/lib/db';
import { authEnabled } from '@/lib/auth';
import { normalizeData } from '@/lib/program';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const data = await readData();
    return NextResponse.json({ data, durable: hasDatabase(), auth: authEnabled() });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const saved = await writeData(normalizeData(body));
    return NextResponse.json({ data: saved, durable: hasDatabase(), auth: authEnabled() });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
