import React from 'react';
import Articles from '../components/Blog/Articles';
import Layout from '../components/Blog/Layout';
import { Wrapper } from '@un/react';
import { getAllPosts } from '../lib/getPost';

//triggering a commit
const Posts = ({ articles }: any) => {
  return (
    <Layout>
      <Wrapper pageWidth="md">
        <Articles articles={articles} />
      </Wrapper>
    </Layout>
  );
};

export async function getStaticProps() {
  const articles =
    (await getAllPosts([
      'title',
      'date',
      'slug',
      'excerpt',
      'author',
      'ogImage',
      'coverImage',
      'content',
    ])) || [];

  /*articles.map((a) => {
    const coverImagePath = path.join(
      postsDirectory,
      a.path,
      '../',
      a.coverImage
    );

    const coverImageFile = require('../_posts/sample-image.jpg');
  });*/

  return {
    props: { articles },
  };
}

export default Posts;
