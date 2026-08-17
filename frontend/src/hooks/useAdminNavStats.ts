import { useCallback, useEffect, useState } from "react";
import { USE_MOCK } from "../config/env";
import { adminAssignmentsService } from "../services/adminAssignments.service";
import { adminLecturersService } from "../services/adminLecturers.service";
import { adminNotificationsService } from "../services/adminNotifications.service";
import { adminStudentsService } from "../services/adminStudents.service";
import { notificationService } from "../services/notification.service";
import type { NotificationDto } from "../types/api";

export interface AdminNavStats {
  studentCount: number;
  lecturerCount: number;
  unassignedCount: number;
  notificationCampaignCount: number;
  unreadNotificationCount: number;
}

const MOCK_NAV: AdminNavStats = {
  studentCount: 0,
  lecturerCount: 0,
  unassignedCount: 0,
  notificationCampaignCount: 0,
  unreadNotificationCount: 0,
};

export function useAdminNavStats(enabled = true) {
  const [stats, setStats] = useState<AdminNavStats>(
    USE_MOCK ? MOCK_NAV : MOCK_NAV,
  );
  const [recentNotifications, setRecentNotifications] = useState<
    NotificationDto[]
  >([]);
  const [isLoading, setIsLoading] = useState(enabled && !USE_MOCK);

  const load = useCallback(async () => {
    if (!enabled) return;
    if (USE_MOCK) {
      setStats({
        studentCount: 1280,
        lecturerCount: 42,
        unassignedCount: 12,
        notificationCampaignCount: 2,
        unreadNotificationCount: 2,
      });
      setRecentNotifications([]);
      return;
    }

    setIsLoading(true);
    try {
      const [students, lecturers, campaigns, mine] = await Promise.all([
        adminStudentsService.getAll(),
        adminLecturersService.getAll(),
        adminNotificationsService.getCampaigns(20).catch(() => []),
        notificationService.getMine().catch(() => []),
      ]);

      const assignmentGroups = await Promise.all(
        lecturers.map((l) =>
          adminAssignmentsService.getByLecturer(l.id).catch(() => []),
        ),
      );
      const assignedIds = new Set<string>();
      for (const group of assignmentGroups) {
        for (const item of group) assignedIds.add(item.studentId);
      }

      setStats({
        studentCount: students.length,
        lecturerCount: lecturers.length,
        unassignedCount: students.filter((s) => !assignedIds.has(s.id)).length,
        notificationCampaignCount: campaigns.length,
        unreadNotificationCount: mine.filter((n) => !n.isRead).length,
      });
      setRecentNotifications(mine.slice(0, 5));
    } finally {
      setIsLoading(false);
    }
  }, [enabled]);

  useEffect(() => {
    void load();
  }, [load]);

  return { stats, recentNotifications, isLoading, reload: load };
}
