
import EditorPage from "./editor";
import ToolBar from "./ToolBar";


type PageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function DocumentPage({ params }: PageProps) {
  // Must await params in Next.js 15+
  const { id } = await params;
  
  console.log('Document ID from URL:', id); // Check browser/terminal console
  
  return (
    <div className="min-h-screen p-4 bg-gray-100">
      <ToolBar/>
      <EditorPage />
    </div>  
)};
