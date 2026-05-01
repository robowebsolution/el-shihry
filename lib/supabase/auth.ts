import type { User } from '@supabase/supabase-js';

export function isRefreshTokenNotFoundError(error: unknown) {
  if (!error || typeof error !== 'object') {
    return false;
  }

  const authError = error as {
    code?: string;
    message?: string;
    status?: number;
  };

  return (
    authError.code === 'refresh_token_not_found' ||
    (authError.status === 400 && authError.message?.includes('Invalid Refresh Token')) ||
    authError.message?.includes('Refresh Token Not Found') === true
  );
}

export async function safeGetUser(
  supabase: {
    auth: {
      getUser: () => Promise<{ data: { user: User | null }; error?: unknown }>;
    };
  }
) {
  try {
    const { data, error } = await supabase.auth.getUser();

    if (error) {
      if (isRefreshTokenNotFoundError(error)) {
        return { user: null, error };
      }

      throw error;
    }

    return { user: data.user, error: null };
  } catch (error) {
    if (isRefreshTokenNotFoundError(error)) {
      return { user: null, error };
    }

    throw error;
  }
}
