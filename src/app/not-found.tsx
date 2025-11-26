import Link from 'next/link';

// 이 컴포넌트는 App Router에서 페이지를 찾을 수 없을 때(404 에러) 자동으로 표시됩니다.
export default function NotFound() {
  return (
    // 1. 전체 레이아웃: 화면 중앙에 내용을 배치합니다.
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-gray-800 p-4">
      {/* 2. 에러 코드 (가장 크게) */}
      <h1 className="text-8xl md:text-9xl font-extrabold tracking-widest text-gray-800">
        404
      </h1>

      {/* 3. 구분선 역할 및 컨테이너 디자인에 통일감을 줍니다. */}
      <div className="bg-black px-2 text-sm rounded rotate-12 absolute text-white">
        Not Found
      </div>

      {/* 4. 사용자에게 전달하는 명확한 메시지 */}
      <p className="mt-8 text-xl text-gray-500 text-center">
        죄송합니다. 요청하신 페이지는 존재하지 않거나 제거되었습니다.
      </p>

      {/* 5. 메인으로 돌아가는 버튼 (가장 중요한 동작) */}
      <Link href="/">
        <button className="mt-6 inline-block px-6 py-3 text-sm font-medium leading-none text-white bg-gray-800 border border-transparent rounded-lg shadow-md hover:bg-black transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800">
          Hololog 메인으로 돌아가기
        </button>
      </Link>
    </div>
  );
}
