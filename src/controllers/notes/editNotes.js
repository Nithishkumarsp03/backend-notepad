const db = require("../../config/db");

const editNotes = async (req, res) => {
  try {
    const { uuid, notetitle } = req.body;

    if (!uuid) {
      return res.status(400).json({ message: "Update reference (UUID) not found." });
    }
    if (!notetitle) {
      return res.status(400).json({ message: "New note title not provided." });
    }

    const query = 'UPDATE notes_table SET note_name = $1 WHERE uuid = $2';
    const values = [notetitle, uuid];

    const result = await db.query(query, values);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Note with the given UUID not found." });
    }

    return res.status(200).json({
      message: "Note title updated successfully.",
    });

  } catch (error) {
    console.error("Error updating note title:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

module.exports = { editNotes }; 
