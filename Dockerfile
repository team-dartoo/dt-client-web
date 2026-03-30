# ============================================================
# Stage 1: Build (Vite 프로젝트 빌드)
# ============================================================
FROM node:20-alpine AS build

WORKDIR /app

# 의존성 파일 먼저 복사 (Docker 캐싱 최적화)
COPY package.json package-lock.json* ./

# 의존성 설치
RUN npm ci

# 소스 코드 복사
COPY . .

# Vite 프로덕션 빌드 (dist 디렉토리 생성)
RUN npm run build

# ============================================================
# Stage 2: Production (nginx 서버)
# ============================================================
FROM nginx:alpine

# 빌드 결과물을 nginx html 디렉토리로 복사
COPY --from=build /app/dist /usr/share/nginx/html

# nginx 설정 복사
COPY nginx.conf /etc/nginx/conf.d/default.conf

# docker-entrypoint.sh 복사
COPY docker-entrypoint.sh /docker-entrypoint.sh

# 실행 권한 부여
RUN chmod +x /docker-entrypoint.sh

# 포트 노출
EXPOSE 3000

# 엔트리포인트 실행 (환경변수 치환용)
ENTRYPOINT ["/docker-entrypoint.sh"]
