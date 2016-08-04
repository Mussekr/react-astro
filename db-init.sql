CREATE TABLE images (
	"id" SERIAL,
	"name" text,
	"image" bytea,
	"thumbnail" bytea,
	"mimetype" text,
	PRIMARY KEY ("id")
);
