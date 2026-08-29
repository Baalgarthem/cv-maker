export function PortfolioIcon({ icon }: { icon?: string }) {
  if (!icon || icon === "none") return null;

  const style = { width: '1.2em', height: '1.2em', objectFit: 'contain' as const, flex: 'none', verticalAlign: 'middle' };

  if (icon === "github") {
    return (
      <svg style={style} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
      </svg>
    );
  }
  if (icon === "facebook") {
    return (
      <svg style={style} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/>
      </svg>
    );
  }
  if (icon === "instagram") {
    return (
      <svg style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
      </svg>
    );
  }
  if (icon === "drive") {
    return (
      <svg style={style} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M7.71 3.5L1.15 15l3.43 6 6.55-11.5M9.73 3.5l-3.43 6 8.57 15h6.85M11.45 15h12.55l-3.43-6H7.92"/>
      </svg>
    );
  }
  if (icon === "mega") {
    return (
      <svg style={style} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M3 6h3.42l5.58 8.82L17.58 6H21v12h-3v-7.66l-4.5 7.02h-3L6 10.34V18H3z"/>
      </svg>
    );
  }

  // Si es un icono personalizado (Data URL)
  if (icon.startsWith("data:")) {
    return <img src={icon} alt="Icono personalizado" style={style} />;
  }

  return null;
}
