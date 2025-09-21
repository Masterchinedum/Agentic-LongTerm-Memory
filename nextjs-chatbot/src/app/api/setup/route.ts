import { NextRequest, NextResponse } from 'next/server';
import { createUserInfo } from '@/lib/setup/prepare-sqldb';

export async function POST(request: NextRequest) {
  try {
    await createUserInfo();
    
    return NextResponse.json({
      message: 'Database setup completed successfully',
      success: true
    });
  } catch (error) {
    console.error('Error setting up database:', error);
    return NextResponse.json(
      { error: 'Failed to setup database', details: String(error) },
      { status: 500 }
    );
  }
}