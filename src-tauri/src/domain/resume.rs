use std::collections::HashSet;

use serde::{Deserialize, Serialize};

use super::error::DomainError;

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "camelCase")]
pub struct ResumeTheme {
    pub font_family: String,
    pub heading_font_family: String,
    pub base_font_size: f32,
    pub heading_scale: f32,
    pub accent_color: String,
    pub text_color: String,
    pub page_color: String,
}

#[derive(Debug, Clone, Copy, Serialize, Deserialize, PartialEq, Eq, Hash)]
#[serde(rename_all = "camelCase")]
pub enum ResumeSectionKind {
    Summary,
    Experience,
    Courses,
    Portfolio,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "camelCase")]
pub struct ResumeSection {
    pub kind: ResumeSectionKind,
    pub is_visible: bool,
}

#[derive(Debug, Clone, Copy, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "camelCase")]
pub enum ContactDisplayMode {
    Icons,
    Text,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "camelCase")]
pub struct Resume {
    id: String,
    template_id: String,
    theme: ResumeTheme,
    contact_display_mode: ContactDisplayMode,
    sections: Vec<ResumeSection>,
}

impl Resume {
    pub fn new(
        id: impl Into<String>,
        template_id: impl Into<String>,
        theme: ResumeTheme,
        contact_display_mode: ContactDisplayMode,
        sections: Vec<ResumeSection>,
    ) -> Result<Self, DomainError> {
        let resume = Self {
            id: id.into(),
            template_id: template_id.into(),
            theme,
            contact_display_mode,
            sections,
        };
        resume.validate_sections()?;
        Ok(resume)
    }

    pub fn change_theme(&mut self, theme: ResumeTheme) {
        self.theme = theme;
    }

    pub fn reorder_sections(&mut self, order: &[ResumeSectionKind]) -> Result<(), DomainError> {
        let expected: HashSet<_> = self.sections.iter().map(|section| section.kind).collect();
        let requested: HashSet<_> = order.iter().copied().collect();
        if expected != requested || requested.len() != order.len() {
            return Err(DomainError::InvalidSectionOrder);
        }
        self.sections
            .sort_by_key(|section| order.iter().position(|kind| kind == &section.kind));
        Ok(())
    }

    pub fn toggle_section(&mut self, kind: ResumeSectionKind) {
        if let Some(section) = self
            .sections
            .iter_mut()
            .find(|section| section.kind == kind)
        {
            section.is_visible = !section.is_visible;
        }
    }

    fn validate_sections(&self) -> Result<(), DomainError> {
        let unique: HashSet<_> = self.sections.iter().map(|section| section.kind).collect();
        if unique.len() != self.sections.len() {
            return Err(DomainError::InvalidSectionOrder);
        }
        Ok(())
    }
}
