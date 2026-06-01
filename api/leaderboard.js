export default async function handler(req, res) {

  try {

    const owner = "myumelldy1";
    const repo = "saweria-board";
    const path = "donations.json";

    const token = process.env.GITHUB_TOKEN;

    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/vnd.github+json"
        }
      }
    );

    const file = await response.json();

    if (!file.content) {
      return res.status(500).json({
        error: "donations.json tidak ditemukan",
        github: file
      });
    }

    const donations = JSON.parse(
      Buffer.from(
        file.content,
        "base64"
      ).toString()
    );

    return res.status(200).json(donations);

  } catch (err) {

    return res.status(500).json({
      error: err.message
    });

  }

}
