# Phân Tích Codebase và Đề Xuất Đơn Giản Hóa

## 📊 Tổng Quan Codebase

### Cấu Trúc Chính

- **Framework**: Next.js 15 với App Router
- **UI**: React 19, Tailwind CSS
- **Blockchain**: Solana Web3.js, Wallet Adapter
- **i18n**: next-intl (hỗ trợ đa ngôn ngữ)
- **State Management**: Zustand, TanStack Query
- **Code Execution**: esbuild (chạy TypeScript trong browser)

---

## 🎯 Tính Năng Hiện Tại

### 1. **Core Features (Cần Giữ)**

✅ **Courses & Lessons**

- Hiển thị danh sách courses
- Trang lesson với MDX content
- Table of contents, navigation
- **Phụ thuộc**: Chỉ cần MDX files, không cần env vars

✅ **Challenges List**

- Hiển thị danh sách challenges
- Filter, search, pagination
- **Phụ thuộc**: Chỉ cần metadata, không cần env vars

✅ **UI Components**

- Header, Footer, Navigation
- Cards, Buttons, Modals
- Icons, Graphics
- **Phụ thuộc**: Không cần env vars (trừ social links - optional)

✅ **Wallet Connection**

- Solana wallet adapter (Phantom, Solflare)
- Wallet connection UI
- **Phụ thuộc**: `NEXT_PUBLIC_RPC_ENDPOINT` (BẮT BUỘC)

### 2. **Advanced Features (Có Thể Đơn Giản Hóa/Loại Bỏ)**

⚠️ **Authentication System**

- JWT-based authentication với wallet signature
- Token storage, session management
- **Phụ thuộc**: `NEXT_PUBLIC_API_URL`
- **Đề xuất**: Có thể loại bỏ nếu chỉ cần wallet connection (không cần backend)

⚠️ **Challenge Verification**

- Upload program (.so files) để verify
- Upload transactions để verify
- API integration với backend
- **Phụ thuộc**: `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_CHALLENGE_SECRET`
- **Đề xuất**: Loại bỏ nếu không có backend API

⚠️ **TypeScript Challenge IDE**

- Code editor với Monaco Editor
- Code execution với esbuild
- RPC call interception
- Transaction simulation
- **Phụ thuộc**: `NEXT_PUBLIC_RPC_ENDPOINT`, `NEXT_PUBLIC_CHALLENGE_RPC_ENDPOINT`, `NEXT_PUBLIC_CHALLENGE_SECRET`
- **Đề xuất**: Có thể đơn giản hóa hoặc loại bỏ nếu chỉ cần hiển thị code

⚠️ **NFT/Certificate System**

- NFT generation và minting
- Certificate display
- Collection stats
- **Phụ thuộc**: `CERTIFICATION_MINTER_PROGRAM_ID`, `NEXT_PUBLIC_RPC_ENDPOINT`
- **Đề xuất**: Loại bỏ nếu không cần NFT functionality

⚠️ **Stats API**

- API route để fetch challenge stats từ Solana
- Decode NFT collection data
- **Phụ thuộc**: `NEXT_PUBLIC_RPC_ENDPOINT`
- **Đề xuất**: Có thể loại bỏ nếu không cần thống kê

⚠️ **Marketing Features**

- Marketing banner
- Staking URL
- Modal prompts
- **Phụ thuộc**: `NEXT_PUBLIC_STAKING_URL`
- **Đề xuất**: Có thể loại bỏ hoặc đơn giản hóa

---

## 🔧 Phân Tích Biến Môi Trường

### Biến Bắt Buộc (Hiện Tại)

| Biến                                 | Sử Dụng                      | Có Thể Loại Bỏ?                       |
| ------------------------------------ | ---------------------------- | ------------------------------------- |
| `NEXT_PUBLIC_RPC_ENDPOINT`           | Wallet connection, RPC calls | ❌ Không (cần cho wallet)             |
| `NEXT_PUBLIC_API_URL`                | Auth, Challenge verification | ✅ Có (nếu loại bỏ auth/verification) |
| `NEXT_PUBLIC_CHALLENGE_SECRET`       | Challenge verification       | ✅ Có (nếu loại bỏ verification)      |
| `NEXT_PUBLIC_CHALLENGE_RPC_ENDPOINT` | Challenge IDE                | ✅ Có (nếu loại bỏ IDE)               |
| `CERTIFICATION_MINTER_PROGRAM_ID`    | NFT minting                  | ✅ Có (nếu loại bỏ NFT)               |

