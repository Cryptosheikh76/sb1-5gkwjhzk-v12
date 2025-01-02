import { useState } from 'react';
import { CyberSettingsIcon } from '../icons/CyberIcons';
import { Button } from './Button';
import { SettingsMenu } from './SettingsMenu';

interface SettingsButtonProps {
  className?: string;
}

export function SettingsButton({ className }: SettingsButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        variant="secondary"
        size="sm"
        className={className}
        onClick={() => setIsOpen(true)}
      >
        <CyberSettingsIcon className="w-5 h-5 hover-icon" />
      </Button>

      <SettingsMenu
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
}