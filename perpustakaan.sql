/*
 Navicat Premium Data Transfer

 Source Server         : postgres_local
 Source Server Type    : PostgreSQL
 Source Server Version : 120004
 Source Host           : localhost:5432
 Source Catalog        : perpustakaan
 Source Schema         : public

 Target Server Type    : PostgreSQL
 Target Server Version : 120004
 File Encoding         : 65001

 Date: 21/03/2025 21:53:48
*/


-- ----------------------------
-- Sequence structure for book_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."book_id_seq";
CREATE SEQUENCE "public"."book_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for borrow_record_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."borrow_record_id_seq";
CREATE SEQUENCE "public"."borrow_record_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for member_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."member_id_seq";
CREATE SEQUENCE "public"."member_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;

-- ----------------------------
-- Table structure for book
-- ----------------------------
DROP TABLE IF EXISTS "public"."book";
CREATE TABLE "public"."book" (
  "id" int4 NOT NULL DEFAULT nextval('book_id_seq'::regclass),
  "code" varchar COLLATE "pg_catalog"."default" NOT NULL,
  "title" varchar COLLATE "pg_catalog"."default" NOT NULL,
  "author" varchar COLLATE "pg_catalog"."default" NOT NULL,
  "stock" int4 NOT NULL DEFAULT 1
)
;

-- ----------------------------
-- Table structure for borrow_record
-- ----------------------------
DROP TABLE IF EXISTS "public"."borrow_record";
CREATE TABLE "public"."borrow_record" (
  "id" int4 NOT NULL DEFAULT nextval('borrow_record_id_seq'::regclass),
  "borrowedAt" timestamp(6) NOT NULL DEFAULT now(),
  "returnedAt" timestamp(6),
  "isPenalized" bool NOT NULL DEFAULT false,
  "memberId" int4,
  "bookId" int4
)
;

-- ----------------------------
-- Table structure for member
-- ----------------------------
DROP TABLE IF EXISTS "public"."member";
CREATE TABLE "public"."member" (
  "id" int4 NOT NULL DEFAULT nextval('member_id_seq'::regclass),
  "code" varchar COLLATE "pg_catalog"."default" NOT NULL,
  "name" varchar COLLATE "pg_catalog"."default" NOT NULL
)
;

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."book_id_seq"
OWNED BY "public"."book"."id";
SELECT setval('"public"."book_id_seq"', 6, true);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."borrow_record_id_seq"
OWNED BY "public"."borrow_record"."id";
SELECT setval('"public"."borrow_record_id_seq"', 5, true);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."member_id_seq"
OWNED BY "public"."member"."id";
SELECT setval('"public"."member_id_seq"', 4, true);

-- ----------------------------
-- Uniques structure for table book
-- ----------------------------
ALTER TABLE "public"."book" ADD CONSTRAINT "UQ_153910bab5ef6438fb822a0c143" UNIQUE ("code");

-- ----------------------------
-- Primary Key structure for table book
-- ----------------------------
ALTER TABLE "public"."book" ADD CONSTRAINT "PK_a3afef72ec8f80e6e5c310b28a4" PRIMARY KEY ("id");

-- ----------------------------
-- Primary Key structure for table borrow_record
-- ----------------------------
ALTER TABLE "public"."borrow_record" ADD CONSTRAINT "PK_bed177a8cdcca94d5adeebdc52c" PRIMARY KEY ("id");

-- ----------------------------
-- Uniques structure for table member
-- ----------------------------
ALTER TABLE "public"."member" ADD CONSTRAINT "UQ_87dbb39d7c7c430faa5bf1af3bb" UNIQUE ("code");

-- ----------------------------
-- Primary Key structure for table member
-- ----------------------------
ALTER TABLE "public"."member" ADD CONSTRAINT "PK_97cbbe986ce9d14ca5894fdc072" PRIMARY KEY ("id");

-- ----------------------------
-- Foreign Keys structure for table borrow_record
-- ----------------------------
ALTER TABLE "public"."borrow_record" ADD CONSTRAINT "FK_8032acbf1eb063876edcf49e96c" FOREIGN KEY ("bookId") REFERENCES "public"."book" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE "public"."borrow_record" ADD CONSTRAINT "FK_d3e3e77bbf01f4a80a2bd4ca297" FOREIGN KEY ("memberId") REFERENCES "public"."member" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
