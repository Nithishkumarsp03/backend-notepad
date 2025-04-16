const db = require("../../config/db");

const fetchNotes = async (req, res) => {
  const { loginId, noteId } = req.body;

  // Input validation
  if (!loginId || !noteId) {
    return res.status(400).json({
      message: "Both loginId and noteId are required.",
    });
  }

  const query = `SELECT notes FROM notes_detail_table WHERE login_id = $1 AND note_title = $2`;
  const values = [loginId, noteId];

  try {
    const result = await db.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Note not found." });
    }

    return res.status(200).json({
      message: "Note fetched successfully.",
      data: result.rows[0], // or result.rows if expecting multiple
    });

  } catch (error) {
    console.error("Error fetching note:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

module.exports = { fetchNotes };
