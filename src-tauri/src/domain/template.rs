use super::resume::{ResumeSection, ResumeSectionKind, ResumeTheme};

pub trait ResumeTemplate: Send + Sync {
    fn id(&self) -> &'static str;
    fn name(&self) -> &'static str;
    fn description(&self) -> &'static str;
    fn default_theme(&self) -> ResumeTheme;
    fn default_sections(&self) -> Vec<ResumeSection>;
}

pub struct OxfordTemplate;

impl ResumeTemplate for OxfordTemplate {
    fn id(&self) -> &'static str {
        "oxford"
    }
    fn name(&self) -> &'static str {
        "Oxford"
    }
    fn description(&self) -> &'static str {
        "Editorial, sobrio y legible, con jerarquía clásica."
    }

    fn default_theme(&self) -> ResumeTheme {
        ResumeTheme {
            font_family: "Segoe UI, sans-serif".into(),
            heading_font_family: "Georgia, serif".into(),
            base_font_size: 10.5,
            heading_scale: 1.25,
            accent_color: "#9a6b35".into(),
            text_color: "#202733".into(),
            page_color: "#ffffff".into(),
        }
    }

    fn default_sections(&self) -> Vec<ResumeSection> {
        [
            ResumeSectionKind::Summary,
            ResumeSectionKind::Experience,
            ResumeSectionKind::Courses,
            ResumeSectionKind::Portfolio,
        ]
        .into_iter()
        .map(|kind| ResumeSection {
            kind,
            is_visible: true,
        })
        .collect()
    }
}
