import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get('supabase-auth-token')?.value;

  return NextResponse.json({ token });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { token } = body;
    
    if (!token) {
      return NextResponse.json(
        { error: 'Token is required' },
        { status: 400 }
      );
    }

    const cookieStore = await cookies()

    cookieStore.set({
      name: 'supabase-auth-token',
      value: token,
      httpOnly: true,
      path: '/',
    })

    return NextResponse.json({ success: true });
    
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message || 'Failed to set the cookie' },
        { status: 500 }
      );
    } else {
      return NextResponse.json(
        { error: 'An unknown error occurred' },
        { status: 500 }
      );
    }
  }
}

