"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { LayoutGrid, List } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSearchParams, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface Machinery {
  type: string;
  jcbSubtype?: string | null;
  jcbPartType?: string | null;
  slmSubtype?: string | null;
  totalHoursUsed: number;
  averageHourlyRate: number;
  totalCost: number;
  lastUpdated: string;
  entries: number;
}

interface MachineryViewProps {
  machinery: Machinery[];
  projectId: string;
}

export function MachineryView({ machinery, projectId }: MachineryViewProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [view, setView] = useState<"grid" | "list">(
    (searchParams.get("view") as "grid" | "list") || "list"
  );

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 1,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const getMachineryName = (machine: Machinery) => {
    const parts = [
      machine.type.toLowerCase(),
      machine.jcbSubtype?.toLowerCase().replace(/_/g, " "),
      machine.type === "JCB" && machine.jcbPartType
        ? `${machine.jcbPartType.toLowerCase().replace(/_/g, " ")}`
        : null,
      machine.slmSubtype?.toLowerCase().replace(/_/g, " "),
    ].filter(Boolean);
    return parts.join(" - ");
  };

  const getMachineryUrl = (machine: Machinery) => {
    const parts = [];
    parts.push(machine.type.toLowerCase());

    if (machine.type === "JCB") {
      if (machine.jcbSubtype) {
        parts.push("subtype", machine.jcbSubtype.toLowerCase());
      }
      if (machine.jcbPartType) {
        parts.push("parttype", machine.jcbPartType.toLowerCase());
      }
    } else if (machine.type === "SLM" && machine.slmSubtype) {
      parts.push("subtype", machine.slmSubtype.toLowerCase());
    }

    return parts.join("_");
  };

  const setViewType = (newView: "grid" | "list") => {
    setView(newView);
    const params = new URLSearchParams(searchParams.toString());
    params.set("view", newView);
    router.push(`?${params.toString()}`);
  };

  return (
    <div>
      <div className="flex items-center gap-4 mb-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-8 border-dashed">
              {view === "grid" ? (
                <LayoutGrid className="h-4 w-4 mr-2" />
              ) : (
                <List className="h-4 w-4 mr-2" />
              )}
              {view === "grid" ? "Grid View" : "List View"}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setViewType("grid")}>
              <LayoutGrid className="h-4 w-4 mr-2" />
              Grid View
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setViewType("list")}>
              <List className="h-4 w-4 mr-2" />
              List View
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {view === "grid" ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {machinery.map((machine) => {
            const machineryType = getMachineryUrl(machine);

            return (
              <Link
                href={`/projects/${projectId}/machinery/${encodeURIComponent(
                  machineryType
                )}`}
                key={`${machine.type}-${machine.jcbSubtype}-${machine.jcbPartType}-${machine.slmSubtype}`}
                className="rounded-lg bg-white/[0.15] p-4 hover:bg-white/[0.25] transition"
              >
                <div className="flex flex-col">
                  <h3 className="font-medium text-lg capitalize">
                    {getMachineryName(machine)}
                  </h3>
                  <div className="mt-2 space-y-1">
                    <p className="text-sm text-gray-500">
                      Total Hours Used: {machine.totalHoursUsed} hrs
                    </p>
                    <p className="text-sm text-gray-500">
                      Average Rate: {formatCurrency(machine.averageHourlyRate)}
                      /hr
                    </p>
                    <p className="text-sm text-gray-500">
                      Total Cost: {formatCurrency(machine.totalCost)}
                    </p>
                    <p className="text-sm text-gray-500">
                      Number of Uses: {machine.entries}
                    </p>
                    <p className="text-sm text-gray-500">
                      Last Used: {formatDate(machine.lastUpdated)}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-[rgba(0,0,0,0.08)] bg-white/[0.15]">
          <table className="w-full divide-y divide-[rgba(0,0,0,0.08)]">
            <thead>
              <tr>
                <th className="px-4 py-2 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Machinery
                </th>
                <th className="px-4 py-2 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-center">
                  Total Hours
                </th>
                <th className="px-4 py-2 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-center">
                  Avg. Rate
                </th>
                <th className="px-4 py-2 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-center">
                  Total Cost
                </th>
                <th className="px-4 py-2 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-center">
                  Uses
                </th>
                <th className="px-4 py-2 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-right">
                  Last Used
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(0,0,0,0.08)]">
              {machinery.map((machine) => {
                const machineryType = getMachineryUrl(machine);

                return (
                  <tr
                    key={`${machine.type}-${machine.jcbSubtype}-${machine.jcbPartType}-${machine.slmSubtype}`}
                    className="hover:bg-white/[0.25] transition cursor-pointer"
                    onClick={() =>
                      router.push(
                        `/projects/${projectId}/machinery/${encodeURIComponent(
                          machineryType
                        )}`
                      )
                    }
                  >
                    <td className="px-4 py-2 sm:px-6 sm:py-4 whitespace-nowrap">
                      <div className="text-sm font-medium capitalize">
                        {getMachineryName(machine)}
                      </div>
                    </td>
                    <td className="px-4 py-2 sm:px-6 sm:py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                      {machine.totalHoursUsed} hrs
                    </td>
                    <td className="px-4 py-2 sm:px-6 sm:py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                      {formatCurrency(machine.averageHourlyRate)}/hr
                    </td>
                    <td className="px-4 py-2 sm:px-6 sm:py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                      {formatCurrency(machine.totalCost)}
                    </td>
                    <td className="px-4 py-2 sm:px-6 sm:py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                      {machine.entries}
                    </td>
                    <td className="px-4 py-2 sm:px-6 sm:py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                      {formatDate(machine.lastUpdated)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
