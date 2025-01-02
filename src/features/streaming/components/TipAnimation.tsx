```typescript
import { motion, AnimatePresence } from 'framer-motion';
import { formatNumber } from '../../../utils/format';

interface TipAnimationProps {
  tip: {
    id: string;
    amount: string;
    senderName: string;
  };
}

export function TipAnimation({ tip }: TipAnimationProps) {
  return (
    <AnimatePresence>
      <motion.div
        key={tip.id}
        initial={{ x: '100%', opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: '-100%', opacity: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="fixed bottom-24 right-4 bg-gradient-to-r from-primary to-secondary p-4 rounded-lg shadow-lg text-black"
      >
        <p className="font-bold">{tip.senderName}</p>
        <p className="text-sm">sent {formatNumber(tip.amount)} AGC</p>
      </motion.div>
    </AnimatePresence>
  );
}
```