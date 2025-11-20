# Hướng dẫn Cấu hình Biến Môi trường

## 🎉 Không Cần Biến Môi trường!

Sau khi đơn giản hóa, ứng dụng **KHÔNG CẦN** biến môi trường nữa!

Ứng dụng sẽ tự động sử dụng default RPC endpoint (`https://api.mainnet-beta.solana.com`).
Bạn có thể chạy `npm run dev` ngay mà không cần tạo file `.env.local`.

## ✅ Cách Sử Dụng Đơn Giản

### Chạy Ngay (Không Cần Cấu Hình)

```bash
npm install
npm run dev
```

**Thế thôi!** Ứng dụng sẽ tự động hoạt động.

## 🔧 Tùy Chọn: Custom RPC Endpoint

Nếu bạn muốn sử dụng RPC endpoint khác (ví dụ: devnet, hoặc RPC provider riêng), có thể tạo file `.env.local`:

```env
# Tùy chọn: Custom RPC endpoint
# Nếu không set, sẽ tự động dùng: https://api.mainnet-beta.solana.com
NEXT_PUBLIC_RPC_ENDPOINT=https://api.devnet.solana.com
```

### Các RPC Endpoint Phổ Biến

**Public Endpoints (Miễn phí)**:

- Mainnet: `https://api.mainnet-beta.solana.com`
- Devnet: `https://api.devnet.solana.com`
- Testnet: `https://api.testnet.solana.com`

**RPC Providers (Trả phí, tốt hơn)**:

- QuickNode: https://www.quicknode.com/
- Helius: https://www.helius.dev/
- Alchemy: https://www.alchemy.com/
- Triton: https://triton.one/

## 📝 Biến Môi Trường Đã Loại Bỏ

Các biến sau **KHÔNG CẦN** nữa vì đã loại bỏ các tính năng liên quan:

- ❌ `NEXT_PUBLIC_API_URL` - Đã loại bỏ authentication
- ❌ `NEXT_PUBLIC_CHALLENGE_SECRET` - Đã loại bỏ challenge verification
- ❌ `NEXT_PUBLIC_CHALLENGE_RPC_ENDPOINT` - Đã loại bỏ TypeScript IDE
- ❌ `CERTIFICATION_MINTER_PROGRAM_ID` - Đã loại bỏ NFT system
- ❌ `NEXT_PUBLIC_STAKING_URL` - Đã loại bỏ marketing banner
- ❌ Social links - Đã hardcode trong Footer

## 🎯 Tính Năng Hiện Tại

Sau khi đơn giản hóa, ứng dụng chỉ có:

- ✅ Courses & Lessons (MDX content)
- ✅ Challenges list
- ✅ Wallet connection (optional, chỉ UI)
- ✅ UI components
- ✅ i18n support

**Không cần**:

- ❌ Authentication
- ❌ Challenge verification
- ❌ Code execution
- ❌ NFT system
- ❌ Backend API

## 🚀 Quick Start

1. **Install dependencies**:

   ```bash
   npm install
   ```

2. **Run development server**:

   ```bash
   npm run dev
   ```

3. **Open browser**:
   ```
   http://localhost:3000
   ```

**Không cần tạo file `.env.local`!** Ứng dụng sẽ tự động hoạt động.

## ⚠️ Lưu Ý

- **Wallet Connection**: Vẫn có thể connect wallet (optional), nhưng không bắt buộc
- **RPC Endpoint**: Sử dụng public Solana RPC (có rate limit, nhưng đủ cho development)
- **Content**: Tất cả MDX files được giữ nguyên
- **i18n**: Tất cả translations được giữ nguyên

## 🔍 Troubleshooting

### Nếu gặp lỗi về RPC endpoint

- Ứng dụng tự động sử dụng default RPC endpoint
- Nếu vẫn gặp lỗi, kiểm tra kết nối internet
- Có thể thử set `NEXT_PUBLIC_RPC_ENDPOINT` trong `.env.local` nếu cần

### Nếu muốn dùng RPC provider riêng

1. Đăng ký tài khoản tại RPC provider (QuickNode, Helius, etc.)
2. Tạo RPC endpoint mới
3. Tạo file `.env.local` và set `NEXT_PUBLIC_RPC_ENDPOINT`

---

**Hoàn thành!** Ứng dụng sẵn sàng sử dụng mà không cần cấu hình. 🎉
