export const CONTENT_UPDATED_EVENT = 'el-shihry-content-updated';
export const CONTENT_UPDATED_STORAGE_KEY = 'el-shihry-content-updated-at';
export const CONTENT_UPDATED_CHANNEL = 'el-shihry-content';

type ContentUpdateCallback = () => void;

export function notifyContentUpdated() {
  if (typeof window === 'undefined') {
    return;
  }

  const timestamp = String(Date.now());

  window.dispatchEvent(new CustomEvent(CONTENT_UPDATED_EVENT, { detail: timestamp }));

  try {
    window.localStorage.setItem(CONTENT_UPDATED_STORAGE_KEY, timestamp);
  } catch {
    // Ignore storage write failures in restricted browsing contexts.
  }

  if ('BroadcastChannel' in window) {
    const channel = new BroadcastChannel(CONTENT_UPDATED_CHANNEL);
    channel.postMessage(timestamp);
    channel.close();
  }
}

export function subscribeToContentUpdates(callback: ContentUpdateCallback) {
  if (typeof window === 'undefined') {
    return () => undefined;
  }

  const handleWindowUpdate = () => {
    callback();
  };

  const handleStorage = (event: StorageEvent) => {
    if (event.key === CONTENT_UPDATED_STORAGE_KEY && event.newValue) {
      callback();
    }
  };

  window.addEventListener(CONTENT_UPDATED_EVENT, handleWindowUpdate as EventListener);
  window.addEventListener('storage', handleStorage);

  let channel: BroadcastChannel | null = null;

  if ('BroadcastChannel' in window) {
    channel = new BroadcastChannel(CONTENT_UPDATED_CHANNEL);
    channel.addEventListener('message', handleWindowUpdate);
  }

  return () => {
    window.removeEventListener(CONTENT_UPDATED_EVENT, handleWindowUpdate as EventListener);
    window.removeEventListener('storage', handleStorage);
    channel?.removeEventListener('message', handleWindowUpdate);
    channel?.close();
  };
}
