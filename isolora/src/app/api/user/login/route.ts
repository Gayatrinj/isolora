import { NextResponse } from 'next/server';
import AuthService from '@/app/servises/auth';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    console.log('Received vendor registration data:', {  email, password });

    const result = await AuthService.login(email, password);

    if (result.success) {
      return NextResponse.json(
        { success: true, message: result.message, user: result.user },
        { status: 201 }
      );
    } else {
      return NextResponse.json(
        { success: false, message: result.message },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error during vendor registration:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}