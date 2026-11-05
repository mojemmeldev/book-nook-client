import { redirect } from "next/navigation";

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function toQuery(params: Record<string, string | string[] | undefined>) {
  const search = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (Array.isArray(value)) {
      value.forEach((item) => search.append(key, item));
    } else if (value !== undefined) {
      search.set(key, value);
    }
  }

  const query = search.toString();
  return query ? `?${query}` : "";
}

/** /login → the real login form, keeping `callbackUrl` (private route) intact. */
export default async function LoginPage({ searchParams }: Props) {
  redirect(`/sign-in${toQuery(await searchParams)}`);
}
