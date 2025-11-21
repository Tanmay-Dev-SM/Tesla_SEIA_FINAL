import "./globals.css";

export const metadata = {
  title: "SEIA - Tesla",
  description: "Tesla Energy Service Engineering UI Applications Evaluation",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
