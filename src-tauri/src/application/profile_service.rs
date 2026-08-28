use crate::domain::profile::Profile;

pub trait ProfileRepository {
    type Error;

    fn save(&self, profile: &Profile) -> Result<(), Self::Error>;
    fn find_by_id(&self, profile_id: &str) -> Result<Option<Profile>, Self::Error>;
}

pub struct ProfileService<R: ProfileRepository> {
    repository: R,
}

impl<R: ProfileRepository> ProfileService<R> {
    pub fn new(repository: R) -> Self {
        Self { repository }
    }

    pub fn save_profile(&self, profile: &Profile) -> Result<(), R::Error> {
        self.repository.save(profile)
    }

    pub fn get_profile(&self, profile_id: &str) -> Result<Option<Profile>, R::Error> {
        self.repository.find_by_id(profile_id)
    }
}
