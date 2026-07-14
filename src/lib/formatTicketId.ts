/** Human-readable ticket reference derived from the MongoDB id (e.g. #DD760). */
export function formatTicketId(id: string): string {
  const tail = id.replace(/\D/g, "").slice(-6) || id.slice(-6);
  return `#${tail.toUpperCase()}`;
}
