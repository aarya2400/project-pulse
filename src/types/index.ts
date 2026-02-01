// Health status types
export type HealthStatus = 'excellent' | 'good' | 'moderate' | 'at-risk' | 'critical';

// Task types
export type TaskStatus = 'backlog' | 'todo' | 'in-progress' | 'review' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string;
  assigneeId: string;
  assigneeName: string;
  projectId: string;
  projectName: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  comments: Comment[];
}

export interface Comment {
  id: string;
  content: string;
  authorId: string;
  authorName: string;
  createdAt: string;
}

// Project types
export interface Project {
  id: string;
  name: string;
  description: string;
  health: HealthStatus;
  healthScore: number;
  progress: number;
  startDate: string;
  endDate: string;
  managerId: string;
  managerName: string;
  memberIds: string[];
  taskCount: number;
  completedTasks: number;
  riskCount: number;
  createdAt: string;
  updatedAt: string;
}

// Team types
export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'manager' | 'member';
  avatar?: string;
  department: string;
  taskCount: number;
  projectIds: string[];
}

// AI Insight types
export interface AIInsight {
  id: string;
  type: 'risk' | 'recommendation' | 'prediction' | 'alert';
  title: string;
  description: string;
  confidenceScore: number;
  signals: string[];
  affectedProjectId?: string;
  affectedProjectName?: string;
  createdAt: string;
  isRead: boolean;
}

// Risk types
export interface Risk {
  id: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  probability: number;
  impact: number;
  projectId: string;
  projectName: string;
  status: 'identified' | 'mitigating' | 'resolved';
  mitigationPlan?: string;
  createdAt: string;
  updatedAt: string;
}

// Dashboard KPI types
export interface DashboardKPI {
  label: string;
  value: number | string;
  change?: number;
  changeLabel?: string;
  trend?: 'up' | 'down' | 'neutral';
}

// Timeline types
export interface TimelineEvent {
  id: string;
  type: 'task' | 'milestone' | 'deadline' | 'meeting';
  title: string;
  date: string;
  projectId: string;
  projectName: string;
  status?: TaskStatus;
}
