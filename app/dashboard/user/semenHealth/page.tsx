"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import axios, { isAxiosError } from "axios";
import { toast } from "sonner";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { LoaderCircleIcon } from "lucide-react";

const SemenHealthDashboard: React.FC = () => {
  const { data: session } = useSession();
  const [trends, setTrends] = useState<any>({});
  const [metrics, setMetrics] = useState<any>({});
  const [goals, setGoals] = useState<string[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [reminders, setReminders] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!session) return;

    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch semen reports trends and metrics
        const semenReportsRes = await axios.get(`/api/users/${session?.user?.id}/semenReports`);
        if (semenReportsRes?.data?.success) {
          setTrends(semenReportsRes?.data?.data?.trends);
          setMetrics(semenReportsRes?.data?.data?.metrics);
        }

        // Fetch personalized goals
        const goalsRes = await axios.get(`/api/users/${session?.user?.id}/goals`);
        if (goalsRes?.data?.success) {
          setGoals(goalsRes?.data?.data?.goals);
        }

        // Fetch notifications
        const notificationsRes = await axios.get(`/api/users/${session?.user?.id}/notifications`);
        if (notificationsRes?.data?.success) {
          setNotifications(notificationsRes?.data?.data);
        }

        // Fetch recommendations
        const recommendationsRes = await axios.get(`/api/users/${session?.user?.id}/recommendations`);
        if (recommendationsRes?.data?.success) {
          setRecommendations(recommendationsRes?.data?.data);
        }

        // Fetch reminders
        const remindersRes = await axios.get(`/api/users/${session?.user?.id}/reminders`);
        if (remindersRes?.data?.success) {
          setReminders(remindersRes?.data?.data);
        }

      } catch (error: any) {
        if (isAxiosError(error)) {
          toast.error(error?.response?.data?.message ?? "Something went wrong");
        } else {
          console.error(error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [session]);

  if (loading) {
    return <LoaderCircleIcon className="animate-spin" />;
  }

  return (
    <div className="p-8 space-y-8">
      <h2 className="text-2xl font-bold">Semen Health Dashboard</h2>

      <Card>
        <CardHeader>
          <CardTitle>Metrics</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label>Sperm Count</Label>
            <Badge variant="outline">{metrics?.spermCount}</Badge>
          </div>
          <div>
            <Label>Motility</Label>
            <Badge variant="outline">{metrics?.motility}</Badge>
          </div>
          <div>
            <Label>Morphology</Label>
            <Badge variant="outline">{metrics?.morphology}</Badge>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <LineChart
            width={600}
            height={300}
            data={trends?.spermCountTrend?.map((value: any, index: number) => ({
              name: `Point ${index + 1}`,
              SpermCount: value,
              Motility: trends?.motilityTrend?.[index],
              Morphology: trends?.morphologyTrend?.[index],
            }))}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="SpermCount" stroke="#8884d8" />
            <Line type="monotone" dataKey="Motility" stroke="#82ca9d" />
            <Line type="monotone" dataKey="Morphology" stroke="#ffc658" />
          </LineChart>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Personalized Goals</CardTitle>
        </CardHeader>
        <CardContent>
          {goals?.map((goal: string, index: number) => (
            <p key={index}>{goal}</p>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
        </CardHeader>
        <CardContent>
          {notifications?.map((notification: any) => (
            <p key={notification?.id}>{notification?.message}</p>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          {recommendations?.map((recommendation: any) => (
            <p key={recommendation?.id}>{recommendation?.content}</p>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Reminders</CardTitle>
        </CardHeader>
        <CardContent>
          {reminders?.map((reminder: any) => (
            <p key={reminder?.id}>{reminder?.message}</p>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default SemenHealthDashboard;