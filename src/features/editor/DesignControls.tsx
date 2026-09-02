import { useTranslation } from "../../i18n/LanguageContext";
import type { ResumeTheme } from "../../types/resume";

interface DesignControlsProps {
  theme: ResumeTheme;
  templateId?: string;
  onChange: (changes: Partial<ResumeTheme>) => void;
}

const fonts = [
  { label: "Segoe UI", value: '"Segoe UI", sans-serif' },
  { label: "Arial", value: "Arial, sans-serif" },
  { label: "Georgia", value: 'Georgia, "Times New Roman", serif' },
  { label: "Times New Roman", value: '"Times New Roman", serif' },
];

export function DesignControls({ theme, templateId, onChange }: DesignControlsProps) {
  const { t } = useTranslation();
  const hasSidebar = templateId === "chronological" || templateId === "mixed";
  const supportsCompactProfile = templateId !== "chronological";
  const isMindmap = templateId === "mindmap";

  return (
    <section className="control-group" aria-labelledby="design-title">
      <div className="control-heading">
        <span>02</span>
        <h2 id="design-title">Diseño</h2>
      </div>

      {/* 1. CONFIGURACIÓN DE PÁGINA */}
      <div className="design-subsection">
        <h3>1. Configuración de página</h3>
        <label>{t("pageSize")}
          <select value={theme.pageSize} onChange={(event) => onChange({ pageSize: event.target.value as "A4" | "LETTER" })}>
            <option value="A4">{t("pageSizeA4")}</option>
            <option value="LETTER">{t("pageSizeLetter")}</option>
          </select>
        </label>

        <label style={{ marginTop: '10px', display: 'block' }}>
          {t("pagePadding")} ({theme.pagePaddingVertical ?? 19}mm)
          <input 
            type="range" 
            min="5" 
            max="40" 
            step="1" 
            value={theme.pagePaddingVertical ?? 19} 
            onChange={(event) => onChange({ pagePaddingVertical: parseInt(event.target.value) })} 
            style={{ width: '100%', marginTop: '4px' }} 
          />
        </label>
      </div>

      {/* 2. DISPOSICIÓN DE SECCIONES */}
      <div className="design-subsection">
        <h3>2. Disposición de secciones</h3>
        <label style={{ display: 'block' }}>
          {t("mainSectionStyle")}
          <select 
            value={theme.mainSectionStyle || "classic"} 
            onChange={(event) => onChange({ mainSectionStyle: event.target.value as any })}
            style={{ width: '100%', marginTop: '4px' }}
          >
            <option value="classic">{t("mainSectionStyleClassic")}</option>
            <option value="treemap">{t("mainSectionStyleTreemap")}</option>
            <option value="shrink">{t("mainSectionStyleShrink")}</option>
          </select>
        </label>

        <label style={{ marginTop: '10px', display: 'block', opacity: hasSidebar ? 1 : 0.45, cursor: hasSidebar ? 'default' : 'not-allowed' }}>
          {t("sidebarAcademicStyle")} {!hasSidebar && <span style={{ fontSize: '0.75em', opacity: 0.85 }}>(No aplica a este formato)</span>}
          <select 
            disabled={!hasSidebar}
            value={theme.sidebarAcademicStyle || "shrink"} 
            onChange={(event) => onChange({ sidebarAcademicStyle: event.target.value as any })}
            style={{ width: '100%', marginTop: '4px', cursor: hasSidebar ? 'pointer' : 'not-allowed' }}
            title={!hasSidebar ? "Esta opción solo está disponible para plantillas con barra lateral" : undefined}
          >
            <option value="shrink">{t("sidebarAcademicStyleShrink")}</option>
            <option value="treemap">{t("sidebarAcademicStyleTreemap")}</option>
            <option value="classic">{t("sidebarAcademicStyleClassic")}</option>
          </select>
        </label>

        <label style={{ marginTop: '10px', display: 'block', opacity: hasSidebar ? 1 : 0.45, cursor: hasSidebar ? 'default' : 'not-allowed' }}>
          Posición de la barra lateral {!hasSidebar && <span style={{ fontSize: '0.75em', opacity: 0.85 }}>(No aplica a este formato)</span>}
          <select 
            disabled={!hasSidebar}
            value={theme.sidebarPosition} 
            onChange={(event) => onChange({ sidebarPosition: event.target.value as "left" | "right" })}
            style={{ width: '100%', marginTop: '4px', cursor: hasSidebar ? 'pointer' : 'not-allowed' }}
            title={!hasSidebar ? "Esta opción solo está disponible para plantillas con barra lateral" : undefined}
          >
            <option value="left">{t("sidebarLeft")}</option>
            <option value="right">{t("sidebarRight")}</option>
          </select>
        </label>
      </div>

      {/* 3. CABECERA Y PERFIL */}
      <div className="design-subsection">
        <h3>3. Cabecera y perfil</h3>
        <label className="checkbox-field">
          <input type="checkbox" checked={theme.showProfilePicture} onChange={(e) => onChange({ showProfilePicture: e.target.checked })} />
          Mostrar fotografía de perfil
        </label>

        {theme.showProfilePicture && (
          <div style={{ display: "grid", gap: "10px", marginTop: "10px", paddingLeft: "10px", borderLeft: "2px solid #e0dfdb" }}>
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
            <label style={{ opacity: isMindmap ? 0.45 : 1, cursor: isMindmap ? 'not-allowed' : 'default' }}>
              Alineación de la foto {isMindmap && <span style={{ fontSize: '0.75em', opacity: 0.85 }}>(Centrada en Mapa Conceptual)</span>}
              <select 
                disabled={isMindmap}
                value={isMindmap ? "center" : (theme.pictureAlignment || "left")} 
                onChange={(e) => onChange({ pictureAlignment: e.target.value as "left" | "center" | "right" })}
                style={{ cursor: isMindmap ? 'not-allowed' : 'pointer' }}
              >
                <option value="left">{t("sidebarLeft")}</option>
                <option value="center">Centrada</option>
                <option value="right">{t("sidebarRight")}</option>
              </select>
            </label>
          </div>
        )}

        <label className="checkbox-field" style={{ marginTop: 12, opacity: supportsCompactProfile ? 1 : 0.45, cursor: supportsCompactProfile ? 'pointer' : 'not-allowed' }}>
          <input 
            type="checkbox" 
            disabled={!supportsCompactProfile}
            checked={supportsCompactProfile ? (theme.compactProfessionalProfile || false) : false} 
            onChange={(e) => onChange({ compactProfessionalProfile: e.target.checked })} 
          />
          {t("compactProfile")} {!supportsCompactProfile && <span style={{ fontSize: '0.78em', opacity: 0.85 }}>(No aplica a Cronológico)</span>}
        </label>

        {supportsCompactProfile && theme.compactProfessionalProfile && (
          <div style={{ display: "grid", gap: "10px", marginTop: "10px", paddingLeft: "10px", borderLeft: "2px solid #e0dfdb" }}>
            <label>{t("separatorStyle")}
              <select value={theme.headerSeparatorStyle || 'solid'} onChange={(e) => onChange({ headerSeparatorStyle: e.target.value as any })}>
                <option value="none">{t("separatorStyleNone")}</option>
                <option value="solid">{t("separatorStyleSolid")}</option>
                <option value="dashed">{t("separatorStyleDashed")}</option>
                <option value="dotted">{t("separatorStyleDotted")}</option>
              </select>
            </label>
            {theme.headerSeparatorStyle !== 'none' && (
              <label>{t("separatorThickness")} <output>{theme.headerSeparatorThickness ?? 1} px</output>
                <input type="range" min="1" max="5" step="1" value={theme.headerSeparatorThickness ?? 1} onChange={(e) => onChange({ headerSeparatorThickness: Number(e.target.value) })} />
              </label>
            )}
            <p className="control-help" style={{ marginTop: 0 }}>* No aplica en el formato Cronológico Inverso.</p>
          </div>
        )}

        <label className="checkbox-field" style={{ marginTop: 12 }}>
          <input type="checkbox" checked={theme.showSummarySeparator ?? true} onChange={(e) => onChange({ showSummarySeparator: e.target.checked })} />
          {t("showSummarySeparator")}
        </label>
      </div>

      {/* 4. TIPOGRAFÍA Y ESCALA DE TEXTO */}
      <div className="design-subsection">
        <h3>4. Tipografía y tamaños</h3>
        <label>
          Fuente del texto
          <select value={theme.fontFamily} onChange={(event) => onChange({ fontFamily: event.target.value })}>
            {fonts.map((font) => <option key={font.value} value={font.value}>{font.label}</option>)}
          </select>
        </label>
        <label style={{ marginTop: '8px', display: 'block' }}>
          Fuente de títulos
          <select value={theme.headingFontFamily} onChange={(event) => onChange({ headingFontFamily: event.target.value })}>
            {fonts.map((font) => <option key={font.value} value={font.value}>{font.label}</option>)}
          </select>
        </label>

        <div style={{ marginTop: '12px', display: 'grid', gap: '8px' }}>
          <label>
            Tu nombre (Título principal) <output>{theme.mainHeadingSize ?? 26} pt</output>
            <input type="range" min="16" max="48" step="1" value={theme.mainHeadingSize ?? 26} onChange={(event) => onChange({ mainHeadingSize: Number(event.target.value) })} />
          </label>
          <label>
            Contactos de cabecera <output>{theme.headerContactFontSize ?? theme.baseFontSize * 0.9} pt</output>
            <input type="range" min="8" max="16" step="0.5" value={theme.headerContactFontSize ?? theme.baseFontSize * 0.9} onChange={(event) => onChange({ headerContactFontSize: Number(event.target.value) })} />
          </label>
          <label>
            Títulos de sección <output>{theme.sectionHeadingSize ?? 13} pt</output>
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
          <label>
            Interlineado general <output>{theme.lineHeight ?? 1.55}</output>
            <input type="range" min="1.0" max="2.0" step="0.05" value={theme.lineHeight ?? 1.55} onChange={(event) => onChange({ lineHeight: Number(event.target.value) })} />
          </label>
        </div>

        {hasSidebar && (
          <div style={{ marginTop: '12px', paddingTop: '10px', borderTop: '1px dashed #e0dfdb', display: 'grid', gap: '8px' }}>
            <strong style={{ fontSize: '0.82rem', color: '#445064' }}>Tamaños en barra lateral:</strong>
            <label>
              Títulos en barra <output>{theme.sidebarHeadingSize ?? 12} pt</output>
              <input type="range" min="10" max="24" step="0.5" value={theme.sidebarHeadingSize ?? 12} onChange={(event) => onChange({ sidebarHeadingSize: Number(event.target.value) })} />
            </label>
            <label>
              Subtítulos en barra <output>{theme.sidebarSubheadingSize ?? 10} pt</output>
              <input type="range" min="8" max="18" step="0.5" value={theme.sidebarSubheadingSize ?? 10} onChange={(event) => onChange({ sidebarSubheadingSize: Number(event.target.value) })} />
            </label>
            <label>
              Texto en barra <output>{theme.sidebarFontSize ?? theme.baseFontSize} pt</output>
              <input type="range" min="8" max="14" step="0.5" value={theme.sidebarFontSize ?? theme.baseFontSize} onChange={(event) => onChange({ sidebarFontSize: Number(event.target.value) })} />
            </label>
          </div>
        )}
      </div>

      {/* 5. ESPACIADOS */}
      <div className="design-subsection">
        <h3>5. Espaciados</h3>
        <label>
          Entre secciones <output>{theme.sectionSpacing ?? 8} mm</output>
          <input type="range" min="2" max="20" step="1" value={theme.sectionSpacing ?? 8} onChange={(event) => onChange({ sectionSpacing: Number(event.target.value) })} />
        </label>
        <label style={{ marginTop: '8px', display: 'block' }}>
          {t("itemSpacing")} <output>{theme.itemSpacing ?? 3} mm</output>
          <input type="range" min="0" max="8" step="0.5" value={theme.itemSpacing ?? 3} onChange={(event) => onChange({ itemSpacing: Number(event.target.value) })} />
        </label>
        {hasSidebar && (
          <label style={{ marginTop: '8px', display: 'block' }}>
            Entre secciones de barra <output>{theme.sidebarSectionSpacing ?? 6} mm</output>
            <input type="range" min="2" max="16" step="1" value={theme.sidebarSectionSpacing ?? 6} onChange={(event) => onChange({ sidebarSectionSpacing: Number(event.target.value) })} />
          </label>
        )}
      </div>

      {/* 6. COLORES */}
      <div className="design-subsection">
        <h3>6. Colores y tema</h3>
        <div className="color-grid">
          <label>{t("accentColor")}<input type="color" value={theme.accentColor} onChange={(event) => onChange({ accentColor: event.target.value })} /></label>
          <label>{t("textColor")}<input type="color" value={theme.textColor} onChange={(event) => onChange({ textColor: event.target.value })} /></label>
          <label>Color de página<input type="color" value={theme.pageColor} onChange={(event) => onChange({ pageColor: event.target.value })} /></label>
          <label>{t("separatorColor")}<input type="color" value={theme.separatorColor || theme.accentColor} onChange={(event) => onChange({ separatorColor: event.target.value })} /></label>
        </div>
      </div>
    </section>
  );
}


