import type { User } from '@supabase/supabase-js';

type AuthLikeError = {
  code?: string;
  message?: string;
  name?: string;
  status?: number;
};

function toAuthError(error: unknown): AuthLikeError | null {
  if (!error || typeof error !== 'object') {
    return null;
  }

  return error as AuthLikeError;
}

export function isRefreshTokenNotFoundError(error: unknown) {
  const authError = toAuthError(error);

  if (!authError) {
    return false;
  }

  return (
    authError.code === 'refresh_token_not_found' ||
    (authError.status === 400 && authError.message?.includes('Invalid Refresh Token')) ||
    authError.message?.includes('Refresh Token Not Found') === true
  );
}

export function isAuthSessionMissingError(error: unknown) {
  const authError = toAuthError(error);

  if (!authError) {
    return false;
  }

  return (
    authError.name === 'AuthSessionMissingError' ||
    authError.code === 'session_not_found' ||
    authError.message?.includes('Auth session missing!') === true
  );
}

export function isRecoverableSessionError(error: unknown) {
  return isRefreshTokenNotFoundError(error) || isAuthSessionMissingError(error);
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
      if (isRecoverableSessionError(error)) {
        return { user: null, error };
      }

      throw error;
    }

    return { user: data.user, error: null };
  } catch (error) {
    if (isRecoverableSessionError(error)) {
      return { user: null, error };
    }

    throw error;
  }
}
