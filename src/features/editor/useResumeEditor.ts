import { useState, useEffect } from "react";
import type { ResumeDocument, ResumeSectionId, ResumeTheme } from "../../types/resume";

export function useResumeEditor(initialDocument: ResumeDocument) {
  const [document, setDocument] = useState<ResumeDocument>(() => {
    try {
      const saved = localStorage.getItem("cv-maker-document");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === "object") {
          const doc = { ...initialDocument, ...parsed };
          
          const requiredSections: { id: ResumeSectionId; label: string; inSidebar?: boolean }[] = [
            { id: "education", label: "Formación académica" },
            { id: "skills", label: "Habilidades y competencias" },
            { id: "languages", label: "Idiomas", inSidebar: true },
          ];
          
          requiredSections.forEach((reqSec) => {
            if (!doc.sections.find((s: any) => s.id === reqSec.id)) {
              doc.sections = [...doc.sections, { id: reqSec.id, label: reqSec.label, isVisible: true, inSidebar: reqSec.inSidebar }];
            }
          });
          return doc;
        }
      }
    } catch (e) {
      console.error("Failed to load document from local storage", e);
    }
    
    // Fallback to initialDocument (which is sampleResume) and apply required sections.
    const requiredSections: { id: ResumeSectionId; label: string; inSidebar?: boolean }[] = [
      { id: "education", label: "Formación académica" },
      { id: "skills", label: "Habilidades y competencias" },
      { id: "languages", label: "Idiomas", inSidebar: true },
    ];
    
    const doc = { ...initialDocument };
    requiredSections.forEach((reqSec) => {
      if (!doc.sections.find((s) => s.id === reqSec.id)) {
        doc.sections = [...doc.sections, { id: reqSec.id, label: reqSec.label, isVisible: true, inSidebar: reqSec.inSidebar }];
      }
    });
    return doc;
  });

  useEffect(() => {
    try {
      localStorage.setItem("cv-maker-document", JSON.stringify(document));
    } catch (e) {
      console.error("Failed to save document to local storage", e);
    }
  }, [document]);

  const replaceDocument = (nextDocument: ResumeDocument) => {
    setDocument(nextDocument);
  };

  const updateTheme = (changes: Partial<ResumeTheme>) => {
    setDocument((current) => ({
      ...current,
      theme: { ...current.theme, ...changes },
    }));
  };

  const moveSection = (sourceId: ResumeSectionId, targetId: ResumeSectionId) => {
    if (sourceId === targetId) return;
    setDocument((current) => {
      const sourceIndex = current.sections.findIndex(({ id }) => id === sourceId);
      const targetIndex = current.sections.findIndex(({ id }) => id === targetId);
      if (sourceIndex < 0 || targetIndex < 0) return current;

      const sections = [...current.sections];
      const [movedSection] = sections.splice(sourceIndex, 1);
      sections.splice(targetIndex, 0, movedSection);
      return { ...current, sections };
    });
  };

  const toggleSection = (sectionId: ResumeSectionId) => {
    setDocument((current) => ({
      ...current,
      sections: current.sections.map((section) =>
        section.id === sectionId
          ? { ...section, isVisible: !section.isVisible }
          : section,
      ),
    }));
  };

  const toggleSectionSidebar = (sectionId: ResumeSectionId) => {
    setDocument((current) => ({
      ...current,
      sections: current.sections.map((section) =>
        section.id === sectionId
          ? { ...section, inSidebar: !section.inSidebar }
          : section,
      ),
    }));
  };

  const updateTemplateId = (templateId: string) => {
    setDocument((current) => ({ ...current, templateId }));
  };

  return { document, moveSection, replaceDocument, toggleSection, toggleSectionSidebar, updateTheme, updateTemplateId };
}
