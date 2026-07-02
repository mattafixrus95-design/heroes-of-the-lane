export type Selection =
  | { kind: "tower"; id: string }
  | { kind: "farm" }
  | { kind: "sawmill" }
  | { kind: "town" };
