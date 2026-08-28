import { useState } from "react";
import type { DragEvent } from "react";
import type { ResumeSection, ResumeSectionId } from "../../types/resume";

interface SectionOrderProps {
  sections: ResumeSection[];
  onMove: (sourceId: ResumeSectionId, targetId: ResumeSectionId) => void;
  onToggle: (sectionId: ResumeSectionId) => void;
  onToggleSidebar: (sectionId: ResumeSectionId) => void;
  templateId: string;
}

export function SectionOrder({ sections, onMove, onToggle, onToggleSidebar, templateId }: SectionOrderProps) {
  const [draggedId, setDraggedId] = useState<ResumeSectionId | null>(null);

  const handleDrop = (event: DragEvent, targetId: ResumeSectionId) => {
    event.preventDefault();
    if (draggedId) onMove(draggedId, targetId);
    setDraggedId(null);
  };

  const hasSidebar = templateId === "chronological" || templateId === "mixed";

  return (
    <section className="control-group" aria-labelledby="sections-title">
      <div className="control-heading">
        <span>03</span>
        <h2 id="sections-title">Orden de secciones</h2>
      </div>
      <p className="control-help">Arrastra cada bloque para cambiar el orden del currículum.</p>
      <ol className="section-list">
        {sections.filter((s) => s.id !== "summary").map((section) => (
          <li
            key={section.id}
            draggable
            className={draggedId === section.id ? "is-dragging" : ""}
            onDragStart={() => setDraggedId(section.id)}
            onDragEnd={() => setDraggedId(null)}
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => handleDrop(event, section.id)}
            style={{ gridTemplateColumns: hasSidebar ? "20px 1fr auto auto" : "20px 1fr auto" }}
          >
            <span className="drag-handle" aria-hidden="true">⠿</span>
            <span>{section.label}</span>
            {hasSidebar && section.id !== "summary" && section.id !== "experience" ? (
              <label className="visibility-toggle" title="Mostrar en barra lateral">
                <input type="checkbox" checked={!!section.inSidebar} onChange={() => onToggleSidebar(section.id)} />
                Barra lateral
              </label>
            ) : (
              hasSidebar ? <span /> : null
            )}
            <label className="visibility-toggle">
              <input type="checkbox" checked={section.isVisible} onChange={() => onToggle(section.id)} />
              Mostrar
            </label>
          </li>
        ))}
      </ol>
    </section>
  );
}
