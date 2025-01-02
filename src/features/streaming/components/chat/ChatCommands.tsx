import { useState } from 'react';
import { Card } from '../../../../components/ui/Card';
import { Input } from '../../../../components/ui/Input';
import { Button } from '../../../../components/ui/Button';

interface ChatCommand {
  id: string;
  command: string;
  response: string;
}

export function ChatCommands() {
  const [commands, setCommands] = useState<ChatCommand[]>([]);
  const [newCommand, setNewCommand] = useState({ command: '', response: '' });

  const addCommand = () => {
    if (!newCommand.command || !newCommand.response) return;
    
    setCommands([
      ...commands,
      { ...newCommand, id: crypto.randomUUID() }
    ]);
    
    setNewCommand({ command: '', response: '' });
  };

  const removeCommand = (id: string) => {
    setCommands(commands.filter(cmd => cmd.id !== id));
  };

  return (
    <Card className="p-4 space-y-4">
      <h3 className="font-medium">Chat Commands</h3>

      <div className="space-y-2">
        <Input
          value={newCommand.command}
          onChange={(e) => setNewCommand({ ...newCommand, command: e.target.value })}
          placeholder="Command (e.g., !discord)"
        />
        <Input
          value={newCommand.response}
          onChange={(e) => setNewCommand({ ...newCommand, response: e.target.value })}
          placeholder="Response"
        />
        <Button onClick={addCommand} fullWidth>Add Command</Button>
      </div>

      <div className="space-y-2">
        {commands.map(cmd => (
          <div key={cmd.id} className="p-2 bg-zinc-800 rounded">
            <div className="flex justify-between items-center mb-1">
              <code className="text-sm font-mono">{cmd.command}</code>
              <Button 
                variant="danger" 
                size="sm"
                onClick={() => removeCommand(cmd.id)}
              >
                Remove
              </Button>
            </div>
            <p className="text-sm text-gray-400">{cmd.response}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}