import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Users, BarChart3, Clock, User, Lock } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function Landing() {
  const [showLogin, setShowLogin] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { toast } = useToast();

  const loginMutation = useMutation({
    mutationFn: async (credentials: { username: string; password: string }) => {
      return await apiRequest('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      window.location.reload();
    },
    onError: (error: any) => {
      toast({
        title: "Login Failed",
        description: error.message || "Invalid credentials",
        variant: "destructive",
      });
    },
  });

  const guestMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest('/api/auth/guest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      window.location.reload();
    },
    onError: (error: any) => {
      toast({
        title: "Guest Access Failed",
        description: error.message || "Unable to access as guest",
        variant: "destructive",
      });
    },
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      toast({
        title: "Missing Information",
        description: "Please enter both username and password",
        variant: "destructive",
      });
      return;
    }
    loginMutation.mutate({ username, password });
  };

  const handleGuestAccess = () => {
    guestMutation.mutate();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Team Task Manager
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Streamline your team's workflow with our comprehensive task management platform. 
            Track progress, manage deadlines, and boost productivity.
          </p>
          
          {!showLogin ? (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => setShowLogin(true)}
                size="lg"
                className="px-8 py-3 text-lg bg-blue-600 hover:bg-blue-700"
              >
                <User className="w-5 h-5 mr-2" />
                Team Member Login
              </Button>
              <Button 
                onClick={handleGuestAccess}
                variant="outline"
                size="lg"
                className="px-8 py-3 text-lg"
                disabled={guestMutation.isPending}
              >
                {guestMutation.isPending ? "Accessing..." : "Continue as Guest"}
              </Button>
            </div>
          ) : (
            <Card className="max-w-md mx-auto">
              <CardHeader>
                <CardTitle className="text-center">Team Member Login</CardTitle>
                <CardDescription className="text-center">
                  Enter your team member credentials
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="username"
                        type="text"
                        placeholder="Enter your full name"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="password"
                        type="password"
                        placeholder="Enter password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button 
                      type="submit" 
                      className="w-full"
                      disabled={loginMutation.isPending}
                    >
                      {loginMutation.isPending ? "Signing In..." : "Sign In"}
                    </Button>
                    <Button 
                      type="button"
                      variant="ghost"
                      onClick={() => setShowLogin(false)}
                      className="w-full"
                    >
                      Back
                    </Button>
                  </div>
                </form>
                
                <div className="mt-4 p-3 bg-gray-50 rounded-lg text-sm text-gray-600">
                  <strong>Team Members:</strong>
                  <ul className="mt-1 space-y-1">
                    <li>• Zacchaeus James (Team Lead)</li>
                    <li>• Glory Arogundade (UI Designer)</li>
                    <li>• Fiyinfoluwa Enis (Developer)</li>
                    <li>• Joseph (Developer)</li>
                  </ul>
                  <p className="mt-2 text-xs">Use your full name and password: password123</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <Card className="text-center">
            <CardHeader>
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <CardTitle>Task Management</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Create, assign, and track tasks with customizable categories and priorities.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Users className="w-12 h-12 text-blue-500 mx-auto mb-4" />
              <CardTitle>Team Collaboration</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Work together seamlessly with team member assignments and role-based access.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Clock className="w-12 h-12 text-purple-500 mx-auto mb-4" />
              <CardTitle>Time Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Monitor time spent on tasks and generate detailed activity reports.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <BarChart3 className="w-12 h-12 text-orange-500 mx-auto mb-4" />
              <CardTitle>Analytics & Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Gain insights with comprehensive dashboards and performance metrics.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Team Members Section */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            Our Team
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Zacchaeus James</CardTitle>
                <CardDescription>Team Lead</CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Glory Arogundade</CardTitle>
                <CardDescription>UI Designer</CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Fiyinfoluwa Enis</CardTitle>
                <CardDescription>Developer</CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Joseph</CardTitle>
                <CardDescription>Developer</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}