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
    
}

export const getPlayListDetails = (req, res) => {}

export const addProblemToPlaylist = (req, res) => {}

export const deletePlaylist = (req, res) => {}

export const removeProblemFromPlaylist = (req, res) => {}
