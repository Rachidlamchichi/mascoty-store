import { NextResponse } from 'next/server';

// TODO: Implement auth API routes
export async function GET() {
  return NextResponse.json({ message: 'Auth API endpoint' });
}

export async function POST() {
  return NextResponse.json({ message: 'Auth API endpoint' });
}
