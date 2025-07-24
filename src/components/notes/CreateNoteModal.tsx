import { useState } from 'react';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription } from '../ui/alert';
import { PlusIcon, XIcon, SaveIcon } from 'lucide-react';
import { notesApi, Note } from '../../utils/notesApi';

interface CreateNoteModalProps {
    isOpen: boolean;
    onClose: () => void;
    applicationId: string;
    title?: string;
    content?: string;
    onNoteCreated: (note: Note) => void;
}

export function CreateNoteModal({ isOpen, onClose, applicationId, onNoteCreated }: CreateNoteModalProps) {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [tags, setTags] = useState<string[]>([]);
    const [currentTag, setCurrentTag] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleAddTag = () => {
        if (currentTag.trim() && !tags.includes(currentTag.trim().toLowerCase())) {
            setTags([...tags, currentTag.trim().toLowerCase()]);
            setCurrentTag('');
        }
    };

    const handleRemoveTag = (tagToRemove: string) => {
        setTags(tags.filter(tag => tag !== tagToRemove));
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddTag();
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!content.trim()) {
            setError('Note content is required');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            const newNote = await notesApi.createNote({
                applicationId,
                title: title.trim() || "",
                content: content.trim(),
                tags: tags.length > 0 ? tags : []
            });

            onNoteCreated(newNote);

            setTitle('');
            setContent('');
            setTags([]);
            setCurrentTag('');

            onClose();
        } catch (err) {
            setError('Failed to create note. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        if (!isLoading) {
            setTitle('');
            setContent('');
            setTags([]);
            setCurrentTag('');
            setError('');
            onClose();
        }
    };

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
        let hash = 0;
        for (let i = 0; i < tag.length; i++) {
            hash = tag.charCodeAt(i) + ((hash << 5) - hash);
        }
        const idx = Math.abs(hash) % tagColors.length;
        return tagColors[idx];
    }

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle className="flex items-center space-x-2">
                        <PlusIcon className="h-5 w-5" />
                        <span>Create New Note</span>
                    </DialogTitle>
                    <DialogDescription>
                        Add a note for this job application to track important information and reminders.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                        <Alert variant="destructive">
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="note-title">Title (Optional)</Label>
                        <Input
                            id="note-title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Enter a title for your note..."
                            disabled={isLoading}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="note-content">Content *</Label>
                        <Textarea
                            id="note-content"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Write your note here..."
                            rows={6}
                            disabled={isLoading}
                            required
                        />
                    </div>

                    <div className="space-y-3">
                        <Label htmlFor="note-tags">Tags</Label>
                        <div className="flex space-x-2">
                            <Input
                                id="note-tags"
                                value={currentTag}
                                onChange={(e) => setCurrentTag(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Add a tag..."
                                disabled={isLoading}
                            />
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleAddTag}
                                disabled={!currentTag.trim() || isLoading}
                            >
                                Add
                            </Button>
                        </div>

                        {tags.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {tags.map((tag) => (
                                    <Badge
                                        key={tag}
                                        variant="secondary"
                                        className={`flex items-center space-x-1 ${getTagColor(tag)}`}
                                    >
                                        <span>{tag}</span>
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveTag(tag)}
                                            disabled={isLoading}
                                            className="ml-1 hover:text-destructive"
                                        >
                                            <XIcon className="h-3 w-3" />
                                        </button>
                                    </Badge>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end space-x-3">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleClose}
                            disabled={isLoading}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isLoading || !content.trim()}
                        >
                            <SaveIcon className="h-4 w-4 mr-2" />
                            {isLoading ? 'Creating...' : 'Create Note'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}