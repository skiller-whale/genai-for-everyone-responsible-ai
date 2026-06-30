import { useRef, useEffect, useReducer, type ReactNode } from 'react';
import { ConnectorLines } from './ConnectorLines';
import type { AppState } from '../types';

interface Props {
  state: AppState;
  children: ReactNode;
}

export function Canvas({ state, children }: Props) {
  const innerRef = useRef<HTMLDivElement>(null);
  const [, forceUpdate] = useReducer((x: number) => x + 1, 0);

  useEffect(() => {
    const el = innerRef.current?.parentElement;
    if (!el) return;
    const ro = new ResizeObserver(() => forceUpdate());
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div className="canvas">
      <div className="canvas-inner" ref={innerRef}>
        {children}
        <ConnectorLines innerRef={innerRef} state={state} />
      </div>
    </div>
  );
}
