import StatsCards from "@/components/dashboard/stats-cards";
import ChartsSection from "@/components/dashboard/charts-section";
import RecentActivity from "@/components/dashboard/recent-activity";

export default function Dashboard() {
  return (
    <div className="flex-1 overflow-auto p-6">
      <StatsCards />
      <ChartsSection />
      <RecentActivity />
    </div>
  );
}
