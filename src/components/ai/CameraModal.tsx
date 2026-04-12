'use client';
import { useRef, useState } from 'react';
import { useTextbookStore } from '@/store/textbook-store';
import { processImage } from '@/lib/image';
import { solveFromImage } from '@/lib/gemma-client';

export function CameraModal() {
  const setCameraOpen = useTextbookStore((s) => s.setCameraOpen);
  const setAiStatus = useTextbookStore((s) => s.setAiStatus);
  const setLastSolution = useTextbookStore((s) => s.setLastSolution);
  const setStage = useTextbookStore((s) => s.setStage);
  const aiStatus = useTextbookStore((s) => s.aiStatus);

  const fileRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [permissionGranted, setPermissionGranted] = useState(false);

  async function handleFile(file: File) {
    setError(null);
    setAiStatus('solving');
    try {
      const processed = await processImage(file);
      const solution = await solveFromImage(processed);
      setLastSolution(solution);
      setStage(solution.steps);
      setAiStatus('idle');
      setCameraOpen(false);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : '풀이 중 오류가 발생했습니다.');
      setAiStatus('error');
    }
  }

  function handleFilePick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.85)',
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) setCameraOpen(false);
      }}
    >
      <div
        style={{
          background: '#111114',
          border: '1px solid #26262d',
          borderRadius: '12px',
          padding: '32px',
          width: '100%',
          maxWidth: '420px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
        }}
      >
        {/* 헤더 */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#d4ff4f', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '4px' }}>
              AI 풀이
            </p>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: '#ececef', fontWeight: 400, margin: 0 }}>
              문제 사진 찍기
            </h2>
          </div>
          <button
            onClick={() => setCameraOpen(false)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#5a5a66', fontSize: '18px' }}
          >
            ✕
          </button>
        </div>

        {/* 권한 안내 */}
        {!permissionGranted && (
          <div style={{ background: 'rgba(26,26,31,0.6)', border: '1px solid #1a1a1f', borderRadius: '8px', padding: '16px' }}>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#8a8a96', lineHeight: 1.7, margin: 0 }} className="ko-text">
              카메라 접근 권한이 필요합니다. 촬영한 이미지는 AI 풀이 생성에만 사용되며, 서버에 저장되지 않습니다. 이미지의 EXIF 정보(위치, 기기 정보)는 전송 전에 자동으로 제거됩니다.
            </p>
          </div>
        )}

        {/* 업로드 영역 */}
        <div
          style={{
            border: '2px dashed #26262d',
            borderRadius: '8px',
            padding: '32px',
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'border-color 150ms',
          }}
          onClick={() => { setPermissionGranted(true); fileRef.current?.click(); }}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#d4ff4f')}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#26262d')}
        >
          <div style={{ marginBottom: '12px' }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#5a5a66" strokeWidth="1.5">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
          </div>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: '#8a8a96', margin: 0 }}>
            파일 선택 또는 카메라 촬영
          </p>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#3a3a44', marginTop: '6px' }}>
            JPEG · PNG · WebP · 최대 5MB
          </p>
        </div>

        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          capture="environment"
          style={{ display: 'none' }}
          onChange={handleFilePick}
        />

        {/* 상태 */}
        {aiStatus === 'solving' && (
          <div style={{ textAlign: 'center', padding: '16px' }}>
            <div style={{ display: 'inline-block', width: '24px', height: '24px', border: '2px solid #d4ff4f', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite', marginBottom: '8px' }} />
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: '#8a8a96' }}>풀이 생성 중...</p>
          </div>
        )}

        {error && (
          <div style={{ background: 'rgba(212,79,79,0.1)', border: '1px solid rgba(212,79,79,0.2)', borderRadius: '6px', padding: '12px 16px' }}>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: '#d44f4f', margin: 0 }}>
              오류: {error}
            </p>
          </div>
        )}

        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#3a3a44', textAlign: 'center' }} className="ko-text">
          수학 문제만 처리됩니다. 개인정보는 수집되지 않습니다.
        </p>
      </div>
    </div>
  );
}
