import { create } from 'zustand';
import { Schema } from '../../amplify/data/resource';

// 타입 정의
type Work = Schema['Work']['type'];

interface WorksState {
  // 전체 작품 데이터 (작품 ID를 키로 하는 맵)
  works: Record<string, Work>;
  
  // 페이지별 작품 ID 목록
  pageWorks: Record<number, string[]>;
  
  // 페이지 토큰 정보
  pageTokens: Record<number, string | null>;
  
  // 총 페이지 수
  totalPages: number;
  
  // 현재 페이지
  currentPage: number;
  
  // 페이지별 로딩 상태 
  loadedPages: Set<number>;
  
  // 페이지당 아이템 수
  pageSize: number;
  
  // 액션들
  setCurrentPage: (page: number) => void;
  setTotalPages: (total: number) => void;
  
  // 작품 추가 (단일)
  addWork: (work: Work) => void;
  
  // 작품 여러 개 추가
  addWorks: (works: Work[]) => void;
  
  // 작품 삭제
  removeWork: (id: string) => void;
  
  // 페이지 데이터 추가
  addPageWorks: (page: number, workIds: string[], nextToken: string | null) => void;
  
  // 특정 페이지가 로드되었는지 확인
  isPageLoaded: (page: number) => boolean;
  
  // 페이지의 작품 목록 가져오기
  getPageWorks: (page: number) => Work[];
  
  // 특정 페이지의 토큰 가져오기
  getPageToken: (page: number) => string | null;
  
  // 스토어 초기화
  resetStore: () => void;
}

// 초기 상태
const initialState = {
  works: {},
  pageWorks: {},
  pageTokens: { 0: null }, // 첫 페이지는 null 토큰으로 시작
  totalPages: 1,
  currentPage: 1,
  loadedPages: new Set<number>(),
  pageSize: 10,
};

// 스토어 생성
export const useWorksStore = create<WorksState>((set, get) => ({
  ...initialState,
  
  setCurrentPage: (page: number) => set({ currentPage: page }),
  
  setTotalPages: (total: number) => set({ totalPages: total }),
  
  addWork: (work: Work) => set(state => ({
    works: { ...state.works, [work.id]: work }
  })),
  
  addWorks: (works: Work[]) => set(state => {
    const newWorks: Record<string, Work> = { ...state.works };
    works.forEach(work => {
      newWorks[work.id] = work;
    });
    return { works: newWorks };
  }),
  
  removeWork: (id: string) => set(state => {
    // 작품 목록에서 삭제
    const { [id]: removed, ...restWorks } = state.works;

    console.log(`removed: ${removed}`);
    
    // 페이지별 작품 목록에서도 해당 ID 삭제
    const updatedPageWorks: Record<number, string[]> = {};
    Object.entries(state.pageWorks).forEach(([pageStr, ids]) => {
      const page = parseInt(pageStr);
      updatedPageWorks[page] = ids.filter(workId => workId !== id);
    });
    
    return {
      works: restWorks,
      pageWorks: updatedPageWorks
    };
  }),
  
  addPageWorks: (page: number, workIds: string[], nextToken: string | null) => set(state => {
    // 해당 페이지에 작품 ID 목록 저장
    const updatedPageWorks = { ...state.pageWorks, [page]: workIds };
    
    // 다음 페이지 토큰 저장
    const updatedPageTokens = { ...state.pageTokens, [page]: nextToken };
    
    // 로드된 페이지 표시
    const loadedPages = new Set(state.loadedPages);
    loadedPages.add(page);
    
    return {
      pageWorks: updatedPageWorks,
      pageTokens: updatedPageTokens,
      loadedPages,
    };
  }),
  
  isPageLoaded: (page: number) => get().loadedPages.has(page),
  
  getPageWorks: (page: number) => {
    const state = get();
    const workIds = state.pageWorks[page] || [];
    return workIds.map(id => state.works[id]).filter(work => work !== undefined);
  },
  
  getPageToken: (page: number) => get().pageTokens[page] || null,
  
  resetStore: () => set(initialState),
})); 