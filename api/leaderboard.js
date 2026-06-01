export default async function handler(req, res) {

  const owner = "myumelldy1";
  const repo = "saweria-board";
  const path = "donations.json";

  const token = process.env.GITHUB_TOKEN;

  const response = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  const file = await response.json();

  const donations = JSON.parse(
    Buffer.from(
      file.content,
      "base64"
    ).toString()
  );

  res.status(200).json(donations);
}
