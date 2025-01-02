import { ProfileBio } from '../types';
import { Card } from '../../../components/ui/Card';

interface ProfileBioDisplayProps {
  data: ProfileBio;
}

export function ProfileBioDisplay({ data }: ProfileBioDisplayProps) {
  return (
    <Card className="space-y-4">
      {data.bio && (
        <div>
          <h3 className="text-sm font-medium text-gray-400">Bio</h3>
          <p className="mt-1">{data.bio}</p>
        </div>
      )}

      {data.location && (
        <div>
          <h3 className="text-sm font-medium text-gray-400">Location</h3>
          <p className="mt-1">{data.location}</p>
        </div>
      )}

      {Object.keys(data.socialLinks).length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-gray-400">Social Links</h3>
          <div className="mt-1 space-y-1">
            {data.socialLinks.twitter && (
              <a
                href={data.socialLinks.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:underline block"
              >
                Twitter
              </a>
            )}
            {data.socialLinks.instagram && (
              <a
                href={data.socialLinks.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:underline block"
              >
                Instagram
              </a>
            )}
            {data.socialLinks.website && (
              <a
                href={data.socialLinks.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:underline block"
              >
                Website
              </a>
            )}
          </div>
        </div>
      )}
    </Card>
  );
}