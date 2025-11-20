import { getTranslations } from "next-intl/server";
import { getChallenge } from "@/app/utils/mdx";
import { notFound } from "next/navigation";
import ContentPagination from "@/app/components/CoursesContent/ContentPagination";
import { Link } from "@/i18n/navigation";
import Button from "@/app/components/Button/Button";
import Icon from "@/app/components/Icon/Icon";
import ChallengeLayout from "@/app/components/Layout/ChallengeLayout";
import MdxLayout from "@/app/mdx-layout";
import ContentFallbackNotice from "@/app/components/ContentFallbackNotice";

interface ChallengePageContainerProps {
  params: Promise<{
    challengeSlug: string;
    pageSlug?: string;
    locale: string;
  }>;
}

export default async function ChallengePageContainer({
  params,
}: ChallengePageContainerProps) {
  const t = await getTranslations();
  const { challengeSlug, pageSlug, locale } = await params;

  const challengeMetadata = await getChallenge(challengeSlug);
  if (!challengeMetadata) {
    console.error(`No metadata found for challenge: ${challengeSlug}`);
    notFound();
  }

  let MdxComponent;
  let challengeLocale = locale;
  if (pageSlug) {
    const pageExists = challengeMetadata.pages?.some(
      (p) => p.slug === pageSlug,
    );
    if (!pageExists) {
      notFound();
    }
    try {
      const mdxModule = await import(
        `@/app/content/challenges/${challengeSlug}/${locale}/pages/${pageSlug}.mdx`
      );
      MdxComponent = mdxModule.default;
    } catch (error) {
      try {
        const mdxModule = await import(
          `@/app/content/challenges/${challengeSlug}/en/pages/${pageSlug}.mdx`
        );
        MdxComponent = mdxModule.default;
        challengeLocale = "en";
      } catch (error) {
        notFound();
      }
    }
  } else {
    try {
      const mdxModule = await import(
        `@/app/content/challenges/${challengeSlug}/${locale}/challenge.mdx`
      );
      MdxComponent = mdxModule.default;
    } catch (error) {
      try {
        const mdxModule = await import(
          `@/app/content/challenges/${challengeSlug}/en/challenge.mdx`
        );
        MdxComponent = mdxModule.default;
        challengeLocale = "en";
      } catch (error) {
        notFound();
      }
    }
  }

  // Removed NFT collection size fetching - not needed for minimal version

  let nextPage;
  if (pageSlug) {
    const currentPageIndex = challengeMetadata.pages?.findIndex(
      (p) => p.slug === pageSlug,
    );
    nextPage =
      currentPageIndex !== undefined &&
      currentPageIndex > -1 &&
      challengeMetadata.pages
        ? challengeMetadata.pages[currentPageIndex + 1]
        : null;
  } else {
    nextPage =
      challengeMetadata.pages && challengeMetadata.pages.length > 0
        ? challengeMetadata.pages[0]
        : null;
  }

  const pagination = (
    <ContentPagination
      type="challenge"
      challenge={challengeMetadata}
      currentPageSlug={pageSlug}
    />
  );

  const footer = nextPage ? (
    <>
      <Link
        href={`/challenges/${challengeMetadata.slug}/${nextPage.slug}`}
        className="flex justify-between items-center w-full bg-background-card border border-border group py-5 px-5 rounded-xl"
      >
        <div className="flex items-center gap-x-2">
          <span className="text-mute text-sm font-mono pt-1">Next Page</span>
          <span className="font-medium text-primary">
            {t(
              `challenges.${challengeMetadata.slug}.pages.${nextPage.slug}.title`,
            )}
          </span>
        </div>
        <Icon
          name="ArrowRight"
          className="text-mute text-sm group-hover:text-primary group-hover:translate-x-1 transition"
        />
      </Link>
      <div className="relative w-full">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border"></div>
        </div>
        <div className="relative flex justify-center">
          <span className="bg-background px-4 text-xs text-mute font-mono">
            {t("lessons.skip_lesson_divider_title").toUpperCase()}
          </span>
        </div>
      </div>
      {/* Removed verify button - not needed for minimal version */}
    </>
  ) : null;

  return (
    <ChallengeLayout
      challengeMetadata={challengeMetadata}
      collectionSize={null}
      pagination={pagination}
      footer={footer}
    >
      <MdxLayout>
        <ContentFallbackNotice locale={locale} originalLocale={challengeLocale} />
        <MdxComponent />
      </MdxLayout>
    </ChallengeLayout>
  );
}
