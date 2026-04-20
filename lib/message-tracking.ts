export const PROGRESS_STATUS_META = {
  received: {
    label: "Received",
    description: "Your request has been submitted successfully and is waiting for review.",
  },
  in_review: {
    label: "In Review",
    description: "The request is being checked and the next action is being prepared.",
  },
  documents_needed: {
    label: "Documents Needed",
    description: "More information or documents are needed before work can continue.",
  },
  in_progress: {
    label: "In Progress",
    description: "Work is underway and the request is actively being handled.",
  },
  completed: {
    label: "Completed",
    description: "The requested work has been completed or handed off.",
  },
  cancelled: {
    label: "Cancelled",
    description: "This request is closed and will not continue further.",
  },
} as const;

export type ProgressStatus = keyof typeof PROGRESS_STATUS_META;

export function createTrackingCode() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let result = "CKS-";
  for (let i = 0; i < 8; i += 1) {
    result += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return result;
}
