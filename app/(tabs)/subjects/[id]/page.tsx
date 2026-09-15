import { notFound } from "next/navigation";
import { SubjectDetail } from "@/components/topics/SubjectDetail";

interface SubjectPageProps {
  params: Promise<{ id: string }>;
}

export default async function SubjectPage({ params }: SubjectPageProps) {
  const { id } = await params;
  const subjectId = Number(id);

  if (!Number.isFinite(subjectId)) {
    notFound();
  }

  return <SubjectDetail subjectId={subjectId} />;
}
