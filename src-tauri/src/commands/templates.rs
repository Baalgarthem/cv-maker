use crate::application::template_catalog::{TemplateCatalog, TemplateSummary};

#[tauri::command]
pub fn list_resume_templates() -> Vec<TemplateSummary> {
    TemplateCatalog::default().list()
}
