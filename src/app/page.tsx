import { Suspense } from "react";
import { HeroSlider } from "@/components/home/hero-slider";
import { NewArrivals } from "@/components/home/new-arrivals";
import { HowBorrowingWorks } from "@/components/home/how-borrowing-works";
import { ReaderReviews } from "@/components/home/reader-reviews";
import { FadeIn } from "@/components/motion/fade-in";
import { Spinner } from "@/components/ui/spinner";

export const metadata = {
  // The root layout's `template` does not wrap the home segment, so the
  // full "BookNook | Home" title is written out here.
  title: "BookNook | Home",
};

export default function Home() {
  return (
    <>
      <HeroSlider />
      <FadeIn>
        <Suspense
          fallback={
            <div className="flex min-h-[40vh] items-center justify-center">
              <div className="h-16 w-16">
                <Spinner />
              </div>
            </div>
          }
        >
          <NewArrivals />
        </Suspense>
      </FadeIn>
      <FadeIn>
        <HowBorrowingWorks />
      </FadeIn>
      <FadeIn>
        <ReaderReviews />
      </FadeIn>
    </>
  );
}
