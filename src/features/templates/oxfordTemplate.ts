import type { ResumeTemplate } from "./templateTypes";

export const oxfordTemplate: ResumeTemplate = {
  id: "oxford",
  name: "Oxford",
  description: "Editorial, sobrio y legible, con una jerarquía clásica.",
  className: "template-oxford",
  defaultSectionOrder: ["summary", "experience", "courses", "portfolio"],
  defaultTheme: {
    fontFamily: '"Segoe UI", sans-serif',
    headingFontFamily: 'Georgia, "Times New Roman", serif',
    baseFontSize: 10.5,
    mainHeadingSize: 26,
    sectionHeadingSize: 13,
    accentColor: "#9a6b35",
    textColor: "#202733",
    pageColor: "#ffffff",
  },
};
