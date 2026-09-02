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

      {/* 1. MENÚS DESPLEGABLES (SELECTORES) */}
      <div className="design-subsection">
        <h3>1. Opciones y selectores</h3>
        
        <div style={{ display: 'grid', gap: '10px' }}>
          <label>{t("pageSize")}
            <select value={theme.pageSize} onChange={(event) => onChange({ pageSize: event.target.value as "A4" | "LETTER" })}>
              <option value="A4">{t("pageSizeA4")}</option>
              <option value="LETTER">{t("pageSizeLetter")}</option>
            </select>
          </label>

          <label>{t("mainSectionStyle")}
            <select 
              value={theme.mainSectionStyle || "classic"} 
              onChange={(event) => onChange({ mainSectionStyle: event.target.value as any })}
            >
              <option value="classic">{t("mainSectionStyleClassic")}</option>
              <option value="treemap">{t("mainSectionStyleTreemap")}</option>
              <option value="shrink">{t("mainSectionStyleShrink")}</option>
            </select>
          </label>

          <label style={{ opacity: hasSidebar ? 1 : 0.45, cursor: hasSidebar ? 'default' : 'not-allowed' }}>
            {t("sidebarAcademicStyle")} {!hasSidebar && <span style={{ fontSize: '0.75em', opacity: 0.85 }}>(No aplica a este formato)</span>}
            <select 
              disabled={!hasSidebar}
              value={theme.sidebarAcademicStyle || "shrink"} 
              onChange={(event) => onChange({ sidebarAcademicStyle: event.target.value as any })}
              style={{ cursor: hasSidebar ? 'pointer' : 'not-allowed' }}
              title={!hasSidebar ? "Esta opción solo está disponible para plantillas con barra lateral" : undefined}
            >
              <option value="shrink">{t("sidebarAcademicStyleShrink")}</option>
              <option value="treemap">{t("sidebarAcademicStyleTreemap")}</option>
              <option value="classic">{t("sidebarAcademicStyleClassic")}</option>
            </select>
          </label>

          <label style={{ opacity: hasSidebar ? 1 : 0.45, cursor: hasSidebar ? 'default' : 'not-allowed' }}>
            Posición de la barra lateral {!hasSidebar && <span style={{ fontSize: '0.75em', opacity: 0.85 }}>(No aplica a este formato)</span>}
            <select 
              disabled={!hasSidebar}
              value={theme.sidebarPosition} 
              onChange={(event) => onChange({ sidebarPosition: event.target.value as "left" | "right" })}
              style={{ cursor: hasSidebar ? 'pointer' : 'not-allowed' }}
              title={!hasSidebar ? "Esta opción solo está disponible para plantillas con barra lateral" : undefined}
            >
              <option value="left">{t("sidebarLeft")}</option>
              <option value="right">{t("sidebarRight")}</option>
            </select>
          </label>

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

          {theme.showProfilePicture && (
            <>
              <label>
                Estilo del marco de foto
                <select value={theme.pictureFrameStyle} onChange={(e) => onChange({ pictureFrameStyle: e.target.value as any })}>
                  <option value="none">Sin marco</option>
                  <option value="circle">Circular</option>
                  <option value="square">Cuadrado</option>
                  <option value="hexagon">Hexagonal</option>
                  <option value="top-bottom">Líneas sup / inf</option>
                </select>
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
            </>
          )}

          {supportsCompactProfile && theme.compactProfessionalProfile && (
            <label>{t("separatorStyle")}
              <select value={theme.headerSeparatorStyle || 'solid'} onChange={(e) => onChange({ headerSeparatorStyle: e.target.value as any })}>
                <option value="none">{t("separatorStyleNone")}</option>
                <option value="solid">{t("separatorStyleSolid")}</option>
                <option value="dashed">{t("separatorStyleDashed")}</option>
                <option value="dotted">{t("separatorStyleDotted")}</option>
              </select>
            </label>
          )}
        </div>
      </div>

      {/* 2. CONTROLES DESLIZANTES (SLIDERS) */}
      <div className="design-subsection">
        <h3>2. Medidas y escalas (Sliders)</h3>

        <div style={{ display: 'grid', gap: '8px' }}>
          <span className="slider-category-title">Márgenes y espaciado</span>
          <label>
            Márgenes de página (sup / inf) <output>{theme.pagePaddingVertical ?? 19} mm</output>
            <input 
              type="range" 
              min="5" 
              max="40" 
              step="1" 
              value={theme.pagePaddingVertical ?? 19} 
              onChange={(event) => onChange({ pagePaddingVertical: parseInt(event.target.value) })} 
            />
          </label>
          <label>
            Espaciado entre secciones <output>{theme.sectionSpacing ?? 8} mm</output>
            <input type="range" min="2" max="20" step="1" value={theme.sectionSpacing ?? 8} onChange={(event) => onChange({ sectionSpacing: Number(event.target.value) })} />
          </label>
          <label>
            Espaciado entre elementos y tarjetas <output>{theme.itemSpacing ?? 3} mm</output>
            <input type="range" min="0" max="8" step="0.5" value={theme.itemSpacing ?? 3} onChange={(event) => onChange({ itemSpacing: Number(event.target.value) })} />
          </label>
          {hasSidebar && (
            <label>
              Espaciado en barra lateral <output>{theme.sidebarSectionSpacing ?? 6} mm</output>
              <input type="range" min="2" max="16" step="1" value={theme.sidebarSectionSpacing ?? 6} onChange={(event) => onChange({ sidebarSectionSpacing: Number(event.target.value) })} />
            </label>
          )}

          <span className="slider-category-title">Tamaños de texto y tipografía</span>
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
            Subtítulos (Empresas/Escuelas) <output>{theme.sectionSubheadingSize ?? 11} pt</output>
            <input type="range" min="8" max="18" step="0.5" value={theme.sectionSubheadingSize ?? 11} onChange={(event) => onChange({ sectionSubheadingSize: Number(event.target.value) })} />
          </label>
          <label>
            Texto del cuerpo base <output>{theme.baseFontSize} pt</output>
            <input type="range" min="8" max="14" step="0.5" value={theme.baseFontSize} onChange={(event) => onChange({ baseFontSize: Number(event.target.value) })} />
          </label>
          <label>
            Interlineado general <output>{theme.lineHeight ?? 1.55}</output>
            <input type="range" min="1.0" max="2.0" step="0.05" value={theme.lineHeight ?? 1.55} onChange={(event) => onChange({ lineHeight: Number(event.target.value) })} />
          </label>

          {hasSidebar && (
            <>
              <span className="slider-category-title">Tamaños en barra lateral</span>
              <label>
                Títulos en barra <output>{theme.sidebarHeadingSize ?? 12} pt</output>
                <input type="range" min="10" max="24" step="0.5" value={theme.sidebarHeadingSize ?? 12} onChange={(event) => onChange({ sidebarHeadingSize: Number(event.target.value) })} />
              </label>
              <label>
                Subtítulos en barra <output>{theme.sidebarSubheadingSize ?? 10} pt</output>
                <input type="range" min="8" max="18" step="0.5" value={theme.sidebarSubheadingSize ?? 10} onChange={(event) => onChange({ sidebarSubheadingSize: Number(event.target.value) })} />
              </label>
              <label>
                Texto base en barra <output>{theme.sidebarFontSize ?? theme.baseFontSize} pt</output>
                <input type="range" min="8" max="14" step="0.5" value={theme.sidebarFontSize ?? theme.baseFontSize} onChange={(event) => onChange({ sidebarFontSize: Number(event.target.value) })} />
              </label>
            </>
          )}

          {theme.showProfilePicture && (
            <>
              <span className="slider-category-title">Dimensiones de fotografía</span>
              <label>
                Grosor del marco <output>{theme.pictureFrameWidth}px</output>
                <input type="range" min="0" max="8" step="1" value={theme.pictureFrameWidth} onChange={(e) => onChange({ pictureFrameWidth: Number(e.target.value) })} />
              </label>
              <label>
                Tamaño de la fotografía <output>{theme.pictureSize}mm</output>
                <input type="range" min="20" max="60" step="2" value={theme.pictureSize} onChange={(e) => onChange({ pictureSize: Number(e.target.value) })} />
              </label>
            </>
          )}

          {supportsCompactProfile && theme.compactProfessionalProfile && theme.headerSeparatorStyle !== 'none' && (
            <>
              <span className="slider-category-title">Separador de perfil compacto</span>
              <label>
                Grosor del separador <output>{theme.headerSeparatorThickness ?? 1} px</output>
                <input type="range" min="1" max="5" step="1" value={theme.headerSeparatorThickness ?? 1} onChange={(e) => onChange({ headerSeparatorThickness: Number(e.target.value) })} />
              </label>
            </>
          )}
        </div>
      </div>

      {/* 3. CASILLAS Y VISIBILIDAD (CHECKBOXES) */}
      <div className="design-subsection">
        <h3>3. Visibilidad y casillas (Checkboxes)</h3>

        <div style={{ display: 'grid', gap: '10px' }}>
          <label className="checkbox-field">
            <input type="checkbox" checked={theme.showProfilePicture} onChange={(e) => onChange({ showProfilePicture: e.target.checked })} />
            Mostrar fotografía de perfil
          </label>

          <label className="checkbox-field" style={{ opacity: supportsCompactProfile ? 1 : 0.45, cursor: supportsCompactProfile ? 'pointer' : 'not-allowed' }}>
            <input 
              type="checkbox" 
              disabled={!supportsCompactProfile}
              checked={supportsCompactProfile ? (theme.compactProfessionalProfile || false) : false} 
              onChange={(e) => onChange({ compactProfessionalProfile: e.target.checked })} 
            />
            {t("compactProfile")} {!supportsCompactProfile && <span style={{ fontSize: '0.78em', opacity: 0.85 }}>(No aplica a Cronológico)</span>}
          </label>

          <label className="checkbox-field">
            <input type="checkbox" checked={theme.showSummarySeparator ?? true} onChange={(e) => onChange({ showSummarySeparator: e.target.checked })} />
            {t("showSummarySeparator")}
          </label>
        </div>
      </div>

      {/* 4. COLORES */}
      <div className="design-subsection">
        <h3>4. Colores y tema</h3>
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