### Biến Tùy Chọn

| Biến                       | Sử Dụng            | Có Thể Loại Bỏ?            |
| -------------------------- | ------------------ | -------------------------- |
| `NEXT_PUBLIC_TWITTER_LINK` | Footer social link | ✅ Có (có thể hardcode)    |
| `NEXT_PUBLIC_GITHUB_LINK`  | Footer social link | ✅ Có (có thể hardcode)    |
| `NEXT_PUBLIC_DISCORD_LINK` | Footer social link | ✅ Có (có thể hardcode)    |
| `NEXT_PUBLIC_STAKING_URL`  | Marketing banner   | ✅ Có (nếu loại bỏ banner) |
| `NEXT_PUBLIC_COMMIT_HASH`  | Footer build info  | ✅ Có (optional)           |

---

## 🎨 Đề Xuất Đơn Giản Hóa

### Option 1: Minimal Version (Chỉ Giao Diện)

**Mục tiêu**: Chỉ hiển thị courses và challenges, không có tương tác phức tạp

**Loại bỏ**:

- ❌ Authentication system
- ❌ Challenge verification
- ❌ TypeScript IDE/Code runner
- ❌ NFT/Certificate system
- ❌ Stats API
- ❌ Marketing banner

**Giữ lại**:

- ✅ Courses & Lessons (MDX content)
- ✅ Challenges list (metadata only)
- ✅ Wallet connection (chỉ để hiển thị, không cần auth)
- ✅ UI components
- ✅ i18n support

**Biến môi trường cần thiết**:

```env
# Chỉ cần RPC endpoint cho wallet connection (có thể dùng public endpoint)
NEXT_PUBLIC_RPC_ENDPOINT=https://api.mainnet-beta.solana.com
```

### Option 2: Simplified Version (Có Wallet, Không Backend)

**Mục tiêu**: Giữ wallet connection và một số tính năng cơ bản, loại bỏ backend dependencies

**Loại bỏ**:

- ❌ Authentication system (backend API)
- ❌ Challenge verification (backend API)
- ❌ Stats API (hoặc đơn giản hóa)
- ❌ Marketing banner

**Giữ lại**:

- ✅ Courses & Lessons
- ✅ Challenges list
- ✅ Wallet connection
- ✅ TypeScript IDE (đơn giản hóa, không cần verification)
- ✅ UI components

**Biến môi trường cần thiết**:

```env
NEXT_PUBLIC_RPC_ENDPOINT=https://api.mainnet-beta.solana.com
# NEXT_PUBLIC_CHALLENGE_RPC_ENDPOINT (optional, fallback to main RPC)
```

### Option 3: Current Version (Giữ Nguyên)

**Mục tiêu**: Giữ nguyên tất cả tính năng

**Biến môi trường cần thiết**:

```env
NEXT_PUBLIC_RPC_ENDPOINT=https://api.mainnet-beta.solana.com
NEXT_PUBLIC_API_URL=https://ai-api.blueshift.gg
NEXT_PUBLIC_CHALLENGE_SECRET=<secret>
NEXT_PUBLIC_CHALLENGE_RPC_ENDPOINT=<optional>
CERTIFICATION_MINTER_PROGRAM_ID=shftxrF75jt6u1nXCkkiarjwz4ENqm1tnummZZuBrDp
NEXT_PUBLIC_TWITTER_LINK=https://x.com/blueshift
NEXT_PUBLIC_GITHUB_LINK=https://github.com/blueshift-gg
NEXT_PUBLIC_DISCORD_LINK=https://discord.gg/blueshift
NEXT_PUBLIC_STAKING_URL=<optional>
```

---

## 📝 Kế Hoạch Đơn Giản Hóa (Option 1 - Minimal)

### Bước 1: Loại Bỏ Authentication

