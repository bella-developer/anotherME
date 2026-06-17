# Middleware Documentation

## Security Middleware

### Overview
The security middleware implements comprehensive security headers and CORS validation to protect the API from common web vulnerabilities.

### Components

#### 1. Helmet Configuration (`helmetConfig`)
Configures security headers including:
- **Content Security Policy (CSP)**: Restricts resource loading
- **HTTP Strict Transport Security (HSTS)**: Enforces HTTPS
- **X-Frame-Options**: Prevents clickjacking
- **X-Content-Type-Options**: Prevents MIME sniffing
- **X-XSS-Protection**: Legacy XSS protection
- **Referrer Policy**: Controls referrer information

#### 2. CORS Configuration (`corsConfig`)
Validates request origins against whitelist:
- Reads allowed origins from `CORS_ORIGIN` environment variable
- Supports multiple origins (comma-separated)
- Allows credentials (cookies, authorization headers)
- Exposes custom headers (X-Request-ID, Retry-After)

#### 3. HTTPS Redirect (`httpsRedirect`)
Redirects HTTP requests to HTTPS in production:
- Only active when `NODE_ENV=production`
- Checks `x-forwarded-proto` header
- Returns 301 permanent redirect

#### 4. Additional Security Headers (`additionalSecurityHeaders`)
Adds extra security headers:
- **Permissions-Policy**: Disables unnecessary browser features
- **X-DNS-Prefetch-Control**: Disables DNS prefetching

### Usage

```javascript
import {
  helmetConfig,
  corsConfig,
  httpsRedirect,
  additionalSecurityHeaders,
} from './middlewares/security.middleware.js';

// Apply in order
app.use(httpsRedirect);
app.use(helmetConfig);
app.use(additionalSecurityHeaders);
app.use(corsConfig());
```

### Environment Variables

```bash
# Single origin
CORS_ORIGIN=https://your-frontend.vercel.app

# Multiple origins (comma-separated)
CORS_ORIGIN=https://your-frontend.vercel.app,https://staging.vercel.app
```

## Response Sanitization Utilities

### Overview
Response sanitization utilities ensure API responses never expose internal MongoDB ObjectIDs, author IDs, or sensitive fields. All IDs are converted to opaque tokens to prevent enumeration attacks.

### Functions

#### `sanitizeUser(user, options)`
Sanitizes user data for public API responses.

**Exposed fields:**
- `id` (opaque)
- `alias`
- `age`
- `gender`
- `createdAt`

**Never exposed:**
- `_id`, `aliasHash`, `tokenVersion`, `isBanned`, `banExpiresAt`, `lastActive`, `updatedAt`

**Example:**
```javascript
import { sanitizeUser } from './utils/response.utils.js';

const user = await User.findById(userId);
const sanitized = sanitizeUser(user);

res.json({ data: sanitized });
```

#### `sanitizePost(post, options)`
Sanitizes post data for public API responses.

**Exposed fields:**
- `id` (opaque)
- `content` (sanitized version only)
- `category`
- `reactions`
- `commentCount`
- `createdAt`, `updatedAt`

**Optional fields:**
- `author.alias` (if `includeAuthorAlias: true` and populated)
- `circle.id`, `circle.name` (if `includeCircleName: true` and populated)

**Never exposed:**
- `_id`, `authorId`, `circleId`, `content` (unsanitized), `userReactions`, `isHidden`, `hiddenBy`, `hiddenAt`

**Example:**
```javascript
import { sanitizePost } from './utils/response.utils.js';

const post = await Post.findById(postId).populate('authorId', 'alias');
const sanitized = sanitizePost(post, { includeAuthorAlias: true });

res.json({ data: sanitized });
```

#### `sanitizeCircle(circle, options)`
Sanitizes circle data for public API responses.

**Exposed fields:**
- `id` (opaque)
- `name`, `description`
- `visibility`
- `memberCount`, `postCount`
- `categories`
- `createdAt`, `updatedAt`

**Optional fields:**
- `creator.alias` (if `includeCreatorAlias: true` and populated)

**Never exposed:**
- `_id`, `creatorId`

