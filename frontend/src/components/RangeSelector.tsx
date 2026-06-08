interface Props {
  value: string;
  onChange: (range: string) => void;
}

const RANGES = ['1M', '3M', '6M', 'YTD', '1Y', '5Y', 'MAX'];

export default function RangeSelector({ value, onChange }: Props) {
  return (
    <div className="inline-flex items-center gap-0.5 p-1 rounded-lg bg-bg-raised border border-bg-border">
      {RANGES.map((r) => {
        const active = r === value;
        return (
          <button
            key={r}
            onClick={() => onChange(r)}
            className={`num px-3 py-1 text-xs rounded-md transition ${
              active
                ? 'bg-bull text-white shadow-bull'
                : 'text-ink-secondary hover:text-ink-primary hover:bg-bg-border'
            }`}
          >
            {r}
          </button>
        );
      })}
    </div>
  );
}
