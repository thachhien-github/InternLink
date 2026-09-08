import { useCallback, useEffect, useState } from "react";
import { adminAssignmentsService } from "../services/adminAssignments.service";
import { adminCompaniesService } from "../services/adminCompanies.service";
import { adminLecturersService } from "../services/adminLecturers.service";
import { adminNotificationsService } from "../services/adminNotifications.service";
import { adminStudentsService } from "../services/adminStudents.service";
import { notificationService } from "../services/notification.service";
import type { NotificationDto } from "../types/api";

export interface AdminNavStats {
  studentCount: number;
  lecturerCount: number;
  companyCount: number;
  unassignedCount: number;
  notificationCampaignCount: number;
  unreadNotificationCount: number;
}

const DEFAULT_NAV_STATS: AdminNavStats = {
  studentCount: 0,
  lecturerCount: 0,
  companyCount: 0,
  unassignedCount: 0,
  notificationCampaignCount: 0,
  unreadNotificationCount: 0,
};

interface AdminNavStatsResult {
  stats: AdminNavStats;
  recentNotifications: NotificationDto[];
}

const navStatsCache = new Map<string, AdminNavStatsResult>();
const navStatsRequests = new Map<string, Promise<AdminNavStatsResult>>();

function getNavStatsKey(semesterId?: string | null) {
  return semesterId ?? "all";
}

function fetchAdminNavStats(semesterId?: string | null): Promise<AdminNavStatsResult> {
  const key = getNavStatsKey(semesterId);
  const cached = navStatsCache.get(key);
  if (cached) return Promise.resolve(cached);

  const existingRequest = navStatsRequests.get(key);
  if (existingRequest) return existingRequest;

  const request = Promise.all([
    adminStudentsService.getAll(0, 500, semesterId ?? undefined),
    adminLecturersService.getAll(0, 500, semesterId ?? undefined),
    adminCompaniesService.getAll(0, 500, semesterId ?? undefined),
    adminNotificationsService.getCampaigns(20).catch(() => []),
    notificationService.getMine(5).catch(() => []),
    notificationService.getUnreadCount().catch(() => 0),
    adminAssignmentsService.getAll(semesterId ?? undefined).catch(() => []),
  ]).then(([students, lecturers, companies, campaigns, mine, unreadCount, allAssignments]) => {
    const assignedIds = new Set<string>();
    for (const item of allAssignments) assignedIds.add(item.studentId);

    const result = {
      stats: {
        studentCount: students.length,
        lecturerCount: lecturers.length,
        companyCount: companies.length,
        unassignedCount: students.filter((s) => !assignedIds.has(s.id)).length,
        notificationCampaignCount: campaigns.length,
        unreadNotificationCount: unreadCount,
      },
      recentNotifications: mine.slice(0, 5),
    };
    navStatsCache.set(key, result);
    return result;
  }).finally(() => {
    navStatsRequests.delete(key);
  });

  navStatsRequests.set(key, request);
  return request;
}

export function useAdminNavStats(
  enabled = true,
  semesterId?: string | null,
) {
  const [stats, setStats] = useState<AdminNavStats>(DEFAULT_NAV_STATS);
  const [recentNotifications, setRecentNotifications] = useState<
    NotificationDto[]
  >([]);
  const [isLoading, setIsLoading] = useState(enabled);

  const load = useCallback(async (force = false) => {
    if (!enabled) return;

    setIsLoading(true);
    try {
      const key = getNavStatsKey(semesterId);
      if (force) navStatsCache.delete(key);
      const result = await fetchAdminNavStats(semesterId);
      setStats(result.stats);
      setRecentNotifications(result.recentNotifications);
    } finally {
      setIsLoading(false);
    }
  }, [enabled, semesterId]);

  useEffect(() => {
    void load();
  }, [load]);

  return { stats, recentNotifications, isLoading, reload: () => load(true) };
}
