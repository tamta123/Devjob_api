import express from "express";
import pool from "./config/sql.js";
import bodyParser from "body-parser";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use("/images", express.static("public/images"));

app.use(bodyParser.json()); //ბადი პარსერი საშუალებას იძლევა რომ ინფორმაცია იყოს წაკითხული ჯეისონ ფორმატში
app.get("/api/jobs/:perPage/:page", async (req, res) => {
  try {
    // Get the page number and items per page from the query parameters
    const { page, perPage } = req.params; // req.params არის ობიექტი სადაც page და perPAge არის ქიები და რა მნიშვნელობასაც მივცემთ ისინი იქნება ველიუები, რექუესთად იგზავნბა ველიუ რომელსაც ექსპრესი ცნობ და იღბს ურლიდან

    console.log("Request received."); // Log that the request has been received

    // Calculate the offset based on the page number and items per page
    const offset = (page - 1) * perPage;

    console.log("Offset:", offset); // Log the calculated offset

    // Query the database with pagination
    const resultQuery = await pool.query(
      //method pool.query part of the node-postgres library, used to send sql queries to the postgres database and to retrieve results from it.
      "SELECT * FROM jobs OFFSET $1 LIMIT $2", // $1 and $2 are placeholders for the parameters that will be replaced from the array of [offset, perPage]. This query retrieves a subset of rows from the "jobs" table based on the pagination values.
      [offset, perPage]
    ); // await ensures that the code execution wait for the query to finish before moving to the next step

    //pool.query მიბრუნებს ობიექტს

    console.log(resultQuery);

    console.log("Query executed successfully."); // Log that the query was executed

    const rows = resultQuery.rows; // Rows containing the data for the current page,აქედან ყველას ვერ ითვლის იმიტომ რომ რომელი offset და perPage გვაქვს მასივს row-ების მასივს მაგის მიხედვით გვიბრუნებს (ანუ არა ყველას)

    // ამ ქვედას გაკეთება ჩვენი დავალებისთვის არ არის საჭირო, იმიტომ რომ დიდი დეითას შემთხვევაში ძაან დიდ დროს წაიღებს
    // You can also query the total number of records to calculate total pages
    const totalRecordsQuery = await pool.query("SELECT COUNT(*) FROM jobs");
    const totalRecords = parseInt(totalRecordsQuery.rows[0].count);

    console.log("Total Records:", totalRecords); // Log the total number of records

    // Calculate the total number of pages
    const totalPages = Math.ceil(totalRecords / perPage);

    console.log("Total Pages:", totalPages); // Log the total number of pages

    // Return the data and pagination information
    return res.status(200).json({ data: rows, totalPages });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
}); //პირველი პარამეტრია როუთი(ენდფოინთი) სადაც უნდა გაეშვას ეს რექუსთი და მეორე რა ფუნქცია გეშვას ამ დროს
// სადაც ვწერთ კოდს რომელიც ამ როუთზე შესვლისას გაეშვება

app.listen(process.env.PORT || 3000);
