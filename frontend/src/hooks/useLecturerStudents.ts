import { useState, useEffect, useCallback } from 'react';
import { USE_MOCK } from '../config/env';
import { lecturerInternshipsService } from '../services/lecturerInternships.service';
import { mapInternshipDtoToStudent } from '../lib/portalMappers';
import { INITIAL_STUDENTS } from '../data/mockData';
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
  const [students, setStudents] = useState<Student[]>(USE_MOCK ? INITIAL_STUDENTS : []);
  const [internships, setInternships] = useState<InternshipDto[]>([]);
  const [loading, setLoading] = useState(!USE_MOCK);
  const [error, setError] = useState<Error | null>(null);

  const fetchStudents = useCallback(async () => {
    if (USE_MOCK) {
      setStudents(INITIAL_STUDENTS);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await lecturerInternshipsService.getAll();
      setInternships(data);
      const mapped = data.map((item) => mapInternshipDtoToStudent(item, lecturerName));
      setStudents(mapped.length > 0 ? mapped : INITIAL_STUDENTS);
      setError(null);
    } catch (err) {
      const e = err instanceof Error ? err : new Error('Failed to fetch lecturer students');
      setError(e);
      setStudents(INITIAL_STUDENTS);
    } finally {
      setLoading(false);
    }
  }, [lecturerName]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  return { students, internships, loading, error, refetch: fetchStudents };
};
