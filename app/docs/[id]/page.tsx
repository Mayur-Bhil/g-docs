
import EditorPage from "./editor";
import ToolBar from "./ToolBar";
import { Navbar } from "./Navbar";


type PageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function DocumentPage({ params }: PageProps) {
  // Must await params in Next.js 15+
  const { id } = await params;
  
  console.log('Document ID from URL:', id); // Check browser/terminal console
  
  return (
    <div className="min-h-screen p-4 bg-[#FAFBFD]">
      <div className="flex flex-col px-4 pt-2 gap-y-2  fixed top-0 left-0 right-0 z-10 bg-[#FAFBFD] print:hidden h-[112px]">
          <Navbar />
          <ToolBar/>
      </div>
      <div className="pt-[114px] print:pt-0">
      <EditorPage />
      </div>
    </div>  
)};
