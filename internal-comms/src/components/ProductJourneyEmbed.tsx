import { useEffect, useRef } from 'react';

function useContentHeight() {
  const ref = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const frame = ref.current;
    if (!frame) return;

    let observer: ResizeObserver | undefined;

    const loadedDoc = () => {
      const doc = frame.contentDocument;
      return doc && doc.location.href !== 'about:blank' ? doc : null;
    };

    const contentRoot = (doc: Document) =>
      doc.querySelector<HTMLElement>('.wrap') ?? doc.body;

    const sync = () => {
      const doc = loadedDoc();
      if (!doc?.body) return;
      const root = contentRoot(doc);
      const height = Math.ceil(Math.max(root.scrollHeight, root.getBoundingClientRect().height));
      if (height && Math.abs(frame.clientHeight - height) > 1) {
        frame.style.height = `${height}px`;
      }
    };

    const attach = () => {
      const doc = loadedDoc();
      if (!doc?.body) return;
      sync();
      observer?.disconnect();
      observer = new ResizeObserver(sync);
      observer.observe(contentRoot(doc));
    };

    frame.addEventListener('load', attach);
    if (frame.contentDocument?.readyState === 'complete') attach();
    window.addEventListener('resize', sync);

    return () => {
      frame.removeEventListener('load', attach);
      window.removeEventListener('resize', sync);
      observer?.disconnect();
    };
  }, []);

  return ref;
}

export function ProductJourneyEmbed({ view }: { view: 'simple' | 'detail' }) {
  const journeyFrame = useContentHeight();

  return (
    <div className={view === 'detail' ? 'private-journey-frame' : 'embed-frame embed-frame-tall'}>
      <iframe
        ref={journeyFrame}
        title={
          view === 'simple'
            ? 'Upline — the product journey'
            : 'Upline — the detailed product journey'
        }
        src={`/product-journey.html?v=11&view=${view}`}
        loading="lazy"
      />
    </div>
  );
}
