import { NextResponse } from 'next/server';
import { generateHash, storeHash, getStoredState } from '@/lib/hash';

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    console.log('⚠️ | POST | body:', body);

    // TODO: validate body
    if (!body || typeof body !== 'object') {
      return NextResponse.json(
        { error: 'Invalid state' },
        { status: 400 }
      );
    }

    const hash = generateHash(body);
    await storeHash(hash, body);

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

    const state = await getStoredState(hash);
    if (!state) {
      return NextResponse.json(
        { error: 'Hash not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(state);
  } catch (error) {
    console.error('GET Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}