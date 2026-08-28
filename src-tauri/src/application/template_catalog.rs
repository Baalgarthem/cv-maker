use serde::Serialize;

use crate::domain::template::{OxfordTemplate, ResumeTemplate};

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct TemplateSummary {
    pub id: &'static str,
    pub name: &'static str,
    pub description: &'static str,
}

pub struct TemplateCatalog {
    templates: Vec<Box<dyn ResumeTemplate>>,
}

impl Default for TemplateCatalog {
    fn default() -> Self {
        Self {
            templates: vec![Box::new(OxfordTemplate)],
        }
    }
}

impl TemplateCatalog {
    pub fn list(&self) -> Vec<TemplateSummary> {
        self.templates
            .iter()
            .map(|template| TemplateSummary {
                id: template.id(),
                name: template.name(),
                description: template.description(),
            })
            .collect()
    }
}
