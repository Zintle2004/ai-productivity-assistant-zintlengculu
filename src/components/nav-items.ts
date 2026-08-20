import {
  LayoutDashboard,
  Mail,
  Mic,
  ListChecks,
  Search,
  MessagesSquare,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  to: string;
  label: string;
  description: string;
  icon: LucideIcon;
};

export const navItems: NavItem[] = [
  {
    to: "/",
    label: "Dashboard",
    description: "Your AI productivity overview",
    icon: LayoutDashboard,
  },
  {
    to: "/email",
    label: "Email Generator",
    description: "Tone and audience aware drafts",
    icon: Mail,
  },
  {
    to: "/meetings",
    label: "Meeting Notes",
    description: "Key points, actions and deadlines",
    icon: Mic,
  },
  {
    to: "/tasks",
    label: "Task Planner",
    description: "Prioritisation and scheduling",
    icon: ListChecks,
  },
  {
    to: "/research",
    label: "Research Assistant",
    description: "Insights and structured briefings",
    icon: Search,
  },
  {
    to: "/chat",
    label: "AI Chat",
    description: "Ask anything about your work",
    icon: MessagesSquare,
  },
];
