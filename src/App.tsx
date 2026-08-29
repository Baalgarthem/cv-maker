import { useState } from "react";
import { useTranslation } from "./i18n/LanguageContext";
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
  const [zoom, setZoom] = useState(100);
  const { 
    document, moveSection, replaceDocument, toggleSectionBody, toggleSectionSidebar, updateSectionPage, updateTheme, updateTemplateId, updateTemplateVersion,
    profileFolders, documents, activeDocId, setActiveDocId, createFolder, createDocument, duplicateDocument, deleteDocument, loadMetadata
  } = useResumeEditor(sampleResume);
  const templates = listTemplates();
  const { t, language, setLanguage } = useTranslation();

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
            <span>{t("appTitle")}</span>
            <span style={{ textTransform: "none", letterSpacing: "normal", fontWeight: 400, opacity: 0.55, fontSize: "0.8rem", color: "#647083" }}>
              Desarrollado por Ing. Arturo Ramirez (reyr@outlook.jp)
            </span>
          </p>
          <h1>Hazlo tuyo.</h1>
          <p>Edita la identidad visual, reorganiza el contenido y prepara el PDF.</p>
        </div>
                  <div className="header-actions">
          <select value={language} onChange={(e) => setLanguage(e.target.value as 'en' | 'es')} style={{ padding: '0 12px', borderRadius: '4px', border: '1px solid #dcdfe4', fontWeight: 600, minHeight: '44px' }}>
            <option value="es">ES</option>
            <option value="en">EN</option>
          </select>
          <button className="edit-data-button" type="button" onClick={() => setIsFormOpen(true)}>{t("tabData")}</button>
          <button className="export-button" type="button" onClick={exportResumeToPdf}>{t("exportPdf")}</button>
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
                <div key={template.id}>
                  <div className={`template-card ${document.templateId === template.id ? 'is-selected' : ''}`} onClick={() => updateTemplateId(template.id)} style={{ cursor: 'pointer', marginBottom: '8px' }}>
                    <span className="template-monogram">{template.name.substring(0, 2)}</span>
                    <div><strong>{template.name}</strong><p>{template.description}</p></div>
                  </div>
                  {document.templateId === template.id && template.versions && template.versions.length > 1 && (
                    <div className="template-versions" style={{ display: 'flex', gap: '8px', marginBottom: '16px', marginLeft: '12px', flexWrap: 'wrap' }}>
                      {template.versions.map(v => (
                        <button 
                          key={v.id} 
                          type="button"
                          onClick={() => updateTemplateVersion(v.id)}
                          style={{ 
                            padding: '6px 12px', 
                            borderRadius: '16px', 
                            border: `1px solid ${(document.templateVersion || 'v1') === v.id ? '#9a6b35' : '#ccc'}`,
                            background: (document.templateVersion || 'v1') === v.id ? '#fffaf3' : '#fff',
                            color: (document.templateVersion || 'v1') === v.id ? '#9a6b35' : '#555',
                            fontSize: '0.8rem',
                            cursor: 'pointer'
                          }}
                          title={v.description}
                        >
                          {v.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
            <p className="future-note">El catálogo admite diseños con orden y composición propios.</p>
          </section>
          <DesignControls theme={document.theme} onChange={updateTheme} />
          <SectionOrder 
            sections={document.sections} 
            onMove={moveSection} 
            onToggleBody={toggleSectionBody} 
            onToggleSidebar={toggleSectionSidebar}
            onUpdatePage={updateSectionPage}
            templateId={document.templateId}
          />
        </aside>

        <section className="preview-stage" aria-label="Área de vista previa">
          <div className="preview-toolbar" style={{ width: `min(${document.theme.pageSize === "A4" ? "210mm" : "215.9mm"}, 100%)` }}>
            <span>Vista previa {document.theme.pageSize === "A4" ? "A4" : "Carta"}</span>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <button className="text-button" type="button" onClick={handleImport} style={{ fontSize: '0.9em', padding: 0, opacity: 0.8 }}>Importar JSON</button>
              <button className="text-button" type="button" onClick={() => exportMetadataManual(profileFolders, documents)} style={{ fontSize: '0.9em', padding: 0, opacity: 0.8 }}>Exportar JSON</button>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(0,0,0,0.05)', borderRadius: '12px', padding: '2px 6px' }}>
                <button className="text-button" type="button" onClick={() => setZoom(z => Math.max(z - 10, 30))} style={{ padding: '0 4px', fontSize: '1.2em' }}>-</button>
                <span style={{ minWidth: '40px', textAlign: 'center' }}>{zoom}%</span>
                <button className="text-button" type="button" onClick={() => setZoom(z => Math.min(z + 10, 200))} style={{ padding: '0 4px', fontSize: '1.2em' }}>+</button>
              </div>
            </div>
          </div>
          <div style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top center', transition: 'transform 0.15s ease' }}>
            <ResumePreview document={document} />
          </div>
          <p className="pdf-hint">En el diálogo del sistema selecciona “Guardar como PDF”.</p>
        </section>
      </div>
      {isFormOpen && <DataEntryForm document={document} onCancel={() => setIsFormOpen(false)} onSave={(nextDocument) => { replaceDocument(nextDocument); setIsFormOpen(false); }} />}
    </main>
  );
}

