import { useCallback, useEffect, useState } from "react";
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

const DEFAULT_NAV_STATS: AdminNavStats = {
  studentCount: 0,
  lecturerCount: 0,
  unassignedCount: 0,
  notificationCampaignCount: 0,
  unreadNotificationCount: 0,
};

export function useAdminNavStats(
  enabled = true,
  semesterId?: string | null,
) {
  const [stats, setStats] = useState<AdminNavStats>(DEFAULT_NAV_STATS);
  const [recentNotifications, setRecentNotifications] = useState<
    NotificationDto[]
  >([]);
  const [isLoading, setIsLoading] = useState(enabled);

  const load = useCallback(async () => {
    if (!enabled) return;

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
          adminAssignmentsService
            .getByLecturer(l.id, semesterId ?? undefined)
            .catch(() => []),
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
  }, [enabled, semesterId]);

  useEffect(() => {
    void load();
  }, [load]);

  return { stats, recentNotifications, isLoading, reload: load };
}
