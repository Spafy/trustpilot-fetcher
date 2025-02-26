# Trustpilot Fetcher

trustpilot-fetcher is a lightweight Node.js library for scraping Trustpilot data, including review count, average rating, overall scores, and profile image.

## Features

- Fetch total review count
- Extract ratings such as "Excellent" or "Average"
- Extract overall Trustpilot score
- Retrieve profile image URL

## Installation

Install the package using NPM or Yarn:

```bash
# NPM
npm install trustpilot-fetcher

# Yarn
yarn add trustpilot-fetcher
```

## Usage

Here’s how to use the library:

```javascript
import { scrapeTrustPilot } from "trustpilot-fetcher";

const url = "https://www.trustpilot.com/review/example.com";

scrapeTrustPilot(url)
  .then(data => console.log(data))
  .catch(error => console.error(error));
```

### Example Output

```json
{
  "totalReviews": 8330,
  "reviewsRate": "Excellent",
  "score": 4.5,
  "imageUrl": "https://example.com/profile-image.jpg"
}
```

## License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.

Feel free to reach out with any feedback or feature requests. Happy coding!
