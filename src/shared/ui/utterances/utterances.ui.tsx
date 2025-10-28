'use client';

import { useEffect, useRef } from 'react';

interface UtterancesProps {
  repo: string;
  theme?:
    | 'github-light'
    | 'github-dark'
    | 'preferred-color-scheme'
    | 'github-dark-orange'
    | 'icy-dark'
    | 'dark-blue'
    | 'photon-dark'
    | 'boxy-light';
  issueTerm?: 'pathname' | 'url' | 'title' | 'og:title';
  label?: string;
  crossorigin?: 'anonymous';
}

export function Utterances({
  repo,
  theme = 'preferred-color-scheme',
  issueTerm = 'pathname',
  label,
  crossorigin = 'anonymous',
}: UtterancesProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isLoadedRef = useRef(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || typeof window === 'undefined') return;

    // 이미 로드되었다면 중복 실행 방지
    if (isLoadedRef.current) return;
    isLoadedRef.current = true;

    // 기존 utterances iframe이나 스크립트가 있다면 제거
    const existingElements = container.querySelectorAll(
      'script, .utterances, iframe',
    );
    existingElements.forEach((element) => {
      try {
        element.remove();
      } catch (e) {
        // 제거 중 오류가 발생하면 무시
        console.warn('Failed to remove existing utterances element:', e);
      }
    });

    // DOM이 안정화될 때까지 잠시 대기
    const timer = setTimeout(() => {
      try {
        // utterances 스크립트 생성
        const script = document.createElement('script');
        script.src = 'https://utteranc.es/client.js';
        script.setAttribute('repo', repo);
        script.setAttribute('issue-term', issueTerm);
        if (label) {
          script.setAttribute('label', label);
        }
        script.setAttribute('theme', theme);
        script.setAttribute('crossorigin', crossorigin);
        script.async = true;

        // 스크립트 로드 완료 후 처리
        script.onload = () => {
          console.log('Utterances script loaded successfully');
        };

        script.onerror = (error) => {
          console.error('Failed to load utterances script:', error);
          isLoadedRef.current = false; // 오류 시 재시도 가능하도록
        };

        // 컨테이너가 DOM에 연결되어 있는지 확인
        if (container.isConnected && document.body.contains(container)) {
          container.appendChild(script);
        }
      } catch (error) {
        console.error('Error creating utterances script:', error);
        isLoadedRef.current = false; // 오류 시 재시도 가능하도록
      }
    }, 100);

    return () => {
      clearTimeout(timer);
      isLoadedRef.current = false;
      // 컴포넌트가 언마운트될 때 정리
      if (container) {
        const elements = container.querySelectorAll(
          'script, .utterances, iframe',
        );
        elements.forEach((element) => {
          try {
            if (element.parentNode) {
              element.parentNode.removeChild(element);
            }
          } catch (e) {
            // 정리 중 오류가 발생하면 무시
            console.warn('Failed to cleanup utterances element:', e);
          }
        });
      }
    };
  }, [repo, theme, issueTerm, label, crossorigin]);

  return (
    <div
      ref={containerRef}
      className="utterances-container"
      style={{ minHeight: '200px' }}
    />
  );
}
