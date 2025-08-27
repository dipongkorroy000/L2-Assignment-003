import express, { Request, Response, NextFunction } from "express";
import { Book } from "../models/books.models";

export const booksRoutes = express.Router();

booksRoutes.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const book = await req.body;

    const result = await Book.create(book);
    res.status(200).json({
      success: true,
      message: "Book created successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
});

booksRoutes.get("/", async (req: Request, res: Response) => {
  const { filter, sortBy, sort, limit } = await req.query;
  if (filter | sort | limit) {
    const books = await Book.find({ genre: filter }).limit(limit).sort({ sortBy: sort });
    res.status(200).json({
      success: true,
      message: "Books retrieved successfully",
      data: books,
    });
  } else {
    const books = await Book.find();
    res.status(200).json({
      success: true,
      message: "Books retrieved successfully",
      data: books,
    });
  }
});

booksRoutes.get("/:bookId", async (req: Request, res: Response) => {
  const book = await Book.findById({ _id: req.params.bookId });
  res.status(200).json({
    success: true,
    message: "Book retrieved successfully",
    data: book,
  });
});

booksRoutes.put("/:bookId", async (req: Request, res: Response) => {
  const { copies } = req.body;
  // console.log(copies);

  if (copies < 0) {
    res.status(200).json({
      success: true,
      message: "Book copies will be positive",
    });
  } else {
    const book = await Book.findOneAndUpdate({ _id: req.params.bookId }, { $set: { copies } });
    res.status(200).json({
      success: true,
      message: "Book updated successfully",
      data: book,
    });
  }
});

booksRoutes.delete("/:bookId", async (req: Request, res: Response) => {
  const book = await Book.findOneAndDelete({ _id: req.params.bookId });

  if (book) {
    res.status(200).json({
      success: true,
      message: "Book deleted successfully",
      data: null,
    });
  } else {
    res.status(200).json({
      success: false,
      message: "Book deleted failed",
      data: null,
    });
  }
});
