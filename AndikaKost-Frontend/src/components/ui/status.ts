export type BadgeTone = "neutral" | "info" | "ok" | "warn" | "bad";

export function statusTone(value: string): BadgeTone {
  const status = value.trim().toLowerCase().replaceAll("-", "_").replaceAll(" ", "_");

  if (["available", "active", "approved", "paid", "resolved", "closed", "completed", "converted"].includes(status)) {
    return "ok";
  }
  if (["rejected", "overdue", "urgent", "cancelled", "canceled", "failed", "blocked"].includes(status)) {
    return "bad";
  }
  if (["pending", "submitted", "contacted", "unpaid", "open", "in_progress", "maintenance", "high"].includes(status)) {
    return "warn";
  }
  if (["occupied", "proof_uploaded", "verified", "normal"].includes(status)) {
    return "info";
  }
  return "neutral";
}

export function formatStatus(value: string) {
  return value
    .trim()
    .replaceAll("_", " ")
    .replaceAll("-", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}
