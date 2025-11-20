# Tóm Tắt Biến Môi Trường

## 📋 So Sánh Các Options

### Option 1: Minimal Version (Chỉ Giao Diện)

**Mục đích**: Chỉ hiển thị courses và challenges, không có tương tác phức tạp

**Biến môi trường cần thiết**:

```env
# BẮT BUỘC - Cho wallet connection
NEXT_PUBLIC_RPC_ENDPOINT=https://api.mainnet-beta.solana.com
```

**Không cần**:

- ❌ `NEXT_PUBLIC_API_URL`
- ❌ `NEXT_PUBLIC_CHALLENGE_SECRET`
- ❌ `NEXT_PUBLIC_CHALLENGE_RPC_ENDPOINT`
- ❌ `CERTIFICATION_MINTER_PROGRAM_ID`
- ❌ `NEXT_PUBLIC_STAKING_URL`
- ❌ Social links (có thể hardcode)

---

### Option 2: Simplified Version (Có Wallet, Không Backend)

**Mục đích**: Giữ wallet connection và một số tính năng client-side

**Biến môi trường cần thiết**:

```env
# BẮT BUỘC - Cho wallet connection và RPC calls
NEXT_PUBLIC_RPC_ENDPOINT=https://api.mainnet-beta.solana.com

# TÙY CHỌN - Cho challenge IDE (nếu giữ lại)
NEXT_PUBLIC_CHALLENGE_RPC_ENDPOINT=https://api.mainnet-beta.solana.com
```

**Không cần**:

- ❌ `NEXT_PUBLIC_API_URL`
- ❌ `NEXT_PUBLIC_CHALLENGE_SECRET`
- ❌ `CERTIFICATION_MINTER_PROGRAM_ID`
- ❌ `NEXT_PUBLIC_STAKING_URL`

---

### Option 3: Current Version (Giữ Nguyên)

**Mục đích**: Giữ nguyên tất cả tính năng hiện tại

**Biến môi trường cần thiết**:

```env
# BẮT BUỘC
NEXT_PUBLIC_RPC_ENDPOINT=https://api.mainnet-beta.solana.com
NEXT_PUBLIC_API_URL=https://ai-api.blueshift.gg
NEXT_PUBLIC_CHALLENGE_SECRET=<secret-from-team>

# TÙY CHỌN
NEXT_PUBLIC_CHALLENGE_RPC_ENDPOINT=https://api.mainnet-beta.solana.com
CERTIFICATION_MINTER_PROGRAM_ID=shftxrF75jt6u1nXCkkiarjwz4ENqm1tnummZZuBrDp
NEXT_PUBLIC_STAKING_URL=https://staking.blueshift.gg

# Social Links (có thể hardcode)
NEXT_PUBLIC_TWITTER_LINK=https://x.com/blueshift
NEXT_PUBLIC_GITHUB_LINK=https://github.com/blueshift-gg
NEXT_PUBLIC_DISCORD_LINK=https://discord.gg/blueshift
```

---

## 🎯 Khuyến Nghị

### Nếu chỉ cần giao diện đơn giản:

✅ **Chọn Option 1**

- Chỉ cần 1 biến môi trường: `NEXT_PUBLIC_RPC_ENDPOINT`
- Đơn giản nhất, dễ maintain
- Không cần backend API

### File .env.local cho Option 1:

```env
# Chỉ cần RPC endpoint cho wallet connection
NEXT_PUBLIC_RPC_ENDPOINT=https://api.mainnet-beta.solana.com
```

---

## 📝 Chi Tiết Từng Biến

### `NEXT_PUBLIC_RPC_ENDPOINT` ⚠️ BẮT BUỘC

- **Sử dụng**: Wallet connection, Solana RPC calls
- **Files sử dụng**:
  - `src/contexts/WalletProvider.tsx`
  - `src/app/components/Challenges/*`
  - `src/app/api/stats/route.ts`
- **Options**:
  - Public: `https://api.mainnet-beta.solana.com`
  - Devnet: `https://api.devnet.solana.com`
  - Custom: RPC provider (QuickNode, Helius, etc.)

### `NEXT_PUBLIC_API_URL` ❌ CÓ THỂ LOẠI BỎ

- **Sử dụng**: Authentication, Challenge verification
- **Files sử dụng**:
  - `src/lib/auth/api.ts`
  - `src/hooks/useChallengeVerifier.ts`
  - `src/app/components/Challenges/*`
- **Loại bỏ nếu**: Không cần authentication và challenge verification

### `NEXT_PUBLIC_CHALLENGE_SECRET` ❌ CÓ THỂ LOẠI BỎ

- **Sử dụng**: Challenge verification trong esbuild runner
- **Files sử dụng**:
  - `src/hooks/useEsbuildRunner.ts`
- **Loại bỏ nếu**: Không cần challenge verification

### `NEXT_PUBLIC_CHALLENGE_RPC_ENDPOINT` ❌ CÓ THỂ LOẠI BỎ

- **Sử dụng**: Challenge IDE RPC endpoint
- **Files sử dụng**:
  - `src/app/components/TSChallengeEnv/IDE.tsx`
- **Loại bỏ nếu**: Không cần challenge IDE hoặc dùng chung RPC endpoint

### `CERTIFICATION_MINTER_PROGRAM_ID` ❌ CÓ THỂ LOẠI BỎ

- **Sử dụng**: NFT minting program ID
- **Files sử dụng**:
  - Có thể trong NFT minting hooks
- **Loại bỏ nếu**: Không cần NFT functionality

### Social Links (Optional) ❌ CÓ THỂ HARDCODE

- `NEXT_PUBLIC_TWITTER_LINK`
- `NEXT_PUBLIC_GITHUB_LINK`
- `NEXT_PUBLIC_DISCORD_LINK`
- **Files sử dụng**: `src/app/components/Footer/Footer.tsx`
- **Có thể**: Hardcode trong code thay vì dùng env vars

### `NEXT_PUBLIC_STAKING_URL` ❌ CÓ THỂ LOẠI BỎ

- **Sử dụng**: Marketing banner
- **Files sử dụng**: `src/app/components/MarketingBanner/MarketingBanner.tsx`
- **Loại bỏ nếu**: Không cần marketing banner

---

## ✅ Kết Luận

**Để đơn giản hóa tối đa**, chỉ cần:

```env
NEXT_PUBLIC_RPC_ENDPOINT=https://api.mainnet-beta.solana.com
```

Tất cả các biến khác đều có thể loại bỏ nếu:

- Không cần authentication
- Không cần challenge verification
- Không cần NFT functionality
- Không cần marketing features
- Hardcode social links trong code
