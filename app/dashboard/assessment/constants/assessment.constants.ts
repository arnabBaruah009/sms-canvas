export const CLASS_OPTIONS = Array.from({ length: 10 }, (_, i) => ({
  value: String(i + 1),
  label: `Class ${i + 1}`,
}));

const SECTIONS = ["A", "B", "C", "D", "E", "F", "G", "H"] as const;
export const SECTION_OPTIONS = SECTIONS.map((s) => ({
  value: s,
  label: `Section ${s}`,
}));
