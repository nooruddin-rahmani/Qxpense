import { getRangeDateForFilter } from './date';
import { views } from './table';

const isProduction = process.env.NODE_ENV === 'production';

const domain = process.env.NEXT_PUBLIC_SITE_URL;
const local = 'localhost:3000'; // Updated to reflect the new base path
const home = isProduction ? domain : local;
console.log('home', home);

const url = {
	homeWithoutApp: isProduction ? domain : 'localhost:3000', // Keeps the base domain without the /app path
	home: `http://${home}`, // Use http for local development
	api: `${isProduction ? `https://${home}` : `http://${home}`}`,
	serverApi: `${isProduction ? `https://${home}` : `http://${home}`}`,
	app: {
		signin: `${isProduction ? `https://${home}/signin` : `http://${home}/signin`}`, // Paths under /app are now covered by `home`
		signup: `${isProduction ? `https://${home}/signup` : `http://${home}/signup`}`,
		overview: `http://${home}/app`,
	},
	twitter: 'https://twitter.com/gokul_i',
	github: 'https://github.com/gokulkrishh/expense.fyi',
};

export const getApiUrl = (filterKey: string, apiPath: string, categories: string[] = [], isNotRange = false) => {
	if (isNotRange) {
		return `/api/${apiPath}`;
	}

	if (filterKey === views.all.key) {
		return `/api/${apiPath}?categories=${categories?.join(',')}`;
	}

	const [start, end] = getRangeDateForFilter(filterKey);
	return `/api/${apiPath}?from=${start}&to=${end}&categories=${categories?.join(',')}`;
};

export default url;
