import express, { Request, Response, NextFunction } from "express";
import { Book } from "../models/books.models";

export const booksRoutes = express.Router();

booksRoutes.post("/create-book", async (req: Request, res: Response, next: NextFunction) => {
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

  const books = await Book.find({ genre: filter }).limit(limit).sort({ sortBy: sort });
  res.status(200).json({
    success: true,
    message: "Books retrieved successfully",
    data: books,
  });
});

booksRoutes.get("/:bookId", async (req: Request, res: Response) => {
  const book = await Book.findById({ _id: req.params.bookId });
  res.status(200).json({
    success: true,
    message: "Book retrieved successfully",
    data: book,
  });
});

booksRoutes.patch("/:bookId", async (req: Request, res: Response) => {
  const { copies } = req.body;
  console.log(copies);

  const book = await Book.findOneAndUpdate({ _id: req.params.bookId }, { $set: { copies } });
  res.status(200).json({
    success: true,
    message: "Book updated successfully",
    data: book,
  });
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
