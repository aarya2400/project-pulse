import { useOutletContext } from 'react-router-dom';
import { Calendar, CheckCircle2, AlertTriangle, Flag, ChevronRight } from 'lucide-react';
import { mockTimelineEvents, mockProjects, mockTasks } from '@/data/mockData';
import { SectionHeader } from '@/components/shared/Cards';
import { HealthBadge, StatusBadge, ProgressBar } from '@/components/shared/StatusIndicators';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface LayoutContext {
  selectedProjectId: string;
}

export default function Timeline() {
  const { selectedProjectId } = useOutletContext<LayoutContext>();

  // Filter data
  const filteredProjects = selectedProjectId
    ? mockProjects.filter((p) => p.id === selectedProjectId)
    : mockProjects;

  const filteredEvents = selectedProjectId
    ? mockTimelineEvents.filter((e) => e.projectId === selectedProjectId)
    : mockTimelineEvents;

  const upcomingTasks = mockTasks
    .filter((t) => t.status !== 'done')
    .filter((t) => !selectedProjectId || t.projectId === selectedProjectId)
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 5);

  // Group events by date
  const eventsByDate = filteredEvents.reduce((acc, event) => {
    if (!acc[event.date]) {
      acc[event.date] = [];
    }
    acc[event.date].push(event);
    return acc;
  }, {} as Record<string, typeof filteredEvents>);

  const sortedDates = Object.keys(eventsByDate).sort(
    (a, b) => new Date(a).getTime() - new Date(b).getTime()
  );

  return (
    <div className="space-y-8">
      <SectionHeader
        title="Timeline"
        description="Project timelines and upcoming deadlines"
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Project Timelines */}
        <div className="space-y-4 lg:col-span-2">
          <h3 className="text-lg font-semibold">Project Progress</h3>
          <div className="space-y-4">
            {filteredProjects.map((project) => (
              <Card key={project.id} className="p-4">
                <div className="mb-4 flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{project.name}</h4>
                      <HealthBadge health={project.health} size="sm" />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {project.startDate} — {project.endDate}
                    </p>
                  </div>
                  <span className="text-lg font-semibold">{project.progress}%</span>
                </div>

                {/* Timeline bar */}
                <div className="relative">
                  <ProgressBar
                    value={project.progress}
                    size="lg"
                    variant={
                      project.health === 'critical'
                        ? 'danger'
                        : project.health === 'at-risk'
                        ? 'warning'
                        : 'default'
                    }
                  />
                  {/* Milestones could be added here */}
                </div>

                <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
                  <span>
                    {project.completedTasks}/{project.taskCount} tasks complete
                  </span>
                  {project.riskCount > 0 && (
                    <span className="flex items-center gap-1 text-warning">
                      <AlertTriangle className="h-3 w-3" />
                      {project.riskCount} risks
                    </span>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Upcoming Events & Deadlines */}
        <div className="space-y-6">
          {/* Upcoming Tasks */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                Upcoming Tasks
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {upcomingTasks.length > 0 ? (
                upcomingTasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center gap-3 rounded-lg border border-border p-3"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{task.title}</p>
                      <p className="text-xs text-muted-foreground">{task.projectName}</p>
                    </div>
                    <div className="text-xs text-muted-foreground whitespace-nowrap">
                      {task.dueDate}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No upcoming tasks
                </p>
              )}
            </CardContent>
          </Card>

          {/* Events Timeline */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                Events
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative space-y-4">
                {sortedDates.map((date, dateIndex) => (
                  <div key={date} className="relative pl-6">
                    {/* Timeline line */}
                    {dateIndex < sortedDates.length - 1 && (
                      <div className="absolute left-2 top-6 h-full w-px bg-border" />
                    )}

                    {/* Date dot */}
                    <div className="absolute left-0 top-1.5 flex h-4 w-4 items-center justify-center rounded-full border-2 border-primary bg-background" />

                    {/* Date header */}
                    <p className="text-xs font-medium text-muted-foreground">
                      {new Date(date).toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </p>

                    {/* Events for this date */}
                    <div className="mt-2 space-y-2">
                      {eventsByDate[date].map((event) => (
                        <div
                          key={event.id}
                          className={cn(
                            'flex items-center gap-2 rounded-md p-2 text-sm',
                            event.type === 'milestone' && 'bg-primary/10',
                            event.type === 'deadline' && 'bg-warning/10',
                            event.type === 'task' && 'bg-muted',
                            event.type === 'meeting' && 'bg-info/10'
                          )}
                        >
                          {event.type === 'milestone' && (
                            <Flag className="h-3 w-3 text-primary" />
                          )}
                          {event.type === 'deadline' && (
                            <AlertTriangle className="h-3 w-3 text-warning" />
                          )}
                          {event.type === 'task' && (
                            <CheckCircle2 className="h-3 w-3 text-muted-foreground" />
                          )}
                          {event.type === 'meeting' && (
                            <Calendar className="h-3 w-3 text-info" />
                          )}
                          <span className="flex-1 truncate">{event.title}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
