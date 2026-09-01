import { useState } from "react";
import { useTranslation } from "../../i18n/LanguageContext";
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
  changeDocumentFolder: (docId: string, newFolderId: string) => void;
  renameDocument: (docId: string, newTitle: string) => void;
}

export function ProfileManager({
  profileFolders,
  documents,
  activeDocId,
  setActiveDocId,
  createFolder,
  createDocument,
  duplicateDocument,
  deleteDocument,
  changeDocumentFolder,
  renameDocument
}: ProfileManagerProps) {
  const { t } = useTranslation();
  const [newFolderName, setNewFolderName] = useState("");
  const [draggingDocId, setDraggingDocId] = useState<string | null>(null);
  const [dragOverFolderId, setDragOverFolderId] = useState<string | null>(null);
  const [editingDocId, setEditingDocId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");

  const saveRename = (docId: string) => {
    if (editingTitle.trim()) {
      renameDocument(docId, editingTitle.trim());
    }
    setEditingDocId(null);
  };
  
  return (
    <section className="control-group" aria-labelledby="profile-title">
      <div className="control-heading">
        <span>00</span>
        <h2 id="profile-title">{t("profilesTab")}</h2>
      </div>
      
      <div className="folders-list">
        {profileFolders.map(folder => {
          const folderDocs = documents.filter(d => d.profileFolderId === folder.id);
          const isDragTarget = dragOverFolderId === folder.id;
          
          return (
            <div 
              key={folder.id} 
              onDragOver={(e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = "move";
                if (dragOverFolderId !== folder.id) setDragOverFolderId(folder.id);
              }}
              onDragLeave={(e) => {
                if (e.currentTarget.contains(e.relatedTarget as Node)) return;
                if (dragOverFolderId === folder.id) setDragOverFolderId(null);
              }}
              onDrop={(e) => {
                e.preventDefault();
                setDragOverFolderId(null);
                setDraggingDocId(null);
                const droppedDocId = e.dataTransfer.getData("text/plain");
                if (droppedDocId) {
                  changeDocumentFolder(droppedDocId, folder.id);
                }
              }}
              style={{ 
                marginBottom: '16px',
                padding: '8px',
                borderRadius: '8px',
                border: isDragTarget ? '2px dashed var(--accent-color, #9a6b35)' : '2px dashed transparent',
                background: isDragTarget ? 'rgba(154, 107, 53, 0.08)' : 'transparent',
                transition: 'all 0.15s ease'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <strong style={{ fontSize: '0.85rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  📁 {folder.name}
                </strong>
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
                  <div 
                    style={{ 
                      padding: '14px 8px', 
                      borderRadius: '6px', 
                      border: '1px dashed #cbd5e1', 
                      textAlign: 'center', 
                      color: '#94a3b8', 
                      fontSize: '0.78rem',
                      background: isDragTarget ? 'rgba(154, 107, 53, 0.12)' : '#ffffff55'
                    }}
                  >
                    {isDragTarget ? "Soltar aquí para mover" : t("emptyFolderDrop")}
                  </div>
                ) : (
                  folderDocs.map(doc => {
                    const isEditing = editingDocId === doc.id;
                    const isDragging = draggingDocId === doc.id;

                    return (
                      <div 
                        key={doc.id} 
                        draggable={!isEditing}
                        onDragStart={(e) => {
                          e.dataTransfer.setData("text/plain", doc.id);
                          e.dataTransfer.effectAllowed = "move";
                          setDraggingDocId(doc.id);
                        }}
                        onDragEnd={() => {
                          setDraggingDocId(null);
                          setDragOverFolderId(null);
                        }}
                        className={`template-card ${doc.id === activeDocId ? 'is-selected' : ''}`}
                        onClick={() => {
                          if (!isEditing) setActiveDocId(doc.id);
                        }}
                        style={{ 
                          cursor: isEditing ? 'text' : 'grab', 
                          padding: '10px 12px', 
                          minHeight: 'auto', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'space-between',
                          opacity: isDragging ? 0.35 : 1,
                          transform: isDragging ? 'scale(0.98)' : 'none',
                          transition: 'opacity 0.15s, transform 0.15s'
                        }}
                      >
                        {isEditing ? (
                          <input 
                            type="text"
                            value={editingTitle}
                            autoFocus
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e) => setEditingTitle(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                saveRename(doc.id);
                              } else if (e.key === 'Escape') {
                                setEditingDocId(null);
                              }
                            }}
                            onBlur={() => saveRename(doc.id)}
                            style={{ 
                              fontSize: '0.85rem', 
                              padding: '2px 6px', 
                              borderRadius: '4px', 
                              border: '1px solid var(--accent-color, #17243b)', 
                              width: '100%',
                              fontWeight: 600
                            }}
                          />
                        ) : (
                          <strong 
                            onDoubleClick={(e) => {
                              e.stopPropagation();
                              setEditingDocId(doc.id);
                              setEditingTitle(doc.title);
                            }}
                            title="Doble clic para renombrar"
                            style={{ fontSize: '0.85rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', flex: 1, marginRight: '6px' }}
                          >
                            📄 {doc.title}
                          </strong>
                        )}
                        
                        {doc.id === activeDocId && !isEditing && (
                          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                            <button 
                              className="text-button"
                              title="Renombrar CV"
                              style={{ padding: 0, minWidth: 'auto', fontSize: '0.75rem', color: '#64748b' }}
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingDocId(doc.id);
                                setEditingTitle(doc.title);
                              }}
                            >
                              {t("rename")}
                            </button>
                            <button 
                              className="text-button"
                              style={{ padding: 0, minWidth: 'auto', fontSize: '0.75rem', color: 'var(--accent-color)' }}
                              onClick={(e) => {
                                e.stopPropagation();
                                const title = prompt("Nombre del CV duplicado", `${doc.title} (Copia)`);
                                if (title) duplicateDocument(doc.id, title, folder.id);
                              }}
                            >
                              {t("duplicate")}
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
                                {t("delete")}
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })
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
          placeholder={t("newFolder")}
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
          {t("addFolder")}
        </button>
      </div>
    </section>
  );
}


