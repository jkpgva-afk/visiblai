export const metadata = {
  title: "VisiblAI",
  description: "AI Visibility Platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          fontFamily: "system-ui, sans-serif",
          background: "#f9fafb",
        }}
      >
        <header
          style={{
            padding: "16px 24px",
            borderBottom: "1px solid #e5e7eb",
            background: "#ffffff",
            fontWeight: 600,
          }}
        >
          VisiblAI
        </header>

        <main style={{ padding: 24 }}>{children}</main>
      </body>
    </html>
  );
}
