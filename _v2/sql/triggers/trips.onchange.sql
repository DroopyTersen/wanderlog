CREATE OR REPLACE FUNCTION associate_items_to_trip() RETURNS trigger AS $BODY$ 

BEGIN 
    UPDATE dailylogs 
    SET trip_id = NEW.id
    WHERE author_id = NEW.author_id AND trip_id is NULL AND date >= NEW."start" AND date <= NEW."end";

    UPDATE photos 
    SET trip_id = NEW.id
    WHERE author_id = NEW.author_id AND trip_id is NULL AND date >= NEW."start" AND date <= NEW."end";

    RETURN NEW;
END;

$BODY$ LANGUAGE plpgsql;

CREATE TRIGGER associate_items_to_trip
AFTER INSERT OR UPDATE ON "trips" 
FOR EACH ROW EXECUTE PROCEDURE associate_items_to_trip();