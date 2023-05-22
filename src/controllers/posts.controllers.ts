import { Request, Response } from "express";
import { prisma } from "../db/db";

export const getAllPosts = async (req: Request, res: Response) => {
  const allPosts = await prisma.post.findMany();
  res.json(allPosts);
};
export const getSinglePost = async (req: Request, res: Response) => {
  const singlePost = await prisma.post.findFirst({
    where: {
      id: parseInt(req.params.id),
    },
  });

  if (!singlePost) res.status(404).json({ error: "Post not found" });

  res.status(200).json(singlePost);
};

export const insertPost = async (req: Request, res: Response) => {
  const newPost = await prisma.post.create({
    data: req.body,
  });

  res.json(newPost);
};

export const updatePost = async (req: Request, res: Response) => {
  const updatedPost = await prisma.post.update({
    where: {
      id: parseInt(req.params.id),
    },
    data: req.body,
  });

  if (!updatedPost)
    res.status(404).json({ err: "Error registering a new Post" });

  res.json(updatedPost);
};

export const deletePost = async (req: Request, res: Response) => {
  const deletedPost = await prisma.post.delete({
    where: {
      id: parseInt(req.params.id),
    },
  });

  if (!deletedPost) res.status(404).json({ err: "Post not found in database" });

  res.status(200).json(deletedPost);
};
