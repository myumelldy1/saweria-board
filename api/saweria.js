import { Octokit } from "@octokit/rest";

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN
});

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

    const file = await octokit.repos.getContent({
      owner,
      repo,
      path
    });

    const donations = JSON.parse(
      Buffer.from(
        file.data.content,
        "base64"
      ).toString()
    );

    donations.unshift({
      donor:
        req.body?.donator_name ||
        "Anonymous",

      amount:
        req.body?.amount_raw ||
        0,

      message:
        req.body?.message ||
        "",

      createdAt:
        new Date().toISOString()
    });

    await octokit.repos.createOrUpdateFileContents({
      owner,
      repo,
      path,
      message: "New Saweria Donation",
      content: Buffer.from(
        JSON.stringify(
          donations,
          null,
          2
        )
      ).toString("base64"),
      sha: file.data.sha
    });

    return res.status(200).json({
      success: true
    });

  } catch (err) {

    console.error(err);

    return res.status(500).json({
      error: err.message
    });
  }
}
