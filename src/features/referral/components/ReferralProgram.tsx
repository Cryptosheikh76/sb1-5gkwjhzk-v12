```typescript
import { useState } from 'react';
import { useReferral } from '../hooks/useReferral';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Alert } from '../../../components/ui/Alert';
import { formatNumber } from '../../../utils/format';

export function ReferralProgram() {
  const [showInvite, setShowInvite] = useState(false);
  const { 
    referralCode,
    referralStats,
    generateReferralCode,
    copyReferralLink,
    loading,
    error 
  } = useReferral();

  const referralLink = `${window.location.origin}/join?ref=${referralCode}`;

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Your Referrals</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-surface-light p-4 rounded-lg">
            <p className="text-sm text-gray-400">Total Referrals</p>
            <p className="text-2xl font-bold">{referralStats.totalReferrals}</p>
          </div>
          <div className="bg-surface-light p-4 rounded-lg">
            <p className="text-sm text-gray-400">Active Users</p>
            <p className="text-2xl font-bold">{referralStats.activeUsers}</p>
          </div>
          <div className="bg-surface-light p-4 rounded-lg">
            <p className="text-sm text-gray-400">Earnings</p>
            <p className="text-2xl font-bold">{formatNumber(referralStats.earnings)} AGC</p>
          </div>
        </div>

        {!referralCode ? (
          <Button 
            onClick={generateReferralCode}
            loading={loading}
            fullWidth
          >
            Generate Referral Code
          </Button>
        ) : (
          <div className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={referralLink}
                readOnly
                className="flex-1"
              />
              <Button
                onClick={() => copyReferralLink(referralLink)}
                variant="secondary"
              >
                Copy
              </Button>
            </div>

            <Button
              onClick={() => setShowInvite(true)}
              variant="secondary"
              fullWidth
            >
              Invite Friends
            </Button>
          </div>
        )}

        {error && <Alert type="error" message={error} />}
      </Card>

      {showInvite && (
        <Card className="p-6">
          <h3 className="font-medium mb-4">Share Your Referral Link</h3>
          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={() => {
                window.open(`https://twitter.com/intent/tweet?text=Join%20me%20on%20SuperHub!%20${referralLink}`, '_blank');
              }}
              className="bg-[#1DA1F2] text-white"
            >
              Twitter
            </Button>
            <Button
              onClick={() => {
                window.open(`https://www.facebook.com/sharer/sharer.php?u=${referralLink}`, '_blank');
              }}
              className="bg-[#4267B2] text-white"
            >
              Facebook
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
```