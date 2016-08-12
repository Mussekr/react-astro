/* Replace with your SQL commands */
CREATE TABLE users (
	"id" serial NOT NULL,
	username text,
	"password" text,
	"role" text,
	PRIMARY KEY ("id")
);

CREATE TABLE images (
	"id" serial NOT NULL,
	"name" text,
	image bytea,
	thumbnail bytea,
	mimetype text,
	created timestamp,
	PRIMARY KEY ("id")
);
