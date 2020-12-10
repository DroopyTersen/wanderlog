
-- SET DAILY LOG AND TRIP ON WHEN PHOTOS CHANGE

-- FUNCTION
CREATE OR REPLACE FUNCTION set_dailylog_from_date()
    RETURNS trigger AS $BODY$

BEGIN
    NEW.dailylog_id = (SELECT dailylogs.id FROM dailylogs WHERE dailylogs.date = NEW."date");
    NEW.trip_id = (SELECT trips.id FROM trips WHERE trips.start <= NEW."date" AND trips.end >= NEW."date");
    RETURN NEW;
END;
    $BODY$ LANGUAGE plpgsql;



-- TRIGGER
CREATE TRIGGER set_dailylog_from_date
BEFORE INSERT OR UPDATE ON "photos" 
FOR EACH ROW EXECUTE PROCEDURE set_dailylog_from_date();