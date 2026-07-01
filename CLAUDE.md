# 게임 기획자 김태윤 포트폴리오 웹사이트 제작 마스터 가이드

본 문서는 제공된 포트폴리오 이미지와 실시간 라이브 페이지(`https://game-design-portfolio--0518tune.replit.app/`)의 구조, 디자인 톤앤매너, 콘텐츠 내용을 분석하여, 최신 웹 표준 기술셋으로 사이트를 완전히 재구축하고 고도화하기 위한 **'마스터 가이드 스펙북(claude.md)'**입니다. 

기획 프론트엔드, 백엔드 데이터 모델, 배포 파이프라인, 그리고 동적 관리를 위한 어드민 페이지 설계까지 한 번에 복사하여 개발에 활용할 수 있도록 고도로 구조화되어 있습니다.

---

## 1. 프로젝트 개요 및 디자인 시스템

### 1.1 프로젝트 목표
* **전문성 극대화**: '소울라이크 액션 RPG 전투/시스템 기획자'라는 핵심 아이덴티티를 시각적으로 강렬하게 전달.
* **확장성 확보**: 정적 하드코딩 방식에서 벗어나 백엔드 API 및 관리자 페이지(Admin)를 연동하여 상시 업데이트 가능한 구조로 변경.
* **UX/UI 고도화**: 반응형 레이아웃의 완성도를 높이고, 게이밍 감성의 네온 다크 모드 스타일과 스크롤 인터랙션 최적화.

### 1.2 디자인 시스템 사양 (Design System)
* **전체 테마**: 다크 사이버 테크 / 어두운 게이밍 그리드 스타일
* **컬러 팔레트**:
    * `Background`: `#08090a` (딥 블랙) / `#111315` (다크 그레이 섹션 블록)
    * `Primary Accent`: `#2efcb7` (네온 그린 / 민트 계열 - 메인 강조, 활성화 버튼)
    * `Secondary Accent`: `#00f0ff` (네온 블루 / 시안 계열 - 서브 버튼, 링크 강조)
    * `Text Main`: `#ffffff` (화이트)
    * `Text Muted`: `#8a939e` (소프트 회색)
    * `Card/Border`: `#1a1d20` 베이스에 투명도 유기적 조절, 네온 보더 글로우 효과 적용
* **타이포그래피**: 
    * Font-Family: `Pretendard`, `-apple-system`, Sans-Serif 코어 사용
    * 코드 및 기술 스택 영역에 한해 부분적으로 `JetBrains Mono` 또는 `Fira Code` 적용
* **시각 효과**: 백그라운드 무한 스퀘어 그리드 패턴 패턴, 네온 블러 글로우(`box-shadow: 0 0 15px var(--accent)`) 효과.

---

## 2. 기획 및 프론트엔드 아키텍처 (Front-end)

### 2.1 기술 스택 추천
* **Framework**: `Next.js 14+ (App Router)` 또는 `React.js` (SEO 최적화 및 정적 생성 인프라를 위해 Next.js 강력 권장)
* **Styling**: `Tailwind CSS` (빠른 네온 유틸리티 클래스 반영 및 미디어 쿼리 제어)
* **Animation**: `Framer Motion` (섹션 스크롤 페이드인, 버튼 호버 글로우, 다운로드 컴포넌트 인터랙션)
* **Icons**: `Lucide React` 또는 임베디드 SVG (게임 패드, 검, 이중 뇌, 렌치 아이콘 매핑)

### 2.2 레이아웃 및 7대 핵심 섹션 상세 구현 스펙

#### [GNB] Global Navigation Bar
* **좌측**: 로고 타입 `게임기획자 김태윤` (게임패드 SVG 아이콘 + 네온 민트 컬러 컬러링)
* **우측**: `HOME`, `ABOUT`, `PROTOTYPES`, `PORTFOLIO`, `PROJECTS`, `SKILLS`, `CONTACT` 메뉴 링크.
* **동작 사양**: 스크롤 시 상단 고정(`sticky`), 백그라운드 블러 블렌딩(`backdrop-blur-md bg-opacity-70`). 클릭 시 해당 섹션으로 부드러운 스크롤 이동(`scroll-smooth`).

#### [Section 1] HOME (Hero Page)
* **배경**: 미세하게 움직이는 다크 그리드 레이어 + 좌상단/우하단 네온 오라 효과 블러 그래디언트 배경.
* **중앙 콘텐츠**:
    * 배지 태그: `• COMBAT SYSTEM DESIGNER` (라운드 보더, 네온 시안)
    * 메인 타이틀: `김태윤` (대형 볼드체, 시안 그래디언트 섀도우)
    * 서브 카피: "소울라이크 액션 RPG의 전투, 시스템을 전문으로 하는 신입 게임 기획자입니다."
    * 상세 설명: "언리얼 엔진5를 활용한 프로젝트 개발 및 수상 경험이 있으며, 게임 규칙 설계와 시스템 구현에 관심이 많습니다."
