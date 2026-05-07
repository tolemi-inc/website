const cardStyles = [
  'bg-tolemi-sky',
  'bg-tolemi-green',
  'bg-tolemi-red',
  'bg-tolemi-yellow',
];

interface StatCardProps {
  value: string;
  label: string;
  index: number;
}

export default function StatCard({ value, label, index }: StatCardProps) {
  const bg = cardStyles[index % cardStyles.length];

  return (
    <div
      className={`text-center p-8 md:p-10 rounded-2xl reveal ${bg}`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <div className="font-heading text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-tolemi-dark">
        {value}
      </div>
      <div className="mt-3 text-sm md:text-base font-semibold uppercase tracking-wider text-tolemi-dark/80">
        {label}
      </div>
    </div>
  );
}
