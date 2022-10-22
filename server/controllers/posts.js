import express from 'express';
import mongoose from 'mongoose';

import PostMessage from '../models/postMessage.js';

const router = express.Router();



//asynchronus function to get posts from database
export const getPosts = async (req, res) => { 
    try {
        //retrieve all posts in database
        const postMessages = await PostMessage.find();
        //status 200 - everything is okay  //.json gives an array of all messages we have in database      
        res.status(200).json(postMessages);
    } catch (error) {
        //status 404 - error
        res.status(404).json({ message: error.message });
    }
}




export const getPost = async (req, res) => { 
    const { id } = req.params;

    try {
        const post = await PostMessage.findById(id);
        
        res.status(200).json(post);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}



//asynchronus function to create posts in database
export const createPost = async (req, res) => {
    
    const post = req.body;
    
    //creator is set to user id
    const newPostMessage = new PostMessage({ ...post, creator: req.userId, createdAt: new Date().toISOString() })

    try {
        //to save a creation
        await newPostMessage.save();
        //201 - saved creation & .json to send post in database
        res.status(201).json(newPostMessage );
    } catch (error) {
        //409 - failed/conflict
        res.status(409).json({ message: error.message });
    }
}




export const updatePost = async (req, res) => {
    
    const { id } = req.params;
    const { title, message, creator, selectedFile, tags } = req.body;
    
    //to check if id is actually a mongoose id
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`);
    //if it is valid, then update id
    const updatedPost = { creator, title, message, tags, selectedFile, _id: id };
    //new: true to get updated post
    await PostMessage.findByIdAndUpdate(id, updatedPost, { new: true });

    res.json(updatedPost);
}




export const deletePost = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`);

    await PostMessage.findByIdAndRemove(id);

    res.json({ message: "Post deleted successfully." });
}




export const likePost = async (req, res) => {
    const { id } = req.params;
    //if user is not authenticated
    if (!req.userId) {
        return res.json({ message: "Unauthenticated" });
      }
    
    //if posts exists with user id
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`);
    
    //to find post,returns post
    const post = await PostMessage.findById(id);

    //each like is the the id for that user id, if id is found in likes, then index will not be -1
    const index = post.likes.findIndex((id) => id ===String(req.userId));

    if (index === -1) {
        //like a post
      post.likes.push(req.userId);
    } else {
        //dislike a post
      post.likes = post.likes.filter((id) => id !== String(req.userId));
    }
    //updated post
    const updatedPost = await PostMessage.findByIdAndUpdate(id, post, { new: true });
    res.status(200).json(updatedPost);
}


export default router;