"use client";
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LoaderCircleIcon, Calendar, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { useSession } from "next-auth/react";
import Link from "next/link";

interface QnASession {
  id: number;
  topic: string;
  scheduledAt: string;
}

const QnASessionsPage: React.FC = () => {
  const [sessions, setSessions] = useState<QnASession[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { data: session } = useSession();

  useEffect(() => {
    const fetchQnASessions = async () => {
      try {
        setLoading(true);
        const res = await axios.get("/api/qna/sessions");
        if (res?.data?.success) {
          setSessions(res?.data?.data);
        }
      } catch (error: any) {
        console.error(error);
        toast.error("Failed to fetch Q&A sessions.");
      } finally {
        setLoading(false);
      }
    };

    fetchQnASessions();
  }, []);

  return (
    <div className="flex-1 p-8 space-y-6">
      <h2 className="text-2xl font-bold mb-6">Scheduled Q&A Sessions</h2>
      {loading ? (
        <div className="flex justify-center">
          <LoaderCircleIcon className="animate-spin h-8 w-8" />
        </div>
      ) : (
        sessions?.map((session: QnASession) => (
          <Card key={session?.id} className="space-y-4">
            <CardHeader>
              <CardTitle>{session?.topic}</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-between space-x-4">
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5" />
                <span>
                  Scheduled at:{" "}
                  {new Date(session?.scheduledAt).toLocaleString()}
                </span>
              </div>
              <Link href={`/dashboard/user/qna/${session?.id}`}>
                <Button variant="outline">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Join Session
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
};

export default QnASessionsPage;