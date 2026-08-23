import { NextResponse } from 'next/server';
import { hasDatabase, readState, writeData } from '@/lib/db';
import { authEnabled } from '@/lib/auth';
import { normalizeData } from '@/lib/program';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const { data, stored } = await readState();
    // Diagnostic temporaire : noms des variables liées à la base, jamais leurs
    // valeurs. À retirer une fois la connexion Neon confirmée.
    const envKeys = Object.keys(process.env).filter((k) =>
      /POSTGRES|DATABASE|NEON|^PG[A-Z]/.test(k),
    );
    return NextResponse.json({
      data,
      stored,
      durable: hasDatabase(),
      auth: authEnabled(),
      envKeys,
    });
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
