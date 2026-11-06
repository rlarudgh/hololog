import {
  pgTable,
  uuid,
  text,
  timestamp,
  boolean,
  integer,
  type AnyPgColumn,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// 모든 테이블에 RLS를 켜고 정책은 두지 않는다.
// public 스키마는 publishable 키로 Data API(REST)에 노출되므로 그 경로를 전부 막고,
// 앱은 DATABASE_URL(postgres 역할, RLS 우회)로만 접근한다.
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: timestamp('emailVerified', { mode: 'date' }),
  image: text('image'),
  role: text('role', { enum: ['user', 'admin'] })
    .default('user')
    .notNull(),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow().notNull(),
}).enableRLS();

export const posts = pgTable('posts', {
  id: uuid('id').primaryKey().defaultRandom(),
  slug: text('slug').notNull().unique(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  content: text('content').notNull(),
  // 발행일. MDX 프론트매터의 `date`와 매핑되며 목록 정렬 기준이다.
  date: timestamp('date', { mode: 'date' }).defaultNow().notNull(),
  published: boolean('published').default(false).notNull(),
  // 글의 출처. 'mdx'는 동기화 스크립트가 관리(미러), 'api'는 외부 쓰기로 생성.
  // 동기화는 source='mdx' 행만 건드려 외부 작성 글을 보존한다.
  source: text('source', { enum: ['mdx', 'api'] })
    .default('api')
    .notNull(),
  // user 인증을 도입하기 전까지 MDX 글은 작성자가 없으므로 nullable.
  authorId: uuid('author_id').references(() => users.id, {
    onDelete: 'set null',
  }),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow().notNull(),
}).enableRLS();

export const tags = pgTable('tags', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull().unique(),
  slug: text('slug').notNull().unique(),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
}).enableRLS();

export const postTags = pgTable('post_tags', {
  id: uuid('id').primaryKey().defaultRandom(),
  postId: uuid('post_id')
    .notNull()
    .references(() => posts.id, { onDelete: 'cascade' }),
  tagId: uuid('tag_id')
    .notNull()
    .references(() => tags.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
}).enableRLS();

export const comments = pgTable('comments', {
  id: uuid('id').primaryKey().defaultRandom(),
  content: text('content').notNull(),
  postId: uuid('post_id')
    .notNull()
    .references(() => posts.id, { onDelete: 'cascade' }),
  authorId: uuid('author_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  parentId: uuid('parent_id').references((): AnyPgColumn => comments.id, {
    onDelete: 'cascade',
  }),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow().notNull(),
}).enableRLS();

export const likes = pgTable('likes', {
  id: uuid('id').primaryKey().defaultRandom(),
  postId: uuid('post_id')
    .notNull()
    .references(() => posts.id, { onDelete: 'cascade' }),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
}).enableRLS();

// URL Shortener. short_code는 original_url의 SHA-256에서 결정적으로 만들고,
// original_url을 unique로 두어 같은 URL 재요청 시 기존 행을 재사용한다.
export const shortUrls = pgTable('short_urls', {
  id: uuid('id').primaryKey().defaultRandom(),
  shortCode: text('short_code').notNull().unique(),
  originalUrl: text('original_url').notNull().unique(),
  clicks: integer('clicks').default(0).notNull(),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
}).enableRLS();

export const usersRelations = relations(users, ({ many }) => ({
  posts: many(posts),
  comments: many(comments),
  likes: many(likes),
}));

export const postsRelations = relations(posts, ({ one, many }) => ({
  author: one(users, {
    fields: [posts.authorId],
    references: [users.id],
  }),
  tags: many(postTags),
  comments: many(comments),
  likes: many(likes),
}));

export const tagsRelations = relations(tags, ({ many }) => ({
  posts: many(postTags),
}));

export const postTagsRelations = relations(postTags, ({ one }) => ({
  post: one(posts, {
    fields: [postTags.postId],
    references: [posts.id],
  }),
  tag: one(tags, {
    fields: [postTags.tagId],
    references: [tags.id],
  }),
}));

export const commentsRelations = relations(comments, ({ one, many }) => ({
  post: one(posts, {
    fields: [comments.postId],
    references: [posts.id],
  }),
  author: one(users, {
    fields: [comments.authorId],
    references: [users.id],
  }),
  parent: one(comments, {
    fields: [comments.parentId],
    references: [comments.id],
  }),
  replies: many(comments),
}));

export const likesRelations = relations(likes, ({ one }) => ({
  post: one(posts, {
    fields: [likes.postId],
    references: [posts.id],
  }),
  user: one(users, {
    fields: [likes.userId],
    references: [users.id],
  }),
}));
