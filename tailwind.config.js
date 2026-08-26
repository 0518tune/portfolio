/** @type {import('tailwindcss').Config} */
// CDN(cdn.tailwindcss.com) 기본 설정과 동일하게 두어 기존 클래스 렌더링이 바뀌지 않게 한다.
// 클래스를 새로 추가/수정한 뒤에는 반드시 `npm run css` 를 실행해 tailwind.css 를 다시 만들어야 한다.
module.exports = {
  content: ['./index.html', './script.js'],
  theme: {
    extend: {
      // index.html 이 duration-400 을 쓰는데 Tailwind 기본 스케일에 400 이 없다.
      // CDN 에서도 생성되지 않아 조용히 무시되던 값이라 여기서 채워 준다.
      transitionDuration: { 400: '400ms' },
    },
  },
  plugins: [],
};
