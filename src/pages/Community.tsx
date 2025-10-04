import { useState } from "react";
import Navbar from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Heart, MessageCircle, Share2, Send } from "lucide-react";
import { toast } from "sonner";

interface Comment {
  id: number;
  author: string;
  avatar: string;
  content: string;
  timestamp: string;
}

interface Post {
  id: number;
  author: string;
  avatar: string;
  content: string;
  timestamp: string;
  likes: number;
  comments: Comment[];
  route: string;
  isLiked?: boolean;
}

const Community = () => {
  const [newPost, setNewPost] = useState("");
  const [commentingPostId, setCommentingPostId] = useState<number | null>(null);
  const [commentContent, setCommentContent] = useState("");
  const [posts, setPosts] = useState<Post[]>([
    {
      id: 1,
      author: "Budi Santoso",
      avatar: "BS",
      content:
        "Just finished an amazing journey on Argo Bromo Anggrek! The service was exceptional and the views were breathtaking. Highly recommend the executive class!",
      timestamp: "2 hours ago",
      likes: 24,
      comments: [
        {
          id: 1,
          author: "Siti Rahayu",
          avatar: "SR",
          content: "Sounds amazing! I'll try it next time.",
          timestamp: "1 hour ago",
        },
        {
          id: 2,
          author: "Ahmad Wijaya",
          avatar: "AW",
          content: "I agree, the executive class is worth every penny.",
          timestamp: "30 minutes ago",
        },
      ],
      route: "Jakarta → Surabaya",
      isLiked: false,
    },
    {
      id: 2,
      author: "Siti Rahayu",
      avatar: "SR",
      content:
        "Tip for first-time travelers: Book your tickets at least 2 weeks in advance during holiday season. Just saved 30% on my upcoming trip!",
      timestamp: "5 hours ago",
      likes: 42,
      comments: [],
      route: "Bandung → Yogyakarta",
      isLiked: false,
    },
    {
      id: 3,
      author: "Ahmad Wijaya",
      avatar: "AW",
      content:
        "The new dining car menu on Bima is fantastic! They now have local cuisine options. The nasi goreng was delicious 🍛",
      timestamp: "1 day ago",
      likes: 18,
      comments: [],
      route: "Jakarta → Surabaya",
      isLiked: false,
    },
  ]);

  const handlePostSubmit = () => {
    if (!newPost.trim()) {
      toast.error("Please write something before posting");
      return;
    }

    const post: Post = {
      id: posts.length + 1,
      author: "You",
      avatar: "YO",
      content: newPost,
      timestamp: "Just now",
      likes: 0,
      comments: [],
      route: "General",
      isLiked: false,
    };

    setPosts([post, ...posts]);
    setNewPost("");
    toast.success("Post published successfully!");
  };

 const handleLike = (postId: number) => {
    setPosts(
      posts.map((post) =>
        post.id === postId
          ? {
              ...post,
              isLiked: !post.isLiked,
              likes: post.isLiked ? post.likes - 1 : post.likes + 1,
            }
          : post
      )
    );
    const post = posts.find((p) => p.id === postId);
    if (post && !post.isLiked) {
      toast.success("Post liked!");
    }
  };

  const handleCommentSubmit = (postId: number) => {
    if (!commentContent.trim()) {
      toast.error("Please write something before commenting");
      return;
    }

    const newComment: Comment = {
      id: Date.now(),
      author: "You",
      avatar: "YO",
      content: commentContent,
      timestamp: "Just now",
    };

    setPosts(
      posts.map((post) =>
        post.id === postId
          ? { ...post, comments: [...post.comments, newComment] }
          : post
      )
    );
    setCommentContent("");
    setCommentingPostId(null);
    toast.success("Comment posted successfully!");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Community Forum</h1>
          <p className="text-muted-foreground">
            Share your travel experiences and connect with fellow passengers
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Feed */}
          <div className="lg:col-span-2 space-y-6">
            {/* Create Post */}
            <Card className="p-6">
              <div className="flex gap-3">
                <Avatar>
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    YO
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <Textarea
                    placeholder="Share your train journey experience..."
                    value={newPost}
                    onChange={(e) => setNewPost(e.target.value)}
                    className="min-h-24 mb-3"
                  />
                  <div className="flex justify-end">
                    <Button onClick={handlePostSubmit} variant="hero">
                      <Send className="h-4 w-4 mr-2" />
                      Post
                    </Button>
                  </div>
                </div>
              </div>
            </Card>

            {/* Posts Feed */}
            {posts.map((post) => (
              <Card key={post.id} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex gap-3">
                  <Avatar>
                    <AvatarFallback className="bg-gradient-to-br from-primary to-primary/70 text-primary-foreground">
                      {post.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h4 className="font-semibold">{post.author}</h4>
                        <p className="text-xs text-muted-foreground">{post.timestamp}</p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {post.route}
                      </Badge>
                    </div>
<p className="text-sm mb-4 leading-relaxed">{post.content}</p>
                    <div className="flex items-center gap-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleLike(post.id)}
                        className={`text-muted-foreground ${
                          post.isLiked
                            ? "text-destructive"
                            : "hover:text-destructive"
                        }`}
                      >
                        <Heart
                          className="h-4 w-4 mr-1"
                          fill={post.isLiked ? "currentColor" : "none"}
                        />
                        {post.likes}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-muted-foreground"
                        onClick={() =>
                          setCommentingPostId(
                            commentingPostId === post.id ? null : post.id
                          )
                        }
                      >
                        <MessageCircle className="h-4 w-4 mr-1" />
                        {post.comments.length}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-muted-foreground"
                      >
                        <Share2 className="h-4 w-4 mr-1" />
                        Share
                      </Button>
                    </div>
                    {commentingPostId === post.id && (
                      <div className="mt-4 pt-4 border-t">
                        {post.comments.length > 0 && (
                          <div className="space-y-4 mb-4">
                            {post.comments.map((comment) => (
                              <div key={comment.id} className="flex gap-3">
                                <Avatar className="h-8 w-8">
                                  <AvatarFallback className="text-xs bg-gradient-to-br from-primary to-primary/70 text-primary-foreground">
                                    {comment.avatar}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 bg-muted p-3 rounded-lg">
                                  <div className="flex items-center justify-between mb-1">
                                    <h5 className="font-semibold text-sm">
                                      {comment.author}
                                    </h5>
                                    <p className="text-xs text-muted-foreground">
                                      {comment.timestamp}
                                    </p>
                                  </div>
                                  <p className="text-sm">{comment.content}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                        <div className="flex gap-3">
                          <Avatar>
                            <AvatarFallback className="bg-primary text-primary-foreground">
                              YO
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <Textarea
                              placeholder="Write a comment..."
                              value={commentContent}
                              onChange={(e) => setCommentContent(e.target.value)}
                              className="min-h-16 mb-2"
                            />
                            <div className="flex justify-end">
                              <Button
                                onClick={() => handleCommentSubmit(post.id)}
                                size="sm"
                                variant="hero"
                              >
                                <Send className="h-4 w-4 mr-2" />
                                Comment
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Trending Topics */}
            <Card className="p-6">
              <h3 className="font-bold mb-4">Trending Topics</h3>
              <div className="space-y-3">
                {[
                  { tag: "Executive Class Tips", count: 145 },
                  { tag: "Holiday Travel", count: 98 },
                  { tag: "Station Reviews", count: 67 },
                  { tag: "Food Recommendations", count: 54 },
                ].map((topic) => (
                  <div
                    key={topic.tag}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-muted cursor-pointer transition-colors"
                  >
                    <span className="text-sm font-medium">#{topic.tag}</span>
                    <span className="text-xs text-muted-foreground">
                      {topic.count} posts
                    </span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Popular Routes */}
            <Card className="p-6">
              <h3 className="font-bold mb-4">Popular Routes</h3>
              <div className="space-y-2">
                {["Jakarta → Surabaya", "Bandung → Yogyakarta", "Jakarta → Malang"].map(
                  (route) => (
                    <Button
                      key={route}
                      variant="outline"
                      className="w-full justify-start text-sm"
                    >
                      {route}
                    </Button>
                  )
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Community;
