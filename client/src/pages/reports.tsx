import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Database, BarChart3, TrendingUp, Users, Clock, Target } from "lucide-react";
import { 
  TaskAnalyticsChart, 
  TeamPerformanceChart, 
  CategoryAnalyticsChart, 
  ProductivityTrendsChart, 
  TimeTrackingChart, 
  WorkloadDistributionChart 
} from "@/components/analytics/advanced-charts";

export default function Reports() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Analytics & Reports</h1>
          <p className="text-slate-600">Comprehensive insights powered by PostgreSQL analytics</p>
        </div>
      </div>

      <Tabs defaultValue="advanced" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="advanced" className="flex items-center gap-2">
            <Database className="w-4 h-4" />
            Advanced Analytics
          </TabsTrigger>
          <TabsTrigger value="insights" className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Performance Insights
          </TabsTrigger>
        </TabsList>

        <TabsContent value="advanced" className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <TaskAnalyticsChart />
              <TeamPerformanceChart />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <CategoryAnalyticsChart />
              <ProductivityTrendsChart />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <TimeTrackingChart />
              <WorkloadDistributionChart />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Database Queries</CardTitle>
                <Database className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">PostgreSQL</div>
                <p className="text-xs text-muted-foreground">
                  Real-time analytics engine
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Performance Metrics</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Advanced</div>
                <p className="text-xs text-muted-foreground">
                  SQL-powered insights
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Team Analytics</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Individual</div>
                <p className="text-xs text-muted-foreground">
                  Member performance tracking
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Time Tracking</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">30 Days</div>
                <p className="text-xs text-muted-foreground">
                  Rolling analytics window
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Key Performance Indicators
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Task Completion Rate</span>
                    <span className="text-sm text-muted-foreground">SQL Aggregated</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Team Productivity Trends</span>
                    <span className="text-sm text-muted-foreground">12-Week Analysis</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Category Distribution</span>
                    <span className="text-sm text-muted-foreground">Real-time Metrics</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Workload Balance</span>
                    <span className="text-sm text-muted-foreground">Current Snapshot</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="w-5 h-5" />
                  Analytics Engine Features
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Advanced SQL Queries</span>
                    <span className="text-sm text-green-600">Active</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Real-time Data Processing</span>
                    <span className="text-sm text-green-600">Active</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Persistent Storage</span>
                    <span className="text-sm text-green-600">Active</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Performance Optimization</span>
                    <span className="text-sm text-green-600">Active</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}