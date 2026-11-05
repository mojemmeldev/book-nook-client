import { Spinner } from "@/components/ui/spinner";

export default function BookDetailsLoading() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center">
      <div className="h-16 w-16">
        <Spinner />
      </div>
    </div>
  );
}
