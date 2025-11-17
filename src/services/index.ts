// Export the factory
export { default as HttpFactory } from './factory';

// Export all services
export { default as UserService } from './modules/user-service';
export { default as PostService } from './modules/post-service';
export { default as TaxonomyService } from './modules/taxonomy-service';
export { default as TermService } from './modules/term-service';
export { default as BookService } from './modules/book-service';

// Convenience function to create service instances with token
export const createUserService = (accessToken?: string) => new (require('./modules/user-service').default)(accessToken);
export const createPostService = (accessToken?: string) => new (require('./modules/post-service').default)(accessToken);
export const createTaxonomyService = (accessToken?: string) => new (require('./modules/taxonomy-service').default)(accessToken);
export const createTermService = (accessToken?: string) => new (require('./modules/term-service').default)(accessToken);
export const createBookService = (accessToken?: string) => new (require('./modules/book-service').default)(accessToken);

// Default instances (without tokens for public endpoints)
import UserService from './modules/user-service';
import PostService from './modules/post-service';
import TaxonomyService from './modules/taxonomy-service';
import TermService from './modules/term-service';
import BookService from './modules/book-service';

export const userService = new UserService();
export const postService = new PostService();
export const taxonomyService = new TaxonomyService();
export const termService = new TermService();
export const bookService = new BookService();