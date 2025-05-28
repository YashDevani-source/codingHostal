import { db } from "../libs/db.libs"

export const createPlaylist = (req, res) => {
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

export const getAllListDetails = (req, res) => {
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

export const getPlayListDetails = (req, res) => {}

export const addProblemToPlaylist = (req, res) => {}

export const deletePlaylist = (req, res) => {}

export const removeProblemFromPlaylist = (req, res) => {}
