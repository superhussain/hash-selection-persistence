import { NextResponse } from 'next/server';
import { generateHash, storeHash, getStoredItems } from '@/lib/hash';
import type { HashRequest } from '@/lib/types';

export async function POST(request: Request) {
  try {
    const body: HashRequest = await request.json();
    
    if (!body.items || !Array.isArray(body.items)) {
      return NextResponse.json(
        { error: 'Invalid items array' },
        { status: 400 }
      );
    }

    const hash = generateHash(body.items);
    storeHash(hash, body.items);
    
    return NextResponse.json({ hash });
  } catch (error) {
    console.error('POST Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const hash = searchParams.get('hash');

    if (!hash) {
      return NextResponse.json(
        { error: 'Hash parameter is required' },
        { status: 400 }
      );
    }

    const items = getStoredItems(hash);
    if (!items) {
      return NextResponse.json(
        { error: 'Hash not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ items });
  } catch (error) {
    console.error('GET Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}