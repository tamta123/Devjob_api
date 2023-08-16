import pgk from "pg";
const { Pool } = pgk; //pool არის ის ქონექშენი რასაც ჩვენი ნოუდი(სერვერი) ქმნის მონაცემთა ბაზასთან
import fs from "fs/promises"; // Import the 'fs' module to read the JSON file. By using the fs module, you can read external data from files, which is helpful when you want to separate your data from your code or work with data that is dynamically generated or provided from an external source.
import dotenv from "dotenv"; // Import dotenv

const pool = new Pool({
  host: "containers-us-west-152.railway.app",
  port: 6307,
  database: "railway",
  user: "postgres",
  password: "oggoh6byJli8HW6iSKSw",
}); // ქარლი ბრეისში გადაეცევა ფროფრთები
//სიქუალაიზერი ვნახო რა არის
//render-ზე არ არის იმის საშუალებ რომ ქრიეთ თეიბლ და ეგეთები ვაკეთოთ და pgadmin-ში არის ამიტო აქვე უნდა დავწეროთ ცხრილის შექმნის ფუნქცია

export const createTable = async () => {
  const jsonData = await fs.readFile("data.json", "utf-8");
  const jobsData = JSON.parse(jsonData); //This function parses a JSON string and returns a JavaScript object.
  await pool.query(
    "CREATE TABLE IF NOT EXISTS jobs(" +
      "id SERIAL PRIMARY KEY, " +
      "company TEXT, " +
      "logo TEXT, " +
      "logo_background_color TEXT, " +
      "position TEXT, " +
      "posted_at TEXT, " +
      "contract TEXT, " +
      "location TEXT, " +
      "website TEXT, " +
      "apply TEXT, " +
      "description TEXT" +
      ");"
  );

  // Create "requirements" table
  await pool.query(
    "CREATE TABLE IF NOT EXISTS requirements(" +
      "id SERIAL PRIMARY KEY, " +
      "job_id INT REFERENCES jobs(id), " +
      "content TEXT" +
      ");"
  );

  // Create "roles" table
  await pool.query(
    "CREATE TABLE IF NOT EXISTS roles(" +
      "id SERIAL PRIMARY KEY, " +
      "job_id INT REFERENCES jobs(id), " +
      "content TEXT" +
      ");"
  );

  // const devJob = await pool.query(
  //   "SELECT column_name FROM information_schema.columns WHERE table_name = 'jobs';"
  // );
  // console.log(devJob.rows); ამით რენდერის კონსოლში შევამოწმეთ რომელ ქოლამნებს ხედავდა ჯობს თეიბლისთვის

  // Populate tables with data
  for (const jobData of jobsData) {
    // Insert job data into the "jobs" table and retrieve the inserted job's ID
    const { rows } = await pool.query(
      "INSERT INTO jobs(company, logo, logo_background_color, position, posted_at, contract, location, website, apply, description) " +
        "VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id;",
      [
        jobData.company,
        jobData.logo,
        jobData.logoBackground,
        jobData.position,
        jobData.postedAt,
        jobData.contract,
        jobData.location,
        jobData.website,
        jobData.apply,
        jobData.description,
      ]
    );

    // Extract the inserted job's ID from the query result
    const jobId = rows[0].id;

    // Insert requirements data into the "requirements" table using the job's ID
    await pool.query(
      "INSERT INTO requirements(job_id, content) VALUES ($1, $2);",
      [jobId, jobData.requirements.content]
    );

    // Insert roles data into the "roles" table using the job's ID
    await pool.query("INSERT INTO roles(job_id, content) VALUES ($1, $2);", [
      jobId,
      jobData.role.content,
    ]);
  }
};

export default pool;
