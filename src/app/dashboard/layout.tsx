export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <main className="min-h-screen bg-background text-foreground overflow-hidden">
            {children}
        </main>
    )
}
