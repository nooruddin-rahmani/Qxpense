import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';

import urls from 'constants/url';

export async function middleware(req: NextRequest) {
	const res = NextResponse.next();
	const hostname = req.headers.get('host');
	console.log('hostname: ', hostname);
	const url = req.nextUrl;
	console.log('url: ', url);

	// Use a default value if urls.homeWithoutApp is undefined
	const homeWithoutApp = urls.homeWithoutApp || '';
	let currentHost = '';
	if (hostname) {
		currentHost = hostname.replace(homeWithoutApp, '');
	}
	console.log('currentHost:', currentHost);

	const supabase = createMiddlewareClient({ req, res });
	const { data } = await supabase.auth.getSession();
	const { session } = data;

	if (currentHost === '/app') {
		if (url.pathname === '/app/signin' || url.pathname === '/app/signup') {
			if (session) {
				url.pathname = '/app';
				return NextResponse.redirect(url);
			}
			return res;
		}

		url.pathname = `/app/dashboard${url.pathname.replace('/app', '')}`;
		return NextResponse.rewrite(url);
	}

	return res;
}

export const config = {
	matcher: [
		/*
		 * Match all paths except for:
		 * 1. /api/ routes
		 * 2. /_next/ (Next.js internals)
		 * 3. /_proxy/ (special page for OG tags proxying)
		 * 4. /_static (inside /public)
		 * 5. /_vercel (Vercel internals)
		 * 6. /favicon.ico, /sitemap.xml (static files)
		 */
		'/((?!api/|_next/|_proxy/|_static|_vercel|favicon.ico|sitemap.xml).*)',
	],
};
