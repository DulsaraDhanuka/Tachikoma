use crate::llm_providers;

pub fn get_cohere_settings() -> Result<Vec<llm_providers::ProviderSetting>, bool> {
    Ok(vec![
        llm_providers::ProviderSetting {
            name: String::from("apiKey"),
            label: String::from("API Key"),
            kind: llm_providers::InputType::TEXT,
            default_bool: None,
            default_text: Some(String::from(""))
        }, 
        llm_providers::ProviderSetting {
            name: String::from("something"),
            label: String::from("Something"),
            kind: llm_providers::InputType::LONGTEXT,
            default_bool: None,
            default_text: Some(String::from(""))
        },
        llm_providers::ProviderSetting {
            name: String::from("somethingElse"),
            label: String::from("Something Else"),
            kind: llm_providers::InputType::BOOLEAN,
            default_bool: Some(false),
            default_text: None
        }
    ])
}