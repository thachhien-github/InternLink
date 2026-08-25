import { useState, useEffect, useCallback } from 'react';
import { lecturerInternshipsService } from '../services/lecturerInternships.service';
import { mapInternshipDtoToStudent } from '../lib/portalMappers';
import type { Student } from '../types/student';
import type { InternshipDto } from '../types/api';

export interface UseLecturerStudentsState {
  students: Student[];
  internships: InternshipDto[];
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export const useLecturerStudents = (lecturerName = 'TS. Trần Minh Huy'): UseLecturerStudentsState => {
  const [students, setStudents] = useState<Student[]>([]);
  const [internships, setInternships] = useState<InternshipDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchStudents = useCallback(async () => {
    try {
      setLoading(true);
      const data = await lecturerInternshipsService.getAll();
      setInternships(data);
      const mapped = data.map((item) => mapInternshipDtoToStudent(item, lecturerName));
      setStudents(mapped);
      setError(null);
    } catch (err) {
      const e = err instanceof Error ? err : new Error('Failed to fetch lecturer students');
      setError(e);
      setStudents([]);
    } finally {
      setLoading(false);
    }
  }, [lecturerName]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  return { students, internships, loading, error, refetch: fetchStudents };
};
