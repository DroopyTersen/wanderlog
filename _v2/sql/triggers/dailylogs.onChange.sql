CREATE OR REPLACE FUNCTION set_trip_from_date() RETURNS trigger AS $BODY$ 

BEGIN 
    NEW.trip_id = (
        SELECT
            trips.id
        FROM
            trips
        WHERE
            trips.author_id = NEW."author_id"
            AND trips.start <= NEW."date"
            AND trips.end >= NEW."date"
        LIMIT 1
            
        );
    RETURN NEW;
END;

$BODY$ LANGUAGE plpgsql;


CREATE TRIGGER set_trip_from_date
BEFORE INSERT OR UPDATE ON "dailylogs" 
FOR EACH ROW EXECUTE PROCEDURE set_trip_from_date();


CREATE OR REPLACE FUNCTION associate_photos_to_dailylog() RETURNS trigger AS $BODY$ 

BEGIN 
    UPDATE photos 
    SET dailylog_id = NEW.id
    WHERE author_id = 'bill' AND dailylog_id is NULL AND date = NEW.date;
    RETURN NEW;
END;

$BODY$ LANGUAGE plpgsql;

CREATE TRIGGER associate_photos_to_dailylog
AFTER INSERT OR UPDATE ON "dailylogs" 
FOR EACH ROW EXECUTE PROCEDURE associate_photos_to_dailylog();