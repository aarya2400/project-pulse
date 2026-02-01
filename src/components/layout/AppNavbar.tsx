import { useState } from 'react';
import { Search, Bell, ChevronDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { mockProjects, mockAIInsights } from '@/data/mockData';

interface AppNavbarProps {
  pageTitle: string;
  selectedProjectId?: string;
  onProjectChange?: (projectId: string) => void;
}

export function AppNavbar({
  pageTitle,
  selectedProjectId,
  onProjectChange,
}: AppNavbarProps) {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  
  const unreadNotifications = mockAIInsights.filter((i) => !i.isRead).length;
  const selectedProject = mockProjects.find((p) => p.id === selectedProjectId);

  return (
    <header className="page-header">
      {/* Page Title */}
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-semibold text-foreground">{pageTitle}</h1>
        
        {/* Project Selector */}
        {onProjectChange && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="gap-2 text-muted-foreground"
              >
                <span className="max-w-[150px] truncate">
                  {selectedProject?.name || 'All Projects'}
                </span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-64">
              <DropdownMenuLabel>Select Project</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => onProjectChange('')}
                className="gap-2"
              >
                <span className="flex-1">All Projects</span>
                {!selectedProjectId && <Check className="h-4 w-4" />}
              </DropdownMenuItem>
              {mockProjects.map((project) => (
                <DropdownMenuItem
                  key={project.id}
                  onClick={() => onProjectChange(project.id)}
                  className="gap-2"
                >
                  <span className="flex-1 truncate">{project.name}</span>
                  {selectedProjectId === project.id && (
                    <Check className="h-4 w-4" />
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Search */}
      <div className="relative w-72">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search tasks, projects..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Notifications */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            {unreadNotifications > 0 && (
              <Badge
                variant="destructive"
                className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 text-xs"
              >
                {unreadNotifications}
              </Badge>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-80">
          <DropdownMenuLabel className="flex items-center justify-between">
            <span>AI Insights</span>
            <Badge variant="secondary" className="text-xs">
              {unreadNotifications} new
            </Badge>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {mockAIInsights.slice(0, 3).map((insight) => (
            <DropdownMenuItem
              key={insight.id}
              className="flex flex-col items-start gap-1 py-3"
            >
              <div className="flex w-full items-center gap-2">
                <span
                  className={cn(
                    'h-2 w-2 rounded-full',
                    insight.type === 'risk' && 'bg-destructive',
                    insight.type === 'alert' && 'bg-warning',
                    insight.type === 'recommendation' && 'bg-primary',
                    insight.type === 'prediction' && 'bg-success'
                  )}
                />
                <span className="flex-1 text-sm font-medium">
                  {insight.title}
                </span>
                {!insight.isRead && (
                  <span className="h-2 w-2 rounded-full bg-primary" />
                )}
              </div>
              <span className="text-xs text-muted-foreground line-clamp-2">
                {insight.description}
              </span>
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuItem className="justify-center text-sm text-primary">
            View all insights
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* User Menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
              {user?.name.charAt(0).toUpperCase()}
            </div>
            <span className="hidden text-sm font-medium md:inline">
              {user?.name}
            </span>
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuLabel>
            <div className="flex flex-col">
              <span>{user?.name}</span>
              <span className="text-xs font-normal text-muted-foreground">
                {user?.email}
              </span>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Profile Settings</DropdownMenuItem>
          <DropdownMenuItem>Preferences</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-destructive">
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
