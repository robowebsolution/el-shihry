import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { revalidatePath, revalidateTag } from 'next/cache';
import { safeGetUser } from '@/lib/supabase/auth';

function revalidateBlogContent() {
  // @ts-ignore
  revalidateTag('blog-posts', 'default');
  // @ts-ignore
  revalidateTag('site-sections', 'default');
  revalidatePath('/', 'layout');
  revalidatePath('/');
  ['/ar/blog', '/en/blog'].forEach((path) => revalidatePath(path));
  revalidatePath('/[locale]/blog/[slug]', 'page');
}

// GET all posts for dashboard
export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { user } = await safeGetUser(supabase);

    if (!user || user.email !== 'elshihry2027@gmail.com') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return NextResponse.json({ data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// CREATE or UPDATE post
export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { user } = await safeGetUser(supabase);

    if (!user || user.email !== 'elshihry2027@gmail.com') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = await req.json();
    const {
      id,
      slug,
      locale = 'ar',
      title,
      excerpt,
      content,
      tag,
      cover_url,
      published,
      author_name,
      reviewed_by,
      expert_source,
      seo_title,
      meta_description,
      og_title,
      og_description,
      og_image,
      canonical_slug,
      indexable,
      key_takeaways,
      sources,
      faq_blocks,
    } = body;

    const payload = {
      slug,
      locale,
      title,
      excerpt,
      content,
      tag,
      cover_url,
      published,
      author_name,
      reviewed_by,
      expert_source,
      seo_title,
      meta_description,
      og_title,
      og_description,
      og_image,
      canonical_slug,
      indexable,
      key_takeaways,
      sources,
      faq_blocks,
      ...(published && { published_at: new Date().toISOString() })
    };

    let result;
    if (id && id !== 'new') {
      // Update
      result = await supabase.from('blog_posts').update(payload).eq('id', id);
    } else {
      // Insert
      result = await supabase.from('blog_posts').insert([payload]);
    }

    if (result.error) throw result.error;

    revalidateBlogContent();
    
    return NextResponse.json({ success: true, message: 'Post saved successfully' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// DELETE post
export async function DELETE(req: NextRequest) {
    try {
        const supabase = await createClient();
        const { user } = await safeGetUser(supabase);
    
        if (!user || user.email !== 'elshihry2027@gmail.com') {
          return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }
        
        const url = new URL(req.url);
        const id = url.searchParams.get('id');
        
        if (!id) return NextResponse.json({ error: 'Missing ID' }, { status: 400 });

        const { error } = await supabase.from('blog_posts').delete().eq('id', id);
        if (error) throw error;

        revalidateBlogContent();
        return NextResponse.json({ success: true });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
