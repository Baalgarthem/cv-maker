export interface Profile {
  id: string;
  firstName: string;
  paternalSurname: string;
  maternalSurname: string;
  email?: string;
  phone?: string;
  address?: string;
  curp?: string;
  rfc?: string;
  professionalLicenses?: string[];
  picture?: string;
  hasDrivingLicense?: boolean;
  drivingLicenseType?: string;
  drivingLicenseNumber?: string;
}

export interface WorkExperience {
  id: string;
  companyName: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  context: string;
  tags?: string[];
  activities: string[];
}

export interface Course {
  id: string;
  name: string;
  obtainedOn: string;
  credentialUrl?: string;
}

export interface PortfolioLink {
  id: string;
  kind: "portfolio" | "github" | "other";
  label: string;
  url: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  startDate: string;
  endDate?: string;
  isCurrent?: boolean;
}

export interface Language {
  id: string;
  name: string;
  level: string;
}

export type ResumeSectionId = "summary" | "experience" | "education" | "skills" | "languages" | "courses" | "portfolio";
export type ContactDisplayMode = "icons" | "text";
export type ProfileFrameStyle = "none" | "hexagon" | "top-bottom" | "circle" | "square";

export interface ResumeSection {
  id: ResumeSectionId;
  label: string;
  inBody: boolean;
  inSidebar?: boolean;
  page?: number;
}

export interface ResumeTheme {
  fontFamily: string;
  headingFontFamily: string;
  baseFontSize: number;
  sidebarFontSize?: number;
  headerContactFontSize?: number;
  mainHeadingSize?: number;
  sectionHeadingSize?: number;
  sectionSubheadingSize?: number;
  sidebarHeadingSize?: number;
  sidebarSubheadingSize?: number;
  sectionSpacing?: number;
  sidebarSectionSpacing?: number;
  showSummarySeparator?: boolean;
  accentColor: string;
  textColor: string;
  pageColor: string;
  sidebarPosition: "left" | "right";
  showProfilePicture: boolean;
  pictureFrameStyle: ProfileFrameStyle;
  pictureFrameWidth: number;
  pictureSize: number;
  pictureAlignment?: 'left' | 'center' | 'right';
  pageSize: "A4" | "LETTER";
}

export interface ResumeDocument {
  id: string;
  profileFolderId?: string;
  title: string;
  profile: Profile;
  professionalSummary: string;
  experiences: WorkExperience[];
  education: Education[];
  hardSkills: string;
  softSkills: string;
  languages: Language[];
  courses: Course[];
  portfolioLinks: PortfolioLink[];
  sections: ResumeSection[];
  templateId: string;
  contactDisplayMode: ContactDisplayMode;
  theme: ResumeTheme;
}

export interface ProfileFolder {
  id: string;
  name: string;
}
