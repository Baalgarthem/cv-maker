mod application;
mod commands;
mod domain;
mod infrastructure;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .invoke_handler(tauri::generate_handler![
            commands::health::health_check,
            commands::templates::list_resume_templates
        ])
        .run(tauri::generate_context!())
        .expect("error while running CV Maker");
}
