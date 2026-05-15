import {
  BarChart3,
  GraduationCap,
  UserPlus,
  WalletCards,
  ClipboardCheck,
  Trophy,
  UserCog,
  Settings,
  Shield
} from "lucide-react";

export const navigation = [
  { label: "Dashboard", href: "/dashboard", icon: BarChart3, activePages: ["dashboard"] },
  { label: "Students", href: "/students", icon: GraduationCap, activePages: ["students", "edit-student"] },
  { label: "Add Student", href: "/add-student", icon: UserPlus, activePages: ["add-student"] },
  { label: "Fees", href: "/students", icon: WalletCards, activePages: ["pay-fee", "monthly-fee", "receipt", "monthly-receipt"] },
  { label: "Attendance", href: "/dashboard", icon: ClipboardCheck, activePages: ["attendance"] },
  { label: "Results", href: "/dashboard", icon: Trophy, activePages: ["results"] },
  { label: "Profile", href: "/change-username", icon: UserCog, activePages: ["profile"] },
  { label: "Settings", href: "/change-password", icon: Settings, activePages: ["settings"] },
  { label: "Admin Panel", href: "/change-security-answer", icon: Shield, activePages: ["admin-panel"] }
];
