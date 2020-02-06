BEGIN;

TRUNCATE
    YP_users,
    YP_events
    RESTART IDENTITY CASCADE;

INSERT INTO YP_users (username, birthyear, password)
VALUES 
    ('Kathy', 1986, 'Password1!'),
    ('Nya', 2017, 'Password1!');

INSERT INTO YP_events (user_id, eventDate, eventName, category, notes)
VALUES
    (1, '2020-02-01', 'worked on app', 'Job', 'got frustrated many times'),
    (1, '2019-08-01', 'had surro baby Lizzie', 'Achievements', '22hr labor, born at 8:40am'),
    (1, '2017-05-01', 'moved to lakeville', 'Home', ''),
    (2, '2018-10-01', 'first birthday', 'Achievements', ''),
    (2, '2018-05-01', 'got bit at daycare', 'Medical', 'bit on the arm by Luca');

COMMIT;