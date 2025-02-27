import { scrapeTrustPilot } from './scrapeTrustPilot';

const url = 'https://www.trustpilot.com/review/npmjs.com';

scrapeTrustPilot(url)
	.then((data) => console.log(data))
	.catch((error) => console.error(error));
