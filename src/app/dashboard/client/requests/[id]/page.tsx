import ProjectDetailsClient from "./ProjectDetailsClient";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return <ProjectDetailsClient projectId={id} />;
}
