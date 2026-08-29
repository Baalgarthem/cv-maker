import { writeTextFile, readTextFile, mkdir, exists, BaseDirectory } from "@tauri-apps/plugin-fs";
import { save, open } from "@tauri-apps/plugin-dialog";
import { appDataDir, join } from "@tauri-apps/api/path";
import type { ResumeDocument, ProfileFolder } from "../../types/resume";

export interface MetadataExport {
  version: "1.0";
  timestamp: string;
  profileFolders: ProfileFolder[];
  documents: ResumeDocument[];
}

/**
 * Creates a silent background backup in the app's local data folder.
 */
export async function autoBackupMetadata(profileFolders: ProfileFolder[], documents: ResumeDocument[]) {
  try {
    const data: MetadataExport = {
      version: "1.0",
      timestamp: new Date().toISOString(),
      profileFolders,
      documents
    };
    
    // Using BaseDirectory.AppData which maps to C:\Users\<User>\AppData\Roaming\com.cv-maker.dev or similar
    const dirExists = await exists("backups", { baseDir: BaseDirectory.AppData });
    if (!dirExists) {
      await mkdir("backups", { baseDir: BaseDirectory.AppData, recursive: true });
    }
    
    const content = JSON.stringify(data, null, 2);
    await writeTextFile("backups/cv-maker-backup.json", content, { baseDir: BaseDirectory.AppData });
    
    console.log("Auto-backup successful");
  } catch (error) {
    console.error("Failed to auto-backup metadata:", error);
  }
}

/**
 * Triggers a manual export dialog for the user to save their data anywhere.
 */
export async function exportMetadataManual(profileFolders: ProfileFolder[], documents: ResumeDocument[]) {
  try {
    const data: MetadataExport = {
      version: "1.0",
      timestamp: new Date().toISOString(),
      profileFolders,
      documents
    };

    const filePath = await save({
      filters: [{ name: 'CV Maker Metadata', extensions: ['json'] }],
      defaultPath: 'cv-maker-export.json'
    });

    if (filePath) {
      const content = JSON.stringify(data, null, 2);
      // Since it's an absolute path from the dialog, we don't use baseDir
      await writeTextFile(filePath, content);
      alert("Metadatos exportados correctamente.");
    }
  } catch (error: any) {
    console.error("Failed to export metadata manually:", error);
    alert(`Hubo un error al exportar los metadatos: ${error.message || error}`);
  }
}

/**
 * Triggers a manual import dialog and returns the parsed metadata if valid.
 */
export async function importMetadataManual(): Promise<MetadataExport | null> {
  try {
    const filePath = await open({
      filters: [{ name: 'CV Maker Metadata', extensions: ['json'] }],
      multiple: false
    });

    if (filePath && typeof filePath === 'string') {
      const content = await readTextFile(filePath);
      const parsed = JSON.parse(content) as MetadataExport;
      
      if (parsed.version && parsed.documents && parsed.profileFolders) {
        return parsed;
      } else {
        alert("El archivo seleccionado no tiene el formato correcto de CV Maker.");
      }
    }
  } catch (error: any) {
    console.error("Failed to import metadata:", error);
    alert(`Hubo un error al importar los metadatos: ${error.message || error}`);
  }
  return null;
}
