import * as React from 'react';

import {
	Body,
	Container,
	Head,
	Heading,
	Html,
	Img,
	Link,
	Preview,
	Section,
	Tailwind,
	Text,
} from '@react-email/components';

import Footer from './footer';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;
const appUrl = process.env.NEXT_PUBLIC_APP_URL;

export default function WelcomeEmail() {
	return (
		<Html>
			<Tailwind>
				<Head />
				<Preview>Welcome to Expense.fyi</Preview>
				<Body className="mx-auto my-auto font-sans bg-white">
					<Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] w-[465px]">
						<Section className="mt-[22px]">
							<Img src={`${baseUrl}/icons/logo.png`} width="50" height="50" alt="Logo" className="block m-auto" />
						</Section>
						<Heading className="text-black text-[24px] font-normal text-center p-0 mb-[24px] mt-[12px] mx-0">
							Welcome to Expense.fyi
						</Heading>
						<Text className="text-black text-[14px] leading-[24px]">
							Hi, I{"'"}m Gokul, creator of the Expense.fyi, an open-source app to deliver financial clarity through
							spending analysis. We are excited to have you on board.
						</Text>
						<Text className="text-black text-[14px] leading-[24px]">Here is how you can get started:</Text>

						<Text className="m-1">4. Finally, spread some word about us.</Text>

						<Link
							href={appUrl}
							className="bg-[#000000] mt-2 inline-block p-2.5 px-3 rounded-md text-white text-[12px] font-medium no-underline text-center"
						>
							Get started
						</Link>
						<Footer />
					</Container>
				</Body>
			</Tailwind>
		</Html>
	);
}
