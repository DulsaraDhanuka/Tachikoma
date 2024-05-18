use crate::llm_providers;

#[tauri::command]
pub fn get_llm_providers() -> [String; 2] {
    llm_providers::get_providers()
}

#[tauri::command]
pub fn get_llm_provider_settings(provider: String) -> Result<Vec<llm_providers::ProviderSetting>, bool> {
    llm_providers::get_provider_settings(provider)
}
