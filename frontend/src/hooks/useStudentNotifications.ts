import { useState, useEffect, useCallback } from 'react';
import { getApiErrorMessage } from '../lib/apiClient';
import { mapNotificationDtoToStudentUi } from '../lib/portalMappers';
import { notificationService } from '../services/notification.service';

export interface StudentNotification {
  id: string;
  title: string;
  timeAgo: string;
  unread: boolean;
  type?: 'info' | 'warning' | 'success' | 'error';
  actionUrl?: string;
}

interface UseStudentNotificationsState {
  notifications: StudentNotification[];
  loading: boolean;
  error: Error | null;
  unreadCount: number;
  refetch: () => Promise<void>;
}

export const useStudentNotifications = (): UseStudentNotificationsState => {
  const [notifications, setNotifications] = useState<StudentNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const rows = await notificationService.getMine();
      setNotifications(
        rows.map((n) => {
          const ui = mapNotificationDtoToStudentUi(n);
          return {
            id: ui.id,
            title: ui.title,
            timeAgo: ui.timeAgo,
            unread: ui.isUnread,
            actionUrl: n.link ?? undefined,
          };
        }),
      );
    } catch (err) {
      setError(err instanceof Error ? err : new Error(getApiErrorMessage(err)));
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const unreadCount = notifications.filter((n) => n.unread).length;

  return { notifications, loading, error, unreadCount, refetch };
};
