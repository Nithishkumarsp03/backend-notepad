const db = require("../../config/db");

const fetchNotes = async (req, res) => {
  const { loginId } = req.body;

  // Basic validation
  if (!loginId) {
    return res.status(400).json({
      status: "fail",
      message: "'loginId' is required",
    });
  }

  try {
    const query = `SELECT id, note_name, uuid 
FROM notes_table 
WHERE login_id = $1 
ORDER BY updated_at DESC 
LIMIT 1;
;`
    const { rows } = await db.query(query, [loginId]);

    if (rows.length === 0) {
      return res.status(404).json({
        status: "fail",
        message: "No notes found for this user",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Notes fetched successfully",
      notes: rows,
    });
  } catch (err) {
    console.error("[FETCH_NOTES_ERROR]", {
      message: err.message,
      stack: err.stack,
      input: req.body,
    });

    res.status(500).json({
      status: "error",
      message: "Failed to fetch notes. Please try again later.",
    });
  }
};

module.exports = { fetchNotes };
