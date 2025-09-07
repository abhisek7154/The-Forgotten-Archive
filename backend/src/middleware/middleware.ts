// @ts-ignore

export function initMiddleware(app) {

    // @ts-ignore
    
    app.use('/api/v1/blog/*' , async (c, next)=>{
        const header = c.req.header('authorization') || "";
        // Bearer token => ["Bearer" , "tokrn"];
        const token = header.split(" ")[1]

        // @ts-ignore

        const response = await verify(token, c.env.JWT_SECRET)
        if(response.id){
            next()
        } else {
            c.status(403)
            return c.json({ error: "Unauthorized"})
        }
    })
}