import { Metadata } from 'next';
import Script from 'next/script';
import Link from 'next/link';
import Image from 'next/image';

// Dummy data fetching function (replace with your real data logic)
async function getCategoryData(slug) {
  // Example: fetch from your CMS or DB
  return {
    name: slug.charAt(0).toUpperCase() + slug.slice(1),
    description: `Latest articles, news, and tips on ${slug}. Stay updated with trends, guides, and expert advice.`,
    posts: [
      {
        title: `Sample ${slug} Post 1`,
        slug: 'sample-post-1',
        coverImage: '/default.jpg',
        excerpt: 'This is a sample excerpt for post 1.',
      },
      {
        title: `Sample ${slug} Post 2`,
        slug: 'sample-post-2',
        coverImage: '/default.jpg',
        excerpt: 'This is a sample excerpt for post 2.',
      },
    ],
  };
}

export async function generateMetadata({ params }) {
  const category = params.slug;
  // Fetch posts to get the first post's cover image
  const data = await getCategoryData(category);
  const firstPostImage = data.posts && data.posts[0] && data.posts[0].coverImage && data.posts[0].coverImage.startsWith('http')
    ? data.posts[0].coverImage
    : `https://qalam.website/og/${category}.jpg`;
  const firstPostTitle = data.posts && data.posts[0] ? data.posts[0].title : category.charAt(0).toUpperCase() + category.slice(1);
  return {
    title: `${category.charAt(0).toUpperCase() + category.slice(1)} News, Tips & Updates | Qalam Blog`,
    description: `Latest articles, news, and tips on ${category}. Stay updated with trends, guides, and expert advice.`,
    alternates: { canonical: `https://qalam.website/category/${category}` },
    openGraph: {
      title: `${category.charAt(0).toUpperCase() + category.slice(1)} News, Tips & Updates | Qalam Blog`,
      description: `Latest articles, news, and tips on ${category}.`,
      url: `https://qalam.website/category/${category}`,
      type: 'website',
      images: [
        {
          url: firstPostImage,
          width: 1200,
          height: 630,
          alt: `${firstPostTitle} - ${category.charAt(0).toUpperCase() + category.slice(1)} category Open Graph image`,
        },
      ],
    },
    twitter: {
      card: 'summary',
      title: `${category.charAt(0).toUpperCase() + category.slice(1)} News, Tips & Updates | Qalam Blog`,
      description: `Latest articles, news, and tips on ${category}.`,
      images: [
        {
          url: firstPostImage,
          width: 1200,
          height: 630,
          alt: `${firstPostTitle} - ${category.charAt(0).toUpperCase() + category.slice(1)} category Twitter image`,
        },
      ],
    },
    robots: { index: true, follow: true },
  };
}

export default async function CategoryPage({ params }) {
  const category = params.slug;
  const data = await getCategoryData(category);

  // Breadcrumb JSON-LD
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://qalam.website/"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": data.name,
        "item": `https://qalam.website/category/${category}`
      }
    ]
  };

  // Category CollectionPage JSON-LD with hasPart
  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": data.name,
    "description": data.description,
    "url": `https://qalam.website/category/${category}`,
    "hasPart": data.posts.map(post => ({
      "@type": "BlogPosting",
      "headline": post.title,
      "url": `https://qalam.website/blog/en/${post.slug}`
    }))
  };

  return (
    <>
      <Script id="jsonld-breadcrumb" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <Script id="jsonld-collection" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }} />
      <main className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">{data.name} News & Articles</h1>
        <p className="mb-6 text-gray-600">{data.description}</p>
        <section className="grid gap-6 md:grid-cols-2">
          {data.posts.map(post => (
            <article key={post.slug} className="border rounded-lg p-4 bg-white shadow">
              <Link href={`/blog/en/${post.slug}`}>
                <Image
                  src={post.coverImage}
                  alt={`${post.title} - ${data.name} article cover image`}
                  width={600}
                  height={315}
                  className="w-full h-40 object-cover rounded mb-2"
                  loading="lazy"
                />
                <h2 className="text-xl font-semibold mb-1">{post.title}</h2>
              </Link>
              <p className="text-gray-500 text-sm mb-2">{post.excerpt}</p>
              <Link href={`/blog/en/${post.slug}`} className="text-blue-600 hover:underline">Read more</Link>
            </article>
          ))}
        </section>
      </main>
    </>
  );
}
