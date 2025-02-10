import * as React from 'react'
import { cn } from "../../lib/utils"

interface CollapsibleContextType {
  isOpen: boolean;
  toggle: () => void;
}

const CollapsibleContext = React.createContext<CollapsibleContextType | undefined>(undefined);

interface CollapsibleProps {
  children: React.ReactNode;
  defaultOpen?: boolean;
  className?: string;
}

const Collapsible = ({ children, defaultOpen = false, className }: CollapsibleProps) => {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);
  
  return (
    <CollapsibleContext.Provider value={{ isOpen, toggle: () => setIsOpen(!isOpen) }}>
      <div className={cn("relative", className)}>
        {children}
      </div>
    </CollapsibleContext.Provider>
  );
};

interface CollapsibleTriggerProps {
  children: React.ReactNode;
  className?: string;
}

const CollapsibleTrigger = ({ children, className }: CollapsibleTriggerProps) => {
  const context = React.useContext(CollapsibleContext);
  if (!context) throw new Error('CollapsibleTrigger must be used within Collapsible');
  
  return (
    <button
      type="button"
      onClick={context.toggle}
      className={cn("w-full text-left", className)}
      data-state={context.isOpen ? "open" : "closed"}
    >
      {children}
    </button>
  );
};

interface CollapsibleContentProps {
  children: React.ReactNode;
  className?: string;
}

const CollapsibleContent = ({ children, className }: CollapsibleContentProps) => {
  const context = React.useContext(CollapsibleContext);
  if (!context) throw new Error('CollapsibleContent must be used within Collapsible');
  
  if (!context.isOpen) return null;
  
  return (
    <div className={cn("overflow-hidden", className)}>
      {children}
    </div>
  );
};

export {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
}; 