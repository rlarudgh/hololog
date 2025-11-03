import fs from 'fs';
import path from 'path';

const postsDirectory = path.join(process.cwd(), 'content', 'posts');
const readmePath = path.join(process.cwd(), 'content', 'README.md');

const files = fs.readdirSync(postsDirectory);

let tree = 'posts/\n';
files.forEach((file, index) => {
  const isLast = index === files.length - 1;
  tree += `├── ${file}\n`;
});

tree = tree.replace(/\├(?=[^\├]*$)/, '\\└');

const readmeContent = fs.readFileSync(readmePath, 'utf8');

const startMarker = '<!-- POSTS_STRUCTURE_START -->';
const endMarker = '<!-- POSTS_STRUCTURE_END -->';

const startIndex = readmeContent.indexOf(startMarker);
const endIndex = readmeContent.indexOf(endMarker);

if (startIndex === -1 || endIndex === -1) {
  console.error('Markers not found in README.md');
  process.exit(1);
}

const newReadmeContent = 
  readmeContent.slice(0, startIndex + startMarker.length) + 
  '\n```\n' +
  tree +
  '```\n' +
  readmeContent.slice(endIndex);

fs.writeFileSync(readmePath, newReadmeContent);

console.log('Successfully updated content/README.md with posts structure.');
