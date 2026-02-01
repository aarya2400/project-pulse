import { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  Users,
  AlertTriangle,
  CheckCircle2,
  Clock,
  MoreHorizontal,
  Plus,
  MessageSquare,
} from 'lucide-react';
import { mockProjects, mockTasks, mockRisks, mockTeamMembers } from '@/data/mockData';
import { useAuth } from '@/contexts/AuthContext';
import {
  HealthBadge,
  ProgressBar,
  StatusBadge,
  PriorityBadge,
} from '@/components/shared/StatusIndicators';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

export default function ProjectDetails() {
  const { projectId } = useParams();
  const { isManager } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  const project = mockProjects.find((p) => p.id === projectId);
  const projectTasks = useMemo(() => 
    mockTasks.filter((t) => t.projectId === projectId), 
    [projectId]
  );
  const projectRisks = useMemo(() => 
    mockRisks.filter((r) => r.projectId === projectId), 
    [projectId]
  );
  const projectMembers = useMemo(() => 
    mockTeamMembers.filter((m) =>
      project?.memberIds.includes(m.id) || m.id === project?.managerId
    ), 
    [project]
  );

  const tasksByStatus = useMemo(() => ({
    backlog: projectTasks.filter((t) => t.status === 'backlog').length,
    todo: projectTasks.filter((t) => t.status === 'todo').length,
    'in-progress': projectTasks.filter((t) => t.status === 'in-progress').length,
    review: projectTasks.filter((t) => t.status === 'review').length,
    done: projectTasks.filter((t) => t.status === 'done').length,
  }), [projectTasks]);

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <h2 className="text-xl font-semibold">Project not found</h2>
        <Link to="/projects" className="mt-4 text-primary hover:underline">
          Back to Projects
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <Link
            to="/projects"
            className="mb-2 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Projects
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold">{project.name}</h1>
            <HealthBadge health={project.health} />
          </div>
          <p className="max-w-2xl text-muted-foreground">{project.description}</p>
        </div>
        {isManager && (
          <Button className="gap-2">
            <MoreHorizontal className="h-4 w-4" />
            Actions
          </Button>
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <CheckCircle2 className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-semibold">{project.healthScore}%</p>
              <p className="text-sm text-muted-foreground">Health Score</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10">
              <Clock className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="text-2xl font-semibold">{project.progress}%</p>
              <p className="text-sm text-muted-foreground">Complete</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-info/10">
              <Users className="h-5 w-5 text-info" />
            </div>
            <div>
              <p className="text-2xl font-semibold">{projectMembers.length}</p>
              <p className="text-sm text-muted-foreground">Team Members</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/10">
              <AlertTriangle className="h-5 w-5 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-semibold">{projectRisks.length}</p>
              <p className="text-sm text-muted-foreground">Active Risks</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="tasks">Tasks ({projectTasks.length})</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="risks">Risks ({projectRisks.length})</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Progress Overview */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-base">Task Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(tasksByStatus).map(([status, count]) => (
                    <div key={status} className="flex items-center gap-4">
                      <StatusBadge status={status as any} />
                      <div className="flex-1">
                        <ProgressBar
                          value={count}
                          max={projectTasks.length || 1}
                        />
                      </div>
                      <span className="text-sm font-medium">{count}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Team */}
            <Card>
              <CardHeader className="flex-row items-center justify-between">
                <CardTitle className="text-base">Team</CardTitle>
                {isManager && (
                  <Button variant="ghost" size="sm" className="gap-1">
                    <Plus className="h-4 w-4" />
                    Add
                  </Button>
                )}
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {projectMembers.map((member) => (
                    <div key={member.id} className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs">
                          {member.name.split(' ').map((n) => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{member.name}</p>
                        <p className="text-xs text-muted-foreground capitalize">
                          {member.role}
                        </p>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {member.taskCount} tasks
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Timeline Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-8">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    <span className="text-muted-foreground">Start:</span>{' '}
                    <span className="font-medium">{project.startDate}</span>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    <span className="text-muted-foreground">End:</span>{' '}
                    <span className="font-medium">{project.endDate}</span>
                  </span>
                </div>
              </div>
              <div className="mt-4">
                <ProgressBar value={project.progress} showLabel />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tasks" className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {projectTasks.length} tasks in this project
            </p>
            {isManager && (
              <Button size="sm" className="gap-2">
                <Plus className="h-4 w-4" />
                New Task
              </Button>
            )}
          </div>
          <div className="space-y-2">
            {projectTasks.map((task) => (
              <Card key={task.id} className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{task.title}</h4>
                      <PriorityBadge priority={task.priority} size="sm" />
                    </div>
                    <p className="line-clamp-1 text-sm text-muted-foreground">
                      {task.description}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span>Assigned to {task.assigneeName}</span>
                      <span>·</span>
                      <span>Due {task.dueDate}</span>
                    </div>
                  </div>
                  <StatusBadge status={task.status} />
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="timeline">
          <Card className="p-8 text-center">
            <Calendar className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 font-semibold">Timeline View</h3>
            <p className="text-sm text-muted-foreground">
              Gantt chart visualization coming soon
            </p>
          </Card>
        </TabsContent>

        <TabsContent value="risks" className="space-y-4">
          {projectRisks.length > 0 ? (
            projectRisks.map((risk) => (
              <Card key={risk.id} className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          risk.severity === 'critical'
                            ? 'destructive'
                            : risk.severity === 'high'
                            ? 'default'
                            : 'secondary'
                        }
                      >
                        {risk.severity}
                      </Badge>
                      <h4 className="font-medium">{risk.title}</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {risk.description}
                    </p>
                    {risk.mitigationPlan && (
                      <p className="text-sm">
                        <span className="font-medium">Mitigation:</span>{' '}
                        {risk.mitigationPlan}
                      </p>
                    )}
                  </div>
                  <Badge variant="outline" className="capitalize">
                    {risk.status}
                  </Badge>
                </div>
              </Card>
            ))
          ) : (
            <Card className="p-8 text-center">
              <CheckCircle2 className="mx-auto h-12 w-12 text-success" />
              <h3 className="mt-4 font-semibold">No Active Risks</h3>
              <p className="text-sm text-muted-foreground">
                This project has no identified risks at this time
              </p>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="activity">
          <Card className="p-8 text-center">
            <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 font-semibold">Activity Feed</h3>
            <p className="text-sm text-muted-foreground">
              Project activity timeline coming soon
            </p>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
