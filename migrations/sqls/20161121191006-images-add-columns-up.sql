/* Replace with your SQL commands */
ALTER TABLE images ADD COLUMN category_id bigint;
ALTER TABLE images ADD COLUMN description text;

DROP TABLE image_detail;
