import { HeroSlider } from "@/components/home/hero-slider";
import { NewArrivals } from "@/components/home/new-arrivals";
import { HowBorrowingWorks } from "@/components/home/how-borrowing-works";
import { ReaderReviews } from "@/components/home/reader-reviews";

export default function Home() {
  return (
    <>
      <HeroSlider />
      <NewArrivals />
      <HowBorrowingWorks />
      <ReaderReviews />
    </>
  );
}
