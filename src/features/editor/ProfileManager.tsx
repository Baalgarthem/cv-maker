import { useState } from "react";
import type { ResumeDocument, ProfileFolder } from "../../types/resume";

interface ProfileManagerProps {
  profileFolders: ProfileFolder[];
  documents: ResumeDocument[];
  activeDocId: string;
  setActiveDocId: (id: string) => void;
  createFolder: (name: string) => void;
  createDocument: (title: string, folderId: string) => void;
  duplicateDocument: (docId: string, newTitle: string, folderId: string) => void;
  deleteDocument: (id: string) => void;
}

export function ProfileManager({
  profileFolders,
  documents,
  activeDocId,
  setActiveDocId,
  createFolder,
  createDocument,
  duplicateDocument,
  deleteDocument
}: ProfileManagerProps) {
  const [newFolderName, setNewFolderName] = useState("");
  
  return (
    <section className="control-group" aria-labelledby="profile-title">
      <div className="control-heading">
        <span>00</span>
        <h2 id="profile-title">Perfiles</h2>
      </div>
      
      <div className="folders-list">
        {profileFolders.map(folder => {
          const folderDocs = documents.filter(d => d.profileFolderId === folder.id);
          
          return (
            <div key={folder.id} style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <strong style={{ fontSize: '0.85rem', color: '#94a3b8' }}>{folder.name}</strong>
                <button 
                  className="text-button" 
                  style={{ fontSize: '0.75rem', padding: '0 4px' }}
                  onClick={() => {
                    const title = prompt(`Nuevo CV en ${folder.name}`);
                    if (title) createDocument(title, folder.id);
                  }}
                >
                  + CV
                </button>
              </div>
              
              <div className="template-list" style={{ gap: '6px' }}>
                {folderDocs.length === 0 ? (
                  <p className="future-note">Carpeta vacía</p>
                ) : (
                  folderDocs.map(doc => (
                    <div 
                      key={doc.id} 
                      className={`template-card ${doc.id === activeDocId ? 'is-selected' : ''}`}
                      onClick={() => setActiveDocId(doc.id)}
                      style={{ cursor: 'pointer', padding: '10px 12px', minHeight: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                    >
                      <strong style={{ fontSize: '0.85rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {doc.title}
                      </strong>
                      
                      {doc.id === activeDocId && (
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button 
                            className="text-button"
                            style={{ padding: 0, minWidth: 'auto', fontSize: '0.75rem', color: 'var(--accent-color)' }}
                            onClick={(e) => {
                              e.stopPropagation();
                              const title = prompt("Nombre del CV duplicado", `${doc.title} (Copia)`);
                              if (title) duplicateDocument(doc.id, title, folder.id);
                            }}
                          >
                            Duplicar
                          </button>
                          {documents.length > 1 && (
                            <button 
                              className="text-button"
                              style={{ padding: 0, minWidth: 'auto', fontSize: '0.75rem', color: '#ef4444' }}
                              onClick={(e) => {
                                e.stopPropagation();
                                if (confirm(`¿Eliminar permanentemente "${doc.title}"?`)) deleteDocument(doc.id);
                              }}
                            >
                              Eliminar
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
      
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <input 
          type="text" 
          className="design-input"
          value={newFolderName}
          onChange={e => setNewFolderName(e.target.value)}
          placeholder="Nuevo perfil..."
          style={{ flex: 1 }}
          onKeyDown={e => {
            if (e.key === 'Enter' && newFolderName.trim()) {
              createFolder(newFolderName.trim());
              setNewFolderName("");
            }
          }}
        />
        <button 
          className="text-button" 
          onClick={() => {
            if (newFolderName.trim()) {
              createFolder(newFolderName.trim());
              setNewFolderName("");
            }
          }}
        >
          Añadir
        </button>
      </div>
    </section>
  );
}
