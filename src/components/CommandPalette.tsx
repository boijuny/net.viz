import React, { useCallback, useEffect, useState } from 'react';
import { Command } from 'cmdk';
import { Search, Settings, FileCode, Layout, Layers, Wrench } from 'lucide-react';
import { cn } from '../lib/utils';
import { useNavigate } from 'react-router-dom';

interface CommandItem {
  id: string;
  name: string;
  shortcut?: string[];
  icon?: React.ReactNode;
  category: 'model' | 'visualization' | 'tools' | 'navigation';
  action: () => void;
}

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const commands: CommandItem[] = [
    {
      id: 'home',
      name: 'Go to Home',
      category: 'navigation',
      icon: <Layout className="w-4 h-4" />,
      action: () => navigate('/')
    },
    {
      id: 'viewer',
      name: 'Open Model Viewer',
      category: 'model',
      icon: <Layers className="w-4 h-4" />,
      action: () => navigate('/viewer')
    },
    {
      id: 'zoo',
      name: 'Browse Model Zoo',
      category: 'model',
      icon: <FileCode className="w-4 h-4" />,
      action: () => navigate('/zoo')
    },
    {
      id: 'settings',
      name: 'Open Settings',
      category: 'tools',
      icon: <Settings className="w-4 h-4" />,
      shortcut: ['⌘', ','],
      action: () => navigate('/settings')
    }
  ];

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const runCommand = useCallback((command: () => void) => {
    setOpen(false);
    command();
  }, []);

  return (
    <Command.Dialog
      open={open}
      onOpenChange={setOpen}
      className={cn(
        'fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-w-[450px] w-full',
        'bg-background border rounded-lg shadow-lg'
      )}
    >
      <div className="flex items-center border-b px-3">
        <Search className="w-4 h-4 text-muted-foreground" />
        <Command.Input
          placeholder="Type a command or search..."
          className="flex h-11 w-full rounded-md bg-transparent py-3 px-2 text-sm outline-none"
        />
      </div>

      <Command.List className="max-h-[300px] overflow-y-auto p-2">
        <Command.Empty>No results found.</Command.Empty>

        {['navigation', 'model', 'tools'].map((category) => (
          <Command.Group key={category} heading={category.charAt(0).toUpperCase() + category.slice(1)}>
            {commands
              .filter((cmd) => cmd.category === category)
              .map((cmd) => (
                <Command.Item
                  key={cmd.id}
                  onSelect={() => runCommand(cmd.action)}
                  className="flex items-center gap-2 px-2 py-1.5 text-sm rounded-sm hover:bg-accent"
                >
                  {cmd.icon}
                  <span>{cmd.name}</span>
                  {cmd.shortcut && (
                    <span className="ml-auto flex gap-1">
                      {cmd.shortcut.map((key) => (
                        <kbd
                          key={key}
                          className="px-1.5 py-0.5 text-xs border rounded-md bg-muted"
                        >
                          {key}
                        </kbd>
                      ))}
                    </span>
                  )}
                </Command.Item>
              ))}
          </Command.Group>
        ))}
        
        <div className="border-t p-2">
          <div className="flex items-center gap-2 text-xs text-muted-foreground px-2 py-1.5">
            <Wrench className="w-3 h-3" />
            <span>Tip: Press ⌘K to open, ↑↓ to navigate, ↵ to select, esc to close</span>
          </div>
        </div>
      </Command.List>
    </Command.Dialog>
  );
}