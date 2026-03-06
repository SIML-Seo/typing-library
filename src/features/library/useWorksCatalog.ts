'use client';

import { useEffect, useState } from 'react';
import { getWorksBaseUrl } from '@/shared/lib/works-config';
import { loadWorksCatalog } from './catalog';
import type { WorksCatalogPayload } from './types';

interface WorksCatalogState extends WorksCatalogPayload {
  status: 'loading' | 'ready' | 'error';
  errorMessage: string | null;
}

function createInitialState(): WorksCatalogState {
  const worksBaseUrl = getWorksBaseUrl();

  return {
    items: [],
    sourceMode: worksBaseUrl ? 'works-origin' : 'preview',
    worksBaseUrl: worksBaseUrl || null,
    status: 'loading',
    errorMessage: null,
  };
}

export function useWorksCatalog() {
  const [state, setState] = useState<WorksCatalogState>(createInitialState);

  useEffect(() => {
    let isMounted = true;

    loadWorksCatalog()
      .then((payload) => {
        if (!isMounted) {
          return;
        }

        setState({
          ...payload,
          status: 'ready',
          errorMessage: null,
        });
      })
      .catch((error) => {
        if (!isMounted) {
          return;
        }

        setState({
          ...createInitialState(),
          status: 'error',
          errorMessage:
            error instanceof Error
              ? error.message
              : '작품 목록을 불러오는 중 알 수 없는 오류가 발생했습니다.',
        });
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return state;
}
