export const INCIDENT_CATEGORIES = [
  { value: "theft", label: "Theft" },
  { value: "assault", label: "Assault" },
  { value: "harassment", label: "Harassment" },
  { value: "vandalism", label: "Vandalism" },
  { value: "suspicious_activity", label: "Suspicious Activity" },
  { value: "missing_item", label: "Missing Item" },
  { value: "emergency", label: "Emergency" },
  { value: "other", label: "Other" },
] as const;

export const SEVERITIES = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
  { value: "emergency", label: "Emergency" },
] as const;

export const STATUSES = [
  { value: "pending", label: "Pending Verification" },
  { value: "verified", label: "Verified" },
  { value: "rejected", label: "Rejected" },
  { value: "resolved", label: "Resolved" },
] as const;

export type IncidentCategory = (typeof INCIDENT_CATEGORIES)[number]["value"];
export type IncidentSeverity = (typeof SEVERITIES)[number]["value"];
export type IncidentStatus = (typeof STATUSES)[number]["value"];

export function categoryLabel(v: string) {
  return INCIDENT_CATEGORIES.find((c) => c.value === v)?.label ?? v;
}

export function severityColor(sev: string, status?: string): string {
  if (status === "resolved") return "var(--success)";
  if (status === "verified") return "var(--info)";
  if (sev === "emergency" || sev === "high") return "var(--destructive)";
  if (sev === "medium") return "var(--warning)";
  return "var(--success)";
}


// Demo campus center (matches seed coords)
export const CAMPUS_CENTER: [number, number] = [-1.0962, 37.0122];
