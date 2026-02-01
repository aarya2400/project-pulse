import { useState } from 'react';
import {
  Plus,
  Search,
  MoreHorizontal,
  Mail,
  FolderKanban,
  CheckSquare,
  UserPlus,
} from 'lucide-react';
import { mockTeamMembers, mockProjects } from '@/data/mockData';
import { SectionHeader, EmptyState } from '@/components/shared/Cards';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

export default function Team() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<string | null>(null);

  const filteredMembers = mockTeamMembers.filter(
    (m) =>
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const managers = filteredMembers.filter((m) => m.role === 'manager');
  const members = filteredMembers.filter((m) => m.role === 'member');

  const openAssignDialog = (memberId: string) => {
    setSelectedMember(memberId);
    setIsAssignDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <SectionHeader
          title="Team Management"
          description={`${mockTeamMembers.length} team members across projects`}
        />
        <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <UserPlus className="h-4 w-4" />
              Invite Member
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Invite Team Member</DialogTitle>
              <DialogDescription>
                Send an invitation to add a new member to your team.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="form-group">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="colleague@company.com"
                  className="mt-1"
                />
              </div>
              <div className="form-group">
                <Label>Role</Label>
                <Select defaultValue="member">
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="member">Team Member</SelectItem>
                    <SelectItem value="manager">Team Manager</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="form-group">
                <Label>Department</Label>
                <Select>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="engineering">Engineering</SelectItem>
                    <SelectItem value="design">Design</SelectItem>
                    <SelectItem value="product">Product</SelectItem>
                    <SelectItem value="qa">QA</SelectItem>
                    <SelectItem value="data">Data</SelectItem>
                    <SelectItem value="security">Security</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsInviteDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setIsInviteDialogOpen(false)}>
                Send Invitation
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search team members..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Managers Section */}
      {managers.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Managers ({managers.length})</h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {managers.map((member) => (
              <MemberCard
                key={member.id}
                member={member}
                onAssign={() => openAssignDialog(member.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Members Section */}
      {members.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Team Members ({members.length})</h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {members.map((member) => (
              <MemberCard
                key={member.id}
                member={member}
                onAssign={() => openAssignDialog(member.id)}
              />
            ))}
          </div>
        </div>
      )}

      {filteredMembers.length === 0 && (
        <EmptyState
          title="No team members found"
          description="Try adjusting your search query"
        />
      )}

      {/* Assignment Dialog */}
      <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign to Projects</DialogTitle>
            <DialogDescription>
              Select projects to assign this team member to.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-3">
            {mockProjects.map((project) => (
              <label
                key={project.id}
                className="flex items-center gap-3 rounded-lg border border-border p-3 cursor-pointer hover:bg-muted/30"
              >
                <Checkbox />
                <div className="flex-1">
                  <p className="font-medium">{project.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {project.memberIds.length + 1} members
                  </p>
                </div>
              </label>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAssignDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIsAssignDialogOpen(false)}>
              Save Assignments
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

interface MemberCardProps {
  member: typeof mockTeamMembers[0];
  onAssign: () => void;
}

function MemberCard({ member, onAssign }: MemberCardProps) {
  return (
    <Card className="p-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12">
            <AvatarFallback className="text-sm">
              {member.name.split(' ').map((n) => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div>
            <h4 className="font-medium">{member.name}</h4>
            <p className="text-sm text-muted-foreground">{member.department}</p>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>View Profile</DropdownMenuItem>
            <DropdownMenuItem onClick={onAssign}>Manage Projects</DropdownMenuItem>
            <DropdownMenuItem>Edit Role</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">
              Remove from Team
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
        <Mail className="h-4 w-4" />
        <span className="truncate">{member.email}</span>
      </div>

      <div className="mt-4 flex items-center gap-4">
        <div className="flex items-center gap-1 text-sm">
          <FolderKanban className="h-4 w-4 text-muted-foreground" />
          <span>{member.projectIds.length} projects</span>
        </div>
        <div className="flex items-center gap-1 text-sm">
          <CheckSquare className="h-4 w-4 text-muted-foreground" />
          <span>{member.taskCount} tasks</span>
        </div>
      </div>

      <div className="mt-3">
        <Badge variant={member.role === 'manager' ? 'default' : 'secondary'} className="capitalize">
          {member.role}
        </Badge>
      </div>
    </Card>
  );
}
