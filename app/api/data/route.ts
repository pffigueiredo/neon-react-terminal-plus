import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('query') || 'SELECT * FROM tasks';
  const connectionString =
    searchParams.get('connectionString') || process.env.NEON_DATABASE_URL!;

  try {
    const sql = neon(connectionString);
    const result = await sql(query);

    console.log(result);
    return NextResponse.json(result);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: 'Failed to fetch data', details: (error as Error).message },
      { status: 500 }
    );
  }
}
