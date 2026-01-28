interface CircularProgressProps {
  value: number; // 0-100
  color: string;
  size?: number;
}

export default function CircularProgress({ value, color, size = 50 }: CircularProgressProps) {
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)' }}>
      {/* Background circle */}
      <circle
        cx="50"
        cy="50"
        r={radius}
        fill="none"
        stroke="rgba(0, 0, 0, 0.15)"
        strokeWidth="10"
      />
      {/* Progress circle */}
      <circle
        cx="50"
        cy="50"
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth="10"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        style={{
          transition: 'stroke-dashoffset 0.5s ease-out'
        }}
      />
    </svg>
  );
}
