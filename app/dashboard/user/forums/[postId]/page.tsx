"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import { LoaderCircleIcon } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import api from "@/lib/api";

interface Post {
  id: number;
  content: string;
  createdAt: string;
  updatedAt: string;
}

interface Reply {
  id: number;
  content: string;
  createdAt: string;
  updatedAt: string;
}

const ForumPostPage: React.FC = () => {
  const { postId } = useParams();
  const [loading, setLoading] = useState<boolean>(false);
  const [post, setPost] = useState<Post | null>(null);
  const [replies, setReplies] = useState<Reply[]>([]);
  const [replyContent, setReplyContent] = useState<string>("");

  const fetchPost = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/api/forums/${postId}`);
      if (res?.data?.success) {
        setPost(res?.data?.data);
      }
    } catch (error: any) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchReplies = async () => {
    try {
      const res = await api.get(`/api/forums/${postId}/replies`);
      if (res?.data?.success) {
        setReplies(res?.data?.data);
      }
    } catch (error: any) {
      console.error(error);
    }
  };

  const createReply = async () => {
    if (!replyContent.trim()) {
      toast.error("Reply content cannot be empty.");
      return;
    }
    try {
      setLoading(true);
      const payload = { content: replyContent.trim() };
      const res = await api.post(`/api/forums/${postId}/replies`, payload);
      if (res?.data?.success) {
        toast.success("Reply added successfully!");
        setReplyContent("");
        fetchReplies();
      }
    } catch (error: any) {
      if (isAxiosError(error)) {
        toast.error(error?.response?.data?.message ?? "Something went wrong");
      } else {
        console.error(error);
        toast.error("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPost();
    fetchReplies();
  }, [postId]);

  return (
    <div className="flex-1 p-8">
      {loading ? (
        <LoaderCircleIcon className="w-10 h-10 animate-spin mx-auto" />
      ) : (
        <>
          {post && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Forum Post</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{post?.content}</p>
              </CardContent>
            </Card>
          )}

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Replies</CardTitle>
            </CardHeader>
            <CardContent>
              {replies?.length > 0 ? (
                replies?.map((reply) => (
                  <div key={reply?.id} className="mb-4">
                    <p>{reply?.content}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(reply?.createdAt).toLocaleString()}
                    </p>
                  </div>
                ))
              ) : (
                <p>No replies yet. Be the first to reply!</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Add a Reply</CardTitle>
            </CardHeader>
            <CardContent>
              <Label htmlFor="replyContent">Your Reply</Label>
              <Textarea
                id="replyContent"
                placeholder="Write your reply..."
                value={replyContent}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setReplyContent(e?.target?.value)}
              />
            </CardContent>
            <div className="p-4">
              <Button
                className="w-full"
                onClick={createReply}
                disabled={loading}
              >
                {loading ? (
                  <LoaderCircleIcon className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  "Post Reply"
                )}
              </Button>
            </div>
          </Card>
        </>
      )}
    </div>
  );
};

export default ForumPostPage;