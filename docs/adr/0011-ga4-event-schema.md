# ADR 0011: GA4 이벤트 스키마(DAU = typing_start)

상태: Accepted  
작성일: 2026-03-05  
관련 문서: `/docs/prd.md`, `/docs/requirements.md`, `/docs/testing.md`, `/docs/adr/0005-analytics-ga4.md`

## 컨텍스트

- MVP 성공지표는 DAU다.
- 랜딩만 보고 이탈한 방문을 성공지표에 포함하면 제품 개선 방향이 흐려질 수 있다.
- MVP는 서버가 없고(정적), 결과/내 작품은 로컬 저장이므로 “서버 로그 기반” 지표가 어렵다.
- GA4로 이벤트 기반 DAU/퍼널을 측정하되, **콘텐츠/PII 전송은 금지**한다.

## 결정

### 1) DAU 정의

- MVP의 DAU는 **`typing_start` 이벤트를 발생시킨 유니크 사용자 수(일별)** 로 정의한다.
  - “작품 선택 → 필사 시작”까지 온 사용자를 활성 사용자로 본다.

### 2) 이벤트 목록(최소)

| 이벤트 | 언제 전송 | 목적 |
|---|---|---|
| `typing_start` | 한 세션에서 “첫 입력” 발생 시 1회 | DAU(핵심) + 퍼널 시작 |
| `typing_paragraph_complete` | 문단(=페이지) 완료 시 | 진행/난이도 파악 |
| `typing_complete` | 작품(또는 파트) 완료 시 | 완료율/성과 측정 |
| `my_work_upload` | 내 작품 업로드(파일/붙여넣기) 성공 시 | UGC 사용률 파악 |

메모
- 저장된 드래프트를 “이어하기”로 복원한 경우에도 동일 세션으로 간주하며, `typing_start`를 다시 전송하지 않는다.

### 3) 공통 파라미터(콘텐츠/PII 금지)

> 필사 원문/사용자 입력 텍스트/파일명/작품 제목(사용자 입력)/이메일 등은 **전송 금지**.

권장 공통 파라미터(초안)
- `work_kind` (string): `public` | `my`
- `public_work_id` (string, optional): 공개 작품 id(공개 데이터). `work_kind=public`일 때만 전송
- `work_language` (string, optional): `ko`, `en` 등(공개 작품 메타)
- `typing_session_id` (string, optional): 세션 단위 난수(드래프트 이어하기 동안 유지, 완료/폐기 시 새로 생성, 영구 식별자 아님)
- `punctuation_case_on` (string, optional): `on` | `off` (판정 옵션 스냅샷)
- `app_version` (string, optional): 앱 버전(예: `0.1.0`)

이벤트별 추가 파라미터(초안)
- `typing_paragraph_complete`
  - `paragraph_index` (number): 1부터 시작
  - `mistake_count` (number)
  - `elapsed_time_ms` (number)
- `typing_complete`
  - `elapsed_time_ms` (number)
  - `wpm` (number)
  - `accuracy_percent` (number): 0~100
- `my_work_upload`
  - `upload_source` (string): `file` | `paste`
  - `text_length` (number): 문자 수(콘텐츠 자체는 전송 금지)

## 대안

- 대안 A) 페이지뷰 기반 DAU(랜딩 포함)
  - 장점: 구현 거의 없음
  - 단점: 랜딩 이탈이 DAU에 섞여 지표가 과대평가될 수 있음
- 대안 B) `typing_start` 이벤트 기반 DAU(채택)
  - 장점: 제품 핵심 행동 기반으로 지표가 선명
  - 단점: 이벤트 구현/검증이 필요

## 결과(Consequences)

- GA4 대시보드/탐색에서 “이벤트 = `typing_start`”로 필터링해 일별 유니크 사용자를 확인해야 한다.
- 로컬 개발에서 GA를 끄기 위해 `NEXT_PUBLIC_GA4_MEASUREMENT_ID`가 없으면 이벤트를 전송하지 않는다.
