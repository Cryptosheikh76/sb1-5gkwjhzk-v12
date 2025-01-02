import { useState } from 'react';
import { Card } from '../../../../components/ui/Card';
import { Button } from '../../../../components/ui/Button';
import { Input } from '../../../../components/ui/Input';

interface ChatRule {
  id: string;
  text: string;
}

export function ChatRules() {
  const [rules, setRules] = useState<ChatRule[]>([]);
  const [newRule, setNewRule] = useState('');

  const addRule = () => {
    if (!newRule.trim()) return;
    setRules([...rules, { id: crypto.randomUUID(), text: newRule }]);
    setNewRule('');
  };

  const removeRule = (id: string) => {
    setRules(rules.filter(rule => rule.id !== id));
  };

  return (
    <Card className="p-4 space-y-4">
      <h3 className="font-medium">Chat Rules</h3>
      
      <div className="flex gap-2">
        <Input
          value={newRule}
          onChange={(e) => setNewRule(e.target.value)}
          placeholder="Add a chat rule..."
        />
        <Button onClick={addRule}>Add</Button>
      </div>

      <div className="space-y-2">
        {rules.map(rule => (
          <div key={rule.id} className="flex justify-between items-center p-2 bg-zinc-800 rounded">
            <span>{rule.text}</span>
            <Button 
              variant="danger" 
              size="sm"
              onClick={() => removeRule(rule.id)}
            >
              Remove
            </Button>
          </div>
        ))}
      </div>
    </Card>
  );
}