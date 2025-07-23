import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { CreateNoteModal } from './CreateNoteModal';
import { PlusIcon, StickyNoteIcon, TrashIcon, CalendarIcon } from 'lucide-react';
import { notesApi, Note } from '../../utils/notesApi';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';

interface NotesSectionProps {
    applicationId: string;
    title?: string;
    description?: string;
    content?: string;
    className?: string;
    tags?: string[];
}

export function NotesSection({ applicationId, className = '' }: NotesSectionProps) {
    const [notes, setNotes] = useState<Note[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [error, setError] = useState('');
    const [noteIdToDelete, setNoteIdToDelete] = useState<string | null>(null);

    useEffect(() => {
        loadNotes();
    }, [applicationId]);

    const loadNotes = async () => {
        try {
            setIsLoading(true);
            const applicationNotes = await notesApi.getNotesByApplicationId(applicationId);
            setNotes(applicationNotes);
            setError('');
        } catch (err) {
            setError('Failed to load notes');
        } finally {
            setIsLoading(false);
        }
    };
    const handleNoteCreated = (newNote: Note) => {
        setNotes([newNote, ...notes]);
    };

    const handleDeleteNote = async (noteId: string) => {
        setError('');
        setNoteIdToDelete(noteId);
    };

    const confirmDeleteNote = async () => {
        if (!noteIdToDelete) return;
        try {
            await notesApi.deleteNote(noteIdToDelete);
            setNotes(notes.filter(note => String(note.id) !== String(noteIdToDelete)));
            setNoteIdToDelete(null);
            setError('');
        } catch (err) {
            setError('Failed to delete note');
            setNoteIdToDelete(null);
        }
    };

    const cancelDeleteNote = () => {
        setNoteIdToDelete(null);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Функция для выбора цвета на основе значения тега
    const tagColors = [
        "bg-blue-100 text-blue-800",
        "bg-green-100 text-green-800",
        "bg-yellow-100 text-yellow-800",
        "bg-pink-100 text-pink-800",
        "bg-purple-100 text-purple-800",
        "bg-orange-100 text-orange-800",
        "bg-teal-100 text-teal-800",
        "bg-red-100 text-red-800",
        "bg-indigo-100 text-indigo-800",
    ];
    function getTagColor(tag: string) {
        // Простая хеш-функция для выбора цвета по тегу
        let hash = 0;
        for (let i = 0; i < tag.length; i++) {
            hash = tag.charCodeAt(i) + ((hash << 5) - hash);
        }
        const idx = Math.abs(hash) % tagColors.length;
        return tagColors[idx];
    }

    if (isLoading) {
        return (
            <div className={`space-y-4 ${className}`}>
                <div className="flex items-center justify-between">
                    <h4 className="flex items-center space-x-2">
                        <StickyNoteIcon className="h-4 w-4" />
                        <span>Notes</span>
                    </h4>
                </div>
                <div className="text-sm text-muted-foreground">Loading notes...</div>
            </div>
        );
    }

    return (
        <div className={`space-y-4 ${className}`}>
            <div className="flex items-center justify-between">
                <h4 className="flex items-center space-x-2">
                    <StickyNoteIcon className="h-4 w-4" />
                    <span>Notes ({notes.length})</span>
                </h4>
                <Button
                    size="sm"
                    onClick={() => setIsCreateModalOpen(true)}
                    className="h-8"
                >
                    <PlusIcon className="h-4 w-4 mr-1" />
                    Create Note
                </Button>
            </div>

            {error && (
                <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
                    {error}
                </div>
            )}

            {notes.length === 0 ? (
                <Card className="border-dashed">
                    <CardContent className="p-6 text-center space-y-2">
                        <StickyNoteIcon className="h-8 w-8 text-muted-foreground mx-auto" />
                        <p className="text-sm text-muted-foreground">No notes yet</p>
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setIsCreateModalOpen(true)}
                        >
                            <PlusIcon className="h-4 w-4 mr-1" />
                            Add your first note
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-3">
                    {notes.map((note) => (
                        <Card key={note.id} className="relative group">
                            <CardHeader className="pb-2">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        {note.title && (
                                            <CardTitle className="text-base mb-1">{note.title}</CardTitle>
                                        )}
                                        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                                            <CalendarIcon className="h-3 w-3" />
                                            <span>{formatDate(note.createdAt)}</span>
                                            {note.updatedAt !== note.createdAt && (
                                                <span>(edited {formatDate(note.updatedAt)})</span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            className="h-6 w-6 p-0 text-red-600 hover:text-red-800"
                                            onClick={() => handleDeleteNote(note.id)}
                                        >
                                            <TrashIcon className="h-3 w-3" />
                                        </Button>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-0">
                                <p className="text-sm whitespace-pre-wrap break-words">{note.content}</p>

                                {note.tags && note.tags.length > 0 && (
                                    <>
                                        <Separator className="my-3" />
                                        <div className="flex flex-wrap gap-1">
                                            {note.tags.map((tag) => (
                                                <Badge
                                                    key={tag}
                                                    variant="outline"
                                                    className={`text-xs ${getTagColor(tag)}`}
                                                >
                                                    {tag}
                                                </Badge>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            <CreateNoteModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                applicationId={applicationId}
                onNoteCreated={handleNoteCreated}
            />

            {/* Confirm Delete Dialog */}
            <Dialog open={!!noteIdToDelete} onOpenChange={cancelDeleteNote}>
                <DialogContent className="max-w-sm">
                    <DialogHeader>
                        <DialogTitle>Delete Note?</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete this note? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex justify-end gap-2 mt-4">
                        <Button variant="outline" onClick={cancelDeleteNote}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={confirmDeleteNote}>
                            Delete
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}