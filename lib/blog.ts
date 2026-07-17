/**
 * Blog scaffold for future MDX posts.
 * Drop files in content/blog/ and extend getAllPosts() when ready.
 */

export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  date: string;
  published: boolean;
};

export function getAllPosts(): BlogPost[] {
  return [];
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  void slug;
  return undefined;
}
