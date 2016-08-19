/* Replace with your SQL commands */
ALTER TABLE images ADD userid bigint;

CREATE TABLE categories (
  "id" serial NOT NULL,
  "name" text,
  "image" bigint,
  PRIMARY KEY ("id")
);
