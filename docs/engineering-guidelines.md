# 엔지니어링 가이드

버전: v0.1 (Draft)
작성일: 2026-03-06

## 0) 목적

이 문서는 새 MVP 구현에서 **어디까지 방어코딩을 허용하고, 어디서는 단순함을 우선할지** 고정한다.
핵심 목표는 아래 2가지다.

- 외부 입력과 저장소 경계에서는 고장을 빨리 드러내고 안전하게 처리한다
- 내부 도메인 로직에서는 과한 guard, silent fallback, 중복 검증을 피한다

## 1) 핵심 원칙

- 경계에서는 방어한다
- 내부에서는 계약을 믿는다
- 실패는 숨기지 않는다
- fallback은 정책일 때만 쓴다
- 에러 메시지와 사용자 메시지는 분리한다

## 2) 경계와 내부를 구분하는 기준

### 2.1 경계(Boundary)

아래 구간은 **방어코딩을 강하게 허용**한다.

- 사용자 입력
  - 검색창
  - 내 작품 업로드(`.txt`, 붙여넣기)
  - URL 파라미터
- 외부 읽기
  - `works origin`의 `index.json`
  - 원문 텍스트 fetch
- 브라우저 저장소
  - IndexedDB open / read / write
  - LocalStorage read / write
- 브라우저 환경 의존
  - `window`, `document`, `indexedDB` 존재 여부

이 구간에서는 다음을 허용한다.

- 입력값 검증
- 명시적 에러 발생
- 실패 사유를 구분하는 `try/catch`
- 사용자용 fallback UI
- 안전한 기본값

### 2.2 내부(Internal)

아래 구간은 **과한 방어코딩을 금지**한다.

- 문단 분절 함수
- 오타 판정 함수
- 정확도 / WPM 계산 함수
- 이미 검증된 작품 메타데이터를 사용하는 렌더링 로직
- `features/typing/*` 내부의 순수 계산 함수

이 구간에서는 다음을 지양한다.

- `null`/`undefined` 체크 반복
- `try/catch`로 버그 숨기기
- `?? 0`, `?? []`, `|| ''` 같은 습관적 기본값
- 모든 예외를 동일 fallback으로 덮기

## 3) 이 프로젝트에서의 적용 규칙

### 3.1 `src/shared/lib/*`

- 외부 시스템과 만나는 공통 레이어다
- fetch 응답 상태, JSON 형식, 환경변수 존재 여부를 검증한다
- 오류는 “작품 없음”, “형식 오류”, “네트워크 실패”를 구분해서 드러낸다

### 3.2 `src/shared/db/*`

- IndexedDB open 실패, 지원 불가, 트랜잭션 실패를 명시적으로 처리한다
- 저장소 키와 레코드 shape는 여기서 강하게 검증한다
- 대신 호출자가 이미 만든 정상 레코드를 다시 여러 번 방어하지는 않는다

### 3.3 `src/features/library/*`

- works catalog는 외부 데이터이므로 파싱/검증을 한다
- UI에서는 오류 상태를 보여줄 수 있지만, 데이터 오류를 “정상 작품 0개”처럼 위장하지 않는다

### 3.4 `src/features/typing/*`

- 가장 중요한 규칙: **도메인 로직은 단순하게 유지한다**
- 입력 판정 엔진은 “이미 정규화된 문자열”을 받는다고 가정한다
- 정규화, 변환, 예외 처리는 바깥 레이어에서 끝낸다

### 3.5 `src/features/results/*`

- 결과 저장 실패는 조용히 무시하지 않는다
- 사용자에게 “저장 실패”를 보여줄 수는 있지만, 성공한 것처럼 보이게 만들지 않는다

## 4) 금지 패턴

아래 패턴은 특별한 이유가 없으면 넣지 않는다.

- `catch { return [] }`
- `catch { return null }`
- `catch { return defaultValue }`
- `value ?? 0` / `value ?? []` / `value ?? ''` 남용
- 이미 타입이 고정된 값에 대한 반복 guard
- 불가능한 상태를 가정한 중복 분기
- 로그만 찍고 계속 진행
- 사용자 입력 오류와 시스템 오류를 같은 메시지로 처리

## 5) 허용 패턴

아래 패턴은 권장한다.

- boundary에서 한 번만 검증
- 검증 통과 후 내부 함수는 단순 계산만 수행
- fallback은 정책일 때만 사용
- 시스템 실패는 명시적으로 드러내기
- 복구 가능한 UI fallback은 화면 계층에서만 처리

## 6) 좋은 예 / 나쁜 예

### 6.1 나쁜 예

```ts
export async function loadWorks() {
  try {
    const response = await fetch('/works/index.json');
    return (await response.json()) ?? [];
  } catch {
    return [];
  }
}
```

문제

- 네트워크 실패와 “작품이 실제로 0개”인 상태가 구분되지 않는다
- 장애가 정상 상태처럼 보인다

### 6.2 더 나은 예

```ts
export async function loadWorks() {
  const response = await fetch('/works/index.json');

  if (!response.ok) {
    throw new Error(`Failed to load works index: ${response.status}`);
  }

  const payload = await response.json();
  return parseCatalog(payload);
}
```

장점

- 실패 원인이 드러난다
- 파싱 책임과 네트워크 책임이 분리된다

### 6.3 나쁜 예

```ts
function calculateAccuracy(total?: number, typoCount?: number) {
  if (!total) return 0;
  if (!typoCount) return 100;
  return ((total - typoCount) / total) * 100;
}
```

문제

- `0`, `undefined`, `NaN`가 모두 같은 의미로 뭉개진다
- 계산 함수가 입력 계약 문제를 숨긴다

### 6.4 더 나은 예

```ts
function calculateAccuracy(total: number, typoCount: number) {
  return ((total - typoCount) / total) * 100;
}
```

전제

- `total > 0` 검증은 boundary에서 끝낸다

## 7) fallback 규칙

fallback은 아래 둘 중 하나일 때만 허용한다.

1. **명시적 제품 정책**인 경우
   - works origin 미설정 시 preview catalog 표시
   - 비로그인 상태에서도 local-only로 동작

2. **사용자 경험을 위한 임시 표시**인 경우
   - skeleton UI
   - “불러오는 중” 텍스트

허용하지 않는 경우

- 개발자 실수를 숨기는 fallback
- 데이터 계약 위반을 정상 상태처럼 보이게 하는 fallback

## 8) 에러 처리 규칙

- 사용자 메시지: 간결하게
- 개발자 메시지: 원인 중심으로
- 로그가 필요하면 원본 오류를 함께 남긴다
- 사용자에게는 “작품 목록을 불러오지 못했습니다”를 보여주더라도, 내부에서는 HTTP 상태/파싱 오류를 구분한다

## 9) 체크 질문

코드를 추가할 때 아래를 확인한다.

- 이 검증은 boundary인가, 내부 함수인가?
- 이 fallback은 정책인가, 그냥 편의인가?
- 이 에러를 여기서 삼키면 장애를 숨기게 되지 않는가?
- 이 값은 이미 위에서 검증된 값 아닌가?
- 이 함수는 계산만 해야 하는데 상태 복구까지 떠안고 있지 않은가?

## 10) 현재 MVP 기준 결론

- `works origin`, `IndexedDB`, 업로드 입력, URL 파라미터는 방어코딩 대상이다
- `typing` 엔진, 문단 판정, 지표 계산은 단순한 내부 로직으로 유지한다
- 새 MVP에서는 “절대 안 터지게”보다 **“경계는 안전하게, 내부는 단순하게”**를 기준으로 구현한다
