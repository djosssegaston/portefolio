import { notFound } from "next/navigation"
import type { BlogPost } from "@/types"
import { Metadata } from "next"
import BlogPostDetail from "./BlogPostDetail"
import { getBlogPostBySlug, getBlogPosts } from "@/lib/content"

export const revalidate = 60

export async function generateStaticParams() {
  const posts = await getBlogPosts({ publishedOnly: true })
  return posts.map((post: BlogPost) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = (await getBlogPostBySlug(params.slug)) as BlogPost | null
  if (!post) return { title: "Articles" }
  const description = post.excerpt || post.content?.slice(0, 160)
  return {
    title: post.title,
    description,
    openGraph: {
      title: post.title,
      description,
      images: post.coverImage ? [post.coverImage] : undefined,
      type: "article",
    },
    alternates: { canonical: `/blog/${params.slug}` },
  }
}

export default async function Page({ params }: { params: { slug: string } }) {
  const post = await getBlogPostBySlug(params.slug)
  if (!post) notFound()
  const related = (await getBlogPosts({ publishedOnly: true }))
    .filter((p: BlogPost) => p.category === post.category && p.slug !== post.slug)
    .slice(0, 3)
  return <BlogPostDetail post={post} related={related} />
}
