import type { ResumeTheme } from "../../types/resume";

interface DesignControlsProps {
  theme: ResumeTheme;
  onChange: (changes: Partial<ResumeTheme>) => void;
}

const fonts = [
  { label: "Segoe UI", value: '"Segoe UI", sans-serif' },
  { label: "Arial", value: "Arial, sans-serif" },
  { label: "Georgia", value: 'Georgia, "Times New Roman", serif' },
  { label: "Times New Roman", value: '"Times New Roman", serif' },
];

export function DesignControls({ theme, onChange }: DesignControlsProps) {
  return (
    <section className="control-group" aria-labelledby="design-title">
      <div className="control-heading">
        <span>02</span>
        <h2 id="design-title">Diseño</h2>
      </div>

      <div className="design-subsection">
        <h3>Estructura y diseño</h3>
        <label>
          Tamaño de página
          <select value={theme.pageSize} onChange={(event) => onChange({ pageSize: event.target.value as "A4" | "LETTER" })}>
            <option value="A4">A4 (210 × 297 mm)</option>
            <option value="LETTER">Carta (8.5 × 11 in)</option>
          </select>
        </label>

        <label className="checkbox-field" style={{ marginTop: 16 }}>
          <input type="checkbox" checked={theme.showSummarySeparator ?? true} onChange={(e) => onChange({ showSummarySeparator: e.target.checked })} />
          Mostrar línea separadora en el perfil
        </label>

        <label className="checkbox-field" style={{ marginTop: 16 }}>
          <input type="checkbox" checked={theme.showProfilePicture} onChange={(e) => onChange({ showProfilePicture: e.target.checked })} />
          Mostrar fotografía de perfil
        </label>

        {theme.showProfilePicture && (
          <div style={{ display: "grid", gap: "10px", marginTop: "12px", paddingLeft: "10px", borderLeft: "2px solid #e0dfdb" }}>
            <label>
              Estilo del marco
              <select value={theme.pictureFrameStyle} onChange={(e) => onChange({ pictureFrameStyle: e.target.value as any })}>
                <option value="none">Sin marco</option>
                <option value="circle">Circular</option>
                <option value="square">Cuadrado</option>
                <option value="hexagon">Hexagonal</option>
                <option value="top-bottom">Líneas sup / inf</option>
              </select>
            </label>
            <label>
              Grosor del marco <output>{theme.pictureFrameWidth}px</output>
              <input type="range" min="0" max="8" step="1" value={theme.pictureFrameWidth} onChange={(e) => onChange({ pictureFrameWidth: Number(e.target.value) })} />
            </label>
            <label>
              Tamaño de la imagen <output>{theme.pictureSize}mm</output>
              <input type="range" min="20" max="60" step="2" value={theme.pictureSize} onChange={(e) => onChange({ pictureSize: Number(e.target.value) })} />
            </label>
            <label>
              Alineación de la imagen
              <select value={theme.pictureAlignment || "left"} onChange={(e) => onChange({ pictureAlignment: e.target.value as "left" | "center" | "right" })}>
                <option value="left">Izquierda</option>
                <option value="center">Centrada</option>
                <option value="right">Derecha</option>
              </select>
            </label>
          </div>
        )}

        <label style={{ marginTop: 16 }}>
          Posición de la barra lateral (si aplica)
          <select value={theme.sidebarPosition} onChange={(event) => onChange({ sidebarPosition: event.target.value as "left" | "right" })}>
            <option value="left">Izquierda</option>
            <option value="right">Derecha</option>
          </select>
        </label>
      </div>

      <div className="design-subsection">
        <h3>Tipografía global</h3>
        <label>
          Fuente del texto
          <select value={theme.fontFamily} onChange={(event) => onChange({ fontFamily: event.target.value })}>
            {fonts.map((font) => <option key={font.value} value={font.value}>{font.label}</option>)}
          </select>
        </label>
        <label>
          Fuente de títulos
          <select value={theme.headingFontFamily} onChange={(event) => onChange({ headingFontFamily: event.target.value })}>
            {fonts.map((font) => <option key={font.value} value={font.value}>{font.label}</option>)}
          </select>
        </label>
      </div>

      <div className="design-subsection">
        <h3>Encabezado (Principal)</h3>
        <label>
          Títulos principales (Tu Nombre) <output>{theme.mainHeadingSize ?? 26} pt</output>
          <input type="range" min="16" max="48" step="1" value={theme.mainHeadingSize ?? 26} onChange={(event) => onChange({ mainHeadingSize: Number(event.target.value) })} />
        </label>
        <label>
          Contactos e info. principal <output>{theme.headerContactFontSize ?? theme.baseFontSize * 0.9} pt</output>
          <input type="range" min="8" max="16" step="0.5" value={theme.headerContactFontSize ?? theme.baseFontSize * 0.9} onChange={(event) => onChange({ headerContactFontSize: Number(event.target.value) })} />
        </label>
      </div>

      <div className="design-subsection">
        <h3>Cuerpo del currículum</h3>
        <label>
          Espaciado entre secciones <output>{theme.sectionSpacing ?? 8} mm</output>
          <input type="range" min="2" max="20" step="1" value={theme.sectionSpacing ?? 8} onChange={(event) => onChange({ sectionSpacing: Number(event.target.value) })} />
        </label>
        <label>
          Espaciado entre elementos <output>{theme.itemSpacing ?? 3} mm</output>
          <input type="range" min="0" max="8" step="0.5" value={theme.itemSpacing ?? 3} onChange={(event) => onChange({ itemSpacing: Number(event.target.value) })} />
        </label>
        <label>
          Interlineado del texto <output>{theme.lineHeight ?? 1.55}</output>
          <input type="range" min="1.0" max="2.0" step="0.05" value={theme.lineHeight ?? 1.55} onChange={(event) => onChange({ lineHeight: Number(event.target.value) })} />
        </label>
        <label>
          Títulos de secciones <output>{theme.sectionHeadingSize ?? 13} pt</output>
          <input type="range" min="10" max="24" step="0.5" value={theme.sectionHeadingSize ?? 13} onChange={(event) => onChange({ sectionHeadingSize: Number(event.target.value) })} />
        </label>
        <label>
          Subtítulos (Empresas, escuelas) <output>{theme.sectionSubheadingSize ?? 11} pt</output>
          <input type="range" min="8" max="18" step="0.5" value={theme.sectionSubheadingSize ?? 11} onChange={(event) => onChange({ sectionSubheadingSize: Number(event.target.value) })} />
        </label>
        <label>
          Texto del cuerpo <output>{theme.baseFontSize} pt</output>
          <input type="range" min="8" max="14" step="0.5" value={theme.baseFontSize} onChange={(event) => onChange({ baseFontSize: Number(event.target.value) })} />
        </label>
      </div>

      <div className="design-subsection">
        <h3>Barra lateral</h3>
        <label>
          Espaciado entre secciones <output>{theme.sidebarSectionSpacing ?? 6} mm</output>
          <input type="range" min="2" max="16" step="1" value={theme.sidebarSectionSpacing ?? 6} onChange={(event) => onChange({ sidebarSectionSpacing: Number(event.target.value) })} />
        </label>
        <label>
          Títulos de barra lateral <output>{theme.sidebarHeadingSize ?? 12} pt</output>
          <input type="range" min="10" max="24" step="0.5" value={theme.sidebarHeadingSize ?? 12} onChange={(event) => onChange({ sidebarHeadingSize: Number(event.target.value) })} />
        </label>
        <label>
          Subtítulos de barra lateral <output>{theme.sidebarSubheadingSize ?? 10} pt</output>
          <input type="range" min="8" max="18" step="0.5" value={theme.sidebarSubheadingSize ?? 10} onChange={(event) => onChange({ sidebarSubheadingSize: Number(event.target.value) })} />
        </label>
        <label>
          Texto de barra lateral <output>{theme.sidebarFontSize ?? theme.baseFontSize} pt</output>
          <input type="range" min="8" max="14" step="0.5" value={theme.sidebarFontSize ?? theme.baseFontSize} onChange={(event) => onChange({ sidebarFontSize: Number(event.target.value) })} />
        </label>
      </div>

      <div className="design-subsection">
        <h3>Colores</h3>
        <div className="color-grid">
          <label>Color de acento<input type="color" value={theme.accentColor} onChange={(event) => onChange({ accentColor: event.target.value })} /></label>
          <label>Color de texto<input type="color" value={theme.textColor} onChange={(event) => onChange({ textColor: event.target.value })} /></label>
          <label>Color de página<input type="color" value={theme.pageColor} onChange={(event) => onChange({ pageColor: event.target.value })} /></label>
        </div>
      </div>
    </section>
  );
}
