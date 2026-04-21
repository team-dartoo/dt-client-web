#!/bin/sh

# ============================================================
# Docker Entrypoint for nginx
# ============================================================
# 환경변수를 nginx.conf에 치환하기 위해 envsubst 사용

# 기본값 설정 (docker-compose 등에서 환경변수로 오버라이드 가능)
# standalone 실행 시 127.0.0.1:8080 사용 (연결 실패해도 nginx는 정상 실행)
export GATEWAY_URL=${GATEWAY_URL:-http://127.0.0.1:8080}

# nginx.conf 템플릿에서 환경변수 치환 (원본 파일을 덮어씀)
envsubst '${GATEWAY_URL}' < /etc/nginx/conf.d/default.conf > /etc/nginx/conf.d/default.conf.tmp
mv /etc/nginx/conf.d/default.conf.tmp /etc/nginx/conf.d/default.conf

# 치환된 설정으로 nginx 실행
nginx -g 'daemon off;'
