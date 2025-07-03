const db = require("../../config/db");

const shareNotes = async (req, res) => {
    const { uuid } = req.body;

    if (!uuid) {
        return res.status(400).json({ message: "ID is required" });
    }

    const fetchQuery = `
        SELECT 
            d.notes, 
            d.updated_at, 
            n.note_name, 
            l.name AS user_name
        FROM 
            notes_detail_table d
        INNER JOIN 
            notes_table n ON n.id = d.note_title
        INNER JOIN 
            login l ON l.id = d.login_id
        WHERE 
            n.uuid = $1
    `;

    try {
        const { rows } = await db.query(fetchQuery, [uuid]);

        if (rows.length === 0) {
            return res.status(404).json({ message: "No notes found for this ID" });
        }

        return res.status(200).json({
            data: rows[0]
        });

    } catch (error) {
        console.error("Error fetching notes:", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = { shareNotes };
