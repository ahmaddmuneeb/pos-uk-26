export async function fetchArray<T>(url: string): Promise<T[]> {
  try {
    const res = await fetch(url);
    const data = await res.json();
    return Array.isArray(data) ? (data as T[]) : [];
  } catch {
    return [];
  }
}
