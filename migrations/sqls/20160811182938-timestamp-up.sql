/* Replace with your SQL commands */
CREATE TABLE images (
	"id" serial NOT NULL,
	"name" text,
	image bytea,
	thumbnail bytea,
	mimetype text,
	created timestamp,
	PRIMARY KEY ("id")
);
