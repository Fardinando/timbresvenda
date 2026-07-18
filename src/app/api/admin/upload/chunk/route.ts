import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { uploadReleaseAsset } from "@/lib/github";

export async function POST(req: Request) {
  const session = await getSession();
  if (!session?.isAdmin) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
  }

  const formData = await req.formData();
  const chunk = formData.get("chunk") as File;
  const releaseId = Number(formData.get("releaseId"));
  const filename = formData.get("filename") as string;

  if (!chunk || !releaseId || !filename) {
    return NextResponse.json({ error: "Parâmetros obrigatórios faltando" }, { status: 400 });
  }

  try {
    const buffer = Buffer.from(await chunk.arrayBuffer());
    await uploadReleaseAsset(releaseId, filename, buffer);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Erro ao enviar chunk" },
      { status: 500 }
    );
  }
}
