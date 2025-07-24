import { apiRequest } from './api';

export interface Note {
  id: string;
  applicationId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  title?: string;
  tags?: string[];
}

export const notesApi = {
  async getNotesByApplicationId(applicationId: string): Promise<Note[]> {
    const data = await apiRequest(`/notes?applicationId=${encodeURIComponent(applicationId)}`);
    return data.map((note: any) => ({
      id: note.id?.toString(),
      applicationId: note.applicationId?.toString(),
      content: note.content,
      createdAt: note.createdAt,
      updatedAt: note.updatedAt,
      title: note.title || '',
      tags: Array.isArray(note.tags)
        ? note.tags
        : (typeof note.tags === 'string' && note.tags.length > 0
            ? note.tags.split(',').map((tag: string) => tag.trim())
            : []),
    }));
  },

  async createNote(noteData: { applicationId: string; content: string, title: string, tags: string[] }): Promise<Note> {
    const payload = {
      applicationId: Number(noteData.applicationId),
      content: noteData.content,
      title: noteData.title,
      tags: noteData.tags,
    };
    const note = await apiRequest('/notes', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    return {
      id: note.id?.toString(),
      applicationId: note.applicationId?.toString(),
      content: note.content,
      createdAt: note.createdAt,
      updatedAt: note.updatedAt,
      title: note.title || '',
      tags: note.tags || [],
    };
  },

  async deleteNote(id: string): Promise<void> {
    await apiRequest(`/notes/${id}`, {
      method: 'DELETE',
    });
  },
};