/**
 * Code Review Skill
 *
 * Performs comprehensive code review of the project or specific files.
 * Can be invoked with: /review [file-path?]
 */

export default async function () {
  const args = arguments[0] || '';

  let reviewTarget = 'entire codebase';
  let specificFile = null;

  // Parse arguments
  if (args && args.trim()) {
    specificFile = args.trim();
    reviewTarget = `file: ${specificFile}`;
  }

  return {
    prompt: `Perform a comprehensive code review of the ${reviewTarget}.

## Review Instructions

1. **Check git status and recent changes** to understand what has been modified
2. **Review the following aspects**:

### Code Quality
- Edge cases and error handling
- Business logic correctness
- Data validation and type safety
- Clear failure behavior

### Security (CRITICAL)
- OWASP Top 10 vulnerabilities:
  * SQL Injection, XSS, CSRF
  * Authentication/authorization issues
  * Input validation and sanitization
  * Secrets/credential exposure
  * Dependency vulnerabilities

### Architecture & Patterns
- FSD layer compliance:
  * No imports from lower layers to higher layers
  * Public API pattern (index.ts exports)
  * Correct segment usage (ui/, model/, api/, lib/)
- Component patterns:
  * Server vs Client Components (Next.js App Router)
  * React.memo usage for optimization
  * Unnecessary re-renders
- Performance considerations
- Code organization and maintainability

### Project Conventions
- TypeScript strict mode compliance
- ESLint/Prettier compliance
- Naming conventions (.ui.tsx, .hook.ts, etc.)
- File structure adherence

### Testing
- Test coverage for new code
- Test quality and completeness
- Integration test needs

3. **Format your output as:**

\`\`\`
## 코드 리뷰 결과

### 📊 리뷰 대상
${reviewTarget}

### 🟢 잘한 점
- [항목 1]
- [항목 2]

### 🟡 개선 제안 (선택사항)
1. **[제안 제목]**
   - 위치: \`파일 경로:줄번호\`
   - 현재: [현재 코드 또는 설명]
   - 제안: [개선 방법]
   - 이유: [왜 개선하는지]
   - 우선순위: [low | medium | high]

### 🔴 해결해야 할 문제 (필수사항)
1. **[문제 제목]**
   - 위치: \`파일 경로:줄번호\`
   - 문제: [설명]
   - 영향: [어떤 문제를 일으키는지]
   - 해결 방안: [구체적인 제안]
   - 심각도: [critical | high | medium | low]

### 📝 FSD 아키텍처 검토
${specificFile ? '- [ ] FSD 레이어 규칙 준수\n- [ ] 올바른 import 방향' : '- 각 변경 파일의 FSD 준수 여부 검토'}

### 🔒 보안 검토
${specificFile ? '- [ ] 보안 취약점 없음' : '- [ ] OWASP Top 10 취약점 검토\n- [ ] 인증/권한 검토\n- [ ] 입력 검증 검토'}

### 🧪 테스트 검토
- [ ] 새 코드에 대한 테스트 작성 필요: [파일 또는 기능]
- [ ] 기존 테스트 수정 필요: [파일]
- [ ] 테스트 커버리지 충분: [예/아니오, 이유]

### ✅ 커밋 가능 여부
**결과:** [바로 커밋 가능 | 수정 후 커밋 권장 | 필수 수정 필요]

**이유:** [간단한 설명]

### 📋 요약
- **총 문제:** critical: 0, high: 0, medium: 0, low: 0
- **총 제안:** 0개
- **다음 단계:** [구체적인 액션 아이템]
\`\`\`

## Important Notes

- Focus on HIGH-PRIORITY issues that actually matter
- Don't nitpick style issues (let Prettier handle those)
- Be constructive and specific in your feedback
- Provide actionable recommendations with code examples when helpful
- Consider the project context (FSD architecture, Next.js 15, etc.)
- If there are no issues, say so! Not every review needs to find problems

${
  specificFile
    ? `
## File-Specific Review

For the file "${specificFile}":
1. Read the file completely
2. Understand its purpose in the architecture
3. Check for issues specific to this file
4. Verify it follows FSD patterns for its layer
`
    : `
## Full Codebase Review

For the entire codebase:
1. Check git status to see what files changed
2. Focus review on changed files
3. Consider impacts on other parts of the codebase
4. Check for architectural consistency
`
}
`,
  };
}
