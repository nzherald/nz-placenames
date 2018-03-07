BEGIN;

CREATE TEMP TABLE _load (
    id int
  , name text
  , status text
  , feat_type text
  , latitude float
  , longitude float
  , reo int
  , maybe int
  , other int
);

\copy _load from 'data/aotearoa-nz.csv' with csv header

DROP TABLE IF EXISTS placenames;
CREATE TABLE placenames AS
SELECT id, name, status, feat_type, reo, maybe, other, st_setsrid(st_point(longitude, latitude), 4326) as geom
FROM _load
where (longitude between 165 and 185 or longitude between -180 and -175) and latitude between -48 and -34;

\copy (select name, status, feat_type, reo, st_y(geom) as y, case when st_x(geom) > 180 then st_x(geom) - 360 else st_x(geom) end as x from placenames) to 'interactive/public/out.csv' with csv header
-- \copy (select name, status, feat_type, reo, round(st_x(geom) - 899480) as x, round(st_y(geom) - 4783333) as y from placenames) to 'frontend/public/out.csv' with csv header
-- \copy (select name, status, feat_type, reo, st_x(st_transform(geom, 4326)) as longitude, st_y(st_transform(geom, 4326)) as latitude from placenames) to 'll.csv' with csv header

COMMIT;
