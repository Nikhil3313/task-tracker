export const STATUS_TRANSITIONS = {

  TODO: [
    "IN_PROGRESS",
    "BLOCKED"
  ],

  IN_PROGRESS: [
    "IN_REVIEW",
    "BLOCKED"
  ],

  IN_REVIEW: [
    "DONE",
    "BLOCKED"
  ],

  DONE: [],

  BLOCKED: []
};
