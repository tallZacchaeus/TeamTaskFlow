import { useQuery } from "@tanstack/react-query";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { type TeamMember, type Category } from "@shared/schema";

interface TaskFiltersProps {
  filters: {
    category: string;
    assignee: string;
    status: string;
    startDate: string;
    endDate: string;
  };
  onFiltersChange: (filters: any) => void;
}

export default function TaskFilters({ filters, onFiltersChange }: TaskFiltersProps) {
  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const { data: teamMembers = [] } = useQuery<TeamMember[]>({
    queryKey: ["/api/team-members"],
  });

  const handleFilterChange = (key: string, value: string) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  return (
    <Card className="mb-6">
      <CardContent className="p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Label className="text-sm font-medium text-slate-700">Category:</Label>
            <Select
              value={filters.category}
              onValueChange={(value) => handleFilterChange("category", value)}
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id.toString()}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <Label className="text-sm font-medium text-slate-700">Assignee:</Label>
            <Select
              value={filters.assignee}
              onValueChange={(value) => handleFilterChange("assignee", value)}
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="All Members" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Members</SelectItem>
                {teamMembers.map((member) => (
                  <SelectItem key={member.id} value={member.id.toString()}>
                    {member.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <Label className="text-sm font-medium text-slate-700">Status:</Label>
            <Select
              value={filters.status}
              onValueChange={(value) => handleFilterChange("status", value)}
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Status</SelectItem>
                <SelectItem value="todo">Todo</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <Input
              type="date"
              value={filters.startDate}
              onChange={(e) => handleFilterChange("startDate", e.target.value)}
              className="w-36"
            />
            <span className="text-slate-500">to</span>
            <Input
              type="date"
              value={filters.endDate}
              onChange={(e) => handleFilterChange("endDate", e.target.value)}
              className="w-36"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
