CREATE TABLE barchart (
	"name" varchar NOT NULL,
	"2016" int NOT NULL,
	"2017" int NOT NULL,
	"2018" int NOT NULL,
	"2019" int NOT NULL
);

CREATE TABLE activities(
	"activity_type" varchar NOT NULL,
	"date" date NOT NULL,
	"title" varchar NOT NULL,
	"distance" decimal,
	"calories" int,
	"duration" varchar NOT NULL,
	"avg_hr" int,
	"max_hr" int,
	"avg_pace" varchar,
	"best_pace" varchar,
	"steps" int,
	"start_latitude" decimal,
	"start_longitude" decimal
);

CREATE TABLE weeklydata(
	"day" int NOT NULL,
	"hour" int NOT NULL,
	"values" int NOT NULL
);

CREATE TABLE yearlydata(
	"Date" DATE NOT NULL,
	"value" int NOT NULL
);

CREATE TABLE mapdata(
	"activity_type" varchar NOT NULL,
	"title" varchar NOT NULL,
	"distance" decimal NOT NULL,
	"start_latitude" decimal NOT NULL,
	"start_longitude" decimal NOT NULL,
	"total_time" varchar NOT NULL
);