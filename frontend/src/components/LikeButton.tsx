import React, { useRef, useState } from "react";

type LikeButtonProps = {
    postId: string;
    initialCount?: number;
    initialuserLiked: boolean;
    // optional auth token 
    authToken?: string | null;
};

export default function LikedButton({
    postId,
    initialCount = 0,
    initialuserLiked = false,
    authToken = null,
}:LikeButtonProps){
    const [count , setCount] = useState(initialCount);
    const [liked , setLiked] = useState(initialuserLiked);
    const [loading , setLoading] = useState(false);
    const mounted = useRef(true);

    // cleanup 

    React.useEffect(() => {
        return () =>{
            mounted.current = false;
        }
    }, []);

    const toggleLike = async() => {
        if(loading) return;
        const nextLiked = !liked;
        const prevCount = count;


        setLiked(nextLiked);
        setCount(prev => prev + (nextLiked ? 1 : -1));
        setLoading(true);

        try{
            const res = await fetch(`/api/posts/${postId}/like`,{
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
                },
                    body: JSON.stringify({ action: nextLiked ? "like" : "unlike" }),
                });
                if (!res.ok) {
            throw new Error(`HTTP ${res.status}`);
                }
                const json = await res.json();
                // server may return the canonical count
        if (mounted.current && typeof json.count === "number") {
            setCount(json.count);
        }
        }catch(err){
                // rollback optimistic update on error
                setLiked(!nextLiked);
                setCount(prevCount);
            console.error('Liked failed' , err)
        } finally {
      if (mounted.current) setLoading(false);
        }
}

 return (
    <button
      aria-pressed={liked}
      aria-label={liked ? "Unlike post" : "Like post"}
        onClick={(e) => {
            e.stopPropagation(); // stop the click from reaching parent
            e.preventDefault();  // prevent link navigation
            toggleLike();
  }}
      disabled={loading}
      className={`flex items-center gap-2 px-3 py-1 rounded-md text-sm ${
        liked ? "bg-red-100 text-red-600" : "bg-slate-100 text-slate-700"
      }`}
    >
      <svg /* small heart icon */ width="16" height="16" viewBox="0 0 24 24" fill={liked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 1 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z"></path>
      </svg>
      <span>{count}</span>
    </button>
  );
}