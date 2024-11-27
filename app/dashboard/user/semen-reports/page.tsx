"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import { LoaderCircleIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { DateTimePicker } from "@/components/ui/date-picker";
import api from "@/lib/api";

const semenReportSchema = z.object({
  spermCount: z
    .string()
    .min(1, "Sperm count is required")
    .refine(
      (val) => !isNaN(Number(val)) && Number(val) > 0,
      "Please enter a valid positive number"
    ),
  motility: z
    .string()
    .min(1, "Motility is required")
    .refine(
      (val) => !isNaN(Number(val)) && Number(val) > 0,
      "Please enter a valid positive number"
    ),
  morphology: z
    .string()
    .min(1, "Morphology is required")
    .refine(
      (val) => !isNaN(Number(val)) && Number(val) > 0,
      "Please enter a valid positive number"
    ),
  diet: z.string().min(1, "Diet information is required"),
  sleepDuration: z
    .string()
    .min(1, "Sleep duration is required")
    .refine(
      (val) => !isNaN(Number(val)) && Number(val) > 0,
      "Please enter a valid positive number"
    ),
  lifestyleChanges: z.string().min(1, "Lifestyle changes information is required"),
  reportDate: z.date({
    required_error: "Report date is required",
  }),
});

type SemenReportFormData = z.infer<typeof semenReportSchema>;

const SemenReportPage: React.FC = () => {
  const { data: session } = useSession();
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<SemenReportFormData>({
    resolver: zodResolver(semenReportSchema),
  });

  const onSubmit = async (data: SemenReportFormData) => {
    try {
      setLoading(true);
      const semenReportPayload = {
        spermCount: Number(data?.spermCount),
        motility: Number(data?.motility),
        morphology: Number(data?.morphology),
        reportDate: selectedDate?.toISOString(),
      };

      const habitPayload = {
        diet: data?.diet,
        sleepDuration: Number(data?.sleepDuration),
        lifestyleChanges: data?.lifestyleChanges,
      };

      const semenReportResponse = await api.post(
        `/api/users/${session?.user?.id}/semenReports`,
        semenReportPayload
      );

      const habitResponse = await api.post(
        `/api/users/${session?.user?.id}/habits`,
        habitPayload
      );

      if (semenReportResponse?.data?.success && habitResponse?.data?.success) {
        toast.success("Semen report and habits logged successfully!");
        reset();
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

  return (
    <div className="flex-1 p-8">
      <h2 className="text-2xl font-bold mb-6">Log Semen Analysis Report</h2>
      <Card>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardHeader>
            <CardTitle>Semen Analysis Report</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="spermCount">Sperm Count (millions/mL)</Label>
              <Input
                {...register("spermCount")}
                type="number"
                placeholder="Enter sperm count"
              />
              {errors?.spermCount && (
                <p className="text-red-500 text-sm">{errors?.spermCount?.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="motility">Motility (%)</Label>
              <Input
                {...register("motility")}
                type="number"
                placeholder="Enter motility percentage"
              />
              {errors?.motility && (
                <p className="text-red-500 text-sm">{errors?.motility?.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="morphology">Morphology (%)</Label>
              <Input
                {...register("morphology")}
                type="number"
                placeholder="Enter morphology percentage"
              />
              {errors?.morphology && (
                <p className="text-red-500 text-sm">{errors?.morphology?.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Report Date</Label>
              <DateTimePicker
                date={selectedDate}
                setDate={setSelectedDate}
              />
              {errors?.reportDate && (
                <p className="text-red-500 text-sm">
                  {errors?.reportDate?.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="diet">Diet</Label>
              <Textarea
                {...register("diet")}
                placeholder="Describe your diet"
              />
              {errors?.diet && (
                <p className="text-red-500 text-sm">{errors?.diet?.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="sleepDuration">Sleep Duration (hours)</Label>
              <Input
                {...register("sleepDuration")}
                type="number"
                placeholder="Enter sleep duration"
              />
              {errors?.sleepDuration && (
                <p className="text-red-500 text-sm">{errors?.sleepDuration?.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="lifestyleChanges">Lifestyle Changes</Label>
              <Textarea
                {...register("lifestyleChanges")}
                placeholder="Describe any lifestyle changes"
              />
              {errors?.lifestyleChanges && (
                <p className="text-red-500 text-sm">
                  {errors?.lifestyleChanges?.message}
                </p>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" type="submit" disabled={isSubmitting || loading}>
              {loading ? (
                <LoaderCircleIcon className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                "Log Report"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default SemenReportPage;