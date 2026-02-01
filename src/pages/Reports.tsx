import { BarChart3, Download, Calendar, TrendingUp } from 'lucide-react';
import { mockProjects, mockTasks, mockTeamMembers } from '@/data/mockData';
import { SectionHeader } from '@/components/shared/Cards';
import { HealthBadge, ProgressBar } from '@/components/shared/StatusIndicators';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function Reports() {
  const tasksByMember = mockTeamMembers.slice(0, 6).map((m) => ({
    name: m.name.split(' ')[0],
    tasks: m.taskCount,
    completed: Math.floor(m.taskCount * 0.6),
  }));

  const healthData = [
    { name: 'Excellent', value: 1, color: 'hsl(var(--health-excellent))' },
    { name: 'Good', value: 1, color: 'hsl(var(--health-good))' },
    { name: 'Moderate', value: 1, color: 'hsl(var(--health-moderate))' },
    { name: 'At Risk', value: 1, color: 'hsl(var(--health-at-risk))' },
    { name: 'Critical', value: 1, color: 'hsl(var(--health-critical))' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <SectionHeader title="Reports" description="Analytics and performance insights" />
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Export
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Task Load by Team Member</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={tasksByMember}>
                  <XAxis dataKey="name" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip />
                  <Bar dataKey="tasks" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="completed" fill="hsl(var(--success))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Project Health Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={healthData} cx="50%" cy="50%" outerRadius={80} dataKey="value">
                    {healthData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Project Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <table className="enterprise-table">
              <thead>
                <tr>
                  <th>Project</th>
                  <th>Health</th>
                  <th>Progress</th>
                  <th>Tasks</th>
                  <th>Due Date</th>
                </tr>
              </thead>
              <tbody>
                {mockProjects.map((project) => (
                  <tr key={project.id}>
                    <td className="font-medium">{project.name}</td>
                    <td><HealthBadge health={project.health} size="sm" /></td>
                    <td className="w-40"><ProgressBar value={project.progress} showLabel /></td>
                    <td>{project.completedTasks}/{project.taskCount}</td>
                    <td>{project.endDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
