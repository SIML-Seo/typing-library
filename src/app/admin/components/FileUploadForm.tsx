'use client';

import React, { useState, useEffect } from 'react';
import { getSession } from 'next-auth/react';
import { useWorksStore } from '@/store/worksStore';
import { type Schema } from '../../../../amplify/data/resource';
import outputs from '../../../../amplify_outputs.json'; // AppSync URL 및 API 키
import { uploadData } from '@aws-amplify/storage';

type Work = Schema['Work']['type'];

// AppSync 엔드포인트 및 API 키
const APPSYNC_ENDPOINT = outputs.data.url;
const API_KEY = outputs.data.api_key;

// Work 생성 뮤테이션
const CREATE_WORK_MUTATION = /* GraphQL */ `
  mutation CreateWork($input: CreateWorkInput!) {
    createWork(input: $input) {
      id
      title
      author
      genre
      content
      s3Key
      createdAt
      updatedAt
    }
  }
`;

// GraphQL API 호출 함수
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

// 파일 크기 체크 (DynamoDB 제한 때문에)
const checkFileSize = (content: string): boolean => {
  // DynamoDB 아이템 최대 크기: 400KB (+ 헤더와 추가 메타데이터 고려하여 여유있게 380KB로 설정)
  const MAX_CONTENT_SIZE_KB = 380;
  const contentSizeKB = new Blob([content]).size / 1024;
  return contentSizeKB <= MAX_CONTENT_SIZE_KB;
};

