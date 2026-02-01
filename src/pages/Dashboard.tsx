import { useOutletContext } from 'react-router-dom';
import {
  FolderKanban,
  CheckSquare,
  AlertTriangle,
  TrendingUp,
  Sparkles,
  ArrowRight,
  BarChart3,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import {
  mockProjects,
  mockTasks,
  mockAIInsights,
  mockDashboardKPIs,
} from '@/data/mockData';
import { StatCard, AIInsightCard, SectionHeader } from '@/components/shared/Cards';
import { HealthBadge, ProgressBar } from '@/components/shared/StatusIndicators';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';

interface LayoutContext {
  selectedProjectId: string;
}

export default function Dashboard() {
  const { isManager } = useAuth();
  const { selectedProjectId } = useOutletContext<LayoutContext>();

  // Filter data based on selected project
  const filteredProjects = selectedProjectId
    ? mockProjects.filter((p) => p.id === selectedProjectId)
    : mockProjects;

  const filteredTasks = selectedProjectId
    ? mockTasks.filter((t) => t.projectId === selectedProjectId)
    : mockTasks;

  // Health distribution for pie chart
  const healthDistribution = [
    { name: 'Excellent', value: filteredProjects.filter((p) => p.health === 'excellent').length, color: 'hsl(var(--health-excellent))' },
    { name: 'Good', value: filteredProjects.filter((p) => p.health === 'good').length, color: 'hsl(var(--health-good))' },
    { name: 'Moderate', value: filteredProjects.filter((p) => p.health === 'moderate').length, color: 'hsl(var(--health-moderate))' },
    { name: 'At Risk', value: filteredProjects.filter((p) => p.health === 'at-risk').length, color: 'hsl(var(--health-at-risk))' },
    { name: 'Critical', value: filteredProjects.filter((p) => p.health === 'critical').length, color: 'hsl(var(--health-critical))' },
  ].filter((d) => d.value > 0);

  // Task completion data
  const taskCompletionData = [
    { name: 'Mon', completed: 8, total: 12 },
    { name: 'Tue', completed: 12, total: 15 },
    { name: 'Wed', completed: 6, total: 10 },
    { name: 'Thu', completed: 14, total: 16 },
    { name: 'Fri', completed: 10, total: 14 },
  ];

  const atRiskProjects = filteredProjects.filter(
    (p) => p.health === 'at-risk' || p.health === 'critical'
  );

  const unreadInsights = mockAIInsights.filter((i) => !i.isRead);

  return (
    <div className="space-y-8">
      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Active Projects"
          value={filteredProjects.length}
          icon={FolderKanban}
          trend="up"
          change={2}
          changeLabel="this month"
        />
        <StatCard
          label="Open Tasks"
          value={filteredTasks.filter((t) => t.status !== 'done').length}
          icon={CheckSquare}
          trend="down"
          change={8}
          changeLabel="from last week"
        />
        <StatCard
          label="At-Risk Projects"
          value={atRiskProjects.length}
          icon={AlertTriangle}
          trend={atRiskProjects.length > 1 ? 'up' : 'neutral'}
          change={atRiskProjects.length > 1 ? 1 : 0}
          changeLabel="new"
        />
        <StatCard
          label="Avg. Health Score"
          value={`${Math.round(filteredProjects.reduce((acc, p) => acc + p.healthScore, 0) / filteredProjects.length)}%`}
          icon={TrendingUp}
          trend="down"
          change={5}
          changeLabel="vs last week"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Health Distribution */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
              Health Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={healthDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {healthDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 flex flex-wrap gap-3">
              {healthDistribution.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <span
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-xs text-muted-foreground">
                    {item.name} ({item.value})
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Task Completion Trend */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <CheckSquare className="h-4 w-4 text-muted-foreground" />
              Task Completion This Week
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={taskCompletionData}>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={12} />
                  <YAxis axisLine={false} tickLine={false} fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Bar
                    dataKey="completed"
                    fill="hsl(var(--primary))"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="total"
                    fill="hsl(var(--muted))"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* AI Insights */}
        <div className="space-y-4">
          <SectionHeader
            title="AI Insights"
            description={`${unreadInsights.length} new insights requiring attention`}
            action={
              <Button variant="ghost" size="sm" className="gap-1 text-primary">
                View All <ArrowRight className="h-4 w-4" />
              </Button>
            }
          />
          <div className="space-y-4">
            {mockAIInsights.slice(0, 2).map((insight) => (
              <AIInsightCard
                key={insight.id}
                type={insight.type}
                title={insight.title}
                description={insight.description}
                confidenceScore={insight.confidenceScore}
                signals={insight.signals}
                projectName={insight.affectedProjectName}
              />
            ))}
          </div>
        </div>

        {/* Projects At Risk */}
        <div className="space-y-4">
          <SectionHeader
            title="Projects Requiring Attention"
            description="Projects with health scores below threshold"
            action={
              <Link to="/projects">
                <Button variant="ghost" size="sm" className="gap-1 text-primary">
                  View All <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            }
          />
          <div className="space-y-3">
            {atRiskProjects.length > 0 ? (
              atRiskProjects.map((project) => (
                <Card key={project.id} className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-3">
                        <h4 className="font-medium">{project.name}</h4>
                        <HealthBadge health={project.health} size="sm" />
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{project.riskCount} risks identified</span>
                        <span>·</span>
                        <span>Due {project.endDate}</span>
                      </div>
                      <ProgressBar
                        value={project.progress}
                        variant={project.health === 'critical' ? 'danger' : 'warning'}
                        showLabel
                      />
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <Card className="p-8 text-center">
                <Sparkles className="mx-auto h-8 w-8 text-success" />
                <p className="mt-2 font-medium">All projects are healthy!</p>
                <p className="text-sm text-muted-foreground">
                  No projects require immediate attention.
                </p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
