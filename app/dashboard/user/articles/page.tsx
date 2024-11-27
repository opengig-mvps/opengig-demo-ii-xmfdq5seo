"use client";
import React, { useState, useEffect } from "react";
import axios, { isAxiosError } from "axios";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LoaderCircleIcon } from "lucide-react";

const ArticlesPage: React.FC = () => {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        const res = await axios.get('/api/articles');
        setArticles(res.data?.data);
      } catch (error: any) {
        if (isAxiosError(error)) {
          toast.error(error.response?.data?.message ?? 'Something went wrong');
        } else {
          console.error(error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  const handleSearch = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/articles/search', {
        params: { query: searchQuery },
      });
      setArticles(res.data?.data);
    } catch (error: any) {
      if (isAxiosError(error)) {
        toast.error(error.response?.data?.message ?? 'Something went wrong');
      } else {
        console.error(error);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBookmark = async (articleId: number) => {
    try {
      const res = await axios.post('/api/bookmarks', {
        userId: session?.user?.id,
        articleId,
      });
      if (res.data?.success) {
        toast.success('Article bookmarked successfully!');
      }
    } catch (error: any) {
      if (isAxiosError(error)) {
        toast.error(error.response?.data?.message ?? 'Something went wrong');
      } else {
        console.error(error);
      }
    }
  };

  const filteredArticles = articles?.filter(article =>
    article?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article?.summary?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 p-8">
      <h2 className="text-2xl font-bold mb-6">Educational Articles on Semen Health</h2>
      <div className="mb-4">
        <Input
          value={searchQuery}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
          placeholder="Search articles by keywords"
        />
        <Button onClick={handleSearch} className="mt-2">
          {loading ? <LoaderCircleIcon className="animate-spin" /> : "Search"}
        </Button>
      </div>
      <div className="grid gap-6">
        {filteredArticles?.map(article => (
          <Card key={article?.id}>
            <CardHeader>
              <CardTitle>{article?.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{article?.summary}</p>
              <Button
                className="mt-2"
                onClick={() => handleBookmark(article?.id)}
              >
                Bookmark
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ArticlesPage;