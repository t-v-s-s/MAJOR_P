CREATE TABLE Property_type(
id SERIAL PRIMARY KEY,
name VARCHAR(100) NOT NULL UNIQUE
);
CREATE TABLE City(
   id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);
CREATE TABLE Area(
 id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
city_id INT REFERENCES city(id) ON DELETE CASCADE
)

CREATE TABLE country (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

CREATE TABLE state (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);




ALTER TABLE state
ADD COLUMN country_id INT REFERENCES country(id) ON DELETE CASCADE;

ALTER TABLE city
ADD COLUMN state_id INT REFERENCES state(id) ON DELETE CASCADE;

CREATE TABLE property (
    id SERIAL PRIMARY KEY,
    property_name VARCHAR(100),
    country_id INT REFERENCES country(id),
    state_id INT REFERENCES state(id),
    city_id INT REFERENCES city(id),
    area_id INT REFERENCES area(id)
);


DROP TABLE IF EXISTS property CASCADE;



INSERT INTO country (name) VALUES ('India'), ('China'), ('Japan'), ('France'), ('South Africa');

INSERT INTO state (name, country_id) VALUES 
('Maharashtra', (SELECT id FROM country WHERE name='India')),
('Uttar Pradesh', (SELECT id FROM country WHERE name='India')),
('Karnataka', (SELECT id FROM country WHERE name='India')),
('Tamil Nadu', (SELECT id FROM country WHERE name='India')),
('Gujarat', (SELECT id FROM country WHERE name='India'));

INSERT INTO city (name, state_id) VALUES 
('Mumbai', (SELECT id FROM state WHERE name='Maharashtra')),
('Pune', (SELECT id FROM state WHERE name='Maharashtra')),
('Nagpur', (SELECT id FROM state WHERE name='Maharashtra')),
('Nashik', (SELECT id FROM state WHERE name='Maharashtra')),
('Aurangabad', (SELECT id FROM state WHERE name='Maharashtra'));

INSERT INTO area (name, city_id) VALUES 
('Andheri', (SELECT id FROM city WHERE name='Mumbai')),
('Bandra', (SELECT id FROM city WHERE name='Mumbai')),
('Borivali', (SELECT id FROM city WHERE name='Mumbai')),
('Colaba', (SELECT id FROM city WHERE name='Mumbai')),
('Dadar', (SELECT id FROM city WHERE name='Mumbai'));