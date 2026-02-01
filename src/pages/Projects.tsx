import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Calendar,
  Users,
  AlertTriangle,
  ArrowUpRight,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { mockProjects } from '@/data/mockData';
import { HealthBadge, ProgressBar } from '@/components/shared/StatusIndicators';
import { SectionHeader, EmptyState } from '@/components/shared/Cards';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { HealthStatus } from '@/types';

type SortOption = 'name' | 'health' | 'progress' | 'endDate';
type FilterHealth = 'all' | HealthStatus;

export default function Projects() {
  const { isManager } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('health');
  const [filterHealth, setFilterHealth] = useState<FilterHealth>('all');

  // Filter and sort projects
  let filteredProjects = [...mockProjects];

  if (searchQuery) {
    filteredProjects = filteredProjects.filter(
      (p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  if (filterHealth !== 'all') {
    filteredProjects = filteredProjects.filter((p) => p.health === filterHealth);
  }

  // Sort
  filteredProjects.sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'health':
        const healthOrder = { critical: 0, 'at-risk': 1, moderate: 2, good: 3, excellent: 4 };
        return healthOrder[a.health] - healthOrder[b.health];
      case 'progress':
        return b.progress - a.progress;
      case 'endDate':
        return new Date(a.endDate).getTime() - new Date(b.endDate).getTime();
      default:
        return 0;
    }
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <SectionHeader
          title="All Projects"
          description={`${mockProjects.length} projects in your portfolio`}
        />
        {isManager && (
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            New Project
          </Button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Select value={filterHealth} onValueChange={(v) => setFilterHealth(v as FilterHealth)}>
            <SelectTrigger className="w-36">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Health" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Health</SelectItem>
              <SelectItem value="excellent">Excellent</SelectItem>
              <SelectItem value="good">Good</SelectItem>
              <SelectItem value="moderate">Moderate</SelectItem>
              <SelectItem value="at-risk">At Risk</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="health">Health</SelectItem>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="progress">Progress</SelectItem>
              <SelectItem value="endDate">Due Date</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project) => (
            <Card
              key={project.id}
              className="group relative overflow-hidden p-5 transition-shadow hover:shadow-md"
            >
              <Link to={`/projects/${project.id}`} className="absolute inset-0 z-10" />
              
              {/* Header */}
              <div className="mb-4 flex items-start justify-between">
                <div className="space-y-1">
                  <h3 className="font-semibold group-hover:text-primary transition-colors">
                    {project.name}
                  </h3>
                  <HealthBadge health={project.health} />
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="relative z-20 h-8 w-8"
                      onClick={(e) => e.preventDefault()}
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>View Details</DropdownMenuItem>
                    {isManager && (
                      <>
                        <DropdownMenuItem>Edit Project</DropdownMenuItem>
                        <DropdownMenuItem>Manage Team</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">
                          Archive Project
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Description */}
              <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">
                {project.description}
              </p>

              {/* Progress */}
              <div className="mb-4 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-medium">{project.progress}%</span>
                </div>
                <ProgressBar
                  value={project.progress}
                  variant={
                    project.health === 'critical'
                      ? 'danger'
                      : project.health === 'at-risk'
                      ? 'warning'
                      : 'default'
                  }
                />
              </div>

              {/* Stats */}
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{project.endDate}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>{project.memberIds.length + 1}</span>
                </div>
                {project.riskCount > 0 && (
                  <div className="flex items-center gap-1 text-warning">
                    <AlertTriangle className="h-4 w-4" />
                    <span>{project.riskCount}</span>
                  </div>
                )}
              </div>

              {/* Hover indicator */}
              <ArrowUpRight className="absolute bottom-4 right-4 h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No projects found"
          description="Try adjusting your filters or search query"
        />
      )}
    </div>
  );
}