// S3에 파일 업로드
const uploadToS3 = async (content: string, fileName: string): Promise<string> => {
  try {
    // 한글 파일명 인코딩 및 특수문자 처리
    const safeFileName = encodeURIComponent(fileName.replace(/\.[^/.]+$/, ""));
    // public/ 접두사를 추가하여 S3 경로 설정
    const filePath  = `public/works/${safeFileName}-${Date.now()}.txt`;
    
    console.log(`업로드 경로: ${filePath}`);

    const uploadTask = uploadData({
      path: filePath,
      data: new Blob([content], { type: 'text/plain' }),
      options: {
        contentType: 'text/plain; charset=utf-8',
      }
    });

    await uploadTask.result;

    console.log('S3 업로드 완료:', filePath);
    return filePath;
  } catch (error) {
    console.error('S3 업로드 오류:', error);
    throw new Error(`S3 업로드 실패: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
  }
};

export default function FileUploadForm({isAdmin}: {isAdmin: boolean}) {
  const [, setWorks] = useState<Work[]>([]);

  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [selectedGenreForUpload, setSelectedGenreForUpload] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState('');
  const [uploadError, setUploadError] = useState<string | null>(null);

  // 글로벌 스토어에서 필요한 함수 가져오기
  const { addWorks } = useWorksStore();

  const genreOptions = ['소설', '시', '수필'];

  useEffect(() => {
    if (genreOptions.length > 0) {
      setSelectedGenreForUpload(genreOptions[0]);
    }
  }, []);


  // 파일 선택 및 장르 변경 핸들러
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFiles(event.target.files);
  };
  const handleGenreChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedGenreForUpload(event.target.value);
  };
  
  // 파일 이름 파싱 헬퍼 함수
  function parseFileName(fileName: string): { title: string; author: string | null } {
    try {
      const baseName = fileName.endsWith('.txt') ? fileName.slice(0, -4) : fileName;
      const firstUnderscoreIndex = baseName.indexOf('_');
      const namePart = firstUnderscoreIndex !== -1 ? baseName.substring(firstUnderscoreIndex + 1) : baseName;
      
      // 모든 대시 위치 찾기
      const dashPositions: number[] = [];
      let pos = namePart.indexOf('-');
      while (pos !== -1) {
        dashPositions.push(pos);
        pos = namePart.indexOf('-', pos + 1);
      }
      
      // 대시가 없는 경우 (잘못된 형식)
      if (dashPositions.length === 0) {
        throw new Error('파일 이름 형식 오류 (대시 문자 "-"가 없음)');
      }
      
      // 대시가 하나만 있는 경우: 저자-제목 형식
      if (dashPositions.length === 1) {
        const author = namePart.substring(0, dashPositions[0]).replace(/_/g, ' ').trim();
        const title = namePart.substring(dashPositions[0] + 1).replace(/_/g, ' ').trim();
        
        if (!title) throw new Error('제목 추출 불가');
        if (!author) throw new Error('저자 추출 불가');
        return { title, author };
      }
      
      // 대시가 두 개인 경우: 저자-제목-출판사 형식
      if (dashPositions.length === 2) {
        const author = namePart.substring(0, dashPositions[0]).replace(/_/g, ' ').trim();
        const title = namePart.substring(dashPositions[0] + 1, dashPositions[1]).replace(/_/g, ' ').trim();
        
        if (!title) throw new Error('제목 추출 불가');
        if (!author) throw new Error('저자 추출 불가');
        return { title, author };
      }
      
      // 대시가 세 개 이상인 경우 (예: 9036962_NT-310-변영로-오 고달픈 心臟[심장]이여)
      // 이 경우 첫 번째, 두 번째 대시는 코드 부분으로 간주하고 
      // 세 번째 대시를 기준으로 저자와 제목을 추출
      const authorStartIndex = dashPositions[1] + 1;
      const authorEndIndex = dashPositions[2];
      const author = namePart.substring(authorStartIndex, authorEndIndex).replace(/_/g, ' ').trim();
      const title = namePart.substring(authorEndIndex + 1).replace(/_/g, ' ').trim();
      
      if (!title) throw new Error('제목 추출 불가');
      if (!author) throw new Error('저자 추출 불가');
      return { title, author };
      
    } catch (e) {
      console.error(`파일 이름 파싱 오류 (${fileName}):`, e);
      throw new Error(`파일 이름 형식 오류: ${e instanceof Error ? e.message : '알 수 없는 오류'}`);
    }
  }
    
  // 파일 내용 읽기 헬퍼
  const readFileContent = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target && typeof event.target.result === 'string') {
          resolve(event.target.result);
        } else {
          reject(new Error('파일 내용을 문자열로 읽을 수 없습니다.'));
        }
      };
      reader.onerror = (error) => reject(error);
      reader.readAsText(file, 'UTF-8');
    });
  };

  // 파일 업로드 핸들러
  const handleFileUpload = async () => {
    if (!selectedFiles || selectedFiles.length === 0 || !selectedGenreForUpload || !isAdmin) return;
    
    setIsUploading(true);
    setUploadProgress(`파일 처리 시작... (총 ${selectedFiles.length}개)`);
    setUploadError(null);
    const results: Array<{ fileName: string; status: 'success' | 'error' | 'skipped'; message?: string }> = [];
    const filesToProcess = Array.from(selectedFiles);

    // 세션 가져오기
    const session = await getSession();
    if (!session?.idToken) {
      setUploadError('ID 토큰을 찾을 수 없습니다. 다시 로그인해주세요.');
      setIsUploading(false);
      return;
    }
    const idToken = session.idToken;
    
    for (let i = 0; i < filesToProcess.length; i++) {
      const file = filesToProcess[i];
      const currentProgress = `(${i + 1}/${filesToProcess.length})`;
      setUploadProgress(`${currentProgress} 처리 중: ${file.name}`);
      
      try {
        // 1. 파일명에서 정보 추출
        const { title, author } = parseFileName(file.name);
                
        // 2. 중복 체크
        setUploadProgress(`${currentProgress} ${file.name} (중복 확인 중...)`);
        
        // 중복 체크 쿼리
        const checkDuplicateQuery = /* GraphQL */ `
          query ListWorks {
            listWorks(limit: 1000) {
              items { 
                id
                title
                author
              }
            }
          }
        `;
        
        type CheckDuplicateResponse = { listWorks: { items: Array<{ id: string, title: string, author: string | null }> } };
        const checkData = await callGraphQLWithToken<CheckDuplicateResponse>(
          checkDuplicateQuery,
          {}
        );
        
        // 제목과 작가가 모두 일치하는지 확인 (대소문자 무시)
        const normalizedTitle = title.toLowerCase().trim();
        const normalizedAuthor = author ? author.toLowerCase().trim() : '';
        
        const duplicateWork = checkData.listWorks.items.find(item => {
          const itemTitle = (item.title || '').toLowerCase().trim();
          const itemAuthor = (item.author || '').toLowerCase().trim();
          
          // 제목 일치 여부 확인
          const titleMatch = itemTitle === normalizedTitle;
          
          // 작가명 일치 여부 확인
          const authorMatch = 
            // 둘 다 작가명이 있고 일치하는 경우
            (normalizedAuthor && itemAuthor && itemAuthor === normalizedAuthor) ||
            // 둘 다 작가명이 없는 경우
            (!normalizedAuthor && !itemAuthor);
          
          // 둘 다 일치하면 중복으로 판단
          return titleMatch && authorMatch;
        });
        
        if (duplicateWork) {
          console.log(`중복 작품 감지: "${title}" (작가: ${author || '없음'}), 기존 ID: ${duplicateWork.id}`);
          results.push({ fileName: file.name, status: 'skipped', message: '이미 존재하는 작품' });
          continue;
        }

        // 3. 파일 내용 읽기
        const content = await readFileContent(file);
        setUploadProgress(`${currentProgress} ${file.name} (DB 저장 중...)`);

        // 파일 크기 체크
        const isFileSizeOk = checkFileSize(content);
        let finalContent: string | null = content;
        let s3Key = null;
        
        if (!isFileSizeOk) {
          // 파일이 크면 S3에 업로드
          setUploadProgress(`${currentProgress} ${file.name} (S3 업로드 중...)`);
          console.log(`파일 크기 초과: ${file.name} (${(new Blob([content]).size / 1024).toFixed(2)}KB > 380KB), S3 업로드 시작`);
          
          try {
            s3Key = await uploadToS3(content, file.name);
            // content는 null로 설정 (S3에만 내용 저장)
            finalContent = null;
          } catch (s3Error) {
            throw new Error(`S3 업로드 실패: ${s3Error instanceof Error ? s3Error.message : '알 수 없는 오류'}`);
          }
        }

        // 4. 작품 생성
        type CreateWorkResponse = { createWork: Work };
        const data = await callGraphQLWithToken<CreateWorkResponse>(
          CREATE_WORK_MUTATION,
          { 
            input: { 
              title, 
              author: author || undefined, 
              genre: selectedGenreForUpload || undefined,
              content: finalContent,
              s3Key: s3Key // S3 키가 있으면 저장, 없으면 null
            } 
          },
          idToken
        );
        
        const newWork = data.createWork;
        if (!newWork) throw new Error("응답 데이터에 createWork가 없습니다.");

        // 5. 성공 처리
        results.push({ fileName: file.name, status: 'success' });
        setWorks(currentWorks => [...currentWorks, newWork]);
      } catch (err) {
        console.error(`파일 처리 실패 (${file.name}):`, err);
        const errorMessage = Array.isArray(err) ? err.map(e => e.message).join(', ') : (err instanceof Error ? err.message : JSON.stringify(err));
        results.push({ fileName: file.name, status: 'error', message: errorMessage });
        setUploadError(`오류 발생 (${file.name}): ${errorMessage}`);
      }
    } // end for loop

    // 최종 결과 메시지 처리
    const successCount = results.filter(r => r.status === 'success').length;
    const failCount = results.filter(r => r.status === 'error').length;
    const skippedCount = results.filter(r => r.status === 'skipped').length;
    const finalMessage = `업로드 완료: 총 ${filesToProcess.length}개 시도, ${successCount}개 성공, ${failCount}개 실패, ${skippedCount}개 건너뜀(중복).`;
    setUploadProgress(finalMessage);
    
    const failedFiles = results.filter(r => r.status === 'error').map(r => `${r.fileName} (오류: ${r.message})`);
    const skippedFiles = results.filter(r => r.status === 'skipped').map(r => `${r.fileName} (사유: ${r.message})`);
    
    // 성공한 작품들을 Zustand 스토어에 추가
    const successWorks = results.filter(r => r.status === 'success');
    if (successWorks.length > 0) {
      // 스토어 갱신을 위해 작품 목록 새로 가져오기
      try {
        const LIST_WORKS_QUERY = /* GraphQL */ `
          query ListWorks {
            listWorks(limit: 1000) {
              items {
                id
                title
                author
                genre
                createdAt
                updatedAt
              }
            }
          }
        `;
        
        type ListWorksResponse = { listWorks: { items: Work[] } };
        const listData = await callGraphQLWithToken<ListWorksResponse>(
          LIST_WORKS_QUERY,
          {}
        );
        
        // 스토어 업데이트
        if (listData.listWorks.items.length > 0) {
          addWorks(listData.listWorks.items);
        }
      } catch (error) {
        console.error('작품 목록 갱신 실패:', error);
      }
    }
    
    let detailMessage = '';
    if (failedFiles.length > 0) { detailMessage += `\n\n실패한 파일:\n${failedFiles.join('\n')}`; }
    if (skippedFiles.length > 0) { detailMessage += `\n\n건너뛴 파일 (중복):\n${skippedFiles.join('\n')}`; }
    
    if (detailMessage) { 
      setUploadError(detailMessage.trim()); 
      alert(`${finalMessage}${detailMessage}`); 
    } else { 
      alert(finalMessage); 
    }
    
    setIsUploading(false);
    const fileInput = document.getElementById('fileUpload') as HTMLInputElement;
    if (fileInput) fileInput.value = ''; 
    setSelectedFiles(null);
  };
  
  return (
    <div className="bg-white shadow rounded-lg p-4 mb-6">
      <h2 className="text-xl font-semibold mb-4">파일 일괄 업로드</h2>
      <div className="space-y-4">
        <div>
          <label htmlFor="fileUpload" className="block text-sm font-medium text-gray-700">텍스트 파일 선택</label>
          <input
            type="file"
            id="fileUpload"
            multiple
            accept=".txt"
            onChange={handleFileChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            disabled={isUploading}
          />
          <p className="mt-1 text-sm text-gray-500">
            파일명 형식: 번호_저자-제목-출판사.txt 또는 번호_저자-제목.txt
          </p>
        </div>
        <div>
          <label htmlFor="genreForUpload" className="block text-sm font-medium text-gray-700">장르 선택 (모든 파일에 적용)</label>
          <select
            id="genreForUpload"
            value={selectedGenreForUpload}
            onChange={handleGenreChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            disabled={isUploading}
          >
            {genreOptions.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>
        <button
          onClick={handleFileUpload}
          disabled={!selectedFiles || selectedFiles.length === 0 || isUploading}
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
        >
          {isUploading ? '업로드 중...' : '파일 업로드'}
        </button>
        {uploadProgress && <p className="text-blue-600">{uploadProgress}</p>}
        {uploadError && <div className="whitespace-pre-wrap text-red-500">{uploadError}</div>}
      </div>
    </div>
  );
} 