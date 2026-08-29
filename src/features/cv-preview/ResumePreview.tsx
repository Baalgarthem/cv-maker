import type { CSSProperties, ReactNode } from "react";
import type { ResumeDocument, ResumeSectionId } from "../../types/resume";
import { getTemplate } from "../templates";
import { ContactDetails } from "./ContactDetails";
import { PortfolioIcon } from "./PortfolioIcon";

interface ResumePreviewProps { document: ResumeDocument; }

function formatPeriod(startDate: string, endDate?: string, isCurrent?: boolean) {
  return `${startDate} — ${isCurrent ? "Actual" : endDate ?? ""}`;
}

export function ResumePreview({ document }: ResumePreviewProps) {
  const template = getTemplate(document.templateId);
  const fullName = [document.profile.firstName, document.profile.paternalSurname, document.profile.maternalSurname].join(" ");
  const isA4 = document.theme.pageSize === "A4";
  const customProperties = {
    "--resume-font": document.theme.fontFamily,
    "--resume-heading-font": document.theme.headingFontFamily,
    "--resume-font-size": `${document.theme.baseFontSize}pt`,
    "--resume-sidebar-font-size": `${document.theme.sidebarFontSize ?? document.theme.baseFontSize}pt`,
    "--resume-header-contact-size": `${document.theme.headerContactFontSize ?? document.theme.baseFontSize * 0.9}pt`,
    "--resume-main-heading-size": `${(document.theme.mainHeadingSize ?? ((document.theme as any).headingScale * document.theme.baseFontSize * 2)) || 26}pt`,
    "--resume-section-heading-size": `${(document.theme.sectionHeadingSize ?? ((document.theme as any).headingScale * document.theme.baseFontSize)) || 13}pt`,
    "--resume-section-subheading-size": `${document.theme.sectionSubheadingSize ?? 11}pt`,
    "--resume-sidebar-heading-size": `${document.theme.sidebarHeadingSize ?? 12}pt`,
    "--resume-sidebar-subheading-size": `${document.theme.sidebarSubheadingSize ?? 10}pt`,
    "--resume-section-spacing": `${document.theme.sectionSpacing ?? 8}mm`,
    "--resume-sidebar-section-spacing": `${document.theme.sidebarSectionSpacing ?? 6}mm`,
    "--resume-item-spacing": `${document.theme.itemSpacing ?? 3}mm`,
    "--resume-page-padding-v": `${document.theme.pagePaddingVertical ?? 19}mm`,
    "--resume-line-height": document.theme.lineHeight ?? 1.55,
    "--resume-accent": document.theme.accentColor,
    "--resume-separator-color": document.theme.separatorColor || document.theme.accentColor,
    "--resume-text": document.theme.textColor,
    "--resume-page": document.theme.pageColor,
    "--resume-picture-size": `${document.theme.pictureSize ?? 32}mm`,
    "--resume-frame-width": `${document.theme.pictureFrameWidth ?? 2}px`,
    "--resume-page-width": isA4 ? "210mm" : "215.9mm",
    "--resume-page-height": isA4 ? "297mm" : "279.4mm",
  } as CSSProperties;

  const sections: Record<Exclude<ResumeSectionId, "summary">, ReactNode> = {
    experience: (
      <ResumeSection title="Experiencia profesional">
        {(document.experiences || []).map((experience) => (
          <article className="resume-entry" key={experience.id}>
            <div className="entry-heading"><h3>{experience.companyName}</h3><time>{formatPeriod(experience.startDate, experience.endDate, experience.isCurrent)}</time></div>
            <p className="entry-context">{experience.context}</p>
            {experience.tags && experience.tags.length > 0 && (
              <div className="entry-tags" style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', margin: '4px 0 8px', opacity: 0.6, fontSize: '0.85em' }}>
                {experience.tags.map(tag => (
                  <span key={tag} style={{ padding: '0 6px', fontStyle: 'italic' }}>• {tag}</span>
                ))}
              </div>
            )}
            <ul>{experience.activities.map((activity) => <li key={activity}>{activity}</li>)}</ul>
          </article>
        ))}
      </ResumeSection>
    ),
    education: (
      <ResumeSection title="Formación académica">
        {(document.education || []).map((edu) => (
          <article className="resume-entry compact" key={edu.id}>
            <div className="entry-heading"><h3>{edu.institution}</h3><time>{formatPeriod(edu.startDate, edu.endDate, edu.isCurrent)}</time></div>
            <p style={{ margin: 0, fontWeight: 500 }}>{edu.degree}</p>
          </article>
        ))}
      </ResumeSection>
    ),
    skills: (
      <ResumeSection title="Habilidades y competencias">
        <div style={{ display: "grid", gap: "2mm" }}>
          {document.hardSkills && (
            <div>
              <strong style={{ display: "block", marginBottom: "1mm", color: "var(--resume-accent)" }}>Habilidades duras</strong>
              <p style={{ margin: 0 }}>{document.hardSkills}</p>
            </div>
          )}
          {document.softSkills && (
            <div>
              <strong style={{ display: "block", marginBottom: "1mm", color: "var(--resume-accent)" }}>Habilidades blandas</strong>
              <p style={{ margin: 0 }}>{document.softSkills}</p>
            </div>
          )}
        </div>
      </ResumeSection>
    ),
    languages: (
      <ResumeSection title="Idiomas">
        <ul className="link-list">
          {(document.languages || []).map((lang) => (
            <li key={lang.id}>
              <strong>{lang.name}:</strong> {lang.level}
            </li>
          ))}
        </ul>
      </ResumeSection>
    ),
    courses: (
      <ResumeSection title="Cursos y formación">
        {document.courses.map((course) => <article className="resume-entry compact" key={course.id}><div className="entry-heading"><h3>{course.name}</h3><time>{course.obtainedOn}</time></div></article>)}
      </ResumeSection>
    ),
    portfolio: (
      <ResumeSection title="Portafolio">
        <ul className="link-list portfolio-list">
          {document.portfolioLinks.map((link) => (
            <li key={link.id} style={{ display: 'flex', gap: '8px', marginBottom: '8px', alignItems: 'flex-start' }}>
              {link.icon && link.icon !== 'none' && (
                <div style={{ marginTop: '2px' }}>
                  <PortfolioIcon icon={link.icon} />
                </div>
              )}
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <strong style={{ lineHeight: 1.2 }}>{link.label}</strong>
                <a 
                  href={link.url.startsWith('http') ? link.url : `https://${link.url}`} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  style={{ 
                    fontSize: '0.85em', 
                    opacity: 0.65, 
                    color: 'inherit', 
                    textDecoration: 'none', 
                    wordBreak: 'break-all',
                    lineHeight: 1.3,
                    marginTop: '2px'
                  }}
                >
                  {link.url}
                </a>
              </div>
            </li>
          ))}
        </ul>
      </ResumeSection>
    ),
  };

  const visibleSections = document.sections.filter((s) => s.inBody || s.inSidebar);
  const hasSidebar = template.id === "chronological" || template.id === "mixed";
  const sidebarSections = hasSidebar ? visibleSections.filter((s) => s.inSidebar && s.id !== "summary" && s.id !== "experience") : [];
  const mainSections = visibleSections.filter((s) => !sidebarSections.includes(s) && s.id !== "summary");
  const summarySection = visibleSections.find((s) => s.id === "summary");

  const maxPage = Math.max(1, ...visibleSections.map(s => s.page || 1));
  const pages = Array.from({ length: maxPage }, (_, i) => i + 1);
  const isChronological = template.id === "chronological";

  return (
    <>
      <style>{`
        @page { size: ${isA4 ? "A4" : "letter"}; margin: 0; }
        @media print { .resume-pages-container { gap: 0 !important; } }
      `}</style>
      <div className="resume-pages-container" style={{ display: 'flex', flexDirection: 'column', gap: '32px', alignItems: 'center' }}>
        {pages.map(pageNumber => {
          const isFirstPage = pageNumber === 1;
          const isLastPage = pageNumber === maxPage;
          const pageMainSections = mainSections.filter(s => (s.page || 1) === pageNumber);
          const pageSidebarSections = sidebarSections.filter(s => (s.page || 1) === pageNumber);
          
          return (
            <article 
              key={pageNumber} 
              className={`resume-page ${template.className}`} 
              style={{ ...customProperties, breakAfter: isLastPage ? 'auto' : 'page', pageBreakAfter: isLastPage ? 'auto' : 'always' }} 
              aria-label={`Vista previa de la plantilla ${template.name} - Página ${pageNumber}`} 
              data-sidebar={document.theme.sidebarPosition} 
              data-summary-separator={document.theme.showSummarySeparator ?? true}
              data-page={pageNumber}
              data-last-page={isLastPage}
              data-version={document.templateVersion || 'v1'}
            >
              
              <header 
                className={`resume-header ${document.theme.compactProfessionalProfile && template.id !== 'chronological' ? 'compact-profile' : ''}`}
                data-picture-align={document.theme.pictureAlignment || "left"} 
                style={!isFirstPage && !isChronological ? { display: 'none' } : {}}
              >
                {isFirstPage && (
                  <div className="header-personal-data">
                    {document.theme.showProfilePicture && document.profile.picture && (
                      <div className="profile-picture-wrapper" data-frame={document.theme.pictureFrameStyle}>
                        <img src={document.profile.picture} alt="Perfil" className="profile-picture" />
                      </div>
                    )}
                    <div className="resume-header-text">
                      <p className="resume-kicker">Currículum vitae</p>
                      <h1>{fullName}</h1>
                      <ContactDetails mode={document.contactDisplayMode} profile={document.profile} />
                    </div>
                  </div>
                )}
                {isFirstPage && document.theme.compactProfessionalProfile && template.id !== 'chronological' && summarySection && document.professionalSummary?.trim() && (
                  <div className="header-profile-data" style={{
                      borderLeftStyle: document.theme.headerSeparatorStyle === 'none' ? 'none' : (document.theme.headerSeparatorStyle || 'solid'),
                      borderLeftWidth: `${document.theme.headerSeparatorThickness ?? 1}px`,
                      borderLeftColor: 'var(--resume-separator-color)',
                      paddingLeft: 'var(--resume-section-spacing)'
                  }}>
                    <h3 style={{ margin: '0 0 calc(var(--resume-item-spacing) / 2)', fontSize: 'var(--resume-section-subheading-size)', color: 'var(--resume-accent)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                      Perfil profesional
                    </h3>
                    <p style={{ margin: 0, fontSize: '0.9em', lineHeight: 'var(--resume-line-height)' }}>
                      {document.professionalSummary}
                    </p>
                  </div>
                )}
                {pageSidebarSections.length > 0 && isChronological && (
                  <div className="sidebar-sections" style={{ marginTop: isFirstPage ? "8mm" : "0" }}>
                    {pageSidebarSections.map(({ id }) => <div key={id} className="sidebar-section-wrap">{sections[id as Exclude<ResumeSectionId, "summary">]}</div>)}
                  </div>
                )}
              </header>

              <div className="resume-body">
                {isFirstPage && summarySection && document.professionalSummary?.trim() && !(document.theme.compactProfessionalProfile && template.id !== 'chronological') && (
                  <div className="summary-highlight" style={{ marginBottom: "var(--resume-section-spacing)", gridColumn: "1 / -1" }}>
                    <ResumeSection title="Perfil profesional">
                      <p style={{ fontSize: "1.08em", lineHeight: 1.6, color: "color-mix(in srgb, var(--resume-text) 80%, var(--resume-accent))" }}>
                        {document.professionalSummary}
                      </p>
                    </ResumeSection>
                  </div>
                )}
                
                {hasSidebar && !isChronological && (
                  <div className="sidebar-sections">
                    {pageSidebarSections.map(({ id }) => <div key={id} className="sidebar-section-wrap">{sections[id as Exclude<ResumeSectionId, "summary">]}</div>)}
                  </div>
                )}

                <div className="main-sections">
                  {pageMainSections.map(({ id }) => (
                    <div key={id}>
                      {sections[id as Exclude<ResumeSectionId, "summary">]}
                    </div>
                  ))}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </>
  );
}

function ResumeSection({ title, children }: { title: string; children: ReactNode }) {
  return <section className="resume-section"><h2>{title}</h2><div className="resume-section-body">{children}</div></section>;
}
