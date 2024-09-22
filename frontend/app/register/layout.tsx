import { Toaster } from "react-hot-toast";

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<>
			<Toaster />
			{children}
		</>
	);
}
