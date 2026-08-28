use rusqlite::{Connection, Result};

const INITIAL_SCHEMA: &str = include_str!("../../migrations/001_initial.sql");

pub struct DatabaseMigrator;

impl DatabaseMigrator {
    pub fn migrate(connection: &Connection) -> Result<()> {
        connection.execute_batch(INITIAL_SCHEMA)
    }
}
