mod cohere;

#[derive(serde::Serialize)]
pub enum InputType {
    TEXT,
    LONGTEXT,
    BOOLEAN
}

#[derive(serde::Serialize)]
pub struct ProviderSetting {
    name: String,
    label: String,
    kind: InputType,
    default_text: Option<String>,
    default_bool: Option<bool>
}

pub fn get_providers() -> [String; 2] {
    [String::from("Cohere"), String::from("Groq")]
}

pub fn get_provider_settings(provider: String) -> Result<Vec<ProviderSetting>, bool> {
    match provider.as_str() {
        "Cohere" => cohere::get_cohere_settings(),
        _ => Err(false)
    }
}
