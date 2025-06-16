const db = require("../../config/db");

const addnewnote = async (req, res) => {
  const { notename, loginId } = req.body;
  console.log(req.body)

  // Basic validation
  if (!notename || !loginId) {
    return res.status(400).json({
      status: "fail",
      message: "Both 'notename' and 'loginId' are required.",
    });
  }

  try {
    const query = `
      INSERT INTO notes_table (note_name, login_id)
      VALUES ($1, $2)
      RETURNING id, uuid, note_name
    `;
    const values = [notename, loginId];
    const { rows } = await db.query(query, values);

    res.status(201).json({
      status: "success",
      message: "Note added successfully.",
      note: rows[0],
    });
  } catch (err) {
    console.error("[ADD_NOTE_ERROR]", {
      message: err.message,
      stack: err.stack,
      input: req.body,
    });

    res.status(500).json({
      status: "error",
      message: "Failed to add the note. Please try again later.",
    });
  }
};

module.exports = { addnewnote };
