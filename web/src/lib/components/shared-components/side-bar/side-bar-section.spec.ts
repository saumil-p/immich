import SideBarSection from '$lib/components/shared-components/side-bar/side-bar-section.svelte';
import { render, screen } from '@testing-library/svelte';
import { vi } from 'vitest';

const mocks = vi.hoisted(() => {
  return {
    mobileDevice: {
      isFullSidebar: false,
    },
    isSidebarOpen: {
      value: false,
    },
  };
});

vi.mock('$lib/stores/mobile-device.svelte', () => ({
  mobileDevice: mocks.mobileDevice,
}));

vi.mock('$lib/stores/side-bar.svelte', () => ({
  isSidebarOpen: mocks.isSidebarOpen,
}));

describe('SideBarSection component', () => {
  beforeEach(() => {
    mocks.mobileDevice.isFullSidebar = false;
    mocks.isSidebarOpen.value = false;
  });

  it.each`
    isFullSidebar | isSidebarOpen | expectedInert
    ${false}      | ${false}      | ${true}
    ${false}      | ${true}       | ${false}
    ${true}       | ${false}      | ${false}
    ${true}       | ${true}       | ${false}
  `(
    'inert is $expectedInert when isFullSidebar=$isFullSidebar and isSidebarOpen=$isSidebarOpen',
    ({ isFullSidebar, isSidebarOpen, expectedInert }) => {
      // setup
      mocks.mobileDevice.isFullSidebar = isFullSidebar;
      mocks.isSidebarOpen.value = isSidebarOpen;

      // when
      render(SideBarSection);
      const parent = screen.getByTestId('sidebar-parent');

      // then
      expect(parent.inert).toBe(expectedInert);
    },
  );

  it('should set width when sidebar is expanded', () => {
    // setup
    mocks.mobileDevice.isFullSidebar = false;
    mocks.isSidebarOpen.value = true;

    // when
    render(SideBarSection);
    const parent = screen.getByTestId('sidebar-parent');

    // then
    expect(parent.classList).toContain('sidebar:w-[16rem]'); // sets the initial width for page load
    expect(parent.classList).toContain('w-[min(100vw,16rem)]');
    expect(parent.classList).toContain('shadow-2xl');
  });
});
