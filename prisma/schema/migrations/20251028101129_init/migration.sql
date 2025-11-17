-- CreateTable
CREATE TABLE "books" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "author" VARCHAR(200) NOT NULL,
    "publish_date" DATE,
    "review" TEXT NOT NULL,
    "quotes" JSON,
    "thumbnail" VARCHAR(255),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "books_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "post_terms" (
    "post_id" INTEGER NOT NULL,
    "term_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pk_post_terms" PRIMARY KEY ("post_id","term_id")
);

-- CreateTable
CREATE TABLE "posts" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(200) NOT NULL,
    "excerpt" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "slug" VARCHAR(255) NOT NULL,
    "table_of_contents" JSON,
    "status" VARCHAR(20) NOT NULL,
    "published_at" TIMESTAMP(6),
    "author_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "thumbnail" VARCHAR(255),

    CONSTRAINT "posts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "taxonomies" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "slug" VARCHAR(100) NOT NULL,
    "description" VARCHAR(500),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "taxonomies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "terms" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "slug" VARCHAR(100) NOT NULL,
    "description" VARCHAR(500),
    "taxonomy_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "terms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "username" VARCHAR(50) NOT NULL,
    "password" VARCHAR(60) NOT NULL,
    "email" VARCHAR(100),
    "role" VARCHAR(20) DEFAULT 'USER',
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_books_name" ON "books"("name");

-- CreateIndex
CREATE INDEX "idx_books_author" ON "books"("author");

-- CreateIndex
CREATE INDEX "idx_books_publish_date" ON "books"("publish_date");

-- CreateIndex
CREATE INDEX "idx_post_terms_post_id" ON "post_terms"("post_id");

-- CreateIndex
CREATE INDEX "idx_post_terms_term_id" ON "post_terms"("term_id");

-- CreateIndex
CREATE UNIQUE INDEX "uk_post_terms_post_term" ON "post_terms"("post_id", "term_id");

-- CreateIndex
CREATE UNIQUE INDEX "posts_slug_key" ON "posts"("slug");

-- CreateIndex
CREATE INDEX "idx_posts_author_id" ON "posts"("author_id");

-- CreateIndex
CREATE INDEX "idx_posts_published_at" ON "posts"("published_at");

-- CreateIndex
CREATE INDEX "idx_posts_slug" ON "posts"("slug");

-- CreateIndex
CREATE INDEX "idx_posts_status" ON "posts"("status");

-- CreateIndex
CREATE INDEX "idx_posts_status_published_at" ON "posts"("status", "published_at");

-- CreateIndex
CREATE UNIQUE INDEX "uk_taxonomies_name" ON "taxonomies"("name");

-- CreateIndex
CREATE UNIQUE INDEX "uk_taxonomies_slug" ON "taxonomies"("slug");

-- CreateIndex
CREATE INDEX "idx_taxonomies_name" ON "taxonomies"("name");

-- CreateIndex
CREATE INDEX "idx_taxonomies_slug" ON "taxonomies"("slug");

-- CreateIndex
CREATE INDEX "idx_terms_name" ON "terms"("name");

-- CreateIndex
CREATE INDEX "idx_terms_slug" ON "terms"("slug");

-- CreateIndex
CREATE INDEX "idx_terms_taxonomy_id" ON "terms"("taxonomy_id");

-- CreateIndex
CREATE UNIQUE INDEX "uk_terms_name_taxonomy" ON "terms"("name", "taxonomy_id");

-- CreateIndex
CREATE UNIQUE INDEX "uk_terms_slug_taxonomy" ON "terms"("slug", "taxonomy_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "idx_users_email" ON "users"("email");

-- CreateIndex
CREATE INDEX "idx_users_username" ON "users"("username");

-- AddForeignKey
ALTER TABLE "post_terms" ADD CONSTRAINT "fk_post_terms_post_id" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "post_terms" ADD CONSTRAINT "fk_post_terms_term_id" FOREIGN KEY ("term_id") REFERENCES "terms"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "fk_posts_author" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "terms" ADD CONSTRAINT "fk_terms_taxonomy_id" FOREIGN KEY ("taxonomy_id") REFERENCES "taxonomies"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
