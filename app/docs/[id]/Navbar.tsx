import Image from "next/image";
import Link from "next/link";
import { DOcumentInput } from "./document.input";
import { Menubar } from "@/components/ui/menubar";
export const Navbar = () => {
    return (
        <nav className="flex items-center justify-between">
            <div className="flex gap-2 items-center">
               <Link href="/">
                    <Image src={"../g-doc.svg"} alt="G-DOCS Logo" width={35} height={35}/>
               </Link>
               <div className="flex flex-col ">
                {/* Document INputs */}
                        <DOcumentInput />
                {/* Menu Bar */}
            <div className="flex">
                
            </div>
               </div>
            </div>
        </nav>
        
    
    )};