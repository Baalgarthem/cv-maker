import { useState } from "react";
import type { DragEvent } from "react";
import type { ResumeSection, ResumeSectionId } from "../../types/resume";

interface SectionOrderProps {
  sections: ResumeSection[];
  onMove: (sourceId: ResumeSectionId, targetId: ResumeSectionId) => void;
  onToggleBody: (sectionId: ResumeSectionId) => void;
  onToggleSidebar: (sectionId: ResumeSectionId) => void;
  onUpdatePage: (sectionId: ResumeSectionId, page: number) => void;
  templateId: string;
}

export function SectionOrder({ sections, onMove, onToggleBody, onToggleSidebar, onUpdatePage, templateId }: SectionOrderProps) {
  const [draggedId, setDraggedId] = useState<ResumeSectionId | null>(null);

  const handleDrop = (event: DragEvent, targetId: ResumeSectionId) => {
    event.preventDefault();
    if (draggedId) onMove(draggedId, targetId);
    setDraggedId(null);
  };

  const hasSidebar = templateId === "chronological" || templateId === "mixed";
  
  // Highest page currently used by any visible section
  const currentMaxPage = Math.max(1, ...sections.filter(s => s.inBody || s.inSidebar).map(s => s.page || 1));

  return (
    <section className="control-group" aria-labelledby="sections-title">
      <div className="control-heading">
        <span>03</span>
        <h2 id="sections-title">Orden de secciones</h2>
      </div>
      <p className="control-help">Arrastra cada bloque para cambiar el orden o envíalos a una nueva página.</p>
      <ol className="section-list">
        {sections.filter((s) => s.id !== "summary").map((section) => {
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
              <label className="visibility-toggle">
                <input type="checkbox" checked={section.inBody} onChange={() => onToggleBody(section.id)} />
                Cuerpo
              </label>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

