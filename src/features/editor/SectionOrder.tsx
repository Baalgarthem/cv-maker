import { useState } from "react";
import type { DragEvent } from "react";
import { useTranslation } from "../../i18n/LanguageContext";
import type { ResumeSection, ResumeSectionId } from "../../types/resume";

interface SectionOrderProps {
  sections: ResumeSection[];
  onMove: (sourceId: ResumeSectionId, targetId: ResumeSectionId) => void;
  onToggleBody: (sectionId: ResumeSectionId) => void;
  onToggleSidebar: (sectionId: ResumeSectionId) => void;
  onUpdatePage: (sectionId: ResumeSectionId, page: number) => void;
  onUpdateSide?: (sectionId: ResumeSectionId, side: "left" | "right" | "none") => void;
  templateId: string;
}

export function SectionOrder({ 
  sections, 
  onMove, 
  onToggleBody, 
  onToggleSidebar, 
  onUpdatePage, 
  onUpdateSide,
  templateId
}: SectionOrderProps) {
  const { t } = useTranslation();
  const [draggedId, setDraggedId] = useState<ResumeSectionId | null>(null);

  const handleDrop = (event: DragEvent, targetId: ResumeSectionId) => {
    event.preventDefault();
    if (draggedId) onMove(draggedId, targetId);
    setDraggedId(null);
  };

  const hasSidebar = templateId === "chronological" || templateId === "mixed";
  const isMindmap = templateId === "mindmap";

  return (
    <section className="control-group" aria-labelledby="sections-title">
      <div className="control-heading">
        <span>03</span>
        <h2 id="sections-title">Orden de secciones</h2>
      </div>
      <p className="control-help">Arrastra cada bloque para cambiar el orden o envíalos a una nueva página.</p>
      <ol className="section-list">
        {sections.filter((s) => s.id !== "summary").map((section, index) => {
          const sectionPage = section.page || 1;
          
          // To prevent empty pages, the maximum page this section can move to is 
          // determined by the maximum page used by ALL OTHER visible sections, plus 1.
          const otherVisibleSections = sections.filter(s => s.id !== section.id && (s.inBody || s.inSidebar));
          const maxPageByOthers = Math.max(1, ...otherVisibleSections.map(s => s.page || 1));
          
          // However, if the section is currently on a page higher than maxPageByOthers + 1, 
          // we should at least show its current page (though normalizePages will fix it anyway).
          const allowedMax = Math.max(maxPageByOthers + 1, sectionPage);
          const availablePages = Array.from({ length: allowedMax }, (_, i) => i + 1);
          
          return (
            <li
              key={section.id}
              draggable
              className={draggedId === section.id ? "is-dragging" : ""}
              onDragStart={() => setDraggedId(section.id)}
              onDragEnd={() => setDraggedId(null)}
              onDragOver={(event) => event.preventDefault()}
              onDrop={(event) => handleDrop(event, section.id)}
              style={{ gridTemplateColumns: hasSidebar ? "20px 1fr auto auto auto" : "20px 1fr auto auto" }}
            >
              <span className="drag-handle" aria-hidden="true">⠿</span>
              <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{section.label}</span>
              
              <select 
                value={sectionPage} 
                onChange={(e) => onUpdatePage(section.id, Number(e.target.value))}
                style={{ fontSize: "0.75em", padding: "2px", border: "1px solid rgba(0,0,0,0.1)", borderRadius: "4px" }}
                title="Página"
              >
                {availablePages.map(p => (
                  <option key={p} value={p}>Pág {p}</option>
                ))}
              </select>

              {hasSidebar && section.id !== "summary" && section.id !== "experience" ? (
                <label className="visibility-toggle" title="Mostrar en barra lateral">
                  <input type="checkbox" checked={!!section.inSidebar} onChange={() => onToggleSidebar(section.id)} />
                  Barra
                </label>
              ) : (
                hasSidebar ? <span /> : null
              )}

              {isMindmap ? (
                <select
                  value={!section.inBody ? "none" : (section.side || (index % 2 === 0 ? "left" : "right"))}
                  onChange={(e) => onUpdateSide ? onUpdateSide(section.id, e.target.value as "left" | "right" | "none") : null}
                  style={{
                    fontSize: "0.74rem",
                    fontWeight: 600,
                    padding: "2px 4px",
                    borderRadius: "4px",
                    border: "1px solid #cac6be",
                    background: !section.inBody ? "#f0eee9" : ((section.side || (index % 2 === 0 ? "left" : "right")) === "right" ? "#f2f7ff" : "#fff8f0"),
                    color: !section.inBody ? "#888" : ((section.side || (index % 2 === 0 ? "left" : "right")) === "right" ? "#295b9a" : "#9a6b35"),
                    cursor: "pointer"
                  }}
                  title="Lado en el mapa conceptual"
                >
                  <option value="left">◧ Izquierdo</option>
                  <option value="right">◨ Derecho</option>
                  <option value="none">⊘ Ocultar</option>
                </select>
              ) : (
                <label className="visibility-toggle">
                  <input type="checkbox" checked={section.inBody} onChange={() => onToggleBody(section.id)} />
                  Cuerpo
                </label>
              )}
            </li>
          );
        })}
      </ol>
    </section>
  );
}

