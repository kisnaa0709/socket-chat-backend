const User = require("../models/user/userModel");

exports.response = (
  res,
  req = null,
  code = 200,
  status = false,
  message = null,
  data = {}
) => {
  res.status(code).send({ status: status, msg: message, data: data });
};
exports.generateNextUserID=async()=> {
  try {
      let lastUser = await User.findOne().sort({ createdAt: -1 }); 
      let lastID = lastUser ? lastUser.userId : null;
      let nextID = "BMPU0001";
      if (lastID) {
          let number = parseInt(lastID.replace("BMPU", ""), 10) + 1;
          nextID = "BMPU" + number.toString().padStart(4, "0");
      }

      return nextID;
  } catch (error) {
      console.error("Error generating User ID:", error);
      return "BMPM0001"; // Fallback ID
  }
}
