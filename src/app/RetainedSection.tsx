import { useLayoutEffect, useRef, type ReactNode } from 'react';

// Keep visited tools mounted for this session, including their form and tab state.
// Hidden sections cannot receive focus or appear in the accessibility tree.
export default function RetainedSection({ active, children }: { active: boolean; children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const pageOffset = useRef(0);
  const nestedOffsets = useRef(new Map<Element, number>());

  useLayoutEffect(() => {
    if (!active) return;
    window.scrollTo({ top: pageOffset.current, behavior: 'instant' });
    nestedOffsets.current.forEach((top, element) => { element.scrollTop = top; });
    const remember = (event: Event) => {
      if (event.target === document) pageOffset.current = window.scrollY;
      else if (event.target instanceof Element && root.current?.contains(event.target)) {
        nestedOffsets.current.set(event.target, event.target.scrollTop);
      }
    };
    document.addEventListener('scroll', remember, true);
    return () => document.removeEventListener('scroll', remember, true);
  }, [active]);

  return <div ref={root} hidden={!active}>{children}</div>;
}
