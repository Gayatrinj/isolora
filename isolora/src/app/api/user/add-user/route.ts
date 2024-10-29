import { NextResponse } from 'next/server';
import ApiService from '@/app/servises/auth';

export async function POST(request: Request) {
  try {
    const { name, email, password, role } = await request.json();
    console.log('Received vendor registration data:', { name, email, password, role });

    const result = await ApiService.signup(name, email, password, role);

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