import { useRef } from 'react';

const FUNCTIONALITIES = [
  'Translate spoken conversations between languages in real-time',
  'Generate personalised workout plans based on fitness goals and health data',
  'Summarise long legal documents into plain English',
  'Detect fraudulent transactions in banking systems',
  'Match job candidates to open roles based on their CV and experience',
  'Recommend diagnoses to clinicians based on patient symptom descriptions',
  'Screen loan applications and assign credit risk scores',
  'Moderate user-generated content on a social platform for policy violations',
  'Predict which students are at risk of dropping out based on academic data',
  'Prioritise organ donor–recipient matches based on compatibility criteria',
  'Generate code from natural language descriptions of software requirements',
  "Curate a personalised news feed based on a reader's interests and history",
];

function shuffle(arr: string[]): string[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

interface Props {
  value: string;
  onChange: (text: string) => void;
  onGenerate: () => void;
  loading: boolean;
}

export function FunctionalityCard({ value, onChange, onGenerate, loading }: Props) {
  const queueRef = useRef<string[]>([]);

  const handleDice = () => {
    if (queueRef.current.length === 0) {
      queueRef.current = shuffle(FUNCTIONALITIES);
    }
    onChange(queueRef.current.pop()!);
  };

  return (
    <div className="card functionality-card" data-card-id="functionality">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Describe the AI functionality…"
        onKeyDown={(e) => {
          if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
            e.preventDefault();
            onGenerate();
          }
        }}
      />
      <div className="functionality-card-actions">
        <button
          className="generate-btn"
          type="button"
          onClick={onGenerate}
          disabled={loading || !value.trim()}
        >
          {loading ? 'Generating…' : 'Generate Use Cases'}
        </button>
        <button
          className="dice-btn"
          type="button"
          onClick={handleDice}
          title="Fill with a random example"
          aria-label="Random example"
        >
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" strokeLinecap="round" strokeLinejoin="round">
            {/* back die: face-2, rotated -12deg, blue face / white dots */}
            <g transform="rotate(-12, 8, 9)">
              <rect x="2" y="3" width="12" height="12" rx="2.5" fill="currentColor" stroke="none"/>
              <circle cx="10.5" cy="6.5"  r="1.1" fill="white" stroke="none"/>
              <circle cx="5.5"  cy="11.5" r="1.1" fill="white" stroke="none"/>
            </g>
            {/* front die: face-4, rotated +10deg, blue face / white dots */}
            <g transform="rotate(10, 16, 15)">
              <rect x="10" y="9" width="12" height="12" rx="2.5" fill="currentColor" stroke="none"/>
              <circle cx="13.5" cy="12.5" r="1.1" fill="white" stroke="none"/>
              <circle cx="18.5" cy="12.5" r="1.1" fill="white" stroke="none"/>
              <circle cx="13.5" cy="17.5" r="1.1" fill="white" stroke="none"/>
              <circle cx="18.5" cy="17.5" r="1.1" fill="white" stroke="none"/>
            </g>
          </svg>
        </button>
      </div>
    </div>
  );
}
