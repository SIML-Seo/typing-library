import type { WorkCatalogItem } from './types';

export const previewWorksCatalog: WorkCatalogItem[] = [
  {
    id: 'spring-spring-kim-yujeong',
    title: '봄봄',
    author: '김유정',
    language: 'ko',
    source: '문서 샘플 카탈로그',
    copyrightProof: '저작권 만료 공개 작품 샘플',
    textPath: '/works/spring-spring-kim-yujeong.txt',
  },
  {
    id: 'little-prince-saint-exupery',
    title: '어린 왕자',
    author: '앙투안 드 생텍쥐페리',
    language: 'ko',
    source: '문서 샘플 카탈로그',
    copyrightProof: '저작권 만료 번역본/원문 샘플 운영용 예시',
    parts: [
      { id: 'part-001', title: '1장', path: '/works/little-prince/part-001.v1.txt' },
      { id: 'part-002', title: '2장', path: '/works/little-prince/part-002.v1.txt' },
    ],
  },
  {
    id: 'pride-and-prejudice-austen',
    title: 'Pride and Prejudice',
    author: 'Jane Austen',
    language: 'en',
    source: 'MVP 미리보기 데이터',
    copyrightProof: '저작권 만료 영문 고전 샘플',
    textPath: '/works/pride-and-prejudice-austen.txt',
  },
];
