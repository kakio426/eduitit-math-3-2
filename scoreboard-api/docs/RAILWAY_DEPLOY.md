# Railway 배포 가이드

이 저장소는 게임 정적 파일과 백엔드 코드가 같이 있는 구조입니다. Railway에서는 `scoreboard-api` 폴더만 별도 백엔드 서비스로 배포합니다.

## 1. Railway 프로젝트 구성

권장 구성:

- Service 1: `scoreboard-api`
- Database: Railway PostgreSQL

게임 정적 파일과 이미지는 Railway에서 서빙하지 않습니다. 기존 GitHub Pages 또는 CDN을 사용합니다.

## 1-1. GitHub 연결과 Root Directory

Railway에서 GitHub 저장소를 연결한 뒤 백엔드 서비스 설정에서 Root Directory를 아래처럼 지정합니다.

```text
scoreboard-api
```

이렇게 해야 Railway가 전체 게임 폴더가 아니라 `scoreboard-api/package.json`을 기준으로 Bun 백엔드만 빌드합니다.

권장 서비스 설정:

```text
Root Directory: scoreboard-api
Install Command: bun install --frozen-lockfile
Start Command: bun run start
```

Railway가 Bun 프로젝트를 자동 감지하면 Install Command는 비워 둘 수 있습니다. 그래도 업체 인계 문서에는 위 값을 명시해 두는 것을 권장합니다.

Railway의 모노레포 Root Directory 공식 안내는 <https://docs.railway.com/deployments/monorepo>를 확인합니다.

## 2. 환경 변수

`.env.example` 기준으로 Railway Variables에 넣습니다.

```text
DATABASE_URL=Railway PostgreSQL private URL
FRONTEND_ORIGINS=https://your-github-pages-domain.example
ADMIN_TOKEN=long-random-token
RETENTION_ANSWER_LOG_DAYS=90
PORT=3000
```

Railway PostgreSQL은 가능하면 public URL 대신 private networking 값을 사용합니다.

## 3. DB 준비 명령

첫 배포 전 또는 schema 변경 후 실행합니다.

```bash
bun run prisma:generate
bun run prisma:deploy
bun run prisma:seed
```

`prisma:seed`는 `Lesson` 기본 데이터를 넣습니다. 같은 lesson ID는 upsert라 다시 실행해도 됩니다.

Railway UI에서 별도 pre-deploy command를 쓰거나, Railway CLI/Shell에서 한 번 실행합니다. 업체가 다른 호스팅을 쓴다면 배포 파이프라인에서 `bun run prisma:deploy`를 서버 시작 전에 실행하면 됩니다.

## 4. 배포 명령

Railway Start Command:

```bash
bun run start
```

배포 뒤 확인:

```bash
curl https://your-scoreboard-api.example.com/health
```

정상 응답:

```json
{ "status": "ok" }
```

## 5. 게임 연결

게임 HTML 또는 호스팅 템플릿에서 API 주소를 주입합니다.

```html
<script>
  window.MATHMON_SCOREBOARD_API_URL = "https://your-scoreboard-api.example.com";
</script>
```

API 주소가 비어 있거나 API가 실패해도 게임 완료는 막지 않습니다. 이 경우 순위 화면만 꺼진 상태로 보입니다.

## 6. 비용 방어 설정

Railway Workspace Usage에서 다음을 설정합니다.

- Compute Usage email alert
- Compute Usage hard limit
- API rate limit 유지
- 랭킹 조회 캐시 또는 CDN 캐시 검토

처음 공개 운영은 월 상한을 작게 두고 실제 사용량을 1주일 관찰한 뒤 조정합니다.

## 7. 운영 전 업체 확인 사항

- Railway 계정 소유자
- PostgreSQL 백업 정책
- 관리자 접근 방식
- 이상 점수 숨김/삭제 절차
- 개인정보 처리방침 반영 여부
- 장애 시 게임 화면의 fallback 문구
