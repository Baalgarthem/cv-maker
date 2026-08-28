use std::{error::Error, fmt::Display};

#[derive(Debug, Clone, PartialEq, Eq)]
pub enum DomainError {
    EmptyRequiredField(&'static str),
    InvalidSectionOrder,
}

impl Display for DomainError {
    fn fmt(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            Self::EmptyRequiredField(field) => write!(formatter, "el campo {field} es obligatorio"),
            Self::InvalidSectionOrder => write!(formatter, "el orden de secciones no es válido"),
        }
    }
}

impl Error for DomainError {}
