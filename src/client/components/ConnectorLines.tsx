import { useLayoutEffect, useRef, type RefObject } from 'react';
import type { AppState } from '../types';

interface Props {
  innerRef: RefObject<HTMLDivElement | null>;
  state: AppState;
}

function bezier(x1: number, y1: number, x2: number, y2: number): string {
  const cp = (x2 - x1) / 2;
  return `M ${x1},${y1} C ${x1 + cp},${y1} ${x2 - cp},${y2} ${x2},${y2}`;
}

const NS = 'http://www.w3.org/2000/svg';

export function ConnectorLines({ innerRef, state }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);

  // Direct DOM mutation — no setState, so no re-render loop.
  useLayoutEffect(() => {
    const svg = svgRef.current;
    const container = innerRef.current;
    if (!svg || !container) return;

    const base = container.getBoundingClientRect();

    const mid = (el: Element) => {
      const r = el.getBoundingClientRect();
      return {
        rx: r.right - base.left,
        ry: r.top + r.height / 2 - base.top,
        lx: r.left - base.left,
        ly: r.top + r.height / 2 - base.top,
      };
    };

    const paths: string[] = [];

    const funcEl = container.querySelector('[data-card-id="functionality"]');
    if (funcEl) {
      const src = mid(funcEl);
      for (const uc of state.useCases) {
        const el = container.querySelector(`[data-card-id="${uc.id}"]`);
        if (!el) continue;
        const dst = mid(el);
        paths.push(bezier(src.rx, src.ry, dst.lx, dst.ly));
      }
    }

    if (state.selectedUseCaseId) {
      const ucEl = container.querySelector(`[data-card-id="${state.selectedUseCaseId}"]`);
      if (ucEl) {
        const src = mid(ucEl);
        for (const sh of state.stakeholders) {
          const el = container.querySelector(`[data-card-id="${sh.id}"]`);
          if (!el) continue;
          const dst = mid(el);
          paths.push(bezier(src.rx, src.ry, dst.lx, dst.ly));
        }
      }
    }

    if (state.selectedStakeholderId) {
      const shEl = container.querySelector(`[data-card-id="${state.selectedStakeholderId}"]`);
      if (shEl) {
        const src = mid(shEl);
        for (const harm of state.harms) {
          const el = container.querySelector(`[data-card-id="${harm.id}"]`);
          if (!el) continue;
          const dst = mid(el);
          paths.push(bezier(src.rx, src.ry, dst.lx, dst.ly));
        }
      }
    }

    while (svg.firstChild) svg.removeChild(svg.firstChild);
    for (const d of paths) {
      const path = document.createElementNS(NS, 'path');
      path.setAttribute('d', d);
      path.setAttribute('fill', 'none');
      path.setAttribute('stroke', '#94a3b8');
      path.setAttribute('stroke-width', '1.5');
      path.setAttribute('stroke-opacity', '0.55');
      svg.appendChild(path);
    }
  });

  return (
    <svg
      ref={svgRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        overflow: 'visible',
      }}
    />
  );
}
