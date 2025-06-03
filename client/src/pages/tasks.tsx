import { useState } from "react";
import TaskFilters from "@/components/tasks/task-filters";
import TaskBoard from "@/components/tasks/task-board";
import TaskModal from "@/components/tasks/task-modal";

export default function Tasks() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    category: "",
    assignee: "",
    status: "",
    startDate: "",
    endDate: "",
  });

  return (
    <div className="flex-1 overflow-auto p-6">
      <TaskFilters filters={filters} onFiltersChange={setFilters} />
      <TaskBoard filters={filters} onNewTask={() => setIsModalOpen(true)} />
      <TaskModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
}
