import { Star } from "lucide-react";
import { SectionHeading } from "@/components/section-heading";

const reviews = [
  {
    name: "Sarah M.",
    role: "Student",
    text: "BookNook makes finding my next read so easy. I borrowed three books last month and returned them without any hassle.",
  },
  {
    name: "Daniel K.",
    role: "Teacher",
    text: "Clean, simple and fast. My students love checking what is new each week — it feels like a real library online.",
  },
  {
    name: "Aisha R.",
    role: "Book club host",
    text: "Borrowing and returning takes seconds. This is how a library website should work, honestly.",
  },
];

function Stars() {
  return (
    <div className="flex gap-0.5" aria-label="5 out of 5 stars">
      {Array.from({ length: 5 }).map((_, index) => (
        <Star
          key={index}
          className="size-4 fill-yellow-500 text-yellow-500"
          aria-hidden="true"
        />
      ))}
    </div>
  );
}

export function ReaderReviews() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <SectionHeading
        title="Reader Reviews"
        subtitle="What people say about borrowing with BookNook."
        align="center"
      />

      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {reviews.map((review) => (
          <figure
            key={review.name}
            className="flex flex-col rounded-xl border bg-card p-6"
          >
            <Stars />
            <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-muted-foreground">
              “{review.text}”
            </blockquote>
            <figcaption className="mt-5 border-t pt-4">
              <div className="font-semibold">{review.name}</div>
              <div className="text-sm text-muted-foreground">{review.role}</div>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
