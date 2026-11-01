// Lớp nhiễu giấy dùng chung cho nền phong thư và tờ thư.
export const NOISE_BG = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 .9  0 0 0 0 .8  0 0 0 .09 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")`;

export const EVENT = {
  // 12:30 giờ Việt Nam (UTC+7), 07/11/2026
  target: Date.UTC(2026, 10, 7, 5, 30, 0),
  place: 'Trường Đại học FPT, Lô E2a-7, Đường D1, Khu Công nghệ cao, Tăng Nhơn Phú, Hồ Chí Minh, Vietnam',
};
