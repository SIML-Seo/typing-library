'use client';

import React, { useState } from 'react';
import { getSession } from 'next-auth/react';
import { useWorksStore } from '@/store/worksStore';
import { type Schema } from '../../../../amplify/data/resource';

// 타입 정의
type Work = Schema['Work']['type'];
type WorkInput = Omit<Work, 'id' | 'createdAt' | 'updatedAt' | 'typingResults'>;

// AppSync 엔드포인트 및 API 키
import outputs from '../../../../amplify_outputs.json';
const APPSYNC_ENDPOINT = outputs.data.url;
const API_KEY = outputs.data.api_key;

// GraphQL 쿼리 및 뮤테이션
const CREATE_WORK_MUTATION = /* GraphQL */ `
  mutation CreateWork($input: CreateWorkInput!) {
    createWork(input: $input) {
      id
      title
      author
      genre
      content
      createdAt
      updatedAt
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

const WorkForm: React.FC = () => {
  const { addWork } = useWorksStore();
  
  const [workInput, setWorkInput] = useState<WorkInput>({
    title: '',
    author: '',
    genre: '',
    content: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setWorkInput((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!workInput.title || !workInput.content) {
      setError('제목과 내용은 필수 입력 항목입니다.');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);
      
      // 세션 가져오기
      const session = await getSession();
      if (!session?.idToken) {
        throw new Error("ID 토큰을 찾을 수 없습니다. 다시 로그인해주세요.");
      }
      
      // GraphQL 요청 실행
      type CreateWorkResponse = { createWork: Work };
      const data = await callGraphQLWithToken<CreateWorkResponse>(
        CREATE_WORK_MUTATION,
        { input: workInput },
        session.idToken
      );
      
      if (data?.createWork) {
        // 새 작품을 스토어에 추가
        addWork(data.createWork);
        
        // 폼 초기화
        setWorkInput({
          title: '',
          author: '',
          genre: '',
          content: ''
        });
        
        setSuccess('작품이 성공적으로 추가되었습니다.');
      } else {
        throw new Error('응답 데이터에 createWork가 없습니다.');
      }
    } catch (err) {
      console.error('작품 추가 실패:', err);
      const errorMessage = Array.isArray(err) 
        ? err.map(e => e.message).join(', ') 
        : (err instanceof Error ? err.message : JSON.stringify(err));
      
      setError(`추가 실패: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h2 className="text-xl font-semibold mb-4">새 작품 추가</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}
      
      {success && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
          {success}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            제목 (필수)
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={workInput.title}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
        </div>
        
        <div>
          <label htmlFor="author" className="block text-sm font-medium text-gray-700">
            작가
          </label>
          <input
            type="text"
            id="author"
            name="author"
            value={workInput.author || ''}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
        
        <div>
          <label htmlFor="genre" className="block text-sm font-medium text-gray-700">
            장르
          </label>
          <input
            type="text"
            id="genre"
            name="genre"
            value={workInput.genre || ''}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
        
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700">
            내용 (필수)
          </label>
          <textarea
            id="content"
            name="content"
            value={workInput.content || ''}
            onChange={handleInputChange}
            rows={10}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
        </div>
        
        <div>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {loading ? '추가 중...' : '작품 추가'}
          </button>
        </div>
      </form>
    </section>
  );
};

export default WorkForm; 