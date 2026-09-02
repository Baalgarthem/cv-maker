import type { CSSProperties, ReactNode } from "react";
import type { ResumeDocument, ResumeSectionId } from "../../types/resume";
import { getTemplate } from "../templates";
import { useTranslation } from "../../i18n/LanguageContext";
import { ContactDetails } from "./ContactDetails";
import { PortfolioIcon } from "./PortfolioIcon";

interface ResumePreviewProps { document: ResumeDocument; }

function formatPeriod(startDate: string, endDate: string | undefined, isCurrent: boolean | undefined, t: any) {
  return `${startDate} — ${isCurrent ? t("cvPresent") : endDate ?? ""}`;
}

export function ResumePreview({ document }: ResumePreviewProps) {
  const { t } = useTranslation();
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

  const renderSection = (id: Exclude<ResumeSectionId, "summary">, isSidebar = false): ReactNode => {
    const sidebarStyle = document.sidebarAcademicStyle || document.theme.sidebarAcademicStyle || "shrink";

    switch (id) {
      case "experience": {
        if (isSidebar) {
          if (sidebarStyle === "shrink") {
            return (
              <ResumeSection title={t("experience")}>
                <div className="sidebar-shrink-list" style={{ display: "grid", gap: "var(--resume-sidebar-section-spacing, 6mm)" }}>
                  {(document.experiences || []).map((exp) => {
                    const formattedDate = formatPeriod(exp.startDate, exp.endDate, exp.isCurrent, t);
                    return (
                      <div key={exp.id} className="sidebar-shrink-card" style={{ display: "grid", gridTemplateColumns: "1.05fr 1fr", gap: "6px", alignItems: "start", fontSize: "0.85em", lineHeight: 1.25 }}>
                        <div className="shrink-left" style={{ fontWeight: 600, color: "var(--resume-text)", wordBreak: "break-word" }}>
                          {exp.companyName}
                        </div>
                        <div className="shrink-right" style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                          <time style={{ fontSize: "0.82em", opacity: 0.7, color: "var(--resume-accent)", fontWeight: 500 }}>{formattedDate}</time>
                          <span style={{ fontSize: "0.88em", color: "var(--resume-text)", opacity: 0.9 }}>{exp.context}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </ResumeSection>
            );
          }

          if (sidebarStyle === "treemap") {
            return (
              <ResumeSection title={t("experience")}>
                <div className="sidebar-treemap-list" style={{ display: "grid", gap: "calc(var(--resume-sidebar-section-spacing, 6mm) * 0.9)" }}>
                  {(document.experiences || []).map((exp) => {
                    const formattedDate = formatPeriod(exp.startDate, exp.endDate, exp.isCurrent, t);
                    return (
                      <div key={exp.id} className="sidebar-treemap-entry" style={{ fontSize: "0.85em", lineHeight: 1.3 }}>
                        <div style={{ fontWeight: 600, display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "4px", flexWrap: "wrap" }}>
                          <span style={{ color: "var(--resume-text)" }}>🏢 {exp.companyName}</span>
                          <span style={{ fontSize: "0.8em", opacity: 0.65, fontStyle: "italic", fontWeight: 400 }}>{formattedDate}</span>
                        </div>
                        <div style={{ marginLeft: "6px", paddingLeft: "8px", borderLeft: "1.5px solid var(--resume-separator-color)", marginTop: "2px", fontSize: "0.88em", color: "var(--resume-text)", opacity: 0.9 }}>
                          <span style={{ color: "var(--resume-accent)", fontFamily: "monospace", marginRight: "3px" }}>└──</span>
                          {exp.context}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </ResumeSection>
            );
          }

          return (
            <ResumeSection title={t("experience")}>
              {(document.experiences || []).map((exp) => (
                <article className="resume-entry compact" key={exp.id} style={{ marginBottom: "var(--resume-sidebar-section-spacing, 6mm)" }}>
                  <div className="entry-heading" style={{ display: "flex", flexDirection: "column", gap: "1px" }}>
                    <h3 style={{ margin: 0, fontSize: "0.95em" }}>{exp.companyName}</h3>
                    <time style={{ fontSize: "0.78em", opacity: 0.7 }}>{formatPeriod(exp.startDate, exp.endDate, exp.isCurrent, t)}</time>
                  </div>
                  <p style={{ margin: "2px 0 0", fontSize: "0.88em" }}>{exp.context}</p>
                </article>
              ))}
            </ResumeSection>
          );
        }

        return (
          <ResumeSection title={t("experience")}>
            {(document.experiences || []).map((experience) => (
              <article className="resume-entry" key={experience.id}>
                <div className="entry-heading"><h3>{experience.companyName}</h3><time>{formatPeriod(experience.startDate, experience.endDate, experience.isCurrent, t)}</time></div>
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
        );
      }

      case "education": {
        if (isSidebar) {
          if (sidebarStyle === "shrink") {
            return (
              <ResumeSection title={t("education")}>
                <div className="sidebar-shrink-list" style={{ display: "grid", gap: "var(--resume-sidebar-section-spacing, 6mm)" }}>
                  {(document.education || []).map((edu) => {
                    const formattedDate = formatPeriod(edu.startDate, edu.endDate, edu.isCurrent, t);
                    return (
                      <div key={edu.id} className="sidebar-shrink-card" style={{ display: "grid", gridTemplateColumns: "1.05fr 1fr", gap: "6px", alignItems: "start", fontSize: "0.85em", lineHeight: 1.25 }}>
                        <div className="shrink-left" style={{ fontWeight: 600, color: "var(--resume-text)", wordBreak: "break-word" }}>
                          {edu.institution}
                        </div>
                        <div className="shrink-right" style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                          <time style={{ fontSize: "0.82em", opacity: 0.7, color: "var(--resume-accent)", fontWeight: 500 }}>{formattedDate}</time>
                          <span style={{ fontSize: "0.9em", fontWeight: 500, color: "var(--resume-text)", wordBreak: "break-word" }}>{edu.degree}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </ResumeSection>
            );
          }

          if (sidebarStyle === "treemap") {
            return (
              <ResumeSection title={t("education")}>
                <div className="sidebar-treemap-list" style={{ display: "grid", gap: "calc(var(--resume-sidebar-section-spacing, 6mm) * 0.9)" }}>
                  {(document.education || []).map((edu) => {
                    const formattedDate = formatPeriod(edu.startDate, edu.endDate, edu.isCurrent, t);
                    return (
                      <div key={edu.id} className="sidebar-treemap-entry" style={{ fontSize: "0.85em", lineHeight: 1.3 }}>
                        <div style={{ fontWeight: 600, display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "4px", flexWrap: "wrap" }}>
                          <span style={{ color: "var(--resume-text)" }}>📁 {edu.institution}</span>
                          <span style={{ fontSize: "0.8em", opacity: 0.65, fontStyle: "italic", fontWeight: 400 }}>{formattedDate}</span>
                        </div>
                        <div style={{ marginLeft: "6px", paddingLeft: "8px", borderLeft: "1.5px solid var(--resume-separator-color)", marginTop: "2px", fontSize: "0.9em", fontWeight: 500, color: "var(--resume-text)" }}>
                          <span style={{ color: "var(--resume-accent)", fontFamily: "monospace", marginRight: "3px" }}>└──</span>
                          {edu.degree}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </ResumeSection>
            );
          }

          return (
            <ResumeSection title={t("education")}>
              {(document.education || []).map((edu) => {
                const formattedDate = formatPeriod(edu.startDate, edu.endDate, edu.isCurrent, t);
                return (
                  <article className="resume-entry compact" key={edu.id} style={{ marginBottom: "var(--resume-sidebar-section-spacing, 6mm)" }}>
                    <div className="entry-heading" style={{ display: "flex", flexDirection: "column", gap: "1px" }}>
                      <h3 style={{ margin: 0, fontSize: "0.95em" }}>{edu.institution}</h3>
                      <time style={{ fontSize: "0.78em", opacity: 0.7 }}>{formattedDate}</time>
                    </div>
                    <p style={{ margin: "2px 0 0", fontWeight: 500, fontSize: "0.88em" }}>{edu.degree}</p>
                  </article>
                );
              })}
            </ResumeSection>
          );
        }

        return (
          <ResumeSection title={t("education")}>
            {(document.education || []).map((edu) => {
              const mode = document.educationDisplayMode || document.theme.educationDisplayMode || "classic";
              const formattedDate = formatPeriod(edu.startDate, edu.endDate, edu.isCurrent, t);

              if (mode === "treemap") {
                return (
                  <div className="education-treemap-entry" key={edu.id} style={{ marginBottom: "calc(var(--resume-item-spacing) * 1.2)", position: "relative" }}>
                    <div className="treemap-level-root" style={{ display: "flex", alignItems: "baseline", gap: "6px", fontWeight: 600, fontSize: "1em", color: "var(--resume-text)" }}>
                      <span style={{ color: "var(--resume-accent)", fontFamily: "monospace", fontSize: "0.9em", flexShrink: 0 }}>📁</span>
                      <span style={{ letterSpacing: "0.01em" }}>{edu.institution}</span>
                    </div>

                    <div className="treemap-branches" style={{ marginLeft: "7px", paddingLeft: "14px", borderLeft: "1.5px solid var(--resume-separator-color)", marginTop: "3px" }}>
                      <div className="treemap-level-degree" style={{ position: "relative", display: "flex", alignItems: "baseline", gap: "6px", fontSize: "0.9em", fontWeight: 500, color: "var(--resume-text)", paddingTop: "2px" }}>
                        <span style={{ position: "absolute", left: "-14px", top: "10px", width: "10px", height: "1.5px", background: "var(--resume-separator-color)" }}></span>
                        <span style={{ color: "var(--resume-accent)", fontFamily: "monospace", fontSize: "0.85em", flexShrink: 0 }}>├──</span>
                        <span>{edu.degree}</span>
                      </div>

                      <div className="treemap-level-date" style={{ position: "relative", display: "flex", alignItems: "baseline", gap: "6px", fontSize: "0.8em", opacity: 0.65, fontStyle: "italic", paddingTop: "3px" }}>
                        <span style={{ position: "absolute", left: "-14px", top: "10px", width: "10px", height: "1.5px", background: "var(--resume-separator-color)" }}></span>
                        <span style={{ color: "var(--resume-accent)", fontFamily: "monospace", fontSize: "0.85em", flexShrink: 0 }}>└──</span>
                        <time>{formattedDate}</time>
                      </div>
                    </div>
                  </div>
                );
              }

              return (
                <article className="resume-entry compact education-classic-entry" key={edu.id} style={{ marginBottom: "var(--resume-item-spacing)" }}>
                  <div className="entry-heading" style={{ display: "flex", flexWrap: "wrap", alignItems: "baseline", gap: "6px" }}>
                    <h3 style={{ margin: 0, display: "inline" }}>{edu.institution}</h3>
                    <span className="ghost-date" style={{ opacity: 0.65, fontSize: "0.85em", fontWeight: 400 }}>
                      ({formattedDate})
                    </span>
                  </div>
                  <p style={{ margin: "2px 0 0", fontWeight: 500, fontSize: "0.95em" }}>{edu.degree}</p>
                </article>
              );
            })}
          </ResumeSection>
        );
      }

      case "skills": {
        if (isSidebar) {
          if (sidebarStyle === "shrink") {
            return (
              <ResumeSection title={t("skills")}>
                <div className="sidebar-shrink-list" style={{ display: "grid", gap: "var(--resume-sidebar-section-spacing, 6mm)" }}>
                  {document.hardSkills && (
                    <div className="sidebar-shrink-card" style={{ display: "grid", gridTemplateColumns: "1fr 1.8fr", gap: "6px", alignItems: "start", fontSize: "0.85em", lineHeight: 1.25 }}>
                      <strong style={{ color: "var(--resume-accent)", fontSize: "0.9em" }}>Duras</strong>
                      <span style={{ fontSize: "0.88em", lineHeight: 1.35, color: "var(--resume-text)" }}>{document.hardSkills}</span>
                    </div>
                  )}
                  {document.softSkills && (
                    <div className="sidebar-shrink-card" style={{ display: "grid", gridTemplateColumns: "1fr 1.8fr", gap: "6px", alignItems: "start", fontSize: "0.85em", lineHeight: 1.25 }}>
                      <strong style={{ color: "var(--resume-accent)", fontSize: "0.9em" }}>Blandas</strong>
                      <span style={{ fontSize: "0.88em", lineHeight: 1.35, color: "var(--resume-text)" }}>{document.softSkills}</span>
                    </div>
                  )}
                </div>
              </ResumeSection>
            );
          }

          if (sidebarStyle === "treemap") {
            return (
              <ResumeSection title={t("skills")}>
                <div className="sidebar-treemap-list" style={{ display: "grid", gap: "calc(var(--resume-sidebar-section-spacing, 6mm) * 0.9)" }}>
                  {document.hardSkills && (
                    <div className="sidebar-treemap-entry" style={{ fontSize: "0.85em", lineHeight: 1.3 }}>
                      <div style={{ fontWeight: 600, color: "var(--resume-text)" }}>⚡ Habilidades duras</div>
                      <div style={{ marginLeft: "6px", paddingLeft: "8px", borderLeft: "1.5px solid var(--resume-separator-color)", marginTop: "2px", fontSize: "0.88em", opacity: 0.85 }}>
                        <span style={{ color: "var(--resume-accent)", fontFamily: "monospace", marginRight: "3px" }}>└──</span>
                        {document.hardSkills}
                      </div>
                    </div>
                  )}
                  {document.softSkills && (
                    <div className="sidebar-treemap-entry" style={{ fontSize: "0.85em", lineHeight: 1.3 }}>
                      <div style={{ fontWeight: 600, color: "var(--resume-text)" }}>💡 Habilidades blandas</div>
                      <div style={{ marginLeft: "6px", paddingLeft: "8px", borderLeft: "1.5px solid var(--resume-separator-color)", marginTop: "2px", fontSize: "0.88em", opacity: 0.85 }}>
                        <span style={{ color: "var(--resume-accent)", fontFamily: "monospace", marginRight: "3px" }}>└──</span>
                        {document.softSkills}
                      </div>
                    </div>
                  )}
                </div>
              </ResumeSection>
            );
          }

          return (
            <ResumeSection title={t("skills")}>
              <div style={{ display: "grid", gap: "2mm" }}>
                {document.hardSkills && (
                  <div>
                    <strong style={{ display: "block", marginBottom: "1mm", color: "var(--resume-accent)" }}>Habilidades duras</strong>
                    <p style={{ margin: 0, fontSize: "0.9em" }}>{document.hardSkills}</p>
                  </div>
                )}
                {document.softSkills && (
                  <div>
                    <strong style={{ display: "block", marginBottom: "1mm", color: "var(--resume-accent)" }}>Habilidades blandas</strong>
                    <p style={{ margin: 0, fontSize: "0.9em" }}>{document.softSkills}</p>
                  </div>
                )}
              </div>
            </ResumeSection>
          );
        }

        return (
          <ResumeSection title={t("skills")}>
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
        );
      }

      case "languages": {
        if (isSidebar) {
          if (sidebarStyle === "shrink") {
            return (
              <ResumeSection title={t("languages")}>
                <div className="sidebar-shrink-list" style={{ display: "grid", gap: "calc(var(--resume-sidebar-section-spacing, 6mm) * 0.8)" }}>
                  {(document.languages || []).map((lang) => (
                    <div key={lang.id} className="sidebar-shrink-card" style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: "6px", alignItems: "baseline", fontSize: "0.85em" }}>
                      <strong style={{ color: "var(--resume-text)", fontSize: "0.92em" }}>{lang.name}</strong>
                      <span style={{ color: "var(--resume-accent)", fontWeight: 600, fontSize: "0.85em", textAlign: "right" }}>{lang.level}</span>
                    </div>
                  ))}
                </div>
              </ResumeSection>
            );
          }

          if (sidebarStyle === "treemap") {
            return (
              <ResumeSection title={t("languages")}>
                <div className="sidebar-treemap-list" style={{ display: "grid", gap: "calc(var(--resume-sidebar-section-spacing, 6mm) * 0.9)" }}>
                  {(document.languages || []).map((lang) => (
                    <div key={lang.id} className="sidebar-treemap-entry" style={{ fontSize: "0.85em", lineHeight: 1.3 }}>
                      <div style={{ fontWeight: 600, color: "var(--resume-text)" }}>🌐 {lang.name}</div>
                      <div style={{ marginLeft: "6px", paddingLeft: "8px", borderLeft: "1.5px solid var(--resume-separator-color)", marginTop: "2px", fontSize: "0.88em", color: "var(--resume-accent)", fontWeight: 500 }}>
                        <span style={{ color: "var(--resume-accent)", fontFamily: "monospace", marginRight: "3px" }}>└──</span>
                        {lang.level}
                      </div>
                    </div>
                  ))}
                </div>
              </ResumeSection>
            );
          }

          return (
            <ResumeSection title={t("languages")}>
              <ul className="link-list">
                {(document.languages || []).map((lang) => (
                  <li key={lang.id}>
                    <strong>{lang.name}:</strong> {lang.level}
                  </li>
                ))}
              </ul>
            </ResumeSection>
          );
        }

        return (
          <ResumeSection title={t("languages")}>
            <ul className="link-list">
              {(document.languages || []).map((lang) => (
                <li key={lang.id}>
                  <strong>{lang.name}:</strong> {lang.level}
                </li>
              ))}
            </ul>
          </ResumeSection>
        );
      }

      case "courses": {
        if (isSidebar) {
          if (sidebarStyle === "shrink") {
            return (
              <ResumeSection title={t("courses")}>
                <div className="sidebar-shrink-list" style={{ display: "grid", gap: "var(--resume-sidebar-section-spacing, 6mm)" }}>
                  {document.courses.map((course) => (
                    <div key={course.id} className="sidebar-shrink-card" style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: "6px", alignItems: "start", fontSize: "0.85em", lineHeight: 1.25 }}>
                      <div className="shrink-left" style={{ fontWeight: 600, color: "var(--resume-text)", wordBreak: "break-word" }}>
                        <div>{course.name}</div>
                        {course.institution && <div style={{ fontSize: "0.8em", opacity: 0.7, fontWeight: 400, marginTop: "2px" }}>{course.institution}</div>}
                      </div>
                      <div className="shrink-right" style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                        {course.obtainedOn && <time style={{ fontSize: "0.82em", opacity: 0.7, color: "var(--resume-accent)", fontWeight: 500 }}>{course.obtainedOn}</time>}
                        {course.credentialUrl && (
                          <a 
                            href={course.credentialUrl.startsWith("http") ? course.credentialUrl : `https://${course.credentialUrl}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ fontSize: "0.78em", opacity: 0.75, color: "var(--resume-accent)", textDecoration: "none", wordBreak: "break-all" }}
                          >
                            🔗 {t("viewCredential")}
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </ResumeSection>
            );
          }

          if (sidebarStyle === "treemap") {
            return (
              <ResumeSection title={t("courses")}>
                <div className="sidebar-treemap-list" style={{ display: "grid", gap: "calc(var(--resume-sidebar-section-spacing, 6mm) * 0.9)" }}>
                  {document.courses.map((course) => (
                    <div key={course.id} className="sidebar-treemap-entry" style={{ fontSize: "0.85em", lineHeight: 1.3 }}>
                      <div style={{ fontWeight: 600, display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "4px", flexWrap: "wrap" }}>
                        <span style={{ color: "var(--resume-text)" }}>📜 {course.name}</span>
                        {course.obtainedOn && <span style={{ fontSize: "0.8em", opacity: 0.65, fontStyle: "italic", fontWeight: 400 }}>{course.obtainedOn}</span>}
                      </div>
                      {course.institution && (
                        <div style={{ marginLeft: "6px", paddingLeft: "8px", borderLeft: "1.5px solid var(--resume-separator-color)", marginTop: "2px", fontSize: "0.85em", opacity: 0.85 }}>
                          <span style={{ color: "var(--resume-accent)", fontFamily: "monospace", marginRight: "3px" }}>{course.credentialUrl ? "├──" : "└──"}</span>
                          {course.institution}
                        </div>
                      )}
                      {course.credentialUrl && (
                        <div style={{ marginLeft: "6px", paddingLeft: "8px", borderLeft: "1.5px solid var(--resume-separator-color)", marginTop: "2px", fontSize: "0.82em", opacity: 0.75 }}>
                          <span style={{ color: "var(--resume-accent)", fontFamily: "monospace", marginRight: "3px" }}>└──</span>
                          <a href={course.credentialUrl.startsWith("http") ? course.credentialUrl : `https://${course.credentialUrl}`} target="_blank" rel="noopener noreferrer" style={{ color: "inherit", textDecoration: "none", wordBreak: "break-all" }}>
                            {t("viewCredential")}
                          </a>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </ResumeSection>
            );
          }

          return (
            <ResumeSection title={t("courses")}>
              {document.courses.map((course) => (
                <article className="resume-entry compact" key={course.id} style={{ marginBottom: "var(--resume-sidebar-section-spacing, 6mm)" }}>
                  <div className="entry-heading" style={{ display: "flex", flexDirection: "column", gap: "1px" }}>
                    <h3 style={{ margin: 0, fontSize: "0.95em" }}>{course.name}</h3>
                    {course.institution && <p style={{ margin: 0, fontSize: "0.85em", opacity: 0.75 }}>{course.institution}</p>}
                    {course.obtainedOn && <time style={{ fontSize: "0.78em", opacity: 0.7 }}>{course.obtainedOn}</time>}
                  </div>
                  {course.credentialUrl && (
                    <a 
                      href={course.credentialUrl.startsWith("http") ? course.credentialUrl : `https://${course.credentialUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ fontSize: "0.78em", opacity: 0.75, color: "var(--resume-accent)", textDecoration: "none" }}
                    >
                      🔗 {t("viewCredential")}
                    </a>
                  )}
                </article>
              ))}
            </ResumeSection>
          );
        }

        return (
          <ResumeSection title={t("courses")}>
            {document.courses.map((course) => (
              <article className="resume-entry compact" key={course.id}>
                <div className="entry-heading">
                  <h3>
                    {course.name}
                    {course.institution && (
                      <span style={{ fontWeight: 500, fontSize: "0.9em", opacity: 0.8, marginLeft: "6px" }}>
                        — {course.institution}
                      </span>
                    )}
                  </h3>
                  {course.obtainedOn && <time>{course.obtainedOn}</time>}
                </div>
                {course.credentialUrl && (
                  <div style={{ marginTop: "2px" }}>
                    <a
                      href={course.credentialUrl.startsWith("http") ? course.credentialUrl : `https://${course.credentialUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ fontSize: "0.85em", opacity: 0.75, color: "var(--resume-accent)", textDecoration: "none" }}
                    >
                      🔗 {t("viewCredential")}
                    </a>
                  </div>
                )}
              </article>
            ))}
          </ResumeSection>
        );
      }

      case "portfolio": {
        if (isSidebar) {
          if (sidebarStyle === "shrink") {
            return (
              <ResumeSection title={t("portfolio")}>
                <div className="sidebar-shrink-list" style={{ display: "grid", gap: "calc(var(--resume-sidebar-section-spacing, 6mm) * 0.8)" }}>
                  {document.portfolioLinks.map((link) => (
                    <div key={link.id} className="sidebar-shrink-card" style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: "6px", alignItems: "baseline", fontSize: "0.85em" }}>
                      <div style={{ display: "flex", gap: "4px", alignItems: "center", fontWeight: 600, color: "var(--resume-text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {link.icon && link.icon !== 'none' && <PortfolioIcon icon={link.icon} />}
                        <span>{link.label}</span>
                      </div>
                      <a 
                        href={link.url.startsWith('http') ? link.url : `https://${link.url}`} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        style={{ fontSize: "0.8em", opacity: 0.65, color: "inherit", textDecoration: "none", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", textAlign: "right" }}
                      >
                        {link.url.replace(/^https?:\/\//, '')}
                      </a>
                    </div>
                  ))}
                </div>
              </ResumeSection>
            );
          }

          if (sidebarStyle === "treemap") {
            return (
              <ResumeSection title={t("portfolio")}>
                <div className="sidebar-treemap-list" style={{ display: "grid", gap: "calc(var(--resume-sidebar-section-spacing, 6mm) * 0.9)" }}>
                  {document.portfolioLinks.map((link) => (
                    <div key={link.id} className="sidebar-treemap-entry" style={{ fontSize: "0.85em", lineHeight: 1.3 }}>
                      <div style={{ fontWeight: 600, display: "flex", alignItems: "center", gap: "4px", color: "var(--resume-text)" }}>
                        {link.icon && link.icon !== 'none' && <PortfolioIcon icon={link.icon} />}
                        <span>{link.label}</span>
                      </div>
                      <div style={{ marginLeft: "6px", paddingLeft: "8px", borderLeft: "1.5px solid var(--resume-separator-color)", marginTop: "2px", fontSize: "0.8em" }}>
                        <span style={{ color: "var(--resume-accent)", fontFamily: "monospace", marginRight: "3px" }}>└──</span>
                        <a 
                          href={link.url.startsWith('http') ? link.url : `https://${link.url}`} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          style={{ opacity: 0.65, color: "inherit", textDecoration: "none", wordBreak: "break-all" }}
                        >
                          {link.url}
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </ResumeSection>
            );
          }

          return (
            <ResumeSection title={t("portfolio")}>
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
          );
        }

        return (
          <ResumeSection title={t("portfolio")}>
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
        );
      }
    }
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
                    {pageSidebarSections.map(({ id }) => <div key={id} className="sidebar-section-wrap">{renderSection(id as Exclude<ResumeSectionId, "summary">, true)}</div>)}
                  </div>
                )}
              </header>

              <div className="resume-body">
                {isFirstPage && summarySection && document.professionalSummary?.trim() && !(document.theme.compactProfessionalProfile && template.id !== 'chronological') && (
                  <div className="summary-highlight" style={{ marginBottom: "var(--resume-section-spacing)", gridColumn: "1 / -1" }}>
                    <ResumeSection title={t("profSummary")}>
                      <p style={{ fontSize: "1.08em", lineHeight: 1.6, color: "color-mix(in srgb, var(--resume-text) 80%, var(--resume-accent))" }}>
                        {document.professionalSummary}
                      </p>
                    </ResumeSection>
                  </div>
                )}
                
                {hasSidebar && !isChronological && (
                  <div className="sidebar-sections">
                    {pageSidebarSections.map(({ id }) => <div key={id} className="sidebar-section-wrap">{renderSection(id as Exclude<ResumeSectionId, "summary">, true)}</div>)}
                  </div>
                )}

                <div className="main-sections">
                  {pageMainSections.map(({ id }) => (
                    <div key={id}>
                      {renderSection(id as Exclude<ResumeSectionId, "summary">, false)}
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



