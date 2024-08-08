import { getRangeDateForFilter } from './date';
import { views } from './table';

const isProduction = process.env.NODE_ENV === 'production';

const domain = process.env.NEXT_PUBLIC_SITE_URL;
const local = 'localhost:3000';
const home = isProduction ? domain : local;

const url = {
	homeWithoutApp: home,
	home: `https://${home}`,
	api: `${isProduction ? `https://${home}/app` : `http://${home}/app`}`,
	serverApi: `${isProduction ? `https://${home}/app` : `http://${home}/app`}`,
	app: {
		signin: `https://${home}/app/signin`,
		signup: `https://${home}/app/signup`,
		overview: `https://${home}/app`,
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
