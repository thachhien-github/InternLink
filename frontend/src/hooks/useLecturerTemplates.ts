import { useState, useEffect, useCallback } from 'react';
import { documentService } from '../services/document.service';
import { mapDocumentListItemToUi } from '../lib/documentMappers';
import type { DocumentItem } from '../types/document';

export interface UseLecturerTemplatesState {
  documents: DocumentItem[];
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export const useLecturerTemplates = (): UseLecturerTemplatesState => {
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchTemplates = useCallback(async () => {
    try {
      setLoading(true);
      const rows = await documentService.getAll();
      const mapped = rows.map(mapDocumentListItemToUi);
      setDocuments(mapped);
      setError(null);
    } catch (err) {
      const e = err instanceof Error ? err : new Error('Failed to fetch templates');
      setError(e);
      setDocuments([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  return { documents, loading, error, refetch: fetchTemplates };
};
