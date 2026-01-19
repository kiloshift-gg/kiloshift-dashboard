# Wallet Connection Debug Guide

## Vấn đề: Wallet kết nối được ở localhost nhưng không kết nối được trên production domain

### Các nguyên nhân phổ biến:

## 1. ✅ Privy App ID Domain Whitelist (QUAN TRỌNG NHẤT)

**Vấn đề**: Privy yêu cầu domain production phải được whitelist trong Privy Dashboard.

**Cách kiểm tra và sửa**:
1. Đăng nhập vào [Privy Dashboard](https://dashboard.privy.io/)
2. Chọn App của bạn
3. Vào **Settings** → **App Settings** → **Allowed Origins**
4. Thêm domain production của bạn:
   - `https://learn.kiloshift.gg` (hoặc domain của bạn)
   - Đảm bảo có `https://` và không có trailing slash
5. Lưu lại và đợi vài phút để changes propagate

## 2. ✅ Environment Variables trên Production

**Vấn đề**: `NEXT_PUBLIC_PRIVY_APP_ID` không được set trên hosting platform.

**Cách kiểm tra**:
- Mở browser console trên production site
- Tìm log: `🔍 Privy Debug Info`
- Kiểm tra `hasAppId: true/false`

**Cách sửa** (tùy hosting platform):

### Vercel:
1. Vào project settings → Environment Variables
2. Thêm `NEXT_PUBLIC_PRIVY_APP_ID` với value từ Privy Dashboard
3. Redeploy

### Cloudflare Pages:
1. Vào Pages → Settings → Environment Variables
2. Thêm `NEXT_PUBLIC_PRIVY_APP_ID`
3. Redeploy

### Other platforms:
- Tìm mục Environment Variables trong settings
- Thêm `NEXT_PUBLIC_PRIVY_APP_ID`
- Redeploy

## 3. ✅ HTTPS Requirement

**Vấn đề**: Wallets (Phantom, Solflare) yêu cầu HTTPS trên production.

**Kiểm tra**:
- URL phải bắt đầu bằng `https://` (không phải `http://`)
- SSL certificate phải valid

**Sửa**: Đảm bảo hosting platform của bạn có SSL enabled.

## 4. ✅ CORS Issues với RPC Endpoint

**Vấn đề**: RPC endpoint có thể block requests từ domain production.

**Kiểm tra**:
- Mở Network tab trong DevTools
- Tìm requests đến RPC endpoint
- Xem có CORS errors không

**Sửa**: 
- Nếu dùng custom RPC endpoint, đảm bảo CORS được config đúng
- Hoặc dùng public RPC endpoint như `https://api.mainnet-beta.solana.com`

## 5. ✅ Browser Console Errors

**Cách debug**:
1. Mở production site
2. Mở Browser DevTools (F12)
3. Vào tab **Console**
4. Tìm các errors liên quan đến:
   - `Privy`
   - `wallet`
   - `solana`
   - `window.solana`

**Các errors phổ biến**:
- `NEXT_PUBLIC_PRIVY_APP_ID is not set` → Thiếu env var
- `Privy Error: ...` → Check Privy dashboard settings
- `window.solana is undefined` → Phantom extension chưa được install hoặc bị block

## 6. ✅ Phantom Wallet Extension

**Kiểm tra**:
- User phải có Phantom wallet extension installed
- Extension phải enabled và không bị block bởi browser

**Test**:
- Mở console và gõ: `window.solana`
- Nếu `undefined` → Phantom chưa được install hoặc bị block

## Checklist Debug:

- [ ] Privy App ID được set trong environment variables trên production
- [ ] Domain production được whitelist trong Privy Dashboard
- [ ] Site đang chạy trên HTTPS (không phải HTTP)
- [ ] Phantom wallet extension được install và enabled
- [ ] Browser console không có errors liên quan đến Privy/wallet
- [ ] RPC endpoint accessible từ production domain

## Test Steps:

1. Mở production site
2. Mở Browser DevTools → Console
3. Click "Connect Wallet"
4. Xem console logs để tìm errors
5. Check Network tab để xem requests đến Privy API

## Nếu vẫn không được:

1. Check Privy Dashboard → Logs để xem errors từ Privy side
2. Check hosting platform logs (Vercel/Cloudflare/etc.)
3. So sánh environment variables giữa local và production
4. Test với incognito mode để loại bỏ cache issues
