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

  // Define common commands
  const commands: CommandItem[] = [
    {
      id: 'open-model',
      name: 'Open Model',
      shortcut: ['⌘', 'O'],
      icon: <FileCode className="w-4 h-4" />,
      category: 'model',
      action: () => navigate('/')
    },
    {
      id: 'toggle-layout',
      name: 'Toggle Layout Direction',
      shortcut: ['⌘', 'L'],
      icon: <Layout className="w-4 h-4" />,
      category: 'visualization',
      action: () => console.log('Toggle layout')
    },
    {
      id: 'toggle-layers',
      name: 'Toggle Layer Groups',
      shortcut: ['⌘', 'G'],
      icon: <Layers className="w-4 h-4" />,
      category: 'visualization',
      action: () => console.log('Toggle layers')
    },
    {
      id: 'open-settings',
      name: 'Open Settings',
      shortcut: ['⌘', ','],
      icon: <Settings className="w-4 h-4" />,
      category: 'tools',
      action: () => console.log('Open settings')
    },
  ];

  // Toggle the menu when ⌘K is pressed
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

  const runCommand = useCallback((command: CommandItem) => {
    setOpen(false);
    command.action();
  }, []);

  return (
    <>
      {/* Overlay */}
      {open && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Command Menu */}
      <Command.Dialog
        open={open}
        onOpenChange={setOpen}
        className={cn(
          'fixed top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50',
          'w-full max-w-[750px] rounded-xl bg-popover text-popover-foreground',
          'shadow-lg border overflow-hidden',
          'transition-all duration-100',
          open ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        )}
      >
        <div className="flex items-center border-b px-3">
          <Search className="w-4 h-4 mr-2 shrink-0 opacity-50" />
          <Command.Input 
            placeholder="Type a command or search..."
            className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>

        <Command.List className="max-h-[300px] overflow-y-auto overflow-x-hidden">
          <Command.Empty className="py-6 text-center text-sm">
            No commands found.
          </Command.Empty>

          {['navigation', 'model', 'visualization', 'tools'].map((category) => (
            <Command.Group key={category} heading={category.charAt(0).toUpperCase() + category.slice(1)}>
              {commands
                .filter((command) => command.category === category)
                .map((command) => (
                  <Command.Item
                    key={command.id}
                    onSelect={() => runCommand(command)}
                    className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 hover:bg-accent hover:text-accent-foreground"
                  >
                    {command.icon && (
                      <div className="mr-2 flex h-4 w-4 items-center justify-center">
                        {command.icon}
                      </div>
                    )}
                    <span>{command.name}</span>
                    {command.shortcut && (
                      <div className="ml-auto flex items-center gap-1">
                        {command.shortcut.map((key, i) => (
                          <kbd
                            key={i}
                            className={cn(
                              'pointer-events-none h-5 select-none items-center gap-1 rounded border bg-muted px-1.5',
                              'text-[10px] font-medium opacity-100 inline-flex ml-auto'
                            )}
                          >
                            {key}
                          </kbd>
                        ))}
                      </div>
                    )}
                  </Command.Item>
                ))}
            </Command.Group>
          ))}
        </Command.List>

        <div className="border-t p-2">
          <div className="flex items-center gap-2 text-xs text-muted-foreground px-2 py-1.5">
            <Wrench className="w-3 h-3" />
            <span>Tip: Press ⌘K to open, ↑↓ to navigate, ↵ to select, esc to close</span>
          </div>
        </div>
      </Command.Dialog>
    </>
  );
} 