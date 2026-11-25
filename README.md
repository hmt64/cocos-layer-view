# Cocos Layer View

Chrome extension (Manifest V3) để debug game Cocos Creator (2.x và 3.x) đang chạy trên trình duyệt: tách scene thành các layer 3D, xem cây node, chỉnh Transform / Active và tạm dừng game, tất cả trong một tab **Anatomy** của Chrome DevTools.

Đây là bản sửa từ extension **Cocos Anatomy** trên Chrome Web Store (`dooemmeeahbfkfghniadkbabempkadji`, v0.1.0). Bản gốc thuộc về tác giả của nó.

## Tính năng

- **Tab DevTools "Anatomy"**: toolbar, cây node và Transform nằm trong DevTools, không nổi trên màn hình game. Đóng DevTools thì các cửa sổ nổi tự quay lại.
- **Cây node** giống cc-inspector:
  - Layer view tắt: toàn bộ scene, node inactive hiện mờ kèm nhãn.
  - Layer view bật: các layer có số thứ tự (▸ để tách tiếp), node không tách được (inactive / không vẽ gì) hiện mờ, vẫn chọn và mở con được.
- **Layer view 3D**: tách node thành các lớp theo chiều sâu, chỉnh khoảng cách giữa các lớp, Hide 3D (ẩn camera 3D, chỉ giữ UI 2D).
- **Transform**: Position / Rotation / Scale (kéo chữ X/Y/Z, ↑↓ với Shift ×10 / Alt ×0.1, lăn chuột, gõ + Enter), Reset từng nhóm hoặc tất cả, Copy JSON, All edits.
- **Active**: bật / tắt `node.active`.
- **Pause / Step**: `director.pause()` chỉ dừng logic game (tween, spine, `update()`), vẫn render nên vẫn soi layer được. Step chạy đúng 1 frame.
- **Interact**: trả chuột / phím cho game để chơi tiếp, rồi quay lại đúng nhánh layer đang xem.
- **Layer tự đồng bộ**: node bật / tắt trong lúc chạy (vd WinEffect khi bigwin) tự thêm vào / bỏ khỏi layer view.

## Cài đặt

1. `chrome://extensions` → bật **Developer mode** → **Load unpacked** → chọn folder này.
2. Tắt bản Cocos Anatomy gốc (nếu có) để hai bản không chạy chồng nhau.
3. Mở DevTools (F12) trên trang game → tab **Anatomy**. Nếu trang chưa có tool, bấm **Load Anatomy into the page**.

Bật / tắt layer view: nút **Layer view** trong tab, icon extension, hoặc `Alt+Shift+L`.

## Phím tắt (trong layer view hoặc tab Anatomy)

| Phím | Tác dụng |
|---|---|
| `Alt+Shift+L` | Bật / tắt layer view |
| `I` | Interact (chơi game tiếp) |
| `P` | Pause / Resume logic game |
| `.` | Step 1 frame |
| `Esc` | Về cấp cha / thoát |
| `H` | Ẩn / hiện dòng hướng dẫn |
| `+` / `-` | Zoom |
| Mũi tên | Xoay camera |

## Cấu trúc

```
manifest.json
src/background.js        # inject src/anatomy.js vào trang (icon / phím tắt)
src/anatomy.js           # layer view + API window.__cocosAnatomy (panelState, cmd)
devtools/devtools.js     # tạo tab Anatomy
devtools/panel.*         # giao diện tab, gọi trang qua chrome.devtools.inspectedWindow.eval
```

## Lịch sử

| Version | Thay đổi |
|---|---|
| 0.1.1 – 0.1.5 | Transform editor, cửa sổ Transform nổi, panel Layers dạng cây, chỉnh spacing |
| 0.2.0 | Hỗ trợ game 3D: Hide 3D, Interact, Copy / All edits |
| 0.2.1 | Cây hiện đủ node (inactive / không vẽ gì), ô Active |
| 0.2.2 | Pause / Step, layer tự đồng bộ theo thời gian thực |
| 0.3.0 | Chuyển bảng điều khiển vào tab DevTools "Anatomy", ẩn cửa sổ nổi khi dock |
