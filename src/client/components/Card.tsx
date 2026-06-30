import { useState, useEffect, useRef } from 'react';

interface BaseProps {
  cardId?: string;
  className?: string;
}

interface GenerateCardProps extends BaseProps {
  variant: 'generate' | 'add';
  text: string;
  onClick: () => void;
}

interface ContentCardProps extends BaseProps {
  variant?: 'content';
  text: string;
  selected?: boolean;
  onClick?: () => void;
  onEdit?: (text: string) => void;
  onDelete?: () => void;
}

type Props = GenerateCardProps | ContentCardProps;

export function Card(props: Props) {
  if (props.variant === 'generate') {
    return (
      <div
        className={`card card-generate ${props.className ?? ''}`}
        data-card-id={props.cardId}
        onClick={props.onClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && props.onClick()}
      >
        {props.text}
      </div>
    );
  }

  if (props.variant === 'add') {
    return (
      <div
        className={`card card-add-blank ${props.className ?? ''}`}
        data-card-id={props.cardId}
        onClick={props.onClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && props.onClick()}
      >
        {props.text}
      </div>
    );
  }

  return <ContentCard {...(props as ContentCardProps)} />;
}

function ContentCard({ cardId, className, text, selected, onClick, onEdit, onDelete }: ContentCardProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(text);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!editing) setDraft(text);
  }, [text, editing]);

  useEffect(() => {
    if (editing) textareaRef.current?.focus();
  }, [editing]);

  const handleClick = (e: React.MouseEvent) => {
    if (editing) return;
    if (!text && onEdit) {
      e.stopPropagation();
      setEditing(true);
    } else {
      onClick?.();
    }
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    if (!onEdit || text) return;
    e.stopPropagation();
    setEditing(true);
  };

  const commitEdit = () => {
    setEditing(false);
    onEdit?.(draft.trim());
  };

  return (
    <div
      className={`card ${className ?? ''} ${selected ? 'selected' : ''}`}
      data-card-id={cardId}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
    >
      {onDelete && (
        <button
          className="card-delete"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          aria-label="Delete card"
        >
          ×
        </button>
      )}
      {editing ? (
        <textarea
          ref={textareaRef}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commitEdit}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              setEditing(false);
              setDraft(text);
            } else if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              commitEdit();
            }
          }}
          className="card-textarea"
        />
      ) : (
        <span className={!text ? 'card-placeholder' : undefined}>
          {text || 'Click to edit…'}
        </span>
      )}
    </div>
  );
}
