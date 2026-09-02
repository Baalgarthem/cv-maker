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
  socialSecurity?: string;
  professionalLicenses?: { prefix?: string, number: string }[];
  picture?: string;
  hasDrivingLicense?: boolean;
  drivingLicensePrefix?: string;
  drivingLicenseType?: string;
  drivingLicenseValidity?: 'omit' | 'valid' | 'expired';
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
  institution?: string;
  obtainedOn?: string;
  credentialUrl?: string;
}

export interface PortfolioLink {
  id: string;
  icon?: string;
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
export type SectionLayoutStyle = "shrink" | "treemap" | "classic";
export type SidebarAcademicStyle = SectionLayoutStyle;
export type EducationDisplayMode = "classic" | "treemap";
export type ProfileFrameStyle = "none" | "hexagon" | "top-bottom" | "circle" | "square";

export interface ResumeSection {
  id: ResumeSectionId;
  label: string;
  inBody: boolean;
  inSidebar?: boolean;
  side?: "left" | "right";
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
  itemSpacing?: number;
  lineHeight?: number;
  pagePaddingVertical?: number; // In mm
  showSummarySeparator?: boolean;
  compactProfessionalProfile?: boolean;
  headerSeparatorStyle?: 'none' | 'solid' | 'dashed' | 'dotted';
  headerSeparatorThickness?: number;
  separatorColor?: string;
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
  educationDisplayMode?: EducationDisplayMode;
  sidebarAcademicStyle?: SectionLayoutStyle;
  mainSectionStyle?: SectionLayoutStyle;
  hideExperienceDates?: boolean;
  hideEducationDates?: boolean;
  hideCourseDates?: boolean;
  showPersonalDataSeparator?: boolean;
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
  templateVersion?: string;
  contactDisplayMode: ContactDisplayMode;
  educationDisplayMode?: EducationDisplayMode;
  sidebarAcademicStyle?: SectionLayoutStyle;
  mainSectionStyle?: SectionLayoutStyle;
  hideExperienceDates?: boolean;
  hideEducationDates?: boolean;
  hideCourseDates?: boolean;
  showPersonalDataSeparator?: boolean;
  theme: ResumeTheme;
}

export interface ProfileFolder {
  id: string;
  name: string;
}
