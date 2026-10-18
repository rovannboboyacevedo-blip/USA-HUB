import { useContext } from 'react';
import { useWindowDimensions } from 'react-native';
import { usePathname } from 'expo-router';

import { SidebarContext } from '@/context/SidebarContext';

export const SIDEBAR_BREAKPOINT = 860;
export const SIDEBAR_WIDTH = 248;
export const RIGHT_RAIL_BREAKPOINT = 1180;
export const RIGHT_RAIL_WIDTH = 320;

const mainRoutes = new Set(['/', '/orgs', '/calendar', '/profile', '/logs']);

const GAP = 16;

const columnsFor = (width: number) => {
  if (width >= 1440) return 5;
  if (width >= 1180) return 4;
  if (width >= 860) return 3;
  return 2;
};

const monthColumnsFor = (width: number) => {
  if (width >= 1180) return 3;
  if (width >= 860) return 2;
  return 1;
};

export const useResponsiveLayout = () => {
  const { width } = useWindowDimensions();
  const { enabled } = useContext(SidebarContext);
  const showSidebar = enabled && width >= SIDEBAR_BREAKPOINT;
  const showRightRail = enabled && width >= RIGHT_RAIL_BREAKPOINT;
  const frameWidth = Math.max(
    width - (showSidebar ? SIDEBAR_WIDTH : 0) - (showRightRail ? RIGHT_RAIL_WIDTH : 0),
    280,
  );
  const isWide = frameWidth >= 860;
  const horizontalPadding = frameWidth >= 1200 ? 48 : isWide ? 32 : 20;
  const contentWidth = Math.max(frameWidth - horizontalPadding * 2, 280);
  const orgColumns = columnsFor(frameWidth);
  const eventColumns = isWide ? columnsFor(frameWidth) : 1;
  const monthColumns = monthColumnsFor(frameWidth);

  const itemWidth = (columns: number) =>
    Math.floor((contentWidth - GAP * (columns - 1)) / columns);

  return {
    width,
    frameWidth,
    showSidebar,
    showRightRail,
    isWide,
    horizontalPadding,
    gap: GAP,
    orgColumns,
    eventColumns,
    monthColumns,
    contentWidth,
    orgCardWidth: itemWidth(orgColumns),
    eventCardWidth: isWide ? itemWidth(eventColumns) : 180,
    monthWidth: itemWidth(monthColumns),
    suggestionWidth: itemWidth(isWide ? 2 : 1),
    orgBoxHeight: isWide ? 160 : 120,
  };
};

export const useShowMenuButton = () => {
  const pathname = usePathname();
  const { enabled } = useContext(SidebarContext);
  const { showSidebar } = useResponsiveLayout();

  return enabled && !showSidebar && mainRoutes.has(pathname);
};
