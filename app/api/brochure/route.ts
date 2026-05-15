import { BROCHURE_DOWNLOAD_FILENAME, BROCHURE_URL } from "@/lib/media";

const HTTP_OK = 200;
const HTTP_NOT_FOUND = 404;
const HTTP_BAD_GATEWAY = 502;

const PDF_CONTENT_TYPE = "application/pdf";
const DOWNLOAD_DISPOSITION = `attachment; filename="${BROCHURE_DOWNLOAD_FILENAME}"`;

export async function GET(): Promise<Response> {
  if (!BROCHURE_URL) {
    return new Response("Brochure has not been uploaded.", {
      status: HTTP_NOT_FOUND,
    });
  }

  const brochureResponse = await fetch(BROCHURE_URL);

  if (!brochureResponse.ok) {
    return new Response("Brochure could not be loaded.", {
      status: HTTP_BAD_GATEWAY,
    });
  }

  return new Response(brochureResponse.body, {
    status: HTTP_OK,
    headers: {
      "Content-Disposition": DOWNLOAD_DISPOSITION,
      "Content-Type":
        brochureResponse.headers.get("Content-Type") ?? PDF_CONTENT_TYPE,
    },
  });
}
