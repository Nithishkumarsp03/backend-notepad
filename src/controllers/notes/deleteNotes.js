const db = require("../../config/db");

const deleteNotes = async (req, res) => {
  const { uuid } = req.body;

  if (!uuid) {
    return res.status(400).json({ message: "UUID is required for deletion." });
  }

  const client = await db.connect();

  try {
    await client.query('BEGIN');

    // Step 1: Get the note ID from notes_table using UUID
    const fetchNoteQuery = 'SELECT id FROM notes_table WHERE uuid = $1';
    const fetchResult = await client.query(fetchNoteQuery, [uuid]);

    if (fetchResult.rowCount === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ message: "Note not found with provided UUID." });
    }

    const noteId = fetchResult.rows[0].id;

    // Step 2: Delete from notes_detail_table using noteId
    const deleteDetailQuery = 'DELETE FROM notes_detail_table WHERE note_title = $1';
    await client.query(deleteDetailQuery, [noteId]);

    // Step 3: Delete from notes_table using UUID
    const deleteNoteQuery = 'DELETE FROM notes_table WHERE uuid = $1';
    await client.query(deleteNoteQuery, [uuid]);

    await client.query('COMMIT');

    return res.status(200).json({ message: "Note and its details deleted successfully." });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error("Error deleting note and details:", error);
    return res.status(500).json({ message: "Internal server error." });

  } finally {
    client.release();
  }
};

module.exports = { deleteNotes };
