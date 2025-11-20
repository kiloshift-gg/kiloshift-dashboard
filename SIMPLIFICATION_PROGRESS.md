# Tiến Độ Đơn Giản Hóa Codebase

## ✅ Đã Hoàn Thành

### Phase 1: Loại Bỏ Backend Dependencies
- ✅ Loại bỏ `AuthProvider` từ `layout.tsx`
- ✅ Đơn giản hóa `WalletMultiButton` - chỉ dùng wallet connection (không có auth)
- ✅ Loại bỏ challenge verification và API calls
- ✅ Loại bỏ NFT collection size fetching từ `ChallengePageContainer`
- ✅ Loại bỏ NFT collection size fetching từ `lesson page`

### Phase 2: Loại Bỏ Complex Features
- ✅ Loại bỏ TypeScript IDE và code execution
- ✅ Đơn giản hóa `ClientChallengesContent` - chỉ hiển thị content
- ✅ Đơn giản hóa `ProgramChallengesContent` - chỉ hiển thị content
- ✅ Đơn giản hóa challenge verify page - chỉ hiển thị content
- ✅ Loại bỏ NFT/Certificate system từ challenge components
- ✅ Loại bỏ Stats API route
- ✅ Đơn giản hóa `ChallengesFooter` - loại bỏ NFT minting
- ✅ Đơn giản hóa `ChallengesList` - loại bỏ NFT ownership checks

### Phase 3: Đơn Giản Hóa UI
- ✅ Loại bỏ MarketingBanner
- ✅ Hardcode social links trong Footer
- ✅ Loại bỏ nft-generator check trong layout
- ✅ Loại bỏ collection size display từ ChallengeLayout

## 🚧 Đang Thực Hiện

### Phase 4: Cleanup
- 🚧 Xóa các files không sử dụng
- 🚧 Loại bỏ unused dependencies

## ⏳ Còn Lại

### Phase 4: Cleanup
- [ ] Xóa các files không sử dụng:
  - `src/contexts/AuthContext.tsx` (không còn được sử dụng)
  - `src/hooks/useAuth.ts` (không còn được sử dụng)
  - `src/lib/auth/*` (không còn được sử dụng)
  - `src/hooks/useChallengeVerifier.ts` (không còn được sử dụng)
  - `src/hooks/useEsbuildRunner.ts` (không còn được sử dụng)
  - `src/hooks/useEsbuild.ts` (không còn được sử dụng)
  - `src/hooks/useMinter.ts` (không còn được sử dụng)
  - `src/hooks/useMintNFT.ts` (không còn được sử dụng)
  - `src/hooks/useNftOwnership.ts` (không còn được sử dụng)
  - `src/lib/nft/*` (không còn được sử dụng - nhưng có thể vẫn được import ở một số nơi)
  - `src/lib/challenges/*` (không còn được sử dụng)
  - `src/app/components/TSChallengeEnv/*` (không còn được sử dụng)
  - `src/app/components/NFTViewer/*` (không còn được sử dụng)
  - `src/app/components/MarketingBanner/*` (không còn được sử dụng)
  - `src/app/[locale]/nft-generator/*` (không còn được sử dụng)
  - `src/app/components/Challenges/ProgramChallengeTable.tsx` (không còn được sử dụng)
  - `src/app/components/Challenges/ClientChallengeTable.tsx` (không còn được sử dụng)
  - `src/app/components/Modals/ChallengeComplete.tsx` (có thể không còn được sử dụng)
- [ ] Loại bỏ unused dependencies:
  - `esbuild-wasm` - có thể loại bỏ
  - `monaco-editor` - có thể loại bỏ
  - `@monaco-editor/react` - có thể loại bỏ
- [ ] Kiểm tra và fix các import errors
- [ ] Test ứng dụng để đảm bảo không có lỗi

## 📝 Files Đã Sửa

1. `src/app/[locale]/layout.tsx` - Loại bỏ AuthProvider
2. `src/app/components/Wallet/WalletMultiButton.tsx` - Đơn giản hóa, chỉ dùng wallet connection
3. `src/app/components/Header/Header.tsx` - Loại bỏ MarketingBanner
4. `src/app/components/Footer/Footer.tsx` - Hardcode social links
5. `src/app/components/Challenges/ChallengePageContainer.tsx` - Loại bỏ NFT collection fetching
6. `src/app/components/Layout/ChallengeLayout.tsx` - Loại bỏ collection size display
7. `src/app/[locale]/challenges/[challengeSlug]/verify/page.tsx` - Đơn giản hóa, chỉ hiển thị content
8. `src/app/components/Challenges/ProgramChallengesContent.tsx` - Đơn giản hóa hoàn toàn
9. `src/app/components/Challenges/ClientChallengesContent.tsx` - Đơn giản hóa hoàn toàn
10. `src/app/components/ChallengeCenterContent/ChallengesFooter.tsx` - Loại bỏ NFT minting
11. `src/app/components/ChallengeCenterContent/ChallengesList.tsx` - Loại bỏ NFT ownership checks
12. `src/app/[locale]/courses/[courseName]/[lessonName]/page.tsx` - Loại bỏ NFT collection fetching
13. `src/app/api/stats/route.ts` - Đã xóa

## 🔍 Files Cần Kiểm Tra

Các files sau vẫn có thể import các hooks/auth không còn tồn tại:
- `src/app/components/Modals/ChallengeComplete.tsx` - Cần kiểm tra
- `src/app/components/Challenges/ProgramChallengeTable.tsx` - Không còn được sử dụng nhưng vẫn tồn tại
- `src/app/components/Challenges/ClientChallengeTable.tsx` - Không còn được sử dụng nhưng vẫn tồn tại

## ⚠️ Lưu Ý

- Các files MDX content trong `src/app/content/` **KHÔNG** được xóa
- Giữ nguyên i18n support
- Giữ nguyên wallet connection (chỉ đơn giản hóa, không loại bỏ)
- Test sau mỗi thay đổi lớn
- Có thể vẫn còn một số imports cũ cần cleanup

## 🎯 Mục Tiêu Cuối Cùng

Sau khi hoàn thành, codebase sẽ chỉ có:
- ✅ Courses & Lessons (MDX content)
- ✅ Challenges list (metadata only)
- ✅ Wallet connection (chỉ để hiển thị)
- ✅ UI components
- ✅ i18n support
- ✅ Search và filter

**Biến môi trường cần thiết**: Chỉ `NEXT_PUBLIC_RPC_ENDPOINT`

## 📊 Tiến Độ Tổng Thể

- Phase 1: ✅ 100% hoàn thành
- Phase 2: ✅ 100% hoàn thành
- Phase 3: ✅ 100% hoàn thành
- Phase 4: 🚧 Đang thực hiện (cleanup)

## 🚀 Next Steps

1. Xóa các files không sử dụng
2. Loại bỏ unused dependencies từ package.json
3. Test ứng dụng để đảm bảo không có lỗi
4. Cập nhật documentation
