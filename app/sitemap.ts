import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
	return [
		{
			url: 'https://qxpense.vercel.app',
			lastModified: new Date(),
		},
		{
			url: 'https://qxpense.vercel.app/app',
			lastModified: new Date(),
		},
		{
			url: 'https://qxpense.vercel.app/app/signin',
			lastModified: new Date(),
		},
		{
			url: 'https://qxpense.vercel.app/app/siginup',
			lastModified: new Date(),
		},
		{
			url: 'https://qxpense.vercel.app/app/expenses',
			lastModified: new Date(),
		},
		{
			url: 'https://qxpense.vercel.app/app/income',
			lastModified: new Date(),
		},
		{
			url: 'https://qxpense.vercel.app/app/investments',
			lastModified: new Date(),
		},
		{
			url: 'https://qxpense.vercel.app/app/settings',
			lastModified: new Date(),
		},
	];
}
