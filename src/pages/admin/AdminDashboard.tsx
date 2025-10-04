import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Train, Ticket, DollarSign, Users } from "lucide-react";

const AdminDashboard = () => {
  const stats = [
    {
      title: "Active Trains",
      value: "24",
      description: "Currently in operation",
      icon: Train,
      trend: "+2 from yesterday"
    },
    {
      title: "Total Bookings",
      value: "1,234",
      description: "This month",
      icon: Ticket,
      trend: "+15% from last month"
    },
    {
      title: "Pending Refunds",
      value: "18",
      description: "Awaiting processing",
      icon: DollarSign,
      trend: "-3 from yesterday"
    },
    {
      title: "Active Users",
      value: "8,456",
      description: "Registered users",
      icon: Users,
      trend: "+234 this week"
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Overview of train operations and bookings
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stat.description}
                </p>
                <p className="text-xs text-primary mt-2">{stat.trend}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
            <CardDescription>Latest admin actions and system updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { action: "Refund approved", user: "John Doe", time: "5 minutes ago" },
                { action: "Train delay updated", train: "Argo Bromo", time: "15 minutes ago" },
                { action: "Ticket confirmed", booking: "#BK12345", time: "1 hour ago" },
                { action: "Post moderated", forum: "Community", time: "2 hours ago" }
              ].map((activity, index) => (
                <div key={index} className="flex items-center justify-between border-b pb-2 last:border-0">
                  <div>
                    <p className="font-medium text-sm">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">
                      {activity.user || activity.train || activity.booking || activity.forum}
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground">{activity.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Alerts</CardTitle>
            <CardDescription>Important notifications and warnings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { type: "warning", message: "Train GA-201 reported 30min delay", severity: "Medium" },
                { type: "info", message: "5 new refund requests pending review", severity: "Low" },
                { type: "success", message: "System backup completed successfully", severity: "Info" }
              ].map((alert, index) => (
                <div key={index} className="flex items-start gap-3 border-b pb-2 last:border-0">
                  <div className={`h-2 w-2 rounded-full mt-2 ${
                    alert.type === 'warning' ? 'bg-warning' : 
                    alert.type === 'success' ? 'bg-success' : 'bg-info'
                  }`} />
                  <div className="flex-1">
                    <p className="text-sm">{alert.message}</p>
                    <span className="text-xs text-muted-foreground">{alert.severity}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
