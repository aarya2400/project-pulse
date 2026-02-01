import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Calendar,
  User,
  MessageSquare,
  ChevronDown,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { mockTasks, mockProjects, mockTeamMembers } from '@/data/mockData';
import {
  StatusBadge,
  PriorityBadge,
} from '@/components/shared/StatusIndicators';
import { SectionHeader, EmptyState } from '@/components/shared/Cards';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Task, TaskStatus, TaskPriority } from '@/types';

interface LayoutContext {
  selectedProjectId: string;
}

type FilterStatus = 'all' | TaskStatus;
type FilterPriority = 'all' | TaskPriority;

export default function Tasks() {
  const { isManager } = useAuth();
  const { selectedProjectId } = useOutletContext<LayoutContext>();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [filterPriority, setFilterPriority] = useState<FilterPriority>('all');
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  // Filter tasks
  let filteredTasks = [...mockTasks];

  if (selectedProjectId) {
    filteredTasks = filteredTasks.filter((t) => t.projectId === selectedProjectId);
  }

  if (searchQuery) {
    filteredTasks = filteredTasks.filter(
      (t) =>
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  if (filterStatus !== 'all') {
    filteredTasks = filteredTasks.filter((t) => t.status === filterStatus);
  }

  if (filterPriority !== 'all') {
    filteredTasks = filteredTasks.filter((t) => t.priority === filterPriority);
  }

  const toggleTaskSelection = (taskId: string) => {
    setSelectedTasks((prev) =>
      prev.includes(taskId)
        ? prev.filter((id) => id !== taskId)
        : [...prev, taskId]
    );
  };

  const toggleAllTasks = () => {
    if (selectedTasks.length === filteredTasks.length) {
      setSelectedTasks([]);
    } else {
      setSelectedTasks(filteredTasks.map((t) => t.id));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <SectionHeader
          title="Tasks"
          description={`${filteredTasks.length} tasks${selectedProjectId ? ' in selected project' : ''}`}
        />
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              New Task
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Create New Task</DialogTitle>
              <DialogDescription>
                Add a new task to your project. Fill in the details below.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="form-group">
                <Label htmlFor="title">Title</Label>
                <Input id="title" placeholder="Enter task title" className="mt-1" />
              </div>
              <div className="form-group">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the task..."
                  className="mt-1"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="form-group">
                  <Label>Priority</Label>
                  <Select defaultValue="medium">
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="form-group">
                  <Label>Due Date</Label>
                  <Input type="date" className="mt-1" />
                </div>
              </div>
              <div className="form-group">
                <Label>Assignee</Label>
                <Select>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select team member" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockTeamMembers.map((member) => (
                      <SelectItem key={member.id} value={member.id}>
                        {member.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="form-group">
                <Label>Project</Label>
                <Select defaultValue={selectedProjectId || undefined}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select project" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockProjects.map((project) => (
                      <SelectItem key={project.id} value={project.id}>
                        {project.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setIsCreateDialogOpen(false)}>Create Task</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Select value={filterStatus} onValueChange={(v) => setFilterStatus(v as FilterStatus)}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="backlog">Backlog</SelectItem>
              <SelectItem value="todo">To Do</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="review">Review</SelectItem>
              <SelectItem value="done">Done</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterPriority} onValueChange={(v) => setFilterPriority(v as FilterPriority)}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priority</SelectItem>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="urgent">Urgent</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedTasks.length > 0 && isManager && (
        <div className="flex items-center gap-4 rounded-lg bg-muted p-3">
          <span className="text-sm font-medium">
            {selectedTasks.length} task{selectedTasks.length > 1 ? 's' : ''} selected
          </span>
          <Button variant="outline" size="sm">
            Change Status
          </Button>
          <Button variant="outline" size="sm">
            Reassign
          </Button>
          <Button variant="outline" size="sm" className="text-destructive">
            Delete
          </Button>
        </div>
      )}

      {/* Task List */}
      {filteredTasks.length > 0 ? (
        <div className="space-y-2">
          {/* Header Row */}
          <div className="flex items-center gap-4 border-b border-border px-4 py-2 text-sm font-medium text-muted-foreground">
            <Checkbox
              checked={selectedTasks.length === filteredTasks.length && filteredTasks.length > 0}
              onCheckedChange={toggleAllTasks}
            />
            <span className="flex-1">Task</span>
            <span className="w-24 text-center">Status</span>
            <span className="w-20 text-center">Priority</span>
            <span className="w-28">Assignee</span>
            <span className="w-24">Due Date</span>
            <span className="w-8"></span>
          </div>

          {/* Task Rows */}
          {filteredTasks.map((task) => (
            <Card
              key={task.id}
              className="flex items-center gap-4 px-4 py-3 transition-colors hover:bg-muted/30"
            >
              <Checkbox
                checked={selectedTasks.includes(task.id)}
                onCheckedChange={() => toggleTaskSelection(task.id)}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="font-medium truncate">{task.title}</h4>
                  {task.comments.length > 0 && (
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <MessageSquare className="h-3 w-3" />
                      <span className="text-xs">{task.comments.length}</span>
                    </div>
                  )}
                </div>
                <p className="text-xs text-muted-foreground truncate">
                  {task.projectName}
                </p>
              </div>
              <div className="w-24 flex justify-center">
                <StatusBadge status={task.status} size="sm" />
              </div>
              <div className="w-20 flex justify-center">
                <PriorityBadge priority={task.priority} size="sm" />
              </div>
              <div className="w-28 flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarFallback className="text-xs">
                    {task.assigneeName.split(' ').map((n) => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm truncate">{task.assigneeName.split(' ')[0]}</span>
              </div>
              <div className="w-24 flex items-center gap-1 text-sm text-muted-foreground">
                <Calendar className="h-3 w-3" />
                <span>{task.dueDate}</span>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>View Details</DropdownMenuItem>
                  <DropdownMenuItem>Edit Task</DropdownMenuItem>
                  {isManager && (
                    <>
                      <DropdownMenuItem>Reassign</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive">
                        Delete
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No tasks found"
          description="Try adjusting your filters or create a new task"
          action={
            <Button onClick={() => setIsCreateDialogOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Create Task
            </Button>
          }
        />
      )}
    </div>
  );
}
