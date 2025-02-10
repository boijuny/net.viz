import { useEffect, useCallback } from 'react';

interface ShortcutConfig {
  key: string;
  ctrlKey?: boolean;
  metaKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  preventDefault?: boolean;
  action: () => void;
}

export function useKeyboardShortcuts(shortcuts: ShortcutConfig[]) {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      for (const shortcut of shortcuts) {
        const matchesKey = event.key.toLowerCase() === shortcut.key.toLowerCase();
        const matchesCtrl = shortcut.ctrlKey === undefined || event.ctrlKey === shortcut.ctrlKey;
        const matchesMeta = shortcut.metaKey === undefined || event.metaKey === shortcut.metaKey;
        const matchesShift = shortcut.shiftKey === undefined || event.shiftKey === shortcut.shiftKey;
        const matchesAlt = shortcut.altKey === undefined || event.altKey === shortcut.altKey;

        if (matchesKey && matchesCtrl && matchesMeta && matchesShift && matchesAlt) {
          if (shortcut.preventDefault !== false) {
            event.preventDefault();
          }
          shortcut.action();
          break;
        }
      }
    },
    [shortcuts]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);
}

// Example usage:
/*
useKeyboardShortcuts([
  {
    key: 'k',
    metaKey: true, // Command on Mac, Ctrl on Windows
    action: () => setCommandPaletteOpen(true),
  },
  {
    key: '/',
    action: () => focusSearch(),
    preventDefault: true,
  },
]);
*/ 