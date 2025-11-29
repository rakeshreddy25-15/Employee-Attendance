import { NavLink } from '@/components/NavLink';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Users,
  Calendar,
  FileText,
  Clock,
  User,
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { motion } from 'framer-motion';

const employeeLinks = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/attendance', icon: Clock, label: 'Mark Attendance' },
  { to: '/history', icon: Calendar, label: 'My History' },
  { to: '/profile', icon: User, label: 'Profile' },
];

const managerLinks = [
  { to: '/manager/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/manager/employees', icon: Users, label: 'All Employees' },
  { to: '/manager/calendar', icon: Calendar, label: 'Team Calendar' },
  { to: '/manager/reports', icon: FileText, label: 'Reports' },
  { to: '/profile', icon: User, label: 'Profile' },
];

export const Sidebar = () => {
  const { user } = useAuthStore();
  const links = user?.role === 'manager' ? managerLinks : employeeLinks;

  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: 0.1 }}
      className="hidden md:flex w-64 flex-col border-r border-border bg-card"
    >
      <nav className="flex-1 space-y-1 p-4">
        {links.map((link, index) => (
          <motion.div
            key={link.to}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1 + index * 0.05 }}
          >
            <NavLink
              to={link.to}
              end
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-all hover:bg-accent hover:text-accent-foreground"
              activeClassName="bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground"
            >
              <link.icon className="h-5 w-5" />
              {link.label}
            </NavLink>
          </motion.div>
        ))}
      </nav>
    </motion.aside>
  );
};
