import { Badge } from '@/components/ui/badge';
import { AttendanceStatus } from '@/store/attendanceStore';
import { CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';

interface StatusBadgeProps {
  status: AttendanceStatus;
  showIcon?: boolean;
}

export const StatusBadge = ({ status, showIcon = true }: StatusBadgeProps) => {
  const variants = {
    present: {
      variant: 'default' as const,
      className: 'bg-success-light text-success border-success/20',
      icon: CheckCircle,
      label: 'Present',
    },
    absent: {
      variant: 'destructive' as const,
      className: 'bg-destructive-light text-destructive border-destructive/20',
      icon: XCircle,
      label: 'Absent',
    },
    late: {
      variant: 'default' as const,
      className: 'bg-warning-light text-warning border-warning/20',
      icon: Clock,
      label: 'Late',
    },
    'half-day': {
      variant: 'default' as const,
      className: 'bg-info-light text-info border-info/20',
      icon: AlertCircle,
      label: 'Half Day',
    },
  };
  // Defensive: handle unknown/undefined statuses
  const config = (status && (variants as any)[status]) || null;
  if (!config) {
    // fallback display for unknown status
    const FallbackIcon = AlertCircle;
    return (
      <Badge className="bg-muted text-muted-foreground">
        {showIcon && <FallbackIcon className="mr-1 h-3 w-3" />}
        Unknown
      </Badge>
    );
  }

  const Icon = config.icon;

  return (
    <Badge className={config.className}>
      {showIcon && Icon && <Icon className="mr-1 h-3 w-3" />}
      {config.label}
    </Badge>
  );
};
