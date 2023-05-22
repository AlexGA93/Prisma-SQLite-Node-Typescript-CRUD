import { Request, Response } from "express";
import { prisma } from "../db/db";

export const getAllUsersControllers = async (req: Request, res: Response) => {
  const allUsers = await prisma.user.findMany();

  if (!allUsers)
    res.status(404).json({ err: "Users Notfound in the database!" });

  res.status(200).json(allUsers);
};

export const getASingleUserControllers = async (
  req: Request,
  res: Response
) => {
  const user = await prisma.user.findFirst({
    where: {
      id: parseInt(req.params.id),
    },
  });

  if (!user) res.status(404).json({ error: "User not found" });

  res.status(200).json(user);
};

export const insertAUser = async (req: Request, res: Response) => {
  const newUser = await prisma.user.create({
    data: req.body,
  });

  if (!newUser) res.status(404).json({ err: "Error registering a new User" });

  res.status(200).json(newUser);
};

export const updateUser = async (req: Request, res: Response) => {
  const updatedUser = await prisma.user.update({
    where: {
      id: parseInt(req.params.id),
    },
    data: req.body,
  });

  if (!updatedUser)
    res.status(404).json({ err: "Error registering a new User" });

  res.json(updatedUser);
};

export const deleteUser = async (req: Request, res: Response) => {
  const deletedUser = await prisma.user.delete({
    where: {
      id: parseInt(req.params.id),
    },
  });

  if (!deletedUser) res.status(404).json({ err: "User not found in database" });

  res.status(200).json(deletedUser);
};
