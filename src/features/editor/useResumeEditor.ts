import { useState, useEffect } from "react";
import type { ResumeDocument, ResumeSectionId, ResumeTheme, ProfileFolder } from "../../types/resume";
import { autoBackupMetadata } from "./metadataSync";

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
    try {
      const savedDocs = localStorage.getItem("cv-maker-documents");
      if (savedDocs) {
        const parsed = JSON.parse(savedDocs);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      
      // Migration from old single document
      const oldDocRaw = localStorage.getItem("cv-maker-document");
      if (oldDocRaw) {
        const parsed = JSON.parse(oldDocRaw);
        if (parsed && typeof parsed === "object") {
          const doc = { ...initialDocument, ...parsed, id: crypto.randomUUID(), profileFolderId: "default-folder", title: "CV Principal" };
          return [doc];
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
      activeDocument.sections = [...activeDocument.sections, { id: reqSec.id, label: reqSec.label, isVisible: true, inSidebar: reqSec.inSidebar }];
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
      currentDocs.map(doc => doc.id === activeDocId ? updater(doc) : doc)
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

  const toggleSection = (sectionId: ResumeSectionId) => {
    updateActiveDocument(current => ({
      ...current,
      sections: current.sections.map((section) =>
        section.id === sectionId
          ? { ...section, isVisible: !section.isVisible }
          : section,
      ),
    }));
  };

  const toggleSectionSidebar = (sectionId: ResumeSectionId) => {
    updateActiveDocument(current => ({
      ...current,
      sections: current.sections.map((section) =>
        section.id === sectionId
          ? { ...section, inSidebar: !section.inSidebar }
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
    updateActiveDocument(current => ({ ...current, templateId }));
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
    toggleSection,
    toggleSectionSidebar,
    updateSectionPage,
    updateTheme,
    updateTemplateId,

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
