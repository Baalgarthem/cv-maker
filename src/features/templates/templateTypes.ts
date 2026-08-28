import type { ResumeSectionId, ResumeTheme } from "../../types/resume";

export interface ResumeTemplate {
  id: string;
  name: string;
  description: string;
  className: string;
  defaultSectionOrder: ResumeSectionId[];
  defaultTheme: Partial<ResumeTheme>;
}
