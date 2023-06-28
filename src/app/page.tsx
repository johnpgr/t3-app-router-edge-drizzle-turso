export const runtime = "edge"
export const revalidate = 0
export const metadata = {
    title: "Home",
    description: "Home",
}

export default function HomePage() {
    return <div className="container px-8">Hello World</div>
}