* **CTA 버튼 그룹 (3개)**:
    1. `자기소개서 보기` (네온 그린 배경 + 블랙 텍스트) -> About 섹션 또는 관련 모달 링크
    2. `포트폴리오 보기` (네온 블루 배경 + 블랙 텍스트) -> Portfolio 섹션 스크롤 링크
    3. `프로젝트 보기` (다크 투명 배경 + 네온 화이트 보더) -> Projects 섹션 스크롤 링크
* **하단 컴포넌트**: `V` 형태의 바운스 애니메이션 스크롤 유도 인디케이터 어로우.

#### [Section 2] ABOUT (자기소개)
* **좌측 레이아웃**: 프로필 및 핵심 강점 요약 텍스트 서술.
    * "정교한 전투 메커니즘에서 나오는 긴장감과 재미를 경험할 수 있게 설계하는 기획자가 되고 싶어 다음과 같은 노력들을 해왔습니다..."
    * 두 개의 팀 프로젝트 부팀장 역임 강조, 일정 조율 및 기술 이슈 사전 관리 역량 소구.
    * 하단 버튼: `자기소개서 바로보기` (시안), `자기소개서 PDF` (그린 + 다운로드 아이콘)
* **우측 레이아웃**: 핵심 전문 기획 역량 카드 3개 수직 배열 (호버 시 테두리 네온 빛 활성화).
    1. **전투 시스템 설계 (Sword Icon)**: 정교한 타이밍 기반 전투와 섬세한 히트 판정 시스템을 설계해 극한의 긴장감을 구현합니다.
    2. **AI & Behavior Tree (Brain AI Icon)**: AI와 몬스터 행동 패턴 설계를 통해 전투의 깊이와 전략성을 더하며, 다양한 공략 패턴의 재미를 제공합니다.
    3. **시스템 아키텍처 (Wrench Icon)**: 게임 내 인벤토리, 강화, 스킬, 성장 구조 등 전반적인 시스템을 데이터 테이블과 연계해 구축합니다.

#### [Section 3] PROTOTYPES (기획 프로토타입)
* **타이틀**: `기획 프로토타입 (PROTOTYPES)`
* **구현 가이드**: 작성한 슬라이드(게이미피케이션 기획 등)의 전체 슬라이드 썸네일 그리드를 디바이스 프레임 내부에 배치. 클릭 시 대형 라이트박스(Lightbox) 슬라이더 모달 팝업이 활성화되어 사용자가 면밀히 넘겨볼 수 있는 인터랙션 제공 필수.

#### [Section 4] PORTFOLIO (기획서 및 분석서)
* **구조**: 분류 탭 제공 또는 스크롤 다운 형태의 그리드 카드 배치.
* **카드 스펙**:
    1. **전투 시스템 영역 - 코드베인 동행자 디자인 분석서**
       * 설명: 소울라이크 장르의 진입장벽을 낮추고 스토리 몰입을 돕는 핵심 요소인 '동행자 시스템'을 분석 후 역기획. NPC AI의 전투 기여도와 플레이어와의 상호작용 메커니즘 분석.
       * 태그 리스트: `역기획`, `전투 시스템`, `게임 분석`, `소울라이크`, `AI 시스템`
       * 액션 버튼: `분석서 바로보기 (외부링크)`, `분석서 다운로드 (PDF)`
    2. **콘텐츠 영역 - 마비노기 모바일 콘텐츠 기획서**
       * 설명: 마비노기 모바일 할로윈 이벤트 콘텐츠인 '키아 던전의 잃어버린 남매' 기획. 2인 파티 협동 퍼즐과 기믹 중심 방탈출 메커니즘으로 모바일 협동 경험 강화 목적.
       * 태그 리스트: `콘텐츠 기획`, `시스템 설계`, `이벤트 기획`
       * 액션 버튼: `기획서 바로보기 (외부링크)`, `기획서 다운로드 (PDF)`
    3. **기타 퀵 링크 버튼 컴포넌트**: `BT 설계 바로보기`, `데이터 테이블 바로보기` 등 통합 제공.

