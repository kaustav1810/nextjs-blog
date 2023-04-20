import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import {remark} from 'remark';
import html from 'remark-html';

const postsDirectory = path.join(process.cwd(), 'posts');

const fileNames = fs.readdirSync(postsDirectory);

export function getAllPostIds(){

  const postIds = fileNames.map(file=>{

    const id = file.replace(/\.md$/,'');

    return {
      params: {id:id}
    }
  })

  return postIds;
}

export async function getPostData(id){
  // Read markdown file as string
  const fullPath = path.join(postsDirectory, `${id}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');

  // Use gray-matter to parse the post metadata section
  const matterResult = matter(fileContents);

  const processedContent =  await remark().use(html).process(matterResult.content);

  const processedHTML = processedContent.toString();

  // Combine the data with the id
  return {
    id,
    processedHTML,
    ...matterResult.data,
  };
}

export function getSortedPostsData() {
  // Get file names under /posts
  const allPostsData = fileNames.map((fileName) => {
    // Remove ".md" from file name to get id
    const id = fileName.replace(/\.md$/, '');

    // Read markdown file as string
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');

    // Use gray-matter to parse the post metadata section
    const matterResult = matter(fileContents);

    // Combine the data with the id
    return {
      id,
      ...matterResult.data,
    };
  });
  // Sort posts by date
  return allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
}