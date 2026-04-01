const cardStyles = [
  { border: 'border-tolemi-sky/25', bg: 'bg-gradient-to-br from-tolemi-sky/10 via-transparent to-transparent', accent: 'text-tolemi-sky-600' },
  { border: 'border-tolemi-green/25', bg: 'bg-gradient-to-br from-tolemi-green/10 via-transparent to-transparent', accent: 'text-tolemi-green' },
  { border: 'border-tolemi-red/25', bg: 'bg-gradient-to-br from-tolemi-red/10 via-transparent to-transparent', accent: 'text-tolemi-red' },
  { border: 'border-tolemi-yellow/25', bg: 'bg-gradient-to-br from-tolemi-yellow/10 via-transparent to-transparent', accent: 'text-tolemi-yellow-600' },
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
      className={`text-center p-8 md:p-10 rounded-2xl border backdrop-blur-sm reveal ${style.border} ${style.bg}`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <div className={`font-heading text-4xl md:text-5xl font-bold mb-3 ${style.accent}`}>
        {value}
      </div>
      <div className="text-sm text-text-secondary">{label}</div>
    </div>
  );
}