#### [Section 5] PROJECTS (개발 프로젝트)
* **레이아웃**: 2단 반응형 그리드 시스템 적용. 가로 너비가 좁아지면 단일 열로 스택 빌드.
* **프로젝트 상세 사양**:
    1. **애쉬 제로 (Ash Zero)**
       * 개요: 포스트 아포칼립스 세계관을 배경으로 한 익스트랙션 소울라이크 게임. 하이 리스크 하이 리턴의 파밍 구조와 긴장감 넘치는 전투 시스템 설계.
       * 담당 역할 배지: `부팀장`, `시스템 디자인`, `몬스터 디자인`
       * 기술 스택 배지: `#UE5`, `#C++`
       * 하단 액션 버튼 바: `발표 자료 바로보기`, `발표 자료 다운로드`, `시연 영상 ▷` (클릭 시 YouTube 또는 비디오 레이어 모달 레이어 팝업)
    2. **여우의 복수**
       * 개요: 측면 스크롤로 제작된 러닝 액션 어드벤처 게임. 이후 캐릭터의 역동적인 움직임과 동양적인 색채의 배경을 특징으로 함. 기획부터 개발까지 참여.
       * 담당 역할 배지: `부팀장`, `시스템 디자인`, `블루프린트 개발`, `레벨 기획`
       * 기술 스택 배지: `#UE5`, `#Blueprint`
       * 하단 액션 버튼 바: `발표 자료 바로보기`, `발표 자료 다운로드`, `시연 영상 ▷`

#### [Section 6] SKILLS (보유 스킬 & 자격 & 수상)
* **3열 메인 역량 구조**:
    1. `게임 디자인`: 시스템 디자인, 전투 디자인, 콘텐츠 디자인
    2. `기술 스택`: Unreal Engine 5, Blueprint, Behavior Tree, Data Table Structure
    3. `사용 도구`: Figma, Excel, PPT, SVN
* **하단 2단 레이아웃 (수상 경력 vs 자격증)**:
    * **수상 경력 (Awards)**:
        * 2025 RETURN ALIVE 프로젝트 최우수상 (인하대 미래인재개발원 | 마리오파티)
        * 컴퓨터공학 설계 프로젝트 경진대회 (게임 구현) 우수상 (성결대학교 | 언리얼너무어렵조)
        * 컴퓨터공학 설계 프로젝트 경진대회 (게임 기획) 장려상 (성결대학교 | 언리얼너무어렵조)
    * **자격증 (Certifications)**:
        * Coding Specialist Professional 2급 (Python)
        * 빅데이터 전문가
        * 코딩지도사 1급
        * 자동차운전면허 1종 보통

#### [Section 7] CONTACT (연락처 및 문의 폼)
* **좌측 정보**:
    * 전화번호: `010-5750-7113`
    * 이메일: `0518tune@gmail.com`
* **우측 폼 컴포넌트**:
    * 필드: `이름` (Input), `이메일` (Input), `메시지` (Textarea)
    * 전송 버튼: `메시지 보내기` (네온 그린 배경 플랫 버튼, 비행기 아이콘 임베딩)
    * 인터랙션: 빈 필드가 있거나 이메일 형식이 안 맞을 시 유효성 검사 경고 처리, 성공 시 백엔드 API 연동 성공 토스트 알림 메시지 출력.

#### [Footer] 하단 영역
* **좌측**: `© 게임기획자 김태윤`
* **우측 방문자 수 인디케이터**: `Today 1 | Total 354` (백엔드 카운터 데이터 바인딩 영역)

---

## 3. 기획 및 백엔드 시스템 아키텍처 (Back-end)

### 3.1 백엔드 기술 스택 추천
* **API Runtime**: `Next.js API Routes` (Serverless) 또는 `Node.js + Express`
* **Database**: `Supabase` (PostgreSQL 기반, 무료 티어 제공 및 실시간 데이터 처리 우수) 또는 `MongoDB Atlas`
* **Notification 서비스**: `Nodemailer` (이메일 발송) 또는 `Slack Webhook` (클릭 시 실시간 알림)

### 3.2 RESTful API 엔드포인트 설계

#### 1. 방문자 수 카운터 API (`GET, POST /api/visitors`)
* **기능**: 페이지 로드 시 클라이언트 IP 또는 세션 기반으로 당일 방문자 및 누적 방문자 수 계산 후 리턴.
* **Response 예시**:
    ```json
    {
      "success": true,
      "data": {
        "today": 12,
        "total": 354
      }
    }
    ```

#### 2. Contact 문의 메시지 저장 및 전송 API (`POST /api/contact`)
* **기능**: 사용자가 보낸 이름, 이메일, 본문을 수신하여 DB에 영구 저장하고 기획자 본인의 이메일 또는 슬랙으로 푸시 알림 발송.
* **Validation**: 필수 값 검증 및 이메일 포맷 Regex 검사 수행.
* **Request Body**:
    ```json
    {
      "name": "홍길동",
      "email": "hr@gamecompany.com",
      "message": "태윤님 포트폴리오를 보고 소울라이크 시스템 기획자 포지션 제안을 위해 연락드렸습니다."
    }
    ```

#### 3. 동적 데이터 조회 API (`GET /api/projects`, `GET /api/portfolios` - 선택사양)
* **기능**: 프로젝트 리스트, 수상 이력을 DB에서 동적으로 불러와 클라이언트에 제공함으로써 어드민 페이지에서 수정 시 사이트에 즉시 반영되는 인프라 제공.

