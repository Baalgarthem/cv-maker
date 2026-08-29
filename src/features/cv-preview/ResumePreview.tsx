import type { CSSProperties, ReactNode } from "react";
import type { ResumeDocument, ResumeSectionId } from "../../types/resume";
import { getTemplate } from "../templates";
import { ContactDetails } from "./ContactDetails";

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
    "--resume-accent": document.theme.accentColor,
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
      <ResumeSection title="Portafolio"><ul className="link-list">{document.portfolioLinks.map((link) => <li key={link.id}><strong>{link.label}:</strong> {link.url}</li>)}</ul></ResumeSection>
    ),
  };

  const visibleSections = document.sections.filter((s) => s.isVisible);
  const hasSidebar = template.id === "chronological" || template.id === "mixed";
  const sidebarSections = hasSidebar ? visibleSections.filter((s) => s.inSidebar && s.id !== "summary" && s.id !== "experience") : [];
  const mainSections = visibleSections.filter((s) => !sidebarSections.includes(s) && s.id !== "summary");
  const summarySection = visibleSections.find((s) => s.id === "summary");

  return (
    <>
      <style>{`@page { size: ${isA4 ? "A4" : "letter"}; margin: 0; }`}</style>
      <article className={`resume-page ${template.className}`} style={customProperties} aria-label={`Vista previa de la plantilla ${template.name}`} data-sidebar={document.theme.sidebarPosition} data-summary-separator={document.theme.showSummarySeparator ?? true}>
        <header className="resume-header" data-picture-align={document.theme.pictureAlignment || "left"}>
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
          {sidebarSections.length > 0 && template.id === "chronological" && (
            <div className="sidebar-sections" style={{ marginTop: "8mm" }}>
              {sidebarSections.map(({ id }) => <div key={id} className="sidebar-section-wrap">{sections[id as Exclude<ResumeSectionId, "summary">]}</div>)}
            </div>
          )}
        </header>
        <div className="resume-body">
          {summarySection && document.professionalSummary?.trim() && (
            <div className="summary-highlight" style={{ marginBottom: "var(--resume-section-spacing)", gridColumn: "1 / -1" }}>
              <ResumeSection title="Perfil profesional">
                <p style={{ fontSize: "1.08em", lineHeight: 1.6, color: "color-mix(in srgb, var(--resume-text) 80%, var(--resume-accent))" }}>
                  {document.professionalSummary}
                </p>
              </ResumeSection>
            </div>
          )}
          {sidebarSections.length > 0 && template.id !== "chronological" && (
            <div className="sidebar-sections">
              {sidebarSections.map(({ id }) => <div key={id} className="sidebar-section-wrap">{sections[id as Exclude<ResumeSectionId, "summary">]}</div>)}
            </div>
          )}
          <div className="main-sections">
            {mainSections.map(({ id }) => <div key={id}>{sections[id as Exclude<ResumeSectionId, "summary">]}</div>)}
          </div>
        </div>
      </article>
    </>
  );
}

function ResumeSection({ title, children }: { title: string; children: ReactNode }) {
  return <section className="resume-section"><h2>{title}</h2><div className="resume-section-body">{children}</div></section>;
}
