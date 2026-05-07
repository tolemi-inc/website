const cardStyles = [
  { accent: 'text-tolemi-sky-600', bar: 'bg-tolemi-sky-600' },
  { accent: 'text-tolemi-green', bar: 'bg-tolemi-green' },
  { accent: 'text-tolemi-red', bar: 'bg-tolemi-red' },
  { accent: 'text-tolemi-yellow-600', bar: 'bg-tolemi-yellow-500' },
];

interface StatCardProps {
  value: string;
  label: string;
  index: number;
}

export default function StatCard({ value, label, index }: StatCardProps) {
  const style = cardStyles[index % cardStyles.length];

  return (
    <div
      className="text-center reveal"
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <div className={`mx-auto h-1 w-10 rounded-full mb-6 ${style.bar}`} />
      <div className={`font-heading text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight ${style.accent}`}>
        {value}
      </div>
      <div className="mt-3 text-sm md:text-base font-semibold uppercase tracking-wider text-text-secondary">
        {label}
      </div>
    </div>
  );
}
