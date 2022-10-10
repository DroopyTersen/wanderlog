import dayjs from "dayjs";
import { Link, useNavigate } from "react-router-dom";
import { getDaysInRange } from "~/common/utils";
import { BigDate } from "~/components";
import { CarouselSlider } from "~/components/carousel/CarouselSlider";
import { TripDto } from "../trip.types";

interface TripDaysSlider {
  trip: TripDto;
  activeDate: string;
}

export function TripDaysSlider({ trip, activeDate }: TripDaysSlider) {
  let tripDates = getDaysInRange(trip?.start, trip?.end).map((d) =>
    dayjs(d).format("YYYY-MM-DD")
  );
  let navigate = useNavigate();
  let activeDateIndex = tripDates.findIndex((d) => d === activeDate);
  return (
    <CarouselSlider
      startingIndex={activeDateIndex}
      onChange={(selectedIndex) => {
        navigate("/trips/" + trip.id + "/" + tripDates[selectedIndex]);
      }}
    >
      {tripDates.map((date) => (
        <div className="relative" key={date}>
          <DayHeader key={date} date={date} trip={trip} />
        </div>
      ))}
    </CarouselSlider>
  );
}
interface DayHeaderProps {
  date: string;
  trip: TripDto;
}

function DayHeader({ date, trip }: DayHeaderProps) {
  let $date = dayjs(date);
  let dayNum = $date.diff(dayjs(trip.start), "day") + 1;

  return (
    <div className="centered">
      <h2 className="text-gold-300 mb-1">
        <BigDate date={date} variant="day-date-month" />
      </h2>
      {trip?.title && (
        <div className="flex items-center gap-1">
          <span className="day-count font-bold">Day {dayNum}:</span>
          <Link to={"/trips/" + trip?.id} className="text-pink">
            {trip.title}
          </Link>
        </div>
      )}
    </div>
  );
}
