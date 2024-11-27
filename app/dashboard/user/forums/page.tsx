"use client";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import { LoaderCircleIcon, Plus, X } from "lucide-react";
import { useSession } from "next-auth/react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import api from "@/lib/api";
import Link from "next/link";

type ForumPost = {
  id: number;
  content: string;
  createdAt: string;
  updatedAt: string;
};

type NewPostFormData = {
  content: string;
};

const ForumPage: React.FC = () => {
  const { data: session } = useSession();
  const [forumPosts, setForumPosts] = useState<ForumPost[]>([]);
  const [loadingPosts, setLoadingPosts] = useState<boolean>(false);
  const [creatingPost, setCreatingPost] = useState<boolean>(false);
  const { register, handleSubmit, formState: { errors } } = useForm<NewPostFormData>();

  useEffect(() => {
    const fetchForumPosts = async () => {
      setLoadingPosts(true);
      try {
        const response = await api.get("/api/forums");
        if (response?.data?.success) {
          setForumPosts(response?.data?.data);
        }
      } catch (error: any) {
        if (isAxiosError(error)) {
          console.error(error?.response?.data?.message);
        } else {
          console.error(error);
        }
      } finally {
        setLoadingPosts(false);
      }
    };

    fetchForumPosts();
  }, []);

  const onSubmit = async (data: NewPostFormData) => {
    setCreatingPost(true);
    try {
      const response = await api.post("/api/forums", data);
      if (response?.data?.success) {
        toast.success("Forum post created successfully!");
        setForumPosts((prevPosts) => [...prevPosts, response?.data?.data]);
      }
    } catch (error: any) {
      if (isAxiosError(error)) {
        toast.error(error?.response?.data?.message ?? "Something went wrong");
      } else {
        console.error(error);
        toast.error("An unexpected error occurred");
      }
    } finally {
      setCreatingPost(false);
    }
  };

  return (
    <div className="flex-1 p-8 space-y-6">
      <h2 className="text-2xl font-bold mb-6">Anonymous Forums</h2>
      <Card>
        <CardHeader>
          <CardTitle>Create New Post</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="content">Post Content</Label>
              <Textarea
                {...register("content", { required: "Content is required" })}
                placeholder="Write your discussion content..."
              />
              {errors?.content && (
                <p className="text-red-500 text-sm">{errors?.content?.message}</p>
              )}
            </div>
            <Button type="submit" disabled={creatingPost} className="w-full">
              {creatingPost ? (
                <>
                  <LoaderCircleIcon className="w-4 h-4 mr-2 animate-spin" />
                  Creating Post...
                </>
              ) : (
                "Create Post"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {loadingPosts ? (
          <LoaderCircleIcon className="w-6 h-6 animate-spin mx-auto" />
        ) : (
          forumPosts?.map((post) => (
            <Card key={post?.id}>
              <CardContent>
                <p>{post?.content}</p>
                <Link href={`/dashboard/user/forums/${post?.id}`} className="text-blue-500 hover:underline">
                  View Details
                </Link>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default ForumPage;