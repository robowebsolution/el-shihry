import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { revalidatePath, revalidateTag } from 'next/cache';
import { getAdminSectionData } from '@/lib/data/sections';
import { safeGetUser } from '@/lib/supabase/auth';

function revalidatePublicContent(sectionKey: string) {
  // @ts-ignore - Next 16 types in this environment require 2nd arg
  revalidateTag('site-sections', 'default');
  revalidatePath('/', 'layout');
  revalidatePath('/');
  ['/ar', '/en'].forEach((localePath) => {
    revalidatePath(localePath);
    revalidatePath(`${localePath}/about`);
    revalidatePath(`${localePath}/contact`);
    revalidatePath(`${localePath}/projects`);
    revalidatePath(`${localePath}/blog`);
    revalidatePath(`${localePath}/privacy-policy`);
    revalidatePath(`${localePath}/terms`);
  });

  if (sectionKey === 'projects') {
    revalidatePath('/projects');
    revalidatePath('/projects/[slug]', 'page');
    revalidatePath('/[locale]/projects/[slug]', 'page');
  }

  if (sectionKey === 'blog') {
    // @ts-ignore - Next 16 types in this environment require 2nd arg
    revalidateTag('blog-posts', 'default');
    revalidatePath('/blog');
    revalidatePath('/blog/[slug]', 'page');
    revalidatePath('/[locale]/blog/[slug]', 'page');
  }
}

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { user } = await safeGetUser(supabase);

    if (!user || user.email !== 'elshihry2027@gmail.com') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const section_key = searchParams.get('section_key');
    const locale = searchParams.get('locale') as 'ar' | 'en';

    if (!section_key || !locale) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    const data = await getAdminSectionData(section_key, locale);
    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}


export async function PATCH(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { user } = await safeGetUser(supabase);

    // Secondary layer of security
    if (!user || user.email !== 'elshihry2027@gmail.com') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = await req.json();
    const { section_key, locale, data } = body;

    if (!section_key || !locale || !data) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    // Upsert into Supabase
    const { error: dbError } = await supabase
      .from('site_sections')
      .upsert({ section_key, locale, data }, { onConflict: 'section_key,locale' });

    if (dbError) {
      console.error(dbError);
      return NextResponse.json({ error: 'Database update failed' }, { status: 500 });
    }

    revalidatePublicContent(section_key);

    return NextResponse.json({ success: true, message: 'Section updated successfully' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