### 3.3 관계형 데이터베이스 스키마 설계 (Supabase / PostgreSQL 표준)

```sql
-- 1. 방문자 테이블 (Daily Visitors Trace)
CREATE TABLE visitor_stats (
    id SERIAL PRIMARY KEY,
    date DATE UNIQUE DEFAULT CURRENT_DATE,
    today_count INT DEFAULT 1
);

-- 누적 카운트는 데이터 로우 전체의 SUM 또는 별도 메타 테이블 관리
CREATE TABLE total_stats (
    key VARCHAR(50) PRIMARY KEY,
    value INT DEFAULT 0
);

-- 2. Contact 메시지 수신 테이블
CREATE TABLE contact_messages (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_read BOOLEAN DEFAULT FALSE
);

-- 3. 프로젝트 동적 관리 테이블 (선택 사양 - 고도화용)
CREATE TABLE projects (
    id SERIAL PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    roles VARCHAR(50)[], -- 부팀장, 시스템 디자인 등 배열 구조
    tags VARCHAR(50)[],  -- #UE5, #C++ 등
    url_view VARCHAR(255),
    url_download VARCHAR(255),
    url_video VARCHAR(255),
    order_index INT DEFAULT 0
);
```

---

## 4. 배포 인프라 및 환경 변수 관리 (Deployment)

### 4.1 배포 플랫폼 파이프라인
* **Front-end & Serverless API**: `Vercel` (GitHub 레포지토리 연동을 통한 Main 브랜치 Push 시 자동 빌드 및 SSL 인증서 즉시 발급)
* **Database**: `Supabase Cloud` (AWS 서울 리전 배포로 지연 시간 최소화)

### 4.2 필수 환경 변수 구성 예시 (`.env.production`)
```env
# Database Credentials
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Mailer Configurations (Contact Form 알림용)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=0518tune@gmail.com
SMTP_PASS=your_app_specific_password

# Admin Credentials
ADMIN_JWT_SECRET=super_secret_session_token_key_for_security
ADMIN_PASSWORD_HASH=$2b$10$YourBcryptHashedPasswordHere
```

---

## 5. 어드민 관리자 전용 대시보드 페이지 (Admin Panel)

* **진입 경로**: 보안을 위해 예측 불가능한 URL 경로 설정 필수 (예: `/admin-panel-secret-gate`)
* **인증 방식**: Next-Auth 기반 로그인 또는 관리자 단일 계정 비밀번호 암호화(Bcrypt) 토큰 매칭 알고리즘 적용 및 JWT 세션 유지.

### 5.1 핵심 관리 기능 요구사항
1.  **메인 대시보드 (Dashboard View)**:
    * 실시간 오늘 방문자 수 / 누적 방문자 수 데이터 카드 배치.
    * 읽지 않은 Contact 문의 메시지 카운트 인디케이터 표시.
2.  **Contact 메시지 매니저 (Messages Management)**:
    * 수신된 모든 채용 및 협업 제안 목록 테이블 뷰 출력.
    * 특정 행 클릭 시 전체 내용 상세 보기 팝업 활성화.
    * `읽음 처리(Mark as Read)` 및 인사담당자 분류 피드백 기능, 필요 없는 스팸성 메시지 `삭제(Delete)` API 트리거 버튼 연동.
3.  **포트폴리오 데이터 수정 툴 (Content CRUD - 선택사양 고도화 시)**:
    * 기존 프로젝트의 다운로드 링크 URL, 시연 영상 YouTube 주소 변경 시 코드를 직접 고치지 않고 대시보드 내 Input 폼에서 즉시 변경 후 `저장`하는 시스템 인터페이스 구축.

---

## 6. 단계별 빌드 앤 런 가이드 (Implementation Roadmap)

* **[Phase 1] 개발 환경 세팅**: Next.js 프로젝트 생성 및 Tailwind CSS 네온 그리드 레이아웃 스타일 파일 이식.
* **[Phase 2] 프론트 뷰 퍼블리싱**: 제공된 1~10번 썸네일 구조에 입각하여 시각 디자인 요소 및 컴포넌트 마크업 코딩, Framer Motion 트리거 부착.
* **[Phase 3] 백엔드 DB 연동**: Supabase 테이블 빌드 및 `visitor`, `contact` 핸들러 API 작성 후 컴포넌트 훅(`useEffect` / `useSWR`) 바인딩.
* **[Phase 4] 어드민 페이지 구현**: `/admin` 라우트 하위에 데이터 그리드 생성 및 세션 가드(Session Guard) 적용.
* **[Phase 5] 프로덕션 릴리즈**: GitHub 연동을 통한 Vercel 프로덕션 도메인 포워딩 및 최종 폼 검증 모니터링 수행.
