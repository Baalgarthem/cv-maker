import { useState } from "react";
import { ResumePreview } from "./features/cv-preview";
import { DataEntryForm } from "./features/data-entry";
import { DesignControls, SectionOrder, useResumeEditor } from "./features/editor";
import { ProfileManager } from "./features/editor/ProfileManager";
import { exportMetadataManual, importMetadataManual } from "./features/editor/metadataSync";
import { exportResumeToPdf } from "./features/export";
import { sampleResume } from "./features/resume";
import { listTemplates } from "./features/templates";

export function App() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { 
    document, moveSection, replaceDocument, toggleSection, toggleSectionSidebar, updateTheme, updateTemplateId,
    profileFolders, documents, activeDocId, setActiveDocId, createFolder, createDocument, duplicateDocument, deleteDocument, loadMetadata
  } = useResumeEditor(sampleResume);
  const templates = listTemplates();

  const handleImport = async () => {
    const data = await importMetadataManual();
    if (data) {
      loadMetadata(data);
    }
  };

  return (
    <main className="app-shell">
      <header className="app-header">
        <div>
          <p className="eyebrow" style={{ display: "flex", alignItems: "baseline", gap: "12px", flexWrap: "wrap" }}>
            <span>CV Maker · Diseñador</span>
            <span style={{ textTransform: "none", letterSpacing: "normal", fontWeight: 400, opacity: 0.55, fontSize: "0.8rem", color: "#647083" }}>
              Desarrollado por Ing. Arturo Ramirez (reyr@outlook.jp)
            </span>
          </p>
          <h1>Hazlo tuyo.</h1>
          <p>Edita la identidad visual, reorganiza el contenido y prepara el PDF.</p>
        </div>
        <div className="header-actions">
          <button className="edit-data-button" type="button" onClick={() => setIsFormOpen(true)}>Editar información</button>
          <button className="export-button" type="button" onClick={exportResumeToPdf}>Exportar PDF</button>
        </div>
      </header>

      <div className="editor-layout">
        <aside className="editor-panel" aria-label="Controles de diseño">
          
          <ProfileManager 
            profileFolders={profileFolders}
            documents={documents}
            activeDocId={activeDocId}
            setActiveDocId={setActiveDocId}
            createFolder={createFolder}
            createDocument={createDocument}
            duplicateDocument={duplicateDocument}
            deleteDocument={deleteDocument}
          />

          <section className="control-group" aria-labelledby="template-title">
            <div className="control-heading"><span>01</span><h2 id="template-title">Formato</h2></div>
            <div className="template-list">
              {templates.map(template => (
                <div key={template.id} className={`template-card ${document.templateId === template.id ? 'is-selected' : ''}`} onClick={() => updateTemplateId(template.id)} style={{ cursor: 'pointer', marginBottom: '8px' }}>
                  <span className="template-monogram">{template.name.substring(0, 2)}</span>
                  <div><strong>{template.name}</strong><p>{template.description}</p></div>
                </div>
              ))}
            </div>
            <p className="future-note">El catálogo admite diseños con orden y composición propios.</p>
          </section>
          <DesignControls theme={document.theme} onChange={updateTheme} />
          <SectionOrder 
            sections={document.sections} 
            onMove={moveSection} 
            onToggle={toggleSection} 
            onToggleSidebar={toggleSectionSidebar}
            templateId={document.templateId}
          />
        </aside>

        <section className="preview-stage" aria-label="Área de vista previa">
          <div className="preview-toolbar" style={{ width: `min(${document.theme.pageSize === "A4" ? "210mm" : "215.9mm"}, 100%)` }}>
            <span>Vista previa {document.theme.pageSize === "A4" ? "A4" : "Carta"}</span>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <button className="text-button" type="button" onClick={handleImport} style={{ fontSize: '0.9em', padding: 0, opacity: 0.8 }}>Importar JSON</button>
              <button className="text-button" type="button" onClick={() => exportMetadataManual(profileFolders, documents)} style={{ fontSize: '0.9em', padding: 0, opacity: 0.8 }}>Exportar JSON</button>
              <span>100%</span>
            </div>
          </div>
          <ResumePreview document={document} />
          <p className="pdf-hint">En el diálogo del sistema selecciona “Guardar como PDF”.</p>
        </section>
      </div>
      {isFormOpen && <DataEntryForm document={document} onCancel={() => setIsFormOpen(false)} onSave={(nextDocument) => { replaceDocument(nextDocument); setIsFormOpen(false); }} />}
    </main>
  );
}
