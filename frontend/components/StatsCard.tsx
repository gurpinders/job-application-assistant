interface StatsCardProps {
  // Define your props here
  title: string
  count: number
  percentage: number
  color: string
  icon: string
}

export default function StatsCard({ title, count, percentage, color, icon }: StatsCardProps) {
  return (
    <div className="rounded-lg bg-white p-6 shadow text-center">
      <div className="text-4xl mb-2">{icon}</div>
      <div className="text-3xl font-bold text-gray-900">{count}</div>
      <div className="text-sm text-gray-600 mt-1">{title}</div>
      <div className="text-sm font-medium mt-2" style={{ color }}>{percentage.toFixed(1)}%</div>
    </div>
  )
}