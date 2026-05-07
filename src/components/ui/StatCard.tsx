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
      className="text-center p-8 md:p-10 rounded-2xl reveal bg-tolemi-dark"
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <div className={`font-heading text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight ${accent}`}>
        {value}
      </div>
      <div className="mt-3 text-sm md:text-base font-semibold uppercase tracking-wider text-white/70">
        {label}
      </div>
    </div>
  );
}
