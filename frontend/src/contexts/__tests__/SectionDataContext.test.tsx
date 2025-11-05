import { renderHook, act } from '@testing-library/react';
import type { ReactNode } from 'react';
import { SectionDataProvider, useSectionData } from '../SectionDataContext';

describe('SectionDataContext', () => {
  /**
   * Ensures the context exposes the default state with every section marked as not loaded.
   */
  it('should provide default state with all sections marked as not loaded', () => {
    const wrapper = ({ children }: { children: ReactNode }) => (
      <SectionDataProvider>{children}</SectionDataProvider>
    );

    const { result } = renderHook(() => useSectionData(), { wrapper });

    expect(result.current.loadedSections).toEqual({
      experience: false,
      projects: false,
      education: false,
    });
  });

  /**
   * Verifies the context allows toggling section states using the setter function.
   */
  it('should allow updating and resetting section state explicitly', () => {
    const wrapper = ({ children }: { children: ReactNode }) => (
      <SectionDataProvider>{children}</SectionDataProvider>
    );

    const { result } = renderHook(() => useSectionData(), { wrapper });

    act(() => {
      result.current.setSectionLoaded('experience');
    });

    expect(result.current.loadedSections.experience).toBe(true);

    act(() => {
      result.current.setSectionLoaded('experience', false);
    });

    expect(result.current.loadedSections.experience).toBe(false);
  });
});
