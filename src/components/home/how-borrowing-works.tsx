import { BookOpen, CalendarDays, Search, Undo2 } from "lucide-react";
import { SectionHeading } from "@/components/section-heading";

const steps = [
  {
    icon: Search,
    title: "1. Browse the Library",
    text: "Open All Books and explore every title in the collection.",
  },
  {
    icon: BookOpen,
    title: "2. Pick a Book",
    text: "Found one you like? Open its details page and borrow it.",
  },
  {
    icon: CalendarDays,
    title: "3. Choose Your Days",
    text: "Select how many days you need the book for — a few days, no rush.",
  },
  {
    icon: Undo2,
    title: "4. Return It",
    text: "When you are done, return it from My Borrows in one click.",
  },
];

export function HowBorrowingWorks() {
  return (
    <section className="border-y bg-muted/40">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <SectionHeading
          title="How Borrowing Works"
          subtitle="Four simple steps from browsing to returning."
          align="center"
        />

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map(({ icon: Icon, title, text }) => (
            <div
              key={title}
              className="rounded-xl border bg-card p-6 text-center"
            >
              <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-accent">
                <Icon className="size-6" aria-hidden="true" />
              </span>
              <h3 className="mt-4 font-semibold">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
