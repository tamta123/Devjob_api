import express from "express";
import { createTable } from "./config/sql.js";

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
    app.get("/api/jobs", (req, res) => {
      return res.status(200).json({ message: "works!" });
    }); //პირველი პარამეტრია როუთი(ენდფოინთი) სადაც უნდა გაეშვას ეს რექუსთი და მეორე რა ფუნქცია გეშვას ამ დროს
    // სადაც ვწერთ კოდს რომელიც ამ როუთზე შესვლისას გაეშვება
    app.listen(3000);
  }
};
init();

//ეს ფუნქცია რატო შევქმენით და პირდაპირ რატო არ გავუშვით სერვერი? გვინდა რომ დავიდან ცხრილი შექმნას დამერე გაეშვას სერვერი
//მერე თუ ბრძანება და რექუესთი გავუშვით რომ ჩაამატე პროდუქტი და ასშ. მაგ დროს ცხრილი უნდა არსებობდეს და ასინქრონული კოდი ისე უნდა გავაკეთოთ, რომ
//ჯერ ცხრილი თუ არ არსებობს შექმნას, დაელოდოს მაგას და ეგ რომ დასრულდება მერე გაეშვას სერვერი
