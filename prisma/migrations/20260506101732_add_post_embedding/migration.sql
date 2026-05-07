-- This is an empty migration.
-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Add embedding column
ALTER TABLE "posts" ADD COLUMN IF NOT EXISTS embedding vector(1024);