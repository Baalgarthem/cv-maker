import { useState, useEffect } from "react";
import type { ResumeDocument, ResumeSection, ResumeSectionId, ResumeTheme, ProfileFolder } from "../../types/resume";
import { autoBackupMetadata } from "./metadataSync";

function normalizePages(sections: ResumeSection[]): ResumeSection[] {
  const visibleSections = sections.filter(s => s.inBody || s.inSidebar);
  const usedPages = Array.from(new Set(visibleSections.map(s => s.page || 1))).sort((a, b) => a - b);
  
  const pageMap = new Map<number, number>();
  usedPages.forEach((oldPage, index) => {
    pageMap.set(oldPage, index + 1);
  });

  return sections.map(section => {
    const current = section.page || 1;
    if (pageMap.has(current)) {
      return { ...section, page: pageMap.get(current) };
    }
    return { ...section, page: 1 };
  });
}

export function useResumeEditor(initialDocument: ResumeDocument) {
  // Global state
  const [profileFolders, setProfileFolders] = useState<ProfileFolder[]>(() => {
    try {
      const saved = localStorage.getItem("cv-maker-folders");
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [{ id: "default-folder", name: "Mi Perfil" }];
  });

  const [documents, setDocuments] = useState<ResumeDocument[]>(() => {
    const migrateDoc = (doc: any) => {
      if (doc.sections) {
        doc.sections.forEach((sec: any) => {
          if (sec.inBody === undefined && sec.isVisible !== undefined) {
            sec.inBody = sec.isVisible;
          }
          delete sec.isVisible;
        });
      }
      if (doc.profile) {
        if (Array.isArray(doc.profile.professionalLicenses)) {
          doc.profile.professionalLicenses = doc.profile.professionalLicenses.map((l: any) => {
            if (typeof l === 'string') {
              return { prefix: "", number: l };
            }
            return l;
          });
        }
        if (typeof doc.profile.drivingLicenseType === 'string') {
          const dt = doc.profile.drivingLicenseType.toLowerCase();
          if (dt.includes('tipo a') || dt === 'automovilista' || dt === 'tipo a (automovilista)') doc.profile.drivingLicenseType = 'A';
          else if (dt.includes('tipo b') || dt === 'chofer') doc.profile.drivingLicenseType = 'B';
          else if (dt.includes('tipo c')) doc.profile.drivingLicenseType = 'C';
          else if (dt.includes('tipo d')) doc.profile.drivingLicenseType = 'D';
          else if (dt.includes('tipo e')) doc.profile.drivingLicenseType = 'E';
          else if (dt.includes('tipo f')) doc.profile.drivingLicenseType = 'F';
        }
      }
      if (Array.isArray(doc.portfolioLinks)) {
        doc.portfolioLinks.forEach((link: any) => {
          if (link.kind && !link.icon) {
            link.icon = link.kind === 'github' ? 'github' : 'none';
            delete link.kind;
          }
        });
      }
      return doc;
    };

    try {
      const savedDocs = localStorage.getItem("cv-maker-documents");
      if (savedDocs) {
        const parsed = JSON.parse(savedDocs);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed.map(migrateDoc);
      }
      
      // Migration from old single document
      const oldDocRaw = localStorage.getItem("cv-maker-document");
      if (oldDocRaw) {
        const parsed = JSON.parse(oldDocRaw);
        if (parsed && typeof parsed === "object") {
          const doc = { ...initialDocument, ...parsed, id: crypto.randomUUID(), profileFolderId: "default-folder", title: "CV Principal" };
          return [migrateDoc(doc)];
        }
      }
    } catch (e) {
      console.error(e);
    }

    // Fallback
    return [{ ...initialDocument, id: crypto.randomUUID(), profileFolderId: "default-folder", title: "CV Principal" }];
  });

  const [activeDocId, setActiveDocId] = useState<string>(() => {
    try {
      const savedId = localStorage.getItem("cv-maker-active-doc");
      if (savedId) return savedId;
    } catch (e) {}
    return documents[0]?.id || "";
  });

  // Derived state: The active document
  let activeDocument = documents.find(d => d.id === activeDocId);
  if (!activeDocument && documents.length > 0) {
    activeDocument = documents[0];
  } else if (!activeDocument) {
    activeDocument = { ...initialDocument, id: crypto.randomUUID(), profileFolderId: "default-folder", title: "CV Principal" };
  }

  // Ensure active document has required sections (migration helper)
  const requiredSections: { id: ResumeSectionId; label: string; inSidebar?: boolean }[] = [
    { id: "education", label: "Formación académica" },
    { id: "skills", label: "Habilidades y competencias" },
    { id: "languages", label: "Idiomas", inSidebar: true },
  ];
  
  requiredSections.forEach((reqSec) => {
    if (!activeDocument.sections.find((s) => s.id === reqSec.id)) {
      activeDocument.sections = [...activeDocument.sections, { id: reqSec.id, label: reqSec.label, inBody: true, inSidebar: reqSec.inSidebar }];
    }
  });

  // Effects to persist state and backup
  useEffect(() => {
    localStorage.setItem("cv-maker-folders", JSON.stringify(profileFolders));
    autoBackupMetadata(profileFolders, documents);
  }, [profileFolders, documents]);

  useEffect(() => {
    localStorage.setItem("cv-maker-documents", JSON.stringify(documents));
  }, [documents]);

  useEffect(() => {
    localStorage.setItem("cv-maker-active-doc", activeDocId);
  }, [activeDocId]);

  // Document Mutators
  const updateActiveDocument = (updater: (doc: ResumeDocument) => ResumeDocument) => {
    setDocuments(currentDocs => 
      currentDocs.map(doc => {
        if (doc.id === activeDocId) {
          const updated = updater(doc);
          updated.sections = normalizePages(updated.sections);
          return updated;
        }
        return doc;
      })
    );
  };

  const replaceDocument = (nextDocument: ResumeDocument) => {
    updateActiveDocument(() => nextDocument);
  };

  const updateTheme = (changes: Partial<ResumeTheme>) => {
    updateActiveDocument(current => ({
      ...current,
      theme: { ...current.theme, ...changes },
    }));
  };

  const moveSection = (sourceId: ResumeSectionId, targetId: ResumeSectionId) => {
    if (sourceId === targetId) return;
    updateActiveDocument(current => {
      const sourceIndex = current.sections.findIndex(({ id }) => id === sourceId);
      const targetIndex = current.sections.findIndex(({ id }) => id === targetId);
      if (sourceIndex < 0 || targetIndex < 0) return current;

      const sections = [...current.sections];
      const [movedSection] = sections.splice(sourceIndex, 1);
      sections.splice(targetIndex, 0, movedSection);
      return { ...current, sections };
    });
  };

  const toggleSectionBody = (sectionId: ResumeSectionId) => {
    updateActiveDocument(current => ({
      ...current,
      sections: current.sections.map((section) =>
        section.id === sectionId
          ? { ...section, inBody: !section.inBody, inSidebar: !section.inBody ? false : section.inSidebar }
          : section,
      ),
    }));
  };

  const toggleSectionSidebar = (sectionId: ResumeSectionId) => {
    updateActiveDocument(current => ({
      ...current,
      sections: current.sections.map((section) =>
        section.id === sectionId
          ? { ...section, inSidebar: !section.inSidebar, inBody: !section.inSidebar ? false : section.inBody }
          : section,
      ),
    }));
  };

  const updateSectionPage = (sectionId: ResumeSectionId, page: number) => {
    updateActiveDocument(current => ({
      ...current,
      sections: current.sections.map((section) =>
        section.id === sectionId ? { ...section, page } : section
      ),
    }));
  };

  const updateTemplateId = (templateId: string) => {
    updateActiveDocument(current => ({ ...current, templateId, templateVersion: "v1" }));
  };

  const updateTemplateVersion = (templateVersion: string) => {
    updateActiveDocument(current => ({ ...current, templateVersion }));
  };

  // Folder & Global Document Management
  const createFolder = (name: string) => {
    setProfileFolders(f => [...f, { id: crypto.randomUUID(), name }]);
  };

  const deleteFolder = (id: string) => {
    setProfileFolders(f => f.filter(folder => folder.id !== id));
    // Optionally handle documents in deleted folders (e.g. set profileFolderId to null or default)
  };

  const createDocument = (title: string, folderId: string) => {
    const newDoc = { ...initialDocument, id: crypto.randomUUID(), profileFolderId: folderId, title };
    setDocuments(d => [...d, newDoc]);
    setActiveDocId(newDoc.id);
  };
  
  const duplicateDocument = (docId: string, newTitle: string, folderId: string) => {
    const docToClone = documents.find(d => d.id === docId);
    if (!docToClone) return;
    const newDoc = { ...docToClone, id: crypto.randomUUID(), profileFolderId: folderId, title: newTitle };
    setDocuments(d => [...d, newDoc]);
    setActiveDocId(newDoc.id);
  };

  const deleteDocument = (id: string) => {
    setDocuments(docs => {
      const nextDocs = docs.filter(d => d.id !== id);
      if (id === activeDocId && nextDocs.length > 0) {
        setActiveDocId(nextDocs[0].id);
      }
      return nextDocs;
    });
  };
  
  const changeDocumentFolder = (docId: string, newFolderId: string) => {
    setDocuments(docs => docs.map(d => d.id === docId ? { ...d, profileFolderId: newFolderId } : d));
  };
  
  const renameDocument = (docId: string, newTitle: string) => {
    setDocuments(docs => docs.map(d => d.id === docId ? { ...d, title: newTitle } : d));
  };

  const loadMetadata = (data: { profileFolders: ProfileFolder[], documents: ResumeDocument[] }) => {
    setProfileFolders(data.profileFolders);
    setDocuments(data.documents);
    if (data.documents.length > 0) setActiveDocId(data.documents[0].id);
  };

  return {
    // Current Active Document API (Backward compatible mostly)
    document: activeDocument,
    moveSection,
    replaceDocument,
    toggleSectionBody,
    toggleSectionSidebar,
    updateSectionPage,
    updateTheme,
    updateTemplateId,
    updateTemplateVersion,

    // Global Profiles & Documents API
    profileFolders,
    documents,
    activeDocId,
    setActiveDocId,
    createFolder,
    deleteFolder,
    createDocument,
    duplicateDocument,
    deleteDocument,
    changeDocumentFolder,
    renameDocument,
    loadMetadata
  };
}
