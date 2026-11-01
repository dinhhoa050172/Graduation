# Thư mời tốt nghiệp – Mai Nguyễn Đình Hòa

Thư mời dự lễ tốt nghiệp (07/11/2026, Đại học FPT), dựng lại từ thiết kế `Thu Moi Van Tay.dc.html` trong Claude Design.

- **Phong thư**: nhấn con dấu sáp → vòng sáng chạy → nắp mở → thư trồi lên → chạm thư để mở thiệp.
- **Thiệp**: ảnh chân dung, dải phim, lời mời, thời gian/địa điểm, đếm ngược, nút mở bản đồ.

## Chạy

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # xuất ra dist/
```

## Cấu trúc

- `src/App.jsx` – chuyển cảnh phong thư → thiệp
- `src/components/EnvelopeScreen.jsx` – màn phong thư
- `src/components/LetterScreen.jsx` – nội dung thiệp
- `src/components/ImageSlot.jsx` – khung ảnh giữ đúng zoom/vị trí cắt như trong Design
- `public/images/` – ảnh (đổi ảnh: thay file cùng tên, chỉnh `view` trong `PHOTOS` nếu cần)
