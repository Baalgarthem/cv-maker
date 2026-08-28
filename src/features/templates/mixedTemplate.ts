import type { ResumeTemplate } from "./templateTypes";

export const mixedTemplate: ResumeTemplate = {
  id: "mixed",
  name: "Mixto",
  description: "Una mezcla robusta: encabezado de color completo con un cuerpo de dos columnas.",
  className: "template-mixed",
  defaultSectionOrder: ["summary", "skills", "experience", "education", "languages", "courses", "portfolio"],
  defaultTheme: {
    fontFamily: "\"Segoe UI\", sans-serif",
    headingFontFamily: "\"Segoe UI\", sans-serif",
    baseFontSize: 11,
    mainHeadingSize: 28,
    sectionHeadingSize: 13,
    accentColor: "#2c3e50",
    textColor: "#333333",
    pageColor: "#ffffff",
  }
};
