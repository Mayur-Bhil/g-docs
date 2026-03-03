
import { Nav } from "react-day-picker";
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
      <Navbar />
      <ToolBar/>
      <EditorPage />
    </div>  
)};
