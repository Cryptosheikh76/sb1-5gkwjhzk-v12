import { useState } from 'react';
import { useProfileBio } from '../hooks/useProfileBio';
import { ProfileBio } from '../types';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Alert } from '../../../components/ui/Alert';

interface ProfileBioFormProps {
  initialData?: ProfileBio;
  onSave?: () => void;
}

export function ProfileBioForm({ initialData, onSave }: ProfileBioFormProps) {
  const [bio, setBio] = useState(initialData?.bio || '');
  const [location, setLocation] = useState(initialData?.location || '');
  const [socialLinks, setSocialLinks] = useState(initialData?.socialLinks || {});
  const { updateProfile, loading, error } = useProfileBio();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await updateProfile({
        bio,
        location,
        social_links: socialLinks
      });
      onSave?.();
    } catch (error) {
      // Error is handled by the hook
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        as="textarea"
        label="Bio"
        value={bio}
        onChange={(e) => setBio(e.target.value)}
        placeholder="Tell us about yourself..."
        rows={4}
      />

      <Input
        label="Location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        placeholder="Where are you based?"
      />

      <div className="space-y-2">
        <h3 className="text-sm font-medium">Social Links</h3>
        <Input
          placeholder="Twitter URL"
          value={socialLinks.twitter || ''}
          onChange={(e) => setSocialLinks(prev => ({
            ...prev,
            twitter: e.target.value
          }))}
        />
        <Input
          placeholder="Instagram URL"
          value={socialLinks.instagram || ''}
          onChange={(e) => setSocialLinks(prev => ({
            ...prev,
            instagram: e.target.value
          }))}
        />
        <Input
          placeholder="Website URL"
          value={socialLinks.website || ''}
          onChange={(e) => setSocialLinks(prev => ({
            ...prev,
            website: e.target.value
          }))}
        />
      </div>

      {error && <Alert type="error" message={error} />}

      <Button
        type="submit"
        disabled={loading}
        loading={loading}
      >
        Save Profile
      </Button>
    </form>
  );
}