/**
 * Hololog Blog API의 OpenAPI 3.1 스펙.
 * `/api/openapi`로 제공되며 `/api-docs`(Scalar)가 이를 렌더링한다.
 */
export const openapiSpec = {
  openapi: '3.1.0',
  info: {
    title: 'Hololog Blog API',
    version: '1.0.0',
    description:
      '블로그 글/태그 데이터를 제공하는 API. 모든 요청에 API 키가 필요하며(`x-api-key` 헤더), ' +
      '없거나 틀리면 401을 반환한다. 읽기 키는 GET, 쓰기 키는 POST/PUT/DELETE에 사용한다.',
  },
  servers: [
    { url: 'http://localhost:3000', description: 'Local' },
    { url: 'https://hololog.vercel.app', description: 'Production' },
  ],
  security: [{ apiKey: [] }],
  tags: [
    { name: 'Posts', description: '블로그 글' },
    { name: 'Tags', description: '태그' },
  ],
  paths: {
    '/api/posts': {
      get: {
        tags: ['Posts'],
        summary: '발행된 글 목록',
        description: '발행된 글을 발행일 내림차순으로 반환한다(본문 제외). 읽기 키 필요.',
        responses: {
          '200': {
            description: '글 목록',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    posts: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/PostSummary' },
                    },
                  },
                },
              },
            },
          },
          '401': { $ref: '#/components/responses/Unauthorized' },
        },
      },
      post: {
        tags: ['Posts'],
        summary: '글 생성',
        description: '새 글을 생성한다(source=api). 쓰기 키 필요.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/PostCreate' },
            },
          },
        },
        responses: {
          '201': {
            description: '생성됨',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: { post: { $ref: '#/components/schemas/Post' } },
                },
              },
            },
          },
          '400': { $ref: '#/components/responses/ValidationError' },
          '401': { $ref: '#/components/responses/Unauthorized' },
          '409': {
            description: 'slug 중복 등으로 생성 실패',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
        },
      },
    },
    '/api/posts/{slug}': {
      parameters: [
        {
          name: 'slug',
          in: 'path',
          required: true,
          schema: { type: 'string' },
          description: '글의 고유 slug',
        },
      ],
      get: {
        tags: ['Posts'],
        summary: '글 단건 조회',
        description: '본문(content)을 포함해 단건을 반환한다. 읽기 키 필요.',
        responses: {
          '200': {
            description: '글',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: { post: { $ref: '#/components/schemas/Post' } },
                },
              },
            },
          },
          '401': { $ref: '#/components/responses/Unauthorized' },
          '404': { $ref: '#/components/responses/NotFound' },
        },
      },
      put: {
        tags: ['Posts'],
        summary: '글 수정',
        description: '전달된 필드만 갱신한다. 쓰기 키 필요.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/PostUpdate' },
            },
          },
        },
        responses: {
          '200': {
            description: '수정됨',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: { post: { $ref: '#/components/schemas/Post' } },
                },
              },
            },
          },
          '400': { $ref: '#/components/responses/ValidationError' },
          '401': { $ref: '#/components/responses/Unauthorized' },
          '404': { $ref: '#/components/responses/NotFound' },
        },
      },
      delete: {
        tags: ['Posts'],
        summary: '글 삭제',
        description: '글을 삭제한다. 쓰기 키 필요.',
        responses: {
          '200': {
            description: '삭제됨',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: { success: { type: 'boolean' } },
                },
              },
            },
          },
          '401': { $ref: '#/components/responses/Unauthorized' },
          '404': { $ref: '#/components/responses/NotFound' },
        },
      },
    },
    '/api/tags': {
      get: {
        tags: ['Tags'],
        summary: '태그 목록',
        description: '전체 태그를 반환한다. 읽기 키 필요.',
        responses: {
          '200': {
            description: '태그 목록',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    tags: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/Tag' },
                    },
                  },
                },
              },
            },
          },
          '401': { $ref: '#/components/responses/Unauthorized' },
        },
      },
    },
  },
  components: {
    securitySchemes: {
      apiKey: {
        type: 'apiKey',
        in: 'header',
        name: 'x-api-key',
        description:
          '읽기: BLOG_API_KEYS 중 하나. 쓰기: BLOG_API_WRITE_KEY. ' +
          '`Authorization: Bearer <key>`도 허용.',
      },
    },
    schemas: {
      PostSummary: {
        type: 'object',
        required: ['slug', 'title', 'date', 'description'],
        properties: {
          slug: { type: 'string', example: '2025-memoir' },
          title: { type: 'string', example: '2025년 회고' },
          date: { type: 'string', example: '2025-11-26' },
          description: { type: 'string' },
          tags: {
            type: 'array',
            items: { type: 'string' },
            example: ['AI', '회고'],
          },
        },
      },
      Post: {
        allOf: [
          { $ref: '#/components/schemas/PostSummary' },
          {
            type: 'object',
            properties: {
              content: { type: 'string', description: '본문(MDX/Markdown)' },
            },
          },
        ],
      },
      PostCreate: {
        type: 'object',
        required: ['slug', 'title', 'description', 'content'],
        properties: {
          slug: { type: 'string', example: 'hello-world' },
          title: { type: 'string', example: 'Hello World' },
          description: { type: 'string', example: '첫 글' },
          content: { type: 'string', example: '# Hello\n\n본문...' },
          date: { type: 'string', example: '2026-06-23' },
          tags: { type: 'array', items: { type: 'string' }, example: ['news'] },
          published: { type: 'boolean', default: false },
        },
      },
      PostUpdate: {
        type: 'object',
        description: '전달된 필드만 갱신된다.',
        properties: {
          title: { type: 'string' },
          description: { type: 'string' },
          content: { type: 'string' },
          date: { type: 'string' },
          tags: { type: 'array', items: { type: 'string' } },
          published: { type: 'boolean' },
        },
      },
      Tag: {
        type: 'object',
        properties: {
          name: { type: 'string', example: '회고' },
          slug: { type: 'string', example: '회고' },
        },
      },
      Error: {
        type: 'object',
        properties: { error: { type: 'string' } },
      },
    },
    responses: {
      Unauthorized: {
        description: 'API 키 없음/불일치',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/Error' },
            example: { error: 'Unauthorized' },
          },
        },
      },
      NotFound: {
        description: '대상 없음',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/Error' },
            example: { error: 'Post not found' },
          },
        },
      },
      ValidationError: {
        description: '요청 바디 검증 실패',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                error: { type: 'string' },
                details: { type: 'array', items: { type: 'object' } },
              },
            },
          },
        },
      },
    },
  },
} as const;
