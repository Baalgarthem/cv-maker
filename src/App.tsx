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
    document, moveSection, replaceDocument, toggleSectionBody, toggleSectionSidebar, updateSectionPage, updateSectionSide, updateTheme, updateTemplateId, updateTemplateVersion,
    profileFolders, documents, activeDocId, setActiveDocId, createFolder, createDocument, duplicateDocument, deleteDocument, loadMetadata,
    changeDocumentFolder, renameDocument
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
          <select value={language} onChange={(e) => setLanguage(e.target.value as 'en' | 'es')} style={{ border: '1px solid #17243b', color: '#17243b', background: 'transparent' }}>
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
            changeDocumentFolder={changeDocumentFolder}
            renameDocument={renameDocument}
          />

          <section className="control-group" aria-labelledby="template-title">
            <div className="control-heading">
              <span>01</span>
              <h2 id="template-title">{t("template")}</h2>
            </div>
            <div className="template-grid" style={{ display: "grid", gap: "10px" }}>
              {templates.map((tpl) => (
                <div key={tpl.id} style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <label
                    className="template-card"
                    style={{
                      borderColor: tpl.id === document.templateId ? "var(--resume-accent, #9a6b35)" : "#dedad2",
                      background: tpl.id === document.templateId ? "#fffaf3" : "white",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      padding: "10px",
                      borderRadius: "6px",
                      border: "1px solid"
                    }}
                  >
                    <input
                      type="radio"
                      name="template-choice"
                      value={tpl.id}
                      checked={tpl.id === document.templateId}
                      onChange={() => updateTemplateId(tpl.id)}
                      style={{ display: "none" }}
                    />
                    <div className="template-monogram">{tpl.name.slice(0, 2).toUpperCase()}</div>
                    <div>
                      <strong style={{ display: "block", fontSize: "0.95rem" }}>{tpl.name}</strong>
                      <span style={{ fontSize: "0.78rem", color: "#666" }}>{tpl.description}</span>
                    </div>
                  </label>

                  {tpl.id === document.templateId && tpl.versions && tpl.versions.length > 1 && (
                    <div style={{ paddingLeft: "12px", marginTop: "2px" }}>
                      <label style={{ fontSize: "0.8rem", color: "#555", display: "flex", alignItems: "center", gap: "6px" }}>
                        Variante:
                        <select
                          value={document.templateVersion || "v1"}
                          onChange={(e) => updateTemplateVersion(e.target.value)}
                          style={{ fontSize: "0.8rem", padding: "2px 6px", borderRadius: "4px", border: "1px solid #ccc" }}
                        >
                          {tpl.versions.map((v) => (
                            <option key={v.id} value={v.id}>{v.name}</option>
                          ))}
                        </select>
                      </label>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <p className="future-note">El catálogo admite diseños con orden y composición propios.</p>
          </section>
          <DesignControls theme={document.theme} templateId={document.templateId} onChange={updateTheme} />
          <SectionOrder 
            sections={document.sections} 
            onMove={moveSection} 
            onToggleBody={toggleSectionBody} 
            onToggleSidebar={toggleSectionSidebar}
            onUpdatePage={updateSectionPage}
            onUpdateSide={updateSectionSide}
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

