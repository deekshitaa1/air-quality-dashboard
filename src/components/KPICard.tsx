import { Video as LucideIcon } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: LucideIcon;
  color?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export function KPICard({ title, value, subtitle, icon: Icon, color = '#3b82f6', trend }: KPICardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="text-sm font-medium text-gray-600">{title}</div>
        {Icon && (
          <div
            className="p-2 rounded-lg"
            style={{ backgroundColor: `${color}20` }}
          >
            <Icon size={20} style={{ color }} />
          </div>
        )}
      </div>

      <div className="mb-2">
        <div className="text-3xl font-bold text-gray-900">{value}</div>
      </div>

      {subtitle && (
        <div className="text-sm text-gray-500">{subtitle}</div>
      )}

      {trend && (
        <div className="mt-3 flex items-center gap-1">
          <span
            className={`text-xs font-medium ${
              trend.isPositive ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
          </span>
          <span className="text-xs text-gray-500">vs last period</span>
        </div>
      )}
    </div>
  );
}
