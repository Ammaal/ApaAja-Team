import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FileText, UserCheck, AlertCircle, DollarSign } from "lucide-react";

const AdminLogs = () => {
  const logs = [
    { 
      id: "L001", 
      admin: "Admin User", 
      action: "Updated refund status", 
      target: "RF001", 
      timestamp: "2025-01-15 14:30:45",
      type: "refund" 
    },
    { 
      id: "L002", 
      admin: "Admin User", 
      action: "Approved booking", 
      target: "BK12349", 
      timestamp: "2025-01-15 13:15:22",
      type: "booking" 
    },
    { 
      id: "L003", 
      admin: "Admin User", 
      action: "Updated train delay", 
      target: "TR002", 
      timestamp: "2025-01-15 12:45:10",
      type: "train" 
    },
    { 
      id: "L004", 
      admin: "Admin User", 
      action: "Deleted forum post", 
      target: "P002", 
      timestamp: "2025-01-15 11:20:33",
      type: "moderation" 
    },
    { 
      id: "L005", 
      admin: "Admin User", 
      action: "Rejected refund request", 
      target: "RF005", 
      timestamp: "2025-01-15 10:05:18",
      type: "refund" 
    },
  ];

  const getActionIcon = (type: string) => {
    switch (type) {
      case "refund":
        return <DollarSign className="h-4 w-4" />;
      case "booking":
        return <UserCheck className="h-4 w-4" />;
      case "train":
        return <AlertCircle className="h-4 w-4" />;
      case "moderation":
        return <FileText className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getActionColor = (type: string) => {
    switch (type) {
      case "refund":
        return "bg-info";
      case "booking":
        return "bg-success";
      case "train":
        return "bg-warning";
      case "moderation":
        return "bg-destructive";
      default:
        return "bg-primary";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Logs & Audit Trail</h1>
        <p className="text-muted-foreground mt-2">
          Complete history of admin actions and system events
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Total Actions", value: logs.length, icon: FileText },
          { label: "Today", value: logs.length, icon: AlertCircle },
          { label: "This Week", value: logs.length, icon: UserCheck },
          { label: "This Month", value: logs.length, icon: DollarSign },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label}>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Icon className="h-4 w-4" />
                  {stat.label}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Activity Log</CardTitle>
          <CardDescription>Detailed log of all administrative actions</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Log ID</TableHead>
                <TableHead>Admin</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Target</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Timestamp</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="font-medium">{log.id}</TableCell>
                  <TableCell>{log.admin}</TableCell>
                  <TableCell>{log.action}</TableCell>
                  <TableCell className="font-mono text-sm">{log.target}</TableCell>
                  <TableCell>
                    <Badge className={`${getActionColor(log.type)} flex items-center gap-1 w-fit`}>
                      {getActionIcon(log.type)}
                      {log.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{log.timestamp}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogs;
