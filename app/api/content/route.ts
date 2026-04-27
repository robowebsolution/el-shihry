import { NextResponse } from 'next/server';
import { getLiveSiteContent } from '@/lib/data/sections';

export async function GET() {
  const data = await getLiveSiteContent();

  return NextResponse.json(data, {
    headers: {
      'Cache-Control': 'no-store, max-age=0',
    },
  });
}
