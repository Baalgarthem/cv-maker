PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS profiles (
    id TEXT PRIMARY KEY,
    first_name TEXT NOT NULL,
    paternal_surname TEXT NOT NULL,
    maternal_surname TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    address TEXT,
    curp TEXT,
    rfc TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS professional_licenses (
    profile_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    license_number TEXT NOT NULL,
    sort_order INTEGER NOT NULL DEFAULT 0,
    PRIMARY KEY (profile_id, license_number)
);

CREATE TABLE IF NOT EXISTS work_experiences (
    id TEXT PRIMARY KEY,
    profile_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    company_name TEXT NOT NULL,
    start_date TEXT NOT NULL,
    end_date TEXT,
    is_current INTEGER NOT NULL DEFAULT 0 CHECK (is_current IN (0, 1)),
    context TEXT NOT NULL DEFAULT '',
    sort_order INTEGER NOT NULL DEFAULT 0,
    CHECK (is_current = 1 OR end_date IS NOT NULL)
);

CREATE TABLE IF NOT EXISTS work_activities (
    id TEXT PRIMARY KEY,
    experience_id TEXT NOT NULL REFERENCES work_experiences(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS courses (
    id TEXT PRIMARY KEY,
    profile_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    obtained_on TEXT NOT NULL,
    credential_url TEXT,
    sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS portfolio_links (
    id TEXT PRIMARY KEY,
    profile_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    kind TEXT NOT NULL CHECK (kind IN ('portfolio', 'github', 'other')),
    label TEXT NOT NULL,
    url TEXT NOT NULL,
    sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS resumes (
    id TEXT PRIMARY KEY,
    profile_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    template_id TEXT NOT NULL DEFAULT 'oxford',
    accent_color TEXT NOT NULL DEFAULT '#17243b',
    theme_json TEXT NOT NULL DEFAULT '{}',
    section_order_json TEXT NOT NULL DEFAULT '[]',
    contact_display_mode TEXT NOT NULL DEFAULT 'icons' CHECK (contact_display_mode IN ('icons', 'text')),
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS resume_items (
    resume_id TEXT NOT NULL REFERENCES resumes(id) ON DELETE CASCADE,
    item_type TEXT NOT NULL CHECK (item_type IN ('experience', 'course', 'portfolio_link')),
    item_id TEXT NOT NULL,
    sort_order INTEGER NOT NULL DEFAULT 0,
    is_visible INTEGER NOT NULL DEFAULT 1 CHECK (is_visible IN (0, 1)),
    PRIMARY KEY (resume_id, item_type, item_id)
);

CREATE INDEX IF NOT EXISTS idx_experiences_profile ON work_experiences(profile_id);
CREATE INDEX IF NOT EXISTS idx_courses_profile ON courses(profile_id);
CREATE INDEX IF NOT EXISTS idx_links_profile ON portfolio_links(profile_id);
