import axios from "axios";
import fs from "fs";
import "dotenv/config";

// Personal Access Token
const pat = process.env.GIT_ACCESS_TOKEN;

if (!pat) {
  console.error("No GIT_ACCESS_TOKEN found in .env");
  process.exit(1);
}

// Azure DevOps details
const organization = "worldfoodprogramme";
const project = "Design%20System";
const repository = "tokens";
const filePath = "tokens.json";
const apiVersion = "7.0";

// Construct the URL for API request
const url = `https://dev.azure.com/${organization}/${project}/_apis/git/repositories/${repository}/items?path=/${filePath}&api-version=${apiVersion}&download=true`;

// Make a GET request
axios
  .get(url, {
    headers: {
      Authorization: `Basic ${Buffer.from(pat).toString("base64")}`,
      Accept: "application/text",
    },
  })
  .then((response) => {
    fs.writeFileSync(
      "tokens/design-tokens.tokens.new.json",
      JSON.stringify(response.data, null, 2)
    );
    console.log(
      "🐝 Tokens downloaded successfully and saved under tokens/design-tokens.tokens.new.json"
    );
  })
  .catch((error) => {
    console.log(error.response.status);
    if (error.response.status === 401) {
      console.error(
        "Invalid GIT_ACCESS_TOKEN found in .env file. Correct format is username:private_access_token"
      );
    } else {
      console.error("Error fetching file:", error);
    }
  });
