import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";
import clientPromise from "../../../lib/mongodb";

interface Question {
  _id: string;
  mainQuestion: string;
  oddQuestion: string;
  category: string;
  createdAt: Date;
  // add other fields here
}

export async function GET() {
  try {
    const client: MongoClient = await clientPromise;
    const db = client.db("db");
    const collection = db.collection<Question>("questions");

    const items: Question[] = await collection.find({}).toArray();

    return NextResponse.json(items);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    // 1. Parse the request body
    const body: Question = await request.json();

    // Check if required fields exist
    if (!body.mainQuestion) {
      return NextResponse.json(
        { message: "Name field is required" },
        { status: 400 }
      );
    }

    if (!body.oddQuestion) {
      return NextResponse.json(
        { message: "Name field is required" },
        { status: 400 }
      );
    }

    // 2. Connect to MongoDB
    const client: MongoClient = await clientPromise;
    const db = client.db("db");
    const collection = db.collection<Question>("questions");

    // 3. Insert the new document
    const result = await collection.insertOne(body);

    // 4. Return the result
    return NextResponse.json(
      {
        message: "Item added successfully",
        insertedId: result.insertedId,
      },
      { status: 201 } // 201 Created status code
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
