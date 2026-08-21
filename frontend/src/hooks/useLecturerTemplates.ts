import { useState, useEffect, useCallback } from 'react';
import { USE_MOCK } from '../config/env';
import { documentService } from '../services/document.service';
import { mapDocumentListItemToUi } from '../lib/documentMappers';
import { loadStoredTemplates } from '../data/initialTemplatesData';
import type { DocumentItem } from '../types/document';

export interface UseLecturerTemplatesState {
  documents: DocumentItem[];
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export const useLecturerTemplates = (): UseLecturerTemplatesState => {
  const [documents, setDocuments] = useState<DocumentItem[]>(() => loadStoredTemplates());
  const [loading, setLoading] = useState(!USE_MOCK);
  const [error, setError] = useState<Error | null>(null);

  const fetchTemplates = useCallback(async () => {
    if (USE_MOCK) {
      setDocuments(loadStoredTemplates());
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const rows = await documentService.getAll();
      const mapped = rows.map(mapDocumentListItemToUi);
      setDocuments(mapped.length > 0 ? mapped : loadStoredTemplates());
      setError(null);
    } catch (err) {
      const e = err instanceof Error ? err : new Error('Failed to fetch templates');
      setError(e);
      setDocuments(loadStoredTemplates());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  return { documents, loading, error, refetch: fetchTemplates };
};
