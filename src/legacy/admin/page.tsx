'use client'; // 폼 입력, 상태 관리 등을 위해 클라이언트 컴포넌트

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

// 관리자 페이지 컴포넌트 임포트
import WorksTable from './components/WorksTable';
import WorkForm from './components/WorkForm';
import FileUploadForm from './components/FileUploadForm';

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (status === 'authenticated') {
      const userGroups = session?.user?.groups;
      if (userGroups && userGroups.includes('Admins')) {
        setIsAdmin(true);
      } else {
        alert('접근 권한이 없습니다.');
        router.replace('/');
      }
    } else if (status === 'unauthenticated') {
      router.replace('/api/auth/signin?callbackUrl=/admin');
    }
  }, [session, status, router]);

  // --- 로딩 및 접근 제어 렌더링 ---
  if (status === 'loading') {
    return <div className="container mx-auto p-4 text-center">관리자 페이지 로딩 중...</div>;
  }
  if (!isAdmin) {
    return <div className="container mx-auto p-4 text-center">권한 확인 중 또는 접근 권한 없음...</div>;
  }

  // --- 관리자 페이지 내용 렌더링 --- 
  return (
    <div className="container mx-auto p-4 space-y-12">
      <h1 className="text-2xl font-bold">관리자 페이지 - 작품 관리</h1>
      <p className="text-sm text-gray-600">로그인 계정: {session?.user?.email}</p>

      {/* 작품 목록 테이블 */}
      <WorksTable isAdmin={isAdmin} />

      {/* 작품 추가 폼 */}
      <WorkForm />

      {/* 파일 업로드 폼 */}
      <FileUploadForm isAdmin={isAdmin} />
    </div>
  );
}
