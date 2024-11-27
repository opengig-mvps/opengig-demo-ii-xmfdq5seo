"use client";
import React, { useEffect, useState } from "react";
import axios, { isAxiosError } from "axios";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LoaderCircleIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const RecommendationsPage: React.FC = () => {
  const { data: session } = useSession();
  const [loading, setLoading] = useState<boolean>(false);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [insights, setInsights] = useState<any[]>([]);
  const [reminders, setReminders] = useState<any[]>([]);
  const [frequency, setFrequency] = useState<string>("monthly");

  useEffect(() => {
    if (!session) return;

    const fetchData = async () => {
      try {
        setLoading(true);

        const recRes = await axios.get(`/api/users/${session?.user?.id}/recommendations`);
        if (recRes?.data?.success) {
          setRecommendations(recRes?.data?.data);
        }

        const insightsRes = await axios.get(`/api/users/${session?.user?.id}/insights`);
        if (insightsRes?.data?.success) {
          setInsights(insightsRes?.data?.data);
        }

        const remindersRes = await axios.get(`/api/users/${session?.user?.id}/reminders`);
        if (remindersRes?.data?.success) {
          setReminders(remindersRes?.data?.data);
          setFrequency(remindersRes?.data?.data?.[0]?.frequency || "monthly");
        }
      } catch (error: any) {
        if (isAxiosError(error)) {
          console.error(error?.response?.data?.message ?? "Something went wrong");
        } else {
          console.error(error);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [session]);

  const updateReminderSettings = async () => {
    try {
      setLoading(true);
      const res = await axios.patch(`/api/users/${session?.user?.id}/reminders`, { frequency });

      if (res?.data?.success) {
        toast.success("Reminder settings updated successfully!");
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

  if (!session) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-8 space-y-6">
      <h2 className="text-2xl font-bold">Personalized Health Recommendations</h2>
      
      <Card>
        <CardHeader>
          <CardTitle>Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <LoaderCircleIcon className="animate-spin" />
          ) : (
            <ul className="list-disc pl-5">
              {recommendations?.map((rec: any) => (
                <li key={rec?.id}>{rec?.content}</li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Insights</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <LoaderCircleIcon className="animate-spin" />
          ) : (
            <ul className="list-disc pl-5">
              {insights?.map((insight: any, index: number) => (
                <li key={index}>
                  <strong>Trend:</strong> {insight?.trend} <br />
                  <strong>Area for Improvement:</strong> {insight?.areaForImprovement}
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Reminders</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <LoaderCircleIcon className="animate-spin" />
          ) : (
            <ul className="list-disc pl-5">
              {reminders?.map((reminder: any) => (
                <li key={reminder?.id}>{reminder?.message}</li>
              ))}
            </ul>
          )}
          <div className="mt-4 space-y-2">
            <Label htmlFor="frequency">Reminder Frequency</Label>
            <Input
              id="frequency"
              value={frequency}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFrequency(e.target.value)}
              className="w-full"
            />
            <Button onClick={updateReminderSettings} className="mt-2">
              {loading ? <LoaderCircleIcon className="animate-spin" /> : "Update Settings"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RecommendationsPage;