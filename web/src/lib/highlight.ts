/** AI pass reason for list rendering. */
export function getItemAiReason(item: {
  passed_reason?: string | null;
}): string | null {
  const reason = item.passed_reason?.trim();
  return reason || null;
}
