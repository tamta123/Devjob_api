import express from "express";
import pool, { createTable } from "./config/sql.js";
import bodyParser from "body-parser";

const app = express();
app.use("/images", express.static("public/images"));
const init = async () => {
  try {
    await createTable(); //ეს დაელოდება ცხრილს შექმნის  და მერე გაეშვება სერვერი
    startServer();
  } catch (error) {
    console.log(error);
  }
  function startServer() {
    app.use(bodyParser.json()); //ბადი პარსერი საშუალებას იძლევა რომ ინფორმაცია იყოს წაკითხული ჯეისონ ფორმატში
    app.get("/api/jobs", async (_, response) => {
      try {
        const resultQuery = await pool.query("SELECT * FROM JOBS"); // ეს აბრუნებს ობიექტის სახით პასუხს
        const rows = resultQuery.rows; // rows არის ფროფერთი, რომელიც მასივის სახით ინახავს ცხრილში არსებულ ინფორმაციას
        return response.status(200).json(rows);
      } catch (error) {
        return response.status(401).json(error);
      } // აქ გვინდა რომ წამოიღოს ბაზიდან და გამოგვიტანოს
    }); //პირველი პარამეტრია როუთი(ენდფოინთი) სადაც უნდა გაეშვას ეს რექუსთი და მეორე რა ფუნქცია გეშვას ამ დროს
    // სადაც ვწერთ კოდს რომელიც ამ როუთზე შესვლისას გაეშვება

    app.post("/api/jobs", async (req, res) => {
      const { company, logo_path } = req.body;
      //font-ში ვიღაც ავსებს ინფორმაციის ფომრას, მოდის ინფორმაცია ბექის სერვერზე, ბექის სერვერზე ამუშავებს და იმ ინფორმაციის საფუძველზე ქმნის ახალ ჩანაწერს მონაცემთა ბაზაში
    }); //პოსტი მიგვანიშნებს რომ ახალი ემატება და გეთი  მიგვანიშნებს რომ ინფორმაცია მოგვაქვს
    app.listen(process.env.PORT || 3000);
  }
};
init();

//ეს ფუნქცია რატო შევქმენით და პირდაპირ რატო არ გავუშვით სერვერი? გვინდა რომ დავიდან ცხრილი შექმნას დამერე გაეშვას სერვერი
//მერე თუ ბრძანება და რექუესთი გავუშვით რომ ჩაამატე პროდუქტი და ასშ. მაგ დროს ცხრილი უნდა არსებობდეს და ასინქრონული კოდი ისე უნდა გავაკეთოთ, რომ
//ჯერ ცხრილი თუ არ არსებობს შექმნას, დაელოდოს მაგას და ეგ რომ დასრულდება მერე გაეშვას სერვერი
