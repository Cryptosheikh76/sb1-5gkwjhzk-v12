```typescript
import { useState } from 'react';
import { useAuth } from '../../auth/components/AuthProvider';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { supabase } from '../../../lib/supabase';

export function ProfileEditor() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [avatar, setAvatar] = useState<File | null>(null);
  const [bio, setBio] = useState(user?.bio || '');
  const [links, setLinks] = useState(user?.social_links || {});

  if (!user) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Upload avatar if changed
      let avatar_url = user.avatar_url;
      if (avatar) {
        const { data: fileData } = await supabase.storage
          .from('avatars')
          .upload(`${user.id}/${Date.now()}`, avatar);
        
        if (fileData) {
          avatar_url = fileData.path;
        }
      }

      // Update profile
      await supabase
        .from('users')
        .update({
          avatar_url,
          bio,
          social_links: links
        })
        .eq('id', user.id);

    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2">Profile Picture</label>
        <input
          type="file"
          accept="image/*"
          onChange={e => setAvatar(e.target.files?.[0] || null)}
          className="w-full"
        />
      </div>

      <Input
        label="Bio"
        value={bio}
        onChange={e => setBio(e.target.value)}
        as="textarea"
        rows={4}
      />

      <div className="space-y-2">
        <h3 className="text-sm font-medium">Social Links</h3>
        <Input
          placeholder="Twitter URL"
          value={links.twitter || ''}
          onChange={e => setLinks({ ...links, twitter: e.target.value })}
        />
        <Input
          placeholder="Instagram URL"
          value={links.instagram || ''}
          onChange={e => setLinks({ ...links, instagram: e.target.value })}
        />
      </div>

      <Button type="submit" loading={loading} fullWidth>
        Save Changes
      </Button>
    </form>
  );
}
```