import type { ResumeTemplate } from "./templateTypes";

export const reverseChronologicalTemplate: ResumeTemplate = {
  id: "chronological",
  name: "Cronológico Inverso",
  description: "Moderno, con una barra lateral izquierda de color acentuado.",
  className: "template-chronological",
  defaultSectionOrder: ["summary", "experience", "education", "skills", "languages", "courses", "portfolio"],
  defaultTheme: {
    fontFamily: '"Segoe UI", sans-serif',
    headingFontFamily: '"Segoe UI", sans-serif',
    baseFontSize: 11,
    mainHeadingSize: 25,
    sectionHeadingSize: 12.5,
    accentColor: "#34495e",
    textColor: "#2c3e50",
    pageColor: "#ffffff",
  }
};
