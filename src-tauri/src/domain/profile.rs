use serde::{Deserialize, Serialize};

use super::error::DomainError;

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
pub struct Profile {
    id: String,
    first_name: String,
    paternal_surname: String,
    maternal_surname: String,
    email: Option<String>,
    phone: Option<String>,
    address: Option<String>,
    curp: Option<String>,
    rfc: Option<String>,
    professional_licenses: Vec<String>,
}

impl Profile {
    pub fn new(
        id: impl Into<String>,
        first_name: impl Into<String>,
        paternal_surname: impl Into<String>,
        maternal_surname: impl Into<String>,
    ) -> Result<Self, DomainError> {
        let profile = Self {
            id: id.into(),
            first_name: first_name.into(),
            paternal_surname: paternal_surname.into(),
            maternal_surname: maternal_surname.into(),
            email: None,
            phone: None,
            address: None,
            curp: None,
            rfc: None,
            professional_licenses: Vec::new(),
        };
        profile.validate()?;
        Ok(profile)
    }

    pub fn validate(&self) -> Result<(), DomainError> {
        for (name, value) in [
            ("nombre", self.first_name.as_str()),
            ("apellido paterno", self.paternal_surname.as_str()),
            ("apellido materno", self.maternal_surname.as_str()),
        ] {
            if value.trim().is_empty() {
                return Err(DomainError::EmptyRequiredField(name));
            }
        }
        Ok(())
    }

    pub fn with_optional_fields(
        mut self,
        email: Option<String>,
        phone: Option<String>,
        address: Option<String>,
        curp: Option<String>,
        rfc: Option<String>,
    ) -> Self {
        self.email = email;
        self.phone = phone;
        self.address = address;
        self.curp = curp.map(|value| value.to_uppercase());
        self.rfc = rfc.map(|value| value.to_uppercase());
        self
    }

    pub fn with_professional_licenses(mut self, professional_licenses: Vec<String>) -> Self {
        self.professional_licenses = professional_licenses;
        self
    }

    pub fn id(&self) -> &str {
        &self.id
    }

    pub fn first_name(&self) -> &str {
        &self.first_name
    }

    pub fn paternal_surname(&self) -> &str {
        &self.paternal_surname
    }

    pub fn maternal_surname(&self) -> &str {
        &self.maternal_surname
    }

    pub fn email(&self) -> Option<&str> {
        self.email.as_deref()
    }

    pub fn phone(&self) -> Option<&str> {
        self.phone.as_deref()
    }

    pub fn address(&self) -> Option<&str> {
        self.address.as_deref()
    }

    pub fn curp(&self) -> Option<&str> {
        self.curp.as_deref()
    }

    pub fn rfc(&self) -> Option<&str> {
        self.rfc.as_deref()
    }

    pub fn professional_licenses(&self) -> &[String] {
        &self.professional_licenses
    }
}
