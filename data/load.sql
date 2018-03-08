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


CREATE TEMP TABLE _export AS
SELECT name, status, feat_type, reo,
CASE WHEN st_x(geom) > 180 then st_x(geom) - 360 ELSE st_x(geom) end AS x,
  st_y(geom) AS y
  FROM placenames
  UNION
  SELECT name, status, feat_type, reo,
  st_x(geom) AS x,
  st_y(geom) AS y
  FROM placenames
  WHERE st_x(geom) > 180;


\copy _export to 'interactive/public/out.csv' with csv header

COMMIT;
