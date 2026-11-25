/**
 * Extracts a concise display title for a room post.
 * Uses the explicit post title when present, otherwise derives a short
 * word-boundary-safe excerpt from the first non-empty line of content.
 *
 * @param {Object} post - Room post object with optional title and content
 * @param {number} [maxLength=18] - Max character length before appending ellipsis
 * @returns {string} Concise title string, or empty string if unavailable
 */
export function extractPostTitle(post, maxLength = 18) {
  if (!post) return '';

  const explicitTitle = typeof post.title === 'string' ? post.title.trim() : '';
  if (explicitTitle) return explicitTitle;

  if (typeof post.content !== 'string' || !post.content.trim()) return '';

  const plainText = post.content
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/gi, ' ');

  const firstLine = plainText
    .split(/\r?\n/)
    .map((line) => line.replace(/\s+/g, ' ').trim())
    .find(Boolean);

  if (!firstLine) return '';
  if (firstLine.length <= maxLength) return firstLine;

  const slice = firstLine.slice(0, maxLength);
  const lastSpace = slice.lastIndexOf(' ');
  const boundary = lastSpace >= Math.floor(maxLength * 0.5) ? slice.slice(0, lastSpace) : slice;
  const cleaned = boundary.replace(/[,.;:\-—\s]+$/, '');

  return `${cleaned || slice.trim()}...`;
}
