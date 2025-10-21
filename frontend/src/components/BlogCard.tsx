import LikedButton from "./LikeButton";

interface BlogCardProps {
    authorName: string;
    title: string;
    content: string;
    publishedDate: string;
    initialLikes?: number;
    initialuserLiked?: boolean;
    postId:string;
}

export const BlogCard = ({
    authorName,
    title,
    content,
    publishedDate,
    postId,
    initialLikes = 0,
    initialuserLiked = false,
}: BlogCardProps) => {
    return(
        <div className="p-4 border-b border-slate-200 pb-4">
            <div className="flex">
                <div>
                    <Avatar
                     size="small"
                     name={authorName}/>
                </div>
                <div className="font-extralight pl-2 flex justify-center flex-col ">{authorName}</div>
                <div className="flex flex-col justify-center pl-2">
                    <Circle/>
                </div>
                <div className="pl-2 font-thin text-slate-500 flex justify-center flex-col"> {publishedDate}</div>
            </div>
            <div className="text-xl font-semibold pt-2">
                {title}
            </div>
            <div className="text-md font-thin">
                {content.slice(0 , 100) + "..."}
            </div>
            <div className="w-full text-slate-500 text-sm font-thin pt-4">
                {`${Math.ceil(content.length / 100)} minute read`}
            </div>
            <div className="flex flex-row justify-end -mt-4 ">
                <LikedButton
                postId={postId}
                initialCount={initialLikes}
                initialuserLiked={initialuserLiked}
                />
            </div>
        </div>
    )
}

export function Avatar({name , size = "small"} : {name: string , size: "small" | "big"}){
return <div className={`relative inline-flex items-center justify-center ${size === "small" ? "w-6 h-6" : "w-10 h-10" } overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600`}>
    <span className={`${size === "small" ? "text-xs" : "text-md"}text-xs font-extralight text-gray-600 dark:text-gray-300`}>
        {name[0]}
    </span>
</div>
}

export function Circle(){
    return <div>
        <div className="h-1 w-1 rounded-full bg-slate-400" />
    </div>
}