**Files cần xóa/sửa**:

- `src/contexts/AuthContext.tsx` → Đơn giản hóa, chỉ giữ wallet connection
- `src/hooks/useAuth.ts` → Loại bỏ
- `src/lib/auth/*` → Loại bỏ toàn bộ
- `src/app/[locale]/layout.tsx` → Loại bỏ `<AuthProvider>`

**Thay đổi**:

- Wallet connection chỉ để hiển thị, không cần sign message
- Loại bỏ tất cả logic liên quan đến JWT token

### Bước 2: Loại Bỏ Challenge Verification

**Files cần xóa/sửa**:

- `src/hooks/useChallengeVerifier.ts` → Loại bỏ
- `src/app/components/Challenges/ProgramChallengesContent.tsx` → Đơn giản hóa
- `src/app/components/Challenges/ClientChallengesContent.tsx` → Đơn giản hóa
- `src/app/components/Challenges/ChallengePageContainer.tsx` → Đơn giản hóa

**Thay đổi**:

- Challenge pages chỉ hiển thị content, không có verification
- Loại bỏ upload program/transaction functionality

### Bước 3: Loại Bỏ TypeScript IDE

**Files cần xóa/sửa**:

- `src/hooks/useEsbuildRunner.ts` → Loại bỏ
- `src/hooks/useEsbuild.ts` → Loại bỏ
- `src/app/components/TSChallengeEnv/*` → Loại bỏ hoặc đơn giản hóa
- `src/lib/challenges/*` → Loại bỏ

**Thay đổi**:

- Challenge pages chỉ hiển thị code blocks, không có code execution
- Loại bỏ Monaco Editor và esbuild integration

### Bước 4: Loại Bỏ NFT/Certificate System

**Files cần xóa/sửa**:

- `src/hooks/useMinter.ts` → Loại bỏ
- `src/hooks/useMintNFT.ts` → Loại bỏ
- `src/hooks/useNftOwnership.ts` → Loại bỏ
- `src/lib/nft/*` → Loại bỏ
- `src/app/components/NFTViewer/*` → Loại bỏ
- `src/app/[locale]/nft-generator/*` → Loại bỏ
- `src/app/api/stats/*` → Loại bỏ

**Thay đổi**:

- Loại bỏ tất cả logic liên quan đến NFT minting và certificate

### Bước 5: Đơn Giản Hóa UI Components

**Files cần sửa**:

- `src/app/components/Footer/Footer.tsx` → Hardcode social links
- `src/app/components/MarketingBanner/MarketingBanner.tsx` → Loại bỏ
- `src/app/components/Modals/*` → Đơn giản hóa, loại bỏ auth-related modals
- `src/app/[locale]/layout.tsx` → Loại bỏ MarketingBanner

### Bước 6: Cập Nhật Environment Variables

**File mới**: `.env.local`

```env
# Chỉ cần RPC endpoint cho wallet connection
NEXT_PUBLIC_RPC_ENDPOINT=https://api.mainnet-beta.solana.com
```

---

## 🔍 Files Cần Xóa (Option 1)

### Authentication

- `src/contexts/AuthContext.tsx`
- `src/hooks/useAuth.ts`
- `src/lib/auth/*` (toàn bộ folder)

### Challenge Verification

- `src/hooks/useChallengeVerifier.ts`
- `src/hooks/useAutoSave.ts` (nếu chỉ dùng cho challenges)

### Code Execution

- `src/hooks/useEsbuildRunner.ts`
- `src/hooks/useEsbuild.ts`
- `src/app/components/TSChallengeEnv/*` (toàn bộ folder)
- `src/lib/challenges/*` (toàn bộ folder)

### NFT/Certificate

- `src/hooks/useMinter.ts`
- `src/hooks/useMintNFT.ts`
- `src/hooks/useNftOwnership.ts`
- `src/lib/nft/*` (toàn bộ folder)
- `src/app/components/NFTViewer/*` (toàn bộ folder)
- `src/app/[locale]/nft-generator/*` (toàn bộ folder)
- `src/app/api/stats/*` (toàn bộ folder)

### Marketing

