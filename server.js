const express = require("express");
const mongoose = require("mongoose");
const bodyparser = require("body-parser");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());
app.use(bodyparser.json());

mongoose
  .connect("mongodb://127.0.0.1:27017/todoapp")
  .then(() => console.log("Database is connected...!"))
  .catch(() => console.log("Connection Failed"));

const ModelSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
});

const CModel = mongoose.model("CRUD", ModelSchema);

app.post("/api/insert/", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      res
        .status(200)
        .json({ success: false, message: "Pls fill All thw fields" });
    } else {
      const NewTask = new CModel({ name, email, password });
      await NewTask.save();
      res
        .status(201)
        .json({
          success: true,
          message: "Data Successfully Added in the Database...!",
        });
    }
  } catch (err) {
    res
      .status(404)
      .json({ success: false, message: "Internal Error Pls try again later" });
  }
});

app.get("/api/find", async (req, res) => {
  try {
    const FindTask = await CModel.find();
    if (FindTask) {
      res.status(200).json({ success: true, data: FindTask });
    } else {
      res.status(200).json({ success: false, message: "No Data Found...!" });
    }
  } catch (err) {
    res
      .status(404)
      .json({ success: false, message: "Internal Error Pls try again later" });
  }
});

app.put("/api/update/:id", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const { id } = req.params;

    const UpdTask = await CModel.findByIdAndUpdate(id, req.body, { new: true });
    res
      .status(201)
      .json({ success: true, message: "Data Updated Successfully...!" });
  } catch (err) {
    res
      .status(404)
      .json({ success: false, message: "Internal Error Pls try again later" });
  }
});

app.delete("/api/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const DelTask = await CModel.findByIdAndDelete(id);
    res
      .status(200)
      .json({ success: true, message: "Data deleted Successfully...!" });
  } catch (err) {
    res
      .status(404)
      .json({ success: false, message: "Internal Error Pls try again later" });
  }
});

const PORT = 4040;
app.listen(PORT, () => console.log("Port Running"));
