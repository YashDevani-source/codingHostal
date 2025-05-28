import { db } from "../libs/db.libs"

export const createPlaylist = async (req, res) => {
    try {
        const {name, description} = req.body
        const userId = req.user.userId

        const playlist = db.playlist.create({
            data:{
                name,
                description,
                userId
            }
        })

       return res.status(200).json({
            success: true,
            message: "Playlist created successfully",
            playlist:playlist
        })
    } catch (error) {
        console.log("Error creating playlist", error);
        res.status(500).json({
            success: false,
            error: "Error creating playlist"
        })
        
    }
}

export const getAllListDetails = async (req, res) => {
    try {
        const playlists = db.playlist.findMany({
            where:{
                userId:req.user.userId
            },
            include:{
                problems:{
                    include:{
                        problem:true
                    }
                }
            }
        })

        res.status(200).json({
            success: true,
            message: "Playlists fetched successfully",
            playlists:playlists
        })
    } catch (error) {
        console.log("Error fetching playlists", error);
        res.status(500).json({
            success: false,
            error: "Error fetching playlists"
        })
        
    }
}

export const getPlayListDetails = async (req, res) => {
    const {playlistId} = req.params;
    try {
        const playlist = db.playlist.findUnique({
            where:{
                id:playlistId,
                userId:req.user.userId
            },
            include:{
                problems:{
                    include:{
                        problem:true
                    }
                }
            }
        })
        if(!playlist){
            return res.status(404).json({
                success: false,
                error: "Playlist not found"
            })
        }
       return res.status(200).json({
            success: true,
            message: "Playlist fetched successfully",
            playlist:playlist
        })

    } catch (error) {
        console.log("Error fetching playlist", error);
        res.status(500).json({
            success: false,
            error: "Error fetching playlist"
        })
        
    }
}

export const addProblemToPlaylist = async (req, res) => { 
    const [playlistId] = req.params
    const [problemIds] = req.body

    try {
        if(!Array.isArray(problemIds)){
            return res.status(400).json({
                success: false,
                error: "Invalid or missing problem ids"
            })
        }
        
        // create records for each problems in the playlist
        const problemsInPlaylist = await db.problemsInPlaylist.createMany({
            data:problemIds.map((problemId)=>{
                playlistId,
                problemId
            })
        })

        return res.status(200).json({
            success: true,
            message: "Problems added to playlist successfully",
            problemsInPlaylist
        })
    } catch (error) {
        console.log("Error adding problems to playlist", error);
        res.status(500).json({
            success: false,
            error: "Error adding problems to playlist"
        })
        
    }

}

export const deletePlaylist = async (req, res) => {}

export const removeProblemFromPlaylist = async (req, res) => {}
