'use client';

import React, { useState, useEffect } from 'react';
import { getSession } from 'next-auth/react';
import { type Schema } from '../../../../amplify/data/resource';
import { useWorksStore } from '@/store/worksStore';
import { dataClient } from '@/amplify-client';

// 타입 정의
type Work = Schema['Work']['type'];

// AppSync 엔드포인트 및 API 키
import outputs from '../../../../amplify_outputs.json';
const APPSYNC_ENDPOINT = outputs.data.url;
const API_KEY = outputs.data.api_key;

// GraphQL 쿼리
const LIST_WORKS_QUERY = /* GraphQL */ `
  query ListWorks($limit: Int, $nextToken: String) {
    listWorks(limit: $limit, nextToken: $nextToken) {
      items {
        id
        title
        author
        content
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;

const DELETE_WORK_MUTATION = /* GraphQL */ `
  mutation DeleteWork($input: DeleteWorkInput!) {
    deleteWork(input: $input) {
      id
    }
  }
`;

// GraphQL API 직접 호출 함수 (인증 헤더 포함)
async function callGraphQLWithToken<T = Record<string, unknown>>(
  query: string, 
  variables: Record<string, unknown>, 
  idToken?: string
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  // 토큰이 있으면 Cognito 인증, 없으면 API 키 사용
  if (idToken) {
    headers['Authorization'] = `Bearer ${idToken}`;
  } else {
    headers['x-api-key'] = API_KEY;
  }
  
  const response = await fetch(APPSYNC_ENDPOINT, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      query,
      variables,
    }),
  });
  
  const result = await response.json();
  
  // 오류 체크
  if (result.errors) {
    console.error('GraphQL 오류:', result.errors);
    throw result.errors;
  }
  
  return result.data as T;
}

interface WorksTableProps {
  isAdmin: boolean;
}

const WorksTable: React.FC<WorksTableProps> = ({ isAdmin }) => {
  // 상태 변수들
  const [works, setWorks] = useState<Work[]>([]);
  const [loadingWorks, setLoadingWorks] = useState(true);
  const [errorWorks, setErrorWorks] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  
  // 페이지네이션 및 검색 상태
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const PAGE_SIZE = 10; // 한 페이지당 표시할 항목 수
  const [searchTitle, setSearchTitle] = useState('');
  const [searchAuthor, setSearchAuthor] = useState('');
  const [searchGenre, setSearchGenre] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const genreOptions = ['소설', '시', '수필'];

  // 글로벌 스토어에서 필요한 상태와 함수 가져오기
  const { 
    setCurrentPage: setStoreCurrentPage,
    setTotalPages: setStoreTotalPages,
    removeWork
  } = useWorksStore();
  
  // 로컬 상태를 글로벌 스토어와 동기화
  useEffect(() => {
    setStoreCurrentPage(currentPage);
  }, [currentPage, setStoreCurrentPage]);
  
  useEffect(() => {
    setStoreTotalPages(totalPages);
  }, [totalPages, setStoreTotalPages]);

  // 페이지네이션 및 데이터 가져오기 
  useEffect(() => {
    if (isAdmin) {
      fetchWorks();
    }
  }, [isAdmin, currentPage, searchTitle, searchAuthor, searchGenre]);

  // 전체 작품 수와 페이지 수 계산
  const calculatePagination = (total: number) => {
    setTotalPages(Math.ceil(total / PAGE_SIZE));
  };

  // 작품 목록 가져오기
  const fetchWorks = async () => {
    setLoadingWorks(true);
    setErrorWorks(null);
    
    try {
      const variables = {
        limit: PAGE_SIZE,
        nextToken: null, // 나중에 페이지네이션 토큰으로 대체
      };
      
      // 필터 조건이 있는 경우 필터 추가
      if (searchTitle || searchAuthor || searchGenre) {
        setIsSearching(true);
        // TODO: 검색 필터 구현
      } else {
        setIsSearching(false);
      }
      
      const response = await dataClient.graphql({
        query: LIST_WORKS_QUERY,
        variables: variables,
      });
      
      // 응답을 안전하게 처리
      // @ts-expect-error - Amplify Gen2 타입 이슈 (data 속성 접근 오류)
      const fetchedWorks = response?.data?.listWorks?.items || [];
      calculatePagination(fetchedWorks.length * 2); // 임시로 페이지 수 계산, 실제로는 총 개수로 계산해야 함
      setWorks(fetchedWorks);
    } catch (err) {
      console.error('Error fetching works:', err);
      setErrorWorks(err instanceof Error ? err.message : String(err));
    } finally {
      setLoadingWorks(false);
    }
  };

  // 작품 삭제 핸들러 (fetch + Cognito 토큰)
  const handleDelete = async (id: string) => {
    if (!isAdmin || !confirm(`정말로 이 작품(ID: ${id})을 삭제하시겠습니까?`)) return;
    setDeletingId(id);
    setErrorWorks(null);
    try {
      // 1. NextAuth.js 세션에서 ID 토큰 가져오기
      const session = await getSession();
      if (!session?.idToken) {
        throw new Error("ID 토큰을 찾을 수 없습니다. 다시 로그인해주세요.");
      }
      
      // 2. GraphQL API 직접 호출
      await callGraphQLWithToken(
        DELETE_WORK_MUTATION,
        { input: { id } },
        session.idToken
      );
      
      // 3. 성공 시 UI 및 스토어 업데이트
      setWorks(currentWorks => currentWorks.filter(work => work.id !== id));
      removeWork(id); // 스토어에서도 삭제
      
      alert('작품이 삭제되었습니다.');
    } catch (err) {
      console.error(`Error deleting work (ID: ${id}):`, err);
      const errorMessage = Array.isArray(err) ? err.map(e => e.message).join(', ') : (err instanceof Error ? err.message : JSON.stringify(err));
      setErrorWorks(`작품 삭제 실패 (ID: ${id}): ${errorMessage}`);
      alert(`작품 삭제 중 오류 발생:\n${errorMessage}`);
    } finally {
      setDeletingId(null);
    }
  };

  // 검색 핸들러 추가
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchWorks();
  };

  const handleResetSearch = () => {
    setSearchTitle('');
    setSearchAuthor('');
    setSearchGenre('');
    fetchWorks();
  };

  // 페이지 이동 핸들러
  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages || newPage === currentPage) return;
    setCurrentPage(newPage);
    fetchWorks();
  };

  return (
    <section>
      <h2 className="text-xl font-semibold mb-4">작품 목록 관리</h2>
      
      {/* 검색 영역 추가 */}
      <div className="bg-white p-4 mb-4 rounded-lg shadow-md">
        <form onSubmit={handleSearch} className="flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-[200px]">
            <label htmlFor="searchTitle" className="block text-sm font-medium text-gray-700">제목 검색</label>
            <input
              type="text"
              id="searchTitle"
              value={searchTitle}
              onChange={(e) => setSearchTitle(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="제목으로 검색"
            />
          </div>
          <div className="flex-1 min-w-[200px]">
            <label htmlFor="searchAuthor" className="block text-sm font-medium text-gray-700">저자 검색</label>
            <input
              type="text"
              id="searchAuthor"
              value={searchAuthor}
              onChange={(e) => setSearchAuthor(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="저자명으로 검색"
            />
          </div>
          <div className="flex-1 min-w-[200px]">
            <label htmlFor="searchGenre" className="block text-sm font-medium text-gray-700">장르 선택</label>
            <select
              id="searchGenre"
              value={searchGenre}
              onChange={(e) => setSearchGenre(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="">모든 장르</option>
              {genreOptions.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={isSearching}
              className="py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isSearching ? '검색 중...' : '검색'}
            </button>
            <button
              type="button"
              onClick={handleResetSearch}
              className="py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              초기화
            </button>
          </div>
        </form>
      </div>
      
      {/* 작품 목록 영역 (로딩 상태와 상관없이 항상 표시) */}
      <div className="relative">
        {/* 로딩 오버레이 */}
        {loadingWorks && (
          <div className="absolute inset-0 bg-white bg-opacity-70 z-10 flex items-center justify-center">
            <div className="flex flex-col items-center space-y-2">
              <svg className="animate-spin h-8 w-8 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="text-sm font-medium text-indigo-700">작품 목록 로딩 중...</span>
            </div>
          </div>
        )}
        
        {errorWorks && <p className="text-red-500">{errorWorks}</p>}
        
        {/* 작품 목록 테이블 - 작품이 없을 때만 숨김 */}
        {!loadingWorks && works.length === 0 && <p>등록된 작품이 없습니다.</p>}
        {(loadingWorks || works.length > 0) && (
          <>
            <div className="relative overflow-hidden">
              {/* 로딩 오버레이 */}
              {loadingWorks && (
                <div className="absolute inset-0 bg-white bg-opacity-70 z-10 flex items-center justify-center">
                  <div className="flex flex-col items-center space-y-2">
                    <svg className="animate-spin h-8 w-8 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="text-sm font-medium text-indigo-700">작품 목록 로딩 중...</span>
                  </div>
                </div>
              )}
              
              <div className="overflow-x-auto shadow border-b border-gray-200 sm:rounded-lg" id="worksTable">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">제목</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">저자</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">장르</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">생성일</th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">작업</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {works.map((work) => (
                      <tr key={work.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 max-w-xs truncate" title={work.title}>{work.title}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{work.author || '-'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{work.genre || '-'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{work.createdAt ? new Date(work.createdAt).toLocaleString() : '-'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => handleDelete(work.id)}
                            disabled={deletingId === work.id}
                            className="text-red-600 hover:text-red-900 disabled:opacity-50"
                          >
                            {deletingId === work.id ? '삭제 중...' : '삭제'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            {/* 페이지네이션 컨트롤 */}
            <div className="mt-4 flex justify-center">
              <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                {/* 처음 페이지 버튼 */}
                <button
                  onClick={() => handlePageChange(1)}
                  disabled={currentPage === 1 || loadingWorks}
                  className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                >
                  <span className="sr-only">처음</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M13.293 6.293a1 1 0 0 1 0 1.414L9.414 12l3.879 3.879a1 1 0 0 1-1.414 1.414l-5-5a1 1 0 0 1 0-1.414l5-5a1 1 0 0 1 1.414 0z" clipRule="evenodd" />
                    <path fillRule="evenodd" d="M7.293 6.293a1 1 0 0 1 0 1.414L3.414 12l3.879 3.879a1 1 0 0 1-1.414 1.414l-5-5a1 1 0 0 1 0-1.414l5-5a1 1 0 0 1 1.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
                
                {/* 이전 페이지 버튼 */}
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1 || loadingWorks}
                  className="relative inline-flex items-center px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                >
                  <span className="sr-only">이전</span>
                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
                  </svg>
                </button>
                
                {/* 페이지 번호 (최대 10개만 표시) */}
                {(() => {
                  // 표시할 페이지 번호 범위 계산
                  const pageNumbersToShow = 10; // 한 번에 표시할 페이지 번호 수
                  
                  // 중앙 배치 로직 수정
                  let startPage = Math.max(1, currentPage - Math.floor(pageNumbersToShow / 2));
                  let endPage = startPage + pageNumbersToShow - 1;
                  
                  // 끝 페이지가 전체 페이지 수를 초과하는 경우 조정
                  if (endPage > totalPages) {
                    endPage = totalPages;
                    startPage = Math.max(1, endPage - pageNumbersToShow + 1);
                  }
                  
                  // 페이지 번호 버튼 배열 생성
                  const pageNumbers = [];
                  for (let i = startPage; i <= endPage; i++) {
                    pageNumbers.push(
                      <button
                        key={i}
                        onClick={() => handlePageChange(i)}
                        disabled={loadingWorks}
                        className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                          currentPage === i
                            ? 'z-10 bg-indigo-600 text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                            : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
                        }`}
                      >
                        {i}
                      </button>
                    );
                  }
                  return pageNumbers;
                })()}
                
                {/* 다음 페이지 버튼 */}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages || loadingWorks}
                  className="relative inline-flex items-center px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                >
                  <span className="sr-only">다음</span>
                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                  </svg>
                </button>
                
                {/* 마지막 페이지 버튼 */}
                <button
                  onClick={() => handlePageChange(totalPages)}
                  disabled={currentPage === totalPages || loadingWorks}
                  className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                >
                  <span className="sr-only">마지막</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M6.707 13.707a1 1 0 0 1 0-1.414L10.586 8l-3.879-3.879a1 1 0 0 1 1.414-1.414l5 5a1 1 0 0 1 0 1.414l-5 5a1 1 0 0 1-1.414 0z" clipRule="evenodd" />
                    <path fillRule="evenodd" d="M12.707 13.707a1 1 0 0 1 0-1.414L16.586 8l-3.879-3.879a1 1 0 0 1 1.414-1.414l5 5a1 1 0 0 1 0 1.414l-5 5a1 1 0 0 1-1.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
              </nav>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default WorksTable; 