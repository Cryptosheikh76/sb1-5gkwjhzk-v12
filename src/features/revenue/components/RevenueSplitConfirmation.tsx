import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { RevenueShare } from '../types';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { useAuth } from '../../../hooks/useAuth';

interface RevenueSplitConfirmationProps {
  contentId: string;
  onConfirm?: () => void;
}

export function RevenueSplitConfirmation({ contentId, onConfirm }: RevenueSplitConfirmationProps) {
  const [shares, setShares] = useState<RevenueShare[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchShares = async () => {
      const { data } = await supabase
        .from('revenue_shares')
        .select(`
          *,
          creator:users(username)
        `)
        .eq('content_id', contentId);

      if (data) setShares(data as RevenueShare[]);
      setLoading(false);
    };

    fetchShares();
  }, [contentId]);

  const handleConfirm = async () => {
    if (!user) return;

    const { error } = await supabase
      .from('revenue_shares')
      .update({ is_confirmed: true })
      .eq('content_id', contentId)
      .eq('creator_id', user.id);

    if (!error) onConfirm?.();
  };

  if (loading) return null;

  const userShare = shares.find(share => share.creatorId === user?.id);
  if (!userShare || userShare.isConfirmed) return null;

  return (
    <Card className="p-4 space-y-4">
      <h3 className="font-medium">Confirm Revenue Split</h3>
      
      <div className="space-y-2">
        {shares.map(share => (
          <div key={share.id} className="flex justify-between items-center">
            <span>{share.creator?.username}</span>
            <span>{share.sharePercentage}%</span>
          </div>
        ))}
      </div>

      <div className="text-sm text-gray-400">
        * After 20% platform fee
      </div>

      <Button onClick={handleConfirm} fullWidth>
        Confirm Split
      </Button>
    </Card>
  );
}