- `src/app/components/MarketingBanner/*` (toàn bộ folder)

### Modals (một số)

- `src/app/components/Modals/ConnectWalletRecommended.tsx` (có thể giữ)
- `src/app/components/Modals/ChallengeComplete.tsx` (loại bỏ nếu không có verification)

---

## 📦 Dependencies Có Thể Loại Bỏ

### Nếu loại bỏ Authentication:

- Không cần thay đổi (jose có thể đã được dùng ở nơi khác)

### Nếu loại bỏ Code Execution:

- `esbuild-wasm` - có thể loại bỏ
- `monaco-editor` - có thể loại bỏ
- `@monaco-editor/react` - có thể loại bỏ

### Nếu loại bỏ NFT:

- Không cần thay đổi (các thư viện Solana vẫn cần cho wallet)

---

## ✅ Checklist Đơn Giản Hóa

### Phase 1: Loại Bỏ Backend Dependencies

- [ ] Loại bỏ AuthContext và authentication logic
- [ ] Loại bỏ challenge verification
- [ ] Loại bỏ API calls đến backend
- [ ] Cập nhật WalletProvider để chỉ connect wallet

### Phase 2: Loại Bỏ Complex Features

- [ ] Loại bỏ TypeScript IDE và code execution
- [ ] Loại bỏ NFT/Certificate system
- [ ] Loại bỏ Stats API
- [ ] Đơn giản hóa challenge pages

### Phase 3: Đơn Giản Hóa UI

- [ ] Loại bỏ MarketingBanner
- [ ] Hardcode social links trong Footer
- [ ] Đơn giản hóa modals
- [ ] Loại bỏ các components không cần thiết

### Phase 4: Cleanup

- [ ] Xóa unused files
- [ ] Xóa unused dependencies
- [ ] Cập nhật .env.local (chỉ giữ RPC_ENDPOINT)
- [ ] Cập nhật documentation

---

## 🎯 Kết Quả Mong Đợi

### Sau khi đơn giản hóa (Option 1):

- **Biến môi trường**: Chỉ cần 1 biến (`NEXT_PUBLIC_RPC_ENDPOINT`)
- **Dependencies**: Giảm đáng kể (loại bỏ esbuild-wasm, monaco-editor)
- **Code complexity**: Giảm ~40-50%
- **Features**: Chỉ còn courses, challenges list, wallet connection
- **Backend**: Không cần backend API

### Tính năng còn lại:

- ✅ Hiển thị courses và lessons (MDX content)
- ✅ Hiển thị challenges list
- ✅ Wallet connection (chỉ để hiển thị)
- ✅ UI components và navigation
- ✅ i18n support
- ✅ Search và filter

---

## 📌 Lưu Ý

1. **Backup code trước khi xóa**: Nên tạo branch mới hoặc backup code gốc
2. **Test từng bước**: Sau mỗi phase, test để đảm bảo app vẫn hoạt động
3. **Giữ nguyên content**: Không xóa MDX files trong `src/app/content/`
4. **i18n**: Giữ nguyên i18n support nếu cần đa ngôn ngữ
5. **Wallet**: Vẫn giữ wallet connection để tương lai có thể mở rộng

---

## 🚀 Next Steps

1. Quyết định option nào phù hợp (1, 2, hoặc 3)
2. Tạo branch mới: `git checkout -b simplify-codebase`
3. Bắt đầu với Phase 1 (loại bỏ backend dependencies)
4. Test và fix lỗi sau mỗi phase
5. Cập nhật documentation

---

## 💡 Gợi Ý

Nếu chỉ cần **giao diện đơn giản** để hiển thị courses và challenges:

- **Chọn Option 1** (Minimal Version)
- Chỉ cần `NEXT_PUBLIC_RPC_ENDPOINT` cho wallet connection
- Loại bỏ tất cả backend dependencies
- Giữ nguyên UI và content (MDX files)

Nếu cần **một số tính năng tương tác** nhưng không có backend:

- **Chọn Option 2** (Simplified Version)
- Giữ wallet connection và một số tính năng client-side
- Loại bỏ backend API calls
- Có thể giữ TypeScript IDE nhưng không có verification