#### `sanitizeComment(comment, options)`
Sanitizes comment data for public API responses.

**Exposed fields:**
- `id` (opaque)
- `content` (sanitized version only)
- `depth`
- `isDeleted`
- `parentId` (opaque, if present)
- `createdAt`

**Optional fields:**
- `author.alias` (if `includeAuthorAlias: true` and populated)

**Never exposed:**
- `_id`, `postId`, `authorId`, `parentId` (raw), `content` (unsanitized), `updatedAt`

#### `sanitizeArray(items, sanitizeFunc, options)`
Sanitizes an array of documents.

**Example:**
```javascript
import { sanitizeArray, sanitizePost } from './utils/response.utils.js';

const posts = await Post.find({ circleId }).limit(20);
const sanitized = sanitizeArray(posts, sanitizePost);

res.json({ data: sanitized });
```

#### `createPaginatedResponse(items, sanitizeFunc, pagination, options)`
Creates a paginated response with sanitized data.

**Example:**
```javascript
import { createPaginatedResponse, sanitizePost } from './utils/response.utils.js';

const posts = await Post.find({ circleId }).limit(20);
const pagination = {
  cursor: generateCursor(posts[posts.length - 1]),
  hasMore: posts.length === 20,
  total: await Post.countDocuments({ circleId }),
};

const response = createPaginatedResponse(posts, sanitizePost, pagination);
res.json(response);
```

#### `createSuccessResponse(data, message)`
Creates a standardized success response.

**Example:**
```javascript
import { createSuccessResponse, sanitizeUser } from './utils/response.utils.js';

const user = await User.create({ alias, age, gender });
const response = createSuccessResponse(
  sanitizeUser(user),
  'User created successfully'
);

res.status(201).json(response);
```

#### `sanitizeError(error, requestId)`
Sanitizes errors for public API responses.

**Example:**
```javascript
import { sanitizeError } from './utils/response.utils.js';

app.use((err, req, res, next) => {
  const sanitized = sanitizeError(err, req.id);
  res.status(sanitized.statusCode).json(sanitized);
});
```

### Best Practices

1. **Always sanitize before sending responses**
   ```javascript
   // ❌ Bad - exposes internal IDs
   res.json({ data: user });
   
   // ✅ Good - sanitized response
   res.json({ data: sanitizeUser(user) });
   ```

2. **Use opaque IDs for all references**
   ```javascript
   // ❌ Bad - raw MongoDB ObjectID
   { postId: "507f1f77bcf86cd799439011" }
   
   // ✅ Good - opaque ID
   { postId: "NTA3ZjFmNzdiY2Y4NmNkNzk5NDM5MDExOmFiY2QxMjM0" }
   ```

3. **Never populate sensitive fields**
   ```javascript
   // ❌ Bad - populates full user with sensitive data
   const post = await Post.findById(id).populate('authorId');
   
   // ✅ Good - only populate needed fields
   const post = await Post.findById(id).populate('authorId', 'alias');
   ```

4. **Use pagination helpers for lists**
   ```javascript
   // ✅ Good - consistent pagination format
   const response = createPaginatedResponse(
     posts,
     sanitizePost,
     { cursor, hasMore }
   );
   ```

5. **Handle errors consistently**
   ```javascript
   // ✅ Good - sanitized error response
   try {
     // ... operation
   } catch (error) {
     const sanitized = sanitizeError(error, req.id);
     res.status(sanitized.statusCode).json(sanitized);
   }
   ```

### Security Considerations

- **Never expose MongoDB ObjectIDs directly** - Use opaque IDs
- **Never expose author IDs** - Only expose aliases when needed
- **Never expose token versions** - Internal security mechanism
- **Never expose ban status** - Internal moderation data
- **Never expose unsanitized content** - Always use `contentSanitized`
- **Never expose user reactions list** - Only expose aggregate counts
- **Never expose moderation fields** - `isHidden`, `hiddenBy`, `hiddenAt`

### Testing

All sanitization functions have comprehensive unit tests. Run tests with:

```bash
npm test -- src/utils/response.utils.test.js
```
