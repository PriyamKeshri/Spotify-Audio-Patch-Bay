import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { useCreatePlaylist } from '../../hooks/usePlaylists';
import { useAuthStore } from '../../store/authStore';

interface CreatePlaylistModalProps {
  open: boolean;
  onClose: () => void;
}

export function CreatePlaylistModal({ open, onClose }: CreatePlaylistModalProps) {
  const [name, setName] = useState('');
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const { mutate: createPlaylist, isPending, error } = useCreatePlaylist(user?.id);

  const handleClose = () => {
    setName('');
    onClose();
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    createPlaylist(
      { name: trimmed },
      {
        onSuccess: (playlist) => {
          handleClose();
          navigate(`/playlist/${playlist.id}`);
        },
      }
    );
  };

  return (
    <Modal open={open} onClose={handleClose} title="New playlist">
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Playlist name"
          maxLength={100}
          className="w-full rounded-lg border border-console-700 bg-console-900 px-3 py-2 text-sm text-console-100 placeholder:text-console-500 focus:border-signal-500/50 focus:outline-none"
        />
        {error && <p className="text-xs text-alert-500">Couldn't create the playlist. Try again.</p>}
        <div className="flex justify-end gap-2">
          <Button type="button" variant="ghost" size="sm" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="sm" disabled={!name.trim() || isPending}>
            {isPending ? 'Creating…' : 'Create'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
