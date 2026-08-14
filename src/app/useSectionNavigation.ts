import { useCallback, useEffect, useState } from 'react';
import type { Section } from './navigation';

const ROUTABLE_SECTIONS: Section[] = ['simulator', 'viability', 'resources', 'learning'];

const getSectionFromUrl = (): Section => {
  const section = new URLSearchParams(window.location.search).get('section');
  return ROUTABLE_SECTIONS.includes(section as Section) ? section as Section : 'home';
};

export const useSectionNavigation = () => {
  const [activeSection, setActiveSection] = useState<Section>(getSectionFromUrl);

  useEffect(() => {
    const handleHistoryChange = () => setActiveSection(getSectionFromUrl());
    window.addEventListener('popstate', handleHistoryChange);
    return () => window.removeEventListener('popstate', handleHistoryChange);
  }, []);

  const navigate = useCallback((section: Section) => {
    const url = new URL(window.location.href);
    if (ROUTABLE_SECTIONS.includes(section)) {
      url.searchParams.set('section', section);
    } else {
      url.searchParams.delete('section');
    }
    window.history.pushState({}, '', url);
    setActiveSection(section);
  }, []);

  return { activeSection, navigate };
};
