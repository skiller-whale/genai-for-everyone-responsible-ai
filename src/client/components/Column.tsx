import type { ReactNode } from 'react';

interface Props {
  title: string;
  accentColor: string;
  children: ReactNode;
}

export function Column({ title, accentColor, children }: Props) {
  return (
    <div className="column">
      <div className="column-header" style={{ color: accentColor }}>
        {title}
      </div>
      {children}
    </div>
  );
}
