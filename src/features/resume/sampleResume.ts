import type { ResumeDocument } from "../../types/resume";

export const sampleResume: ResumeDocument = {
  id: "sample-resume-id",
  title: "CV Principal",
  profileFolderId: "default-folder",
  profile: {
    id: "sample-profile",
    firstName: "María",
    paternalSurname: "Fernández",
    maternalSurname: "López",
    email: "maria.fernandez@example.com",
    phone: "+52 55 1234 5678",
    address: "Ciudad de México, México",
  },
  professionalSummary:
    "Profesional orientada a resultados, con experiencia coordinando proyectos y transformando necesidades complejas en soluciones claras.",
  experiences: [
    {
      id: "sample-experience",
      companyName: "Empresa de ejemplo",
      startDate: "2022-01",
      isCurrent: true,
      context: "Coordinación de proyectos y mejora de procesos.",
      activities: [
        "Planificación y seguimiento de iniciativas estratégicas.",
        "Documentación de procesos y coordinación con equipos multidisciplinarios.",
      ],
    },
  ],
  education: [
    {
      id: "edu-1",
      institution: "Universidad Nacional",
      degree: "Licenciatura en Diseño y Desarrollo",
      startDate: "2015",
      endDate: "2019",
    }
  ],
  hardSkills: "HTML, CSS, JavaScript, React, Node.js, SQL, Diseño UI/UX, Git",
  softSkills: "Trabajo en equipo, Comunicación efectiva, Liderazgo, Gestión de tiempo, Adaptabilidad",
  languages: [
    {
      id: "lang-1",
      name: "Inglés",
      level: "Avanzado (C1)",
    }
  ],
  courses: [
    { id: "c1", name: "Arquitectura de Software Orientada a Eventos", obtainedOn: "Octubre 2021" },
    { id: "c2", name: "Diseño de Interfaces Accesibles", obtainedOn: "Mayo 2020" },
  ],
  portfolioLinks: [
    { id: "l1", icon: "none", label: "Portafolio", url: "https://janedoe.design" },
    { id: "l2", icon: "github", label: "GitHub", url: "github.com/janedoe" },
  ],
  sections: [
    { id: "summary", label: "Perfil profesional", inBody: true },
    { id: "experience", label: "Experiencia profesional", inBody: true },
    { id: "education", label: "Formación académica", inBody: true },
    { id: "skills", label: "Habilidades y competencias", inBody: true },
    { id: "languages", label: "Idiomas", inBody: false, inSidebar: true },
    { id: "courses", label: "Cursos y formación", inBody: false, inSidebar: true },
    { id: "portfolio", label: "Portafolio", inBody: false, inSidebar: true },
  ],
  templateId: "oxford",
  contactDisplayMode: "icons",
  theme: {
    fontFamily: '"Segoe UI", sans-serif',
    headingFontFamily: 'Georgia, "Times New Roman", serif',
    baseFontSize: 10.5,
    mainHeadingSize: 26,
    sectionHeadingSize: 13,
    accentColor: "#9a6b35",
    textColor: "#202733",
    pageColor: "#ffffff",
    sidebarPosition: "left",
    showProfilePicture: true,
    pictureFrameStyle: "circle",
    pictureFrameWidth: 2,
    pictureSize: 32,
    pageSize: "A4",
  },
};
