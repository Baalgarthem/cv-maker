import { useState } from "react";
import { useTranslation } from "../../i18n/LanguageContext";
import type { Course, PortfolioLink, ResumeDocument, WorkExperience, Education, Language } from "../../types/resume";

interface DataEntryFormProps {
  document: ResumeDocument;
  onCancel: () => void;
  onSave: (document: ResumeDocument) => void;
}

const createId = () => crypto.randomUUID();

const createExperience = (): WorkExperience => ({
  id: createId(),
  companyName: "",
  startDate: "",
  endDate: "",
  isCurrent: false,
  context: "",
  activities: [""],
});

const createCourse = (): Course => ({ id: createId(), name: "", obtainedOn: "", credentialUrl: "" });
const createLink = (): PortfolioLink => ({ id: createId(), icon: "none", label: "", url: "" });
const createEducation = (): Education => ({ id: createId(), institution: "", degree: "", startDate: "" });
const createLanguage = (): Language => ({ id: createId(), name: "", level: "" });

export function DataEntryForm({ document, onCancel, onSave }: DataEntryFormProps) {
  const { t } = useTranslation();
  const [draft, setDraft] = useState<ResumeDocument>(() => structuredClone(document));

  const updateExperience = (index: number, changes: Partial<WorkExperience>) => {
    setDraft((current) => ({
      ...current,
      experiences: current.experiences.map((experience, itemIndex) =>
        itemIndex === index ? { ...experience, ...changes } : experience,
      ),
    }));
  };

  const updateEducation = (index: number, changes: Partial<Education>) => {
    setDraft((current) => ({
      ...current,
      education: (current.education || []).map((edu, itemIndex) => itemIndex === index ? { ...edu, ...changes } : edu),
    }));
  };

  const updateLanguage = (index: number, changes: Partial<Language>) => {
    setDraft((current) => ({
      ...current,
      languages: (current.languages || []).map((lang, itemIndex) => itemIndex === index ? { ...lang, ...changes } : lang),
    }));
  };

  const updateCourse = (index: number, changes: Partial<Course>) => {
    setDraft((current) => ({
      ...current,
      courses: current.courses.map((course, itemIndex) => itemIndex === index ? { ...course, ...changes } : course),
    }));
  };

  const updateLink = (index: number, changes: Partial<PortfolioLink>) => {
    setDraft((current) => ({
      ...current,
      portfolioLinks: current.portfolioLinks.map((link, itemIndex) => itemIndex === index ? { ...link, ...changes } : link),
    }));
  };

  const submit = () => {
    onSave({
      ...draft,
      profile: {
        ...draft.profile,
        curp: draft.profile.curp?.trim().toUpperCase(),
        rfc: draft.profile.rfc?.trim().toUpperCase(),
        professionalLicenses: draft.profile.professionalLicenses?.map((license) => ({ prefix: license.prefix?.trim(), number: license.number?.trim() })).filter(l => l.number),
      },
    });
  };

  return (
    <div className="form-backdrop" role="presentation">
      <section className="data-form-dialog" role="dialog" aria-modal="true" aria-labelledby="data-form-title">
        <header className="data-form-header">
          <div><p className="eyebrow">Información reutilizable</p><h2 id="data-form-title">Completa tu currículum</h2></div>
          <button className="icon-button" type="button" onClick={onCancel} aria-label="Cerrar formulario">×</button>
        </header>

        <form onSubmit={(event) => { event.preventDefault(); submit(); }}>
          <fieldset>
            <legend>{t("personalData")}</legend>
            <div className="form-grid three-columns">
              <label>Nombre<input required value={draft.profile.firstName} onChange={(event) => setDraft((current) => ({ ...current, profile: { ...current.profile, firstName: event.target.value } }))} /></label>
              <label>{t("paternalSurname")}<input required value={draft.profile.paternalSurname} onChange={(event) => setDraft((current) => ({ ...current, profile: { ...current.profile, paternalSurname: event.target.value } }))} /></label>
              <label>Apellido materno<input required value={draft.profile.maternalSurname} onChange={(event) => setDraft((current) => ({ ...current, profile: { ...current.profile, maternalSurname: event.target.value } }))} /></label>
              <label>{t("email")} <input type="email" placeholder="Opcional" value={draft.profile.email ?? ""} onChange={(event) => setDraft((current) => ({ ...current, profile: { ...current.profile, email: event.target.value } }))} /></label>
              <label>Número telefónico <input type="tel" placeholder="Opcional" value={draft.profile.phone ?? ""} onChange={(event) => setDraft((current) => ({ ...current, profile: { ...current.profile, phone: event.target.value } }))} /></label>
              <label>{t("address")} <input placeholder="Opcional" value={draft.profile.address ?? ""} onChange={(event) => setDraft((current) => ({ ...current, profile: { ...current.profile, address: event.target.value } }))} /></label>
              
              <div className="contact-display-choice">
                <span>Presentación de contacto</span>
                <div className="segmented-control">
                  <label>
                    <input type="radio" name="contactDisplayMode" checked={draft.contactDisplayMode === "icons"} onChange={() => setDraft((current) => ({ ...current, contactDisplayMode: "icons" }))} />
                    <span className="control-label">Iconos genéricos</span>
                  </label>
                  <label>
                    <input type="radio" name="contactDisplayMode" checked={draft.contactDisplayMode === "text"} onChange={() => setDraft((current) => ({ ...current, contactDisplayMode: "text" }))} />
                    <span className="control-label">Únicamente texto</span>
                  </label>
                </div>
              </div>

              <label>{t("nationalId")} <input maxLength={18} placeholder="Opcional" value={draft.profile.curp ?? ""} onChange={(event) => setDraft((current) => ({ ...current, profile: { ...current.profile, curp: event.target.value } }))} /></label>
              <label>{t("taxId")} <input maxLength={13} placeholder="Opcional" value={draft.profile.rfc ?? ""} onChange={(event) => setDraft((current) => ({ ...current, profile: { ...current.profile, rfc: event.target.value } }))} /></label>
              
              <label>
                Fotografía (Opcional)
                <input type="file" accept="image/*" onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                      const img = new Image();
                      img.onload = () => {
                        const canvas = window.document.createElement("canvas");
                        const MAX_SIZE = 400;
                        let width = img.width;
                        let height = img.height;
                        if (width > height) {
                          if (width > MAX_SIZE) { height *= MAX_SIZE / width; width = MAX_SIZE; }
                        } else {
                          if (height > MAX_SIZE) { width *= MAX_SIZE / height; height = MAX_SIZE; }
                        }
                        canvas.width = width;
                        canvas.height = height;
                        const ctx = canvas.getContext("2d");
                        if (ctx) {
                          ctx.drawImage(img, 0, 0, width, height);
                          const dataUrl = canvas.toDataURL("image/jpeg", 0.8);
                          setDraft((current) => ({ ...current, profile: { ...current.profile, picture: dataUrl } }));
                        }
                      };
                      img.src = e.target?.result as string;
                    };
                    reader.readAsDataURL(file);
                  } else {
                    setDraft((current) => ({ ...current, profile: { ...current.profile, picture: undefined } }));
                  }
                }} />
              </label>

              <div style={{ gridColumn: "1 / -1" }}>
                <label className="checkbox-field" style={{ marginBottom: draft.profile.hasDrivingLicense ? "12px" : "0" }}>
                  <input type="checkbox" checked={!!draft.profile.hasDrivingLicense} onChange={(event) => setDraft((current) => ({ ...current, profile: { ...current.profile, hasDrivingLicense: event.target.checked } }))} />
                  Licencia de conducir vigente
                </label>
                {draft.profile.hasDrivingLicense && (
                  <div className="form-grid" style={{ gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                    <label>{t("drivingLicense")}
                      <select 
                        required 
                        value={draft.profile.drivingLicenseType ?? ""} 
                        onChange={(event) => setDraft((current) => ({ ...current, profile: { ...current.profile, drivingLicenseType: event.target.value } }))}
                      >
                        <option value="" disabled>Seleccionar tipo...</option>
                        {draft.profile.drivingLicenseType && !["A", "B", "C", "D", "E", "F", "Motociclista", "Chofer", "Federal", "Internacional"].includes(draft.profile.drivingLicenseType) && (
                          <option value={draft.profile.drivingLicenseType}>{draft.profile.drivingLicenseType}</option>
                        )}
                        <option value="A">{t("drivingLicenseA")}</option>
                        <option value="B">Tipo B (chofer particular/estatal)</option>
                        <option value="C">Tipo C (chofer de carga)</option>
                        <option value="D">Tipo D (turismo / guía)</option>
                        <option value="E">Tipo E (carga especializada)</option>
                        <option value="F">Tipo F (marítima/aérea)</option>
                        <option value="Motociclista">Motociclista</option>
                        <option value="Federal">Federal</option>
                        <option value="Internacional">Internacional</option>
                      </select>
                    </label>
                    <label>Número de licencia <input placeholder="Opcional" value={draft.profile.drivingLicenseNumber ?? ""} onChange={(event) => setDraft((current) => ({ ...current, profile: { ...current.profile, drivingLicenseNumber: event.target.value } }))} /></label>
                  </div>
                )}
                <div className="license-fields">
                  {(draft.profile.professionalLicenses?.length ? draft.profile.professionalLicenses : [{ prefix: "", number: "" }]).map((license, licenseIndex) => (
                    <div key={licenseIndex} style={{ marginBottom: "12px" }}>
                      <div className="license-label-wrap">
                        Cédula profesional {licenseIndex > 0 && licenseIndex + 1}
                        {licenseIndex === 0 && (draft.profile.professionalLicenses?.length || 1) < 3 && (
                          <button className="add-small-btn" type="button" aria-label="Añadir otra cédula profesional" title="Añadir otra cédula profesional" onClick={(e) => { e.preventDefault(); setDraft((current) => ({ ...current, profile: { ...current.profile, professionalLicenses: [...(current.profile.professionalLicenses?.length ? current.profile.professionalLicenses : [{ prefix: "", number: "" }]), { prefix: "", number: "" }] } })); }}>+</button>
                        )}
                        {licenseIndex > 0 && (
                          <button className="remove-small-btn" type="button" aria-label={`Eliminar cédula profesional ${licenseIndex + 1}`} title="Eliminar cédula" onClick={(e) => { e.preventDefault(); setDraft((current) => ({ ...current, profile: { ...current.profile, professionalLicenses: current.profile.professionalLicenses?.filter((_, itemIndex) => itemIndex !== licenseIndex) } })); }}>×</button>
                        )}
                      </div>
                      <div className="form-grid" style={{ gridTemplateColumns: "1fr 2fr", gap: "8px" }}>
                        <input 
                          placeholder="Prefijo (opcional)" 
                          value={license.prefix ?? ""} 
                          onChange={(event) => setDraft((current) => {
                            const licenses = current.profile.professionalLicenses?.length ? [...current.profile.professionalLicenses] : [{ prefix: "", number: "" }];
                            licenses[licenseIndex] = { ...licenses[licenseIndex], prefix: event.target.value };
                            return { ...current, profile: { ...current.profile, professionalLicenses: licenses } };
                          })} 
                        />
                        <input 
                          type="number" 
                          placeholder="Solo números" 
                          value={license.number} 
                          onChange={(event) => setDraft((current) => {
                            const licenses = current.profile.professionalLicenses?.length ? [...current.profile.professionalLicenses] : [{ prefix: "", number: "" }];
                            licenses[licenseIndex] = { ...licenses[licenseIndex], number: event.target.value };
                            return { ...current, profile: { ...current.profile, professionalLicenses: licenses } };
                          })} 
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <label className="full-field">Perfil profesional<textarea rows={4} value={draft.professionalSummary} onChange={(event) => setDraft((current) => ({ ...current, professionalSummary: event.target.value }))} /></label>
          </fieldset>

          <fieldset>
            <div className="fieldset-heading"><legend>Experiencia laboral</legend><button className="text-button" type="button" onClick={() => setDraft((current) => ({ ...current, experiences: [...current.experiences, createExperience()] }))}>{t("addExperience")}</button></div>
            <div className="repeatable-list">
              {draft.experiences.map((experience, experienceIndex) => (
                <article className="repeatable-card" key={experience.id}>
                  <div className="card-heading"><strong>Experiencia {experienceIndex + 1}</strong><button className="remove-button" type="button" onClick={() => setDraft((current) => ({ ...current, experiences: current.experiences.filter(({ id }) => id !== experience.id) }))}>{t("removeEducation")}</button></div>
                  <div className="form-grid three-columns">
                    <label>{t("company")}<input required value={experience.companyName} onChange={(event) => updateExperience(experienceIndex, { companyName: event.target.value })} /></label>
                    <label>Fecha inicial<input required type="month" value={experience.startDate} onChange={(event) => updateExperience(experienceIndex, { startDate: event.target.value })} /></label>
                    <label>Fecha final<input type="month" disabled={experience.isCurrent} required={!experience.isCurrent} value={experience.endDate ?? ""} onChange={(event) => updateExperience(experienceIndex, { endDate: event.target.value })} /></label>
                  </div>
                  <label className="checkbox-field"><input type="checkbox" checked={experience.isCurrent} onChange={(event) => updateExperience(experienceIndex, { isCurrent: event.target.checked, endDate: event.target.checked ? "" : experience.endDate })} />Trabajo actualmente aquí</label>
                  <label className="full-field">Contexto<textarea rows={3} value={experience.context} onChange={(event) => updateExperience(experienceIndex, { context: event.target.value })} /></label>
                  <label className="full-field">Etiquetas (separadas por comas)<input type="text" placeholder="Ej: Liderazgo, Ventas, Excel" value={experience.tags?.join(', ') || ''} onChange={(event) => updateExperience(experienceIndex, { tags: event.target.value.split(',').map(t => t.trim()).filter(Boolean) })} /></label>
                  <div className="activities-heading"><span>Actividades realizadas</span><button className="text-button" type="button" onClick={() => updateExperience(experienceIndex, { activities: [...experience.activities, ""] })}>+ Actividad</button></div>
                  {experience.activities.map((activity, activityIndex) => (
                    <div className="inline-field" key={`${experience.id}-${activityIndex}`}>
                      <input required aria-label={`Actividad ${activityIndex + 1}`} value={activity} onChange={(event) => updateExperience(experienceIndex, { activities: experience.activities.map((item, itemIndex) => itemIndex === activityIndex ? event.target.value : item) })} />
                      <button type="button" aria-label={`Eliminar actividad ${activityIndex + 1}`} onClick={() => updateExperience(experienceIndex, { activities: experience.activities.filter((_, itemIndex) => itemIndex !== activityIndex) })}>×</button>
                    </div>
                  ))}
                </article>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <div className="fieldset-heading"><legend>{t("education")}</legend><button className="text-button" type="button" onClick={() => setDraft((current) => ({ ...current, education: [...(current.education || []), createEducation()] }))}>+ Añadir educación</button></div>
            <div className="repeatable-list">
              {(draft.education || []).map((edu, index) => (
                <article className="repeatable-card" key={edu.id}>
                  <div className="card-heading"><strong>{t("institution")} {index + 1}</strong><button className="remove-button" type="button" onClick={() => setDraft((current) => ({ ...current, education: current.education.filter(({ id }) => id !== edu.id) }))}>{t("removeEducation")}</button></div>
                  <div className="form-grid three-columns">
                    <label>{t("institution")}<input required value={edu.institution} onChange={(event) => updateEducation(index, { institution: event.target.value })} /></label>
                    <label>{t("startDate")}<input required value={edu.startDate} placeholder="Ej. 2015" onChange={(event) => updateEducation(index, { startDate: event.target.value })} /></label>
                    <label>{t("endDate")}<input value={edu.endDate ?? ""} disabled={edu.isCurrent} placeholder="Ej. 2019" onChange={(event) => updateEducation(index, { endDate: event.target.value })} /></label>
                  </div>
                  <div className="form-grid" style={{ marginTop: 16 }}>
                    <label>Título o grado obtenido<input required value={edu.degree} onChange={(event) => updateEducation(index, { degree: event.target.value })} /></label>
                  </div>
                  <label className="checkbox-field"><input type="checkbox" checked={edu.isCurrent} onChange={(event) => updateEducation(index, { isCurrent: event.target.checked, endDate: event.target.checked ? "" : edu.endDate })} />Estudio actualmente aquí</label>
                </article>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <div className="fieldset-heading"><legend>{t("skills")}</legend></div>
            <div className="form-grid" style={{ gap: "24px" }}>
              <label>
                {t("hardSkills")}
                <textarea rows={3} value={draft.hardSkills || ""} onChange={(event) => setDraft((current) => ({ ...current, hardSkills: event.target.value }))} placeholder={t("hardSkillsPlaceholder")} />
              </label>
              <label>
                {t("softSkills")}
                <textarea rows={3} value={draft.softSkills || ""} onChange={(event) => setDraft((current) => ({ ...current, softSkills: event.target.value }))} placeholder={t("softSkillsPlaceholder")} />
              </label>
            </div>
          </fieldset>

          <fieldset>
            <div className="fieldset-heading"><legend>{t("languages")}</legend><button className="text-button" type="button" onClick={() => setDraft((current) => ({ ...current, languages: [...(current.languages || []), createLanguage()] }))}>{t("addLanguage")}</button></div>
            <div className="repeatable-list">
              {(draft.languages || []).map((lang, index) => (
                <article className="repeatable-card compact-card" key={lang.id}>
                  <div className="form-grid three-columns">
                    <label>{t("languageName")}<input required value={lang.name} placeholder="Ej. Inglés" onChange={(event) => updateLanguage(index, { name: event.target.value })} /></label>
                    <label>{t("skillLevel")}<input required value={lang.level} placeholder="Ej. B2 Intermedio" onChange={(event) => updateLanguage(index, { level: event.target.value })} /></label>
                    <div style={{ alignSelf: "end" }}>
                      <button className="remove-button" type="button" onClick={() => setDraft((current) => ({ ...current, languages: current.languages.filter(({ id }) => id !== lang.id) }))}>{t("removeLanguage")}</button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <div className="fieldset-heading"><legend>{t("courses")}</legend><button className="text-button" type="button" onClick={() => setDraft((current) => ({ ...current, courses: [...current.courses, createCourse()] }))}>{t("addCourse")}</button></div>
            <div className="repeatable-list">
              {draft.courses.map((course, index) => (
                <article className="repeatable-card compact-card" key={course.id}>
                  <div className="form-grid three-columns">
                    <label>{t("courseName")}<input required value={course.name} onChange={(event) => updateCourse(index, { name: event.target.value })} /></label>
                    <label>{t("courseDate")}<input required type="month" value={course.obtainedOn} onChange={(event) => updateCourse(index, { obtainedOn: event.target.value })} /></label>
                    <label>{t("portUrl")}<input type="text" placeholder="Opcional" value={course.credentialUrl ?? ""} onChange={(event) => updateCourse(index, { credentialUrl: event.target.value })} /></label>
                  </div>
                  <button className="remove-button" type="button" onClick={() => setDraft((current) => ({ ...current, courses: current.courses.filter(({ id }) => id !== course.id) }))}>{t("removeCourse")}</button>
                </article>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <div className="fieldset-heading"><legend>{t("portfolio")}</legend><button className="text-button" type="button" onClick={() => setDraft((current) => ({ ...current, portfolioLinks: [...current.portfolioLinks, createLink()] }))}>{t("addPortfolio")}</button></div>
            <div className="repeatable-list">
              {draft.portfolioLinks.map((link, index) => (
                <article className="repeatable-card compact-card" key={link.id}>
                    <div className="form-grid three-columns">
                      <label>{t("portTitle")}<input required placeholder={t("portTitlePlaceholder")} value={link.label} onChange={(event) => updateLink(index, { label: event.target.value })} />
                      </label>
                      <label>{t("portIcon")}<div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                          <select 
                            style={{ flex: 1 }}
                            value={link.icon?.startsWith('data:') ? 'custom' : (link.icon || 'none')} 
                            onChange={(event) => {
                              if (event.target.value === 'custom') {
                                window.document.getElementById(`icon-upload-${link.id}`)?.click();
                              } else {
                                updateLink(index, { icon: event.target.value });
                              }
                            }}
                          >
                            <option value="none">{t("portIconNone")}</option>
                            <option value="web">Web</option>
                            <option value="github">GitHub</option>
                            <option value="gitlab">GitLab</option>
                            <option value="instagram">Instagram</option>
                            <option value="facebook">Facebook</option>
                            <option value="drive">Google Drive</option>
                            <option value="mega">MEGA</option>
                            <option value="custom">{t("portIconCustom")}</option>
                          </select>
                          {link.icon?.startsWith('data:') && <img src={link.icon} alt="Icon" style={{ width: '20px', height: '20px', objectFit: 'contain' }} />}
                          <input 
                            id={`icon-upload-${link.id}`} 
                            type="file" 
                            accept=".ico" 
                            style={{ display: 'none' }} 
                            onChange={(event) => {
                              const file = event.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onload = (e) => {
                                  updateLink(index, { icon: e.target?.result as string });
                                };
                                reader.readAsDataURL(file);
                              }
                            }} 
                          />
                        </div>
                      </label>
                      <label>{t("portUrl")}<input required type="text" value={link.url} onChange={(event) => updateLink(index, { url: event.target.value })} />
                      </label>
                    </div>
                  <button className="remove-button" type="button" onClick={() => setDraft((current) => ({ ...current, portfolioLinks: current.portfolioLinks.filter(({ id }) => id !== link.id) }))}>{t("removePortfolio")}</button>
                </article>
              ))}
            </div>
          </fieldset>

          <footer className="form-actions"><button className="secondary-button" type="button" onClick={onCancel}>{t("cancel")}</button><button className="primary-button" type="submit">{t("saveAndPreview")}</button></footer>
        </form>
      </section>
    </div>
  );
}


