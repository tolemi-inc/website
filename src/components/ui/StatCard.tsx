const gradients = [
  'bg-gradient-to-br from-tolemi-yellow to-tolemi-sky',
  'bg-gradient-to-br from-tolemi-green-300 to-tolemi-sky-300',
  'bg-gradient-to-br from-tolemi-red-300 to-tolemi-yellow-300',
];

interface StatCardProps {
  value: string;
  label: string;
  index: number;
}

export default function StatCard({ value, label, index }: StatCardProps) {
  const gradient = gradients[index % gradients.length];

  return (
    <div
      className={`rounded-2xl p-[2px] reveal shadow-lg shadow-black/5 aspect-square ${gradient}`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <div className="w-full h-full rounded-[14px] bg-surface flex flex-col items-center justify-center text-center p-8 md:p-10">
        <div
          className="font-heading text-5xl md:text-6xl lg:text-7xl font-extrabold text-tolemi-dark drop-shadow-md"
          style={{ fontVariantNumeric: 'tabular-nums' }}
        >
          {value}
        </div>
        <div className="mt-3 text-xs md:text-sm font-semibold uppercase tracking-wider text-tolemi-dark/80">
          {label}
        </div>
      </div>
    </div>
  );
}
