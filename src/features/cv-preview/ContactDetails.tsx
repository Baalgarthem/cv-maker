import type { ContactDisplayMode, Profile } from "../../types/resume";

interface ContactDetailsProps {
  mode: ContactDisplayMode;
  profile: Profile;
}

export function ContactDetails({ mode, profile }: ContactDetailsProps) {
  const contacts: Array<{ kind: "email" | "phone" | "address" | "curp" | "rfc" | "license" | "driving"; label: string; value: string }> = [
    profile.email ? { kind: "email", label: "Correo", value: profile.email } : null,
    profile.phone ? { kind: "phone", label: "Teléfono", value: profile.phone } : null,
    profile.address ? { kind: "address", label: "Dirección", value: profile.address } : null,
    profile.curp ? { kind: "curp", label: "CURP", value: profile.curp } : null,
    profile.rfc ? { kind: "rfc", label: "RFC", value: profile.rfc } : null,
  ].filter(Boolean) as any;

  if (profile.professionalLicenses) {
    profile.professionalLicenses.forEach((license, i) => {
      const num = license.number?.trim();
      if (num) {
        const prefix = license.prefix?.trim() ? `${license.prefix.trim()} ` : "";
        contacts.push({ kind: "license", label: `Cédula${profile.professionalLicenses!.length > 1 ? ` ${i + 1}` : ""}`, value: `${prefix}${num}` });
      }
    });
  }

  if (profile.hasDrivingLicense) {
    const typeStr = profile.drivingLicenseType?.trim() ? `Tipo ${profile.drivingLicenseType.trim()}` : "";
    const numStr = profile.drivingLicenseNumber?.trim() ? ` - ${profile.drivingLicenseNumber.trim()}` : "";
    contacts.push({
      kind: "driving",
      label: "Licencia",
      value: `${typeStr}${numStr}`.trim() || "Vigente",
    });
  }

  if (contacts.length === 0) return null;

  return (
    <ul className={`resume-contact-list contact-mode-${mode}`}>
      {contacts.map((contact, idx) => (
        <li key={`${contact.kind}-${idx}`}>
          {mode === "icons" ? <ContactIcon kind={contact.kind} /> : <strong>{contact.label}:</strong>}
          <span>{contact.value}</span>
        </li>
      ))}
    </ul>
  );
}

function ContactIcon({ kind }: { kind: "email" | "phone" | "address" | "curp" | "rfc" | "license" | "driving" }) {
  const paths = {
    email: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m4 7 8 6 8-6" /></>,
    phone: <path d="M7 3H4a1 1 0 0 0-1 1c0 9.4 7.6 17 17 17a1 1 0 0 0 1-1v-3l-4-2-2 3c-4-1.5-7.5-5-9-9l3-2-2-4Z" />,
    address: <><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></>,
    curp: <><rect x="3" y="4" width="18" height="16" rx="2" /><circle cx="9" cy="10" r="3" /><path d="M4 18v-2a4 4 0 0 1 4-4h2a4 4 0 0 1 4 4v2" /><path d="M15 8h4" /><path d="M15 12h4" /><path d="M15 16h4" /></>,
    rfc: <><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M8 9h8" /><path d="M8 15h8" /></>,
    license: <><path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c3 3 9 3 12 0v-5" /></>,
    driving: <><path d="M14 16H9m10 0h3v-3.15a1 1 0 0 0-.84-.99L16 11l-2.7-3.6a2 2 0 0 0-1.6-.8H9.3a2 2 0 0 0-1.6.8L5 11l-5.16.86a1 1 0 0 0-.84.99V16h3m10 0a2 2 0 1 0 4 0 2 2 0 0 0-4 0zM5 16a2 2 0 1 0 4 0 2 2 0 0 0-4 0z" /></>,
  };

  return <svg className="contact-icon" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{paths[kind]}</svg>;
}
