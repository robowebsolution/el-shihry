import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Secure the route: only allowed admin
    if (!user || user.email !== 'elshihry2027@gmail.com') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const timestamp = Math.round(new Date().getTime() / 1000);
    const api_secret = process.env.CLOUDINARY_API_SECRET;
    
    if (!api_secret) {
        return NextResponse.json({ error: 'Cloudinary secret missing in environment' }, { status: 500 });
    }

    // Generate the signature
    // For simplicity, we sign the timestamp (can be extended with folder, etc)
    const signature = cloudinary.utils.api_sign_request(
      { timestamp },
      api_secret
    );

    return NextResponse.json({
      signature,
      timestamp,
      api_key: process.env.CLOUDINARY_API_KEY,
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
