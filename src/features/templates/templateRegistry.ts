import { oxfordTemplate } from "./oxfordTemplate";
import { reverseChronologicalTemplate } from "./reverseChronologicalTemplate";
import { mixedTemplate } from "./mixedTemplate";
import type { ResumeTemplate } from "./templateTypes";

const templates: ResumeTemplate[] = [oxfordTemplate, reverseChronologicalTemplate, mixedTemplate];

export function listTemplates(): readonly ResumeTemplate[] {
  return templates;
}

export function getTemplate(templateId: string): ResumeTemplate {
  return templates.find(({ id }) => id === templateId) ?? oxfordTemplate;
}
