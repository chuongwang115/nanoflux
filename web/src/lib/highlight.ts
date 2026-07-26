/** AI pass reason for list rendering. */
export function getItemAiReason(item: {
  filter_passed?: string | null;
}): string | null {
  const reason = item.filter_passed?.trim();
  return reason || null;
}
