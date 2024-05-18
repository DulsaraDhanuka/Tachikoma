use crate::settings;

#[tauri::command]
pub async fn load_app_settings(app_handle: tauri::AppHandle) -> Result<settings::Settings, bool> {
    settings::load(app_handle).await
}

#[tauri::command]
pub async fn save_app_settings(app_handle: tauri::AppHandle, settings: settings::Settings) -> Result<bool, bool> {
    settings::save(app_handle, settings).await
}
