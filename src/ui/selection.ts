export type Selection =
  | { kind: "tower"; id: string }
  | { kind: "creep"; id: string }
  | { kind: "farm" }
  | { kind: "sawmill" }
  | { kind: "town" }
  | { kind: "wave" };
