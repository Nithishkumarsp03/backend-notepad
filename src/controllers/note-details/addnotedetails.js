const db = require("../../config/db");

const addNewNoteDetails = async (req, res) => {
  try {
    const { loginId, noteId, notes } = req.body;
    // console.log(req.body)

    if (!loginId) {
      return res.status(400).json({ message: "Login ID is required." });
    }
    if (!noteId) {
      return res.status(400).json({ message: "Note ID is required." });
    }
    if (!notes) {
      return res.status(400).json({ message: "Notes content is required." });
    }

    // Step 1: Check if noteId exists in notes_detail_table for the given loginId
    const checkQuery = `
      SELECT * FROM notes_detail_table
      WHERE login_id = $1 AND note_title = $2
    `;
    const checkResult = await db.query(checkQuery, [loginId, noteId]);

    let result;

    if (checkResult.rowCount > 0) {
      // Step 2a: If exists, update the row
      const updateQuery = `
        UPDATE notes_detail_table
        SET notes = $1
        WHERE login_id = $2 AND note_title = $3
        RETURNING *
      `;
      result = await db.query(updateQuery, [notes, loginId, noteId]);
      return res.status(200).json({
        message: "Note details updated successfully.",
        data: result.rows[0],
      });
    } else {
      // Step 2b: If not exists, insert new row
      const insertQuery = `
        INSERT INTO notes_detail_table (login_id, note_title, notes)
        VALUES ($1, $2, $3)
      `;
      result = await db.query(insertQuery, [loginId, noteId, notes]);
      return res.status(201).json({
        message: "Note details added successfully.",
        data: result.rows[0],
      });
    }

  } catch (error) {
    console.error("Error adding or updating note details:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

module.exports = { addNewNoteDetails };
