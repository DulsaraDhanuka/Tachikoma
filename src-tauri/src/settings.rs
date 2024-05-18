use std::path::PathBuf;

use serde_json::{Map, Value};
use tauri::{Manager, Wry};
use tauri_plugin_store::{with_store, StoreCollection};

#[derive(serde::Serialize, serde::Deserialize)]
pub struct Settings {
    default_agent: String,
    provider_settings: Map<String, Value>
}

pub async fn load(app_handle: tauri::AppHandle) -> Result<Settings, bool> {
    let stores = app_handle.state::<StoreCollection<Wry>>();
    let path = PathBuf::from("settings.bin");

    match with_store(app_handle.clone(), stores, path, |store| {
        let mut settings = Settings {
            default_agent: String::new(),
            provider_settings: Map::new(),
        };

        match store.get("default_agent") {
            Some(val) => match val.as_str() {
                Some(val) => {
                    settings.default_agent = String::from(val);
                }
                None => {}
            },
            None => {}
        }

        match store.get("provider_settings") {
            Some(val) => match val.as_object() {
                Some(val) => {
                    settings.provider_settings = val.clone();
                }
                None => {}
            },
            None => {}
        }

        Ok(settings)
    }) {
        Ok(val) => Ok(val),
        Err(e) => {
            println!("Error: {}", e.to_string());
            Err(false)
        }
    }
}

pub async fn save(app_handle: tauri::AppHandle, settings: Settings) -> Result<bool, bool> {
    let stores = app_handle.state::<StoreCollection<Wry>>();
    let path = PathBuf::from("settings.bin");

    match with_store(app_handle.clone(), stores, path, |store| {
        match store.insert(
            String::from("default_agent"),
            serde_json::json!(settings.default_agent),
        ) {
            Ok(_) => {}
            Err(e) => {
                println!("Error: Could not save defautl_agent");
                println!("{}", e);
                return Err(tauri_plugin_store::Error::Tauri(tauri::Error::UnstableFeatureNotSupported));
            }
        }

        match store.insert(String::from("provider_settings"), serde_json::json!(settings.provider_settings)) {
            Ok(_) => {},
            Err(e) => {
                println!("Error: Could not save provider_settings");
                println!("{}", e);
                return Err(tauri_plugin_store::Error::Tauri(tauri::Error::UnstableFeatureNotSupported));
            },
        }

        Ok(true)
    }) {
        Ok(val) => Ok(val),
        Err(e) => {
            println!("Error: {}", e.to_string());
            Err(false)
        }
    }
}
