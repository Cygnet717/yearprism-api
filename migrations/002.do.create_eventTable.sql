CREATE TYPE cat AS ENUM (
    'Achievements', 'Body Modification', 'Family', 'Home', 'Job', 'Medical', 'Pets', 'Relationship', 'School', 'Vacation', 'Other'
);

CREATE TABLE YP_events (
    eventId INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    user_id INTEGER REFERENCES YP_users(user_id) ON DELETE CASCADE,
    eventDate DATE NOT NULL, 
    eventName TEXT NOT NULL,
    category cat NOT NULL,
    notes TEXT
);
END