const accents = [
  'text-tolemi-sky',
  'text-tolemi-green',
  'text-tolemi-red',
  'text-tolemi-yellow',
];

interface StatCardProps {
  value: string;
  label: string;
  index: number;
}

export default function StatCard({ value, label, index }: StatCardProps) {
  const accent = accents[index % accents.length];

  return (
    <div
      className="flex flex-col items-center justify-center text-center p-8 md:p-10 rounded-2xl reveal bg-tolemi-dark shadow-lg shadow-tolemi-dark/15 min-h-[220px] md:min-h-[260px]"
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <div
        className={`font-heading text-5xl md:text-6xl lg:text-7xl font-extrabold ${accent}`}
        style={{ fontVariantNumeric: 'tabular-nums' }}
      >
        {value}
      </div>
      <div className="mt-3 text-xs md:text-sm font-semibold uppercase tracking-wider text-white/95">
        {label}
      </div>
    </div>
  );
}
