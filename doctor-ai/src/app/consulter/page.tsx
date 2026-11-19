import { ConsultationClient } from "@/components/ConsultationClient";

type Props = {
  searchParams: Promise<{ id?: string }>;
};

export default async function ConsulterPage({ searchParams }: Props) {
  const params = await searchParams;
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
      <ConsultationClient initialId={params.id} />
    </div>
  );
}
