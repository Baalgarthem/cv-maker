use rusqlite::{params, Connection, OptionalExtension, Result};

use crate::{application::profile_service::ProfileRepository, domain::profile::Profile};

pub struct SqliteProfileRepository<'connection> {
    connection: &'connection Connection,
}

impl<'connection> SqliteProfileRepository<'connection> {
    pub fn new(connection: &'connection Connection) -> Self {
        Self { connection }
    }
}

impl ProfileRepository for SqliteProfileRepository<'_> {
    type Error = rusqlite::Error;

    fn save(&self, profile: &Profile) -> Result<()> {
        let transaction = self.connection.unchecked_transaction()?;
        transaction.execute(
            "INSERT INTO profiles (
                id, first_name, paternal_surname, maternal_surname,
                email, phone, address, curp, rfc
             ) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9)
             ON CONFLICT(id) DO UPDATE SET
                first_name = excluded.first_name,
                paternal_surname = excluded.paternal_surname,
                maternal_surname = excluded.maternal_surname,
                email = excluded.email,
                phone = excluded.phone,
                address = excluded.address,
                curp = excluded.curp,
                rfc = excluded.rfc,
                updated_at = CURRENT_TIMESTAMP",
            params![
                profile.id(),
                profile.first_name(),
                profile.paternal_surname(),
                profile.maternal_surname(),
                profile.email(),
                profile.phone(),
                profile.address(),
                profile.curp(),
                profile.rfc(),
            ],
        )?;

        transaction.execute(
            "DELETE FROM professional_licenses WHERE profile_id = ?1",
            [profile.id()],
        )?;
        for (sort_order, license_number) in profile.professional_licenses().iter().enumerate() {
            transaction.execute(
                "INSERT INTO professional_licenses (profile_id, license_number, sort_order)
                 VALUES (?1, ?2, ?3)",
                params![profile.id(), license_number, sort_order],
            )?;
        }

        transaction.commit()
    }

    fn find_by_id(&self, profile_id: &str) -> Result<Option<Profile>> {
        let profile = self
            .connection
            .query_row(
                "SELECT id, first_name, paternal_surname, maternal_surname,
                    email, phone, address, curp, rfc
             FROM profiles WHERE id = ?1",
                [profile_id],
                |row| {
                    let email: Option<String> = row.get(4)?;
                    let phone: Option<String> = row.get(5)?;
                    let address: Option<String> = row.get(6)?;
                    let curp: Option<String> = row.get(7)?;
                    let rfc: Option<String> = row.get(8)?;

                    Profile::new(
                        row.get::<_, String>(0)?,
                        row.get::<_, String>(1)?,
                        row.get::<_, String>(2)?,
                        row.get::<_, String>(3)?,
                    )
                    .map(|profile| profile.with_optional_fields(email, phone, address, curp, rfc))
                    .map_err(|error| {
                        rusqlite::Error::FromSqlConversionFailure(
                            0,
                            rusqlite::types::Type::Text,
                            Box::new(error),
                        )
                    })
                },
            )
            .optional()?;

        let Some(profile) = profile else {
            return Ok(None);
        };
        let mut statement = self.connection.prepare(
            "SELECT license_number FROM professional_licenses
             WHERE profile_id = ?1 ORDER BY sort_order",
        )?;
        let professional_licenses = statement
            .query_map([profile_id], |row| row.get::<_, String>(0))?
            .collect::<Result<Vec<_>>>()?;

        Ok(Some(
            profile.with_professional_licenses(professional_licenses),
        ))
    }
}
