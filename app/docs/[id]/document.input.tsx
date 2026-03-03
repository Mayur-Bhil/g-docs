import { BsCloudCheck } from "react-icons/bs";
export const DOcumentInput = ()=>{
    return (
        <div className="flex items-center gap-2">
            <span className="text-lg px-1.5 cursor-pointer truncate">Untitiled Document</span>
            <BsCloudCheck className="text-green-500" size={18}/>
        </div>
    )
}