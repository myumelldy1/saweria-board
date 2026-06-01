export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  try {

    const owner = "myumelldy1";
    const repo = "saweria-board";
    const path = "donations.json";

    const token = process.env.GITHUB_TOKEN;

    const getFile = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/vnd.github+json"
        }
      }
    );

    const fileData = await getFile.json();

    const donations = JSON.parse(
      Buffer.from(
        fileData.content,
        "base64"
      ).toString()
    );

    donations.unshift({
      donor: req.body?.donator_name || "Anonymous",
      amount: req.body?.amount_raw || 0,
      message: req.body?.message || "",
      createdAt: new Date().toISOString()
    });

    const update = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/vnd.github+json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message: "New Saweria Donation",
          content: Buffer.from(
            JSON.stringify(donations, null, 2)
          ).toString("base64"),
          sha: fileData.sha
        })
      }
    );

    const result = await update.json();

    return res.status(200).json({
      success: true,
      commit: result.commit?.sha
    });

  } catch (err) {

    return res.status(500).json({
      error: err.message
    });

  }

}
