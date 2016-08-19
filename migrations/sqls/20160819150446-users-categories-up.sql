/* Replace with your SQL commands */
ALTER TABLE images ADD userid bigint;

CREATE TABLE categories (
  "id" serial NOT NULL,
  "name" text,
  "image" bigint,
  PRIMARY KEY ("id")
)
INSERT INTO categories (id, name, image) VALUES (1, "Nebulae", 3);
INSERT INTO categories (id, name, image) VALUES (2, "Galaxies", 4);
INSERT INTO categories (id, name, image) VALUES (3, "Best of", 6);

UPDATE images SET userid = 1;

/*INSERT INTO users (id, username, password, role) VALUES (1, "Musse", "$2a$10$6BL3hWTTWU5Coi.dmZuBmuSaFHlbpTrzS2BvbaLHcNiyaEuqgClbS", 1);*/
