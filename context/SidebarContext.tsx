import { createContext, useContext } from 'react';

type SidebarState = {
  enabled: boolean;
  isOpen: boolean;
  toggle: () => void;
  close: () => void;
};

const defaultState: SidebarState = {
  enabled: false,
  isOpen: false,
  toggle: () => {},
  close: () => {},
};

export const SidebarContext = createContext<SidebarState>(defaultState);

export const useSidebar = () => useContext(SidebarContext);
