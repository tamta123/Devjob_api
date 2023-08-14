import pgk from "pg";
const { Pool } = pgk; //pool არის ის ქონექშენი რასაც ჩვენი ნოუდი(სერვერი) ქმნის მონაცემთა ბაზასთან

const pool = new Pool({
  host: "dpg-cjcsl4ndb61s739aq2ug-a",
  port: 5432,
  database: "devjob_api",
  user: "devjob_api_user",
  password: "o9wBluDgZFpUlDONU58E55WvvEM0XbSV",
}); // ქარლი ბრეისში გადაეცევა ფროფრთები
//სიქუალაიზერი ვნახო რა არის
//render-ზე არ არის იმის საშუალებ რომ ქრიეთ თეიბლ და ეგეთები ვაკეთოთ და pgadmin-ში არის ამიტო აქვე უნდა დავწეროთ ცხრილის შექმნის ფუნქცია

export const createTable = async () => {
  return await pool.query(
    "CREATE TABLE IF NOT EXISTS jobs(id SERIAL PRIMARY KEY, title TEXT, price INT )"
  );
};
