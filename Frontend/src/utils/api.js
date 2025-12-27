export const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8017/api';
export const API_ORIGIN = API_BASE.replace(/\/api$/, '');

export function getImageUrl(path) {
  if (!path) return path;
  if (path.startsWith('http')) return path;
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${API_ORIGIN}${normalized}`;  // <-- path từ sampleRooms sẽ ghép với đây
}
