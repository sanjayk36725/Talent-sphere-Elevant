export async function safeFetchJson<T = any>(
  url: string,
  options?: RequestInit
): Promise<{ ok: boolean; status: number; data: T }> {
  try {
    const res = await fetch(url, options);
    const contentType = res.headers.get('content-type') || '';

    if (contentType.includes('application/json')) {
      const data = await res.json();
      return { ok: res.ok, status: res.status, data };
    } else {
      const text = await res.text();
      // If server returned HTML (like 404/500 page or index.html fallback)
      const errorMsg = res.ok
        ? 'Received non-JSON response from server.'
        : `Server error (${res.status}): ${res.statusText || 'Endpoint returned HTML instead of JSON'}`;
      
      return {
        ok: false,
        status: res.status,
        data: { error: errorMsg, rawText: text.substring(0, 200) } as any,
      };
    }
  } catch (err: any) {
    return {
      ok: false,
      status: 0,
      data: { error: err.message || 'Network error or service unreachable.' } as any,
    };
  }
}
