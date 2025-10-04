import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Trash2, Flag } from "lucide-react";
import { toast } from "sonner";

const ForumModeration = () => {
  const [posts, setPosts] = useState([
    { 
      id: "P001", 
      user: "John Doe", 
      content: "Great service! The train was on time and comfortable.", 
      date: "2025-01-15 10:30", 
      reports: 0,
      flagged: false 
    },
    { 
      id: "P002", 
      user: "Jane Smith", 
      content: "Spam content here - buy cheap tickets now!", 
      date: "2025-01-15 11:45", 
      reports: 3,
      flagged: true 
    },
    { 
      id: "P003", 
      user: "Bob Wilson", 
      content: "Anyone traveling to Surabaya this weekend?", 
      date: "2025-01-15 14:20", 
      reports: 0,
      flagged: false 
    },
    { 
      id: "P004", 
      user: "Alice Brown", 
      content: "Offensive content that violates community guidelines", 
      date: "2025-01-15 15:10", 
      reports: 5,
      flagged: true 
    },
  ]);

  const handleDeletePost = (postId: string) => {
    setPosts(posts.filter(post => post.id !== postId));
    toast.success("Post deleted successfully");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Forum Moderation</h1>
        <p className="text-muted-foreground mt-2">
          Monitor and moderate community forum posts
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{posts.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Flagged Posts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {posts.filter(p => p.flagged).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">
              {posts.reduce((sum, p) => sum + p.reports, 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Community Posts</CardTitle>
          <CardDescription>Review and moderate user-generated content</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {posts.map((post) => (
              <div 
                key={post.id} 
                className={`p-4 border rounded-lg ${post.flagged ? 'border-destructive bg-destructive/5' : ''}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <Avatar>
                      <AvatarFallback>{post.user.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{post.user}</p>
                        <span className="text-xs text-muted-foreground">{post.date}</span>
                        {post.flagged && (
                          <Badge variant="destructive" className="text-xs">
                            <Flag className="h-3 w-3 mr-1" />
                            Flagged
                          </Badge>
                        )}
                        {post.reports > 0 && (
                          <Badge variant="outline" className="text-xs">
                            {post.reports} reports
                          </Badge>
                        )}
                      </div>
                      <p className="mt-2 text-sm">{post.content}</p>
                    </div>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeletePost(post.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ForumModeration;
