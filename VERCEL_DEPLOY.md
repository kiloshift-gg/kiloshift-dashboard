# Hướng dẫn Deploy lên Vercel

## 🚀 Deploy tự động với Vercel

Vercel tự động detect Next.js và không cần cấu hình đặc biệt!

### Các bước deploy:

1. **Push code lên GitHub/GitLab/Bitbucket**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Kết nối repository với Vercel**
   - Truy cập [vercel.com](https://vercel.com)
   - Đăng nhập/Đăng ký
   - Click "Add New Project"
   - Chọn repository của bạn
   - Vercel sẽ tự động detect Next.js

3. **Cấu hình (Tùy chọn)**
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `./` (hoặc `./blueshift-dashboard` nếu repo là monorepo)
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `.next` (auto-detected)
   - **Install Command**: `npm install` (auto-detected)

4. **Environment Variables (Tùy chọn)**
   
   Vercel sẽ tự động sử dụng `VERCEL_GIT_COMMIT_SHA` cho commit hash.
   
   Nếu muốn set custom RPC endpoint, thêm trong Vercel Dashboard:
   - **Name**: `NEXT_PUBLIC_RPC_ENDPOINT`
   - **Value**: `https://api.mainnet-beta.solana.com` (hoặc RPC endpoint khác)
   
   **Lưu ý**: Không bắt buộc! Ứng dụng sẽ tự động dùng default RPC endpoint nếu không set.

5. **Deploy!**
   - Click "Deploy"
   - Vercel sẽ tự động build và deploy
   - Build script sẽ tự động lấy git commit hash từ `VERCEL_GIT_COMMIT_SHA`

## ✅ Tính năng tự động

- ✅ **Git Commit Hash**: Tự động lấy từ `VERCEL_GIT_COMMIT_SHA`
- ✅ **Build Script**: Tự động chạy `npm run build`
- ✅ **Next.js Detection**: Tự động detect và cấu hình
- ✅ **Environment Variables**: Tự động inject vào build

## 🔧 Cấu hình tùy chọn

### Custom RPC Endpoint

Nếu muốn dùng RPC endpoint khác trên production:

1. Vào Vercel Dashboard → Project Settings → Environment Variables
2. Thêm biến:
   - **Name**: `NEXT_PUBLIC_RPC_ENDPOINT`
   - **Value**: `https://api.mainnet-beta.solana.com` (hoặc RPC endpoint của bạn)
   - **Environment**: Production, Preview, Development (chọn tất cả)

### Node.js Version

Vercel tự động sử dụng Node.js version từ `package.json`:
```json
"engines": {
  "node": ">=20.0.0"
}
```

## 📝 Lưu ý

- **Không cần file `vercel.json`**: Vercel tự động detect Next.js
- **Build script hoạt động tự động**: Script `build.js` tự động detect Vercel environment
- **Git commit hash**: Tự động từ `VERCEL_GIT_COMMIT_SHA`
- **Environment variables**: Không bắt buộc, nhưng có thể set trong Vercel Dashboard

## 🎯 Sau khi deploy

Sau khi deploy thành công:

1. **Preview URL**: Vercel sẽ tạo preview URL cho mỗi commit
2. **Production URL**: Set custom domain trong Vercel Dashboard nếu cần
3. **Auto Deploy**: Mỗi khi push code, Vercel sẽ tự động deploy

## 🐛 Troubleshooting

### Build fails

- Kiểm tra logs trong Vercel Dashboard
- Đảm bảo Node.js version >= 20.0.0
- Kiểm tra dependencies trong `package.json`

### Git commit hash không hiển thị

- Build script tự động sử dụng `VERCEL_GIT_COMMIT_SHA`
- Nếu không có, sẽ fallback về "development"
- Kiểm tra build logs để xem commit hash

### RPC endpoint issues

- Ứng dụng tự động sử dụng default RPC endpoint
- Nếu cần custom, set `NEXT_PUBLIC_RPC_ENDPOINT` trong Vercel Dashboard
- Kiểm tra RPC endpoint có hoạt động không

---

**Hoàn thành!** Vercel sẽ tự động build và deploy ứng dụng của bạn! 🎉


