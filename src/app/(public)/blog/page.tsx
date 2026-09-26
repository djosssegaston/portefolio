import BlogList from "./BlogList"
import { getBlogPosts } from "@/lib/content"

export const revalidate = 60

export default async function Page() {
  const blogPosts = await getBlogPosts({ publishedOnly: true })
  return <BlogList blogPosts={blogPosts} />
}
