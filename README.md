# YearPrism
http://yearprism.herokuapp.com/


## Summary

## Technology Used
    JavaScript, React, PostgreSQL, HTML, and CSS

## Screenshots
### Landing Page
![Landing Page](/ScreenShots/Landing.png "Landing Page")
![Mobile Landing Page](/ScreenShots/LandingMobile.png "Mobile Landing Page")

### Home Page
![Home Page](/ScreenShots/Home.png "Home Page")
![Mobile Home Page](/ScreenShots/HomeMobile.png "Mobile Home Page")

### Add Event Page
![Add Event Page](/ScreenShots/AddEvent.png "Add Event Page")
![Mobile Add Event Page](/ScreenShots/AddEventMobile.png "Mobile Add Event Page")

### Year View Page
![Year View Page](/ScreenShots/YearView.png "Year View Page")
![Mobile Year View Page](/ScreenShots/YearViewMobile.png "Mobile Year View Page")

### Search Events Page
![Search Events Page](/ScreenShots/SearchView.png "Search Events Page")
![Mobile Search Events Page](/ScreenShots/SearchViewMobile.png "Mobile Search Events Page")


## API Documentation 
### Getting Started
To use API endpoints:
https://yearprism-api.herokuapp.com/api

#### EndPoints
**/**
>Test
Response 

    [
        {"Hello, world!"}
    ]
    


**/users**  POST
>Adds a new user

Send 

    [
        {"username": "Picard", "birthyear": "2305", "password": "Makeitso#1"}
    ]


*username must be unique, password must contain 8 characters long and inclue Capital, number, and one of #?!@$%^&*-

Response  

    [
        {
        "authToken": *token*,
        "user": {
            "username": "Picard",
            "user_id": 99,
            "birthyear": 2305
            }
        }
    ]


**/users/:id** DELETE
>Deletes user



**/login**  POST
>Logsin user

Send 

    [
        {"username": "Picard", "password": "Makeitso#1"}
    ]

Response 

    [
        {
        "authToken": *token*,
        "user": {
            "username": "Picard",
            "user_id": 99,
            "birthyear": 2305
            }
        }
    ]



**/events/**   GET
>Gets all events a user has made

Send 

    [
        {"user_id": 99}
    ]

Response 

    [
    {
        "eventid": 53,
        "user_id": 99,
        "eventdate": "2020-02-06T06:00:00.000Z",
        "eventname": "Borded the Enterprise",
        "category": "Job",
        "notes": ""
    },
    {
        "eventid": 54,
        "user_id": 99,
        "eventdate": "2020-02-06T06:00:00.000Z",
        "eventname": "Encountered the Borg",
        "category": "Achievement",
        "notes": "This should be fun"
    }
]


**/events/**   POST
>adds an event to a users account

Send 

    [
        {
            "user_id": 99,
            "eventdate": "2013-02-01T06:00:00.000Z",
            "eventname": "Shot with an arrow",
            "category": "Medical",
            "notes": ""
        }
    ]

Response 

    [
        {
            "eventid": 25,
            "user_id": 99,
            "eventdate": "2013-02-01T06:00:00.000Z",
            "eventname": "Shot with an arrow",
            "category": "Medical",
            "notes": ""
        }
    ]


**/events/**   PATCH
>modifies an event in a users account

Send 

    [
        {
            "eventid": 25,
            "user_id": 99,
            "eventdate": "2013-02-01T06:00:00.000Z",
            "eventname": "Shot with an arrow",
            "category": "Medical",
            "notes": "At least it convinced the inhabitants of Mintaka III that I an not a god."
        }
    ]

Response 

    [
        {
            "eventid": 25,
            "user_id": 99,
            "eventdate": "2013-02-01T06:00:00.000Z",
            "eventname": "Shot with an arrow",
            "category": "Medical",
            "notes": "At least it convinced the inhabitants of Mintaka III that I an not a god."
        }
    ]



**/events/:id**  DELETE
>Deletes event from users account

Send

    [
        {"eventid": 100}
    ]
    
Response

    [
        {message: "deleted"}
    ]



**/events/:year**  GET
>Gets all events in a year

Send

    [
        
    ]

Response

    [
        {
            "command": "SELECT",
            "rowCount": 1,
            "oid": null,
            "rows": [
                {
                    "eventid": 25,
                    "user_id": 99,
                    "eventdate": "2013-02-01T06:00:00.000Z",
                    "eventname": "Shot with an arrow",
                    "category": "Medical",
                    "notes": "At least it convinced the inhabitants of Mintaka III that I an not a god."
                },
                {
                    "eventid": 53,
                    "user_id": 99,
                    "eventdate": "2020-02-06T06:00:00.000Z",
                    "eventname": "Borded the Enterprise",
                    "category": "Job",
                    "notes": ""
                },
                {
                    "eventid": 54,
                    "user_id": 99,
                    "eventdate": "2020-02-06T06:00:00.000Z",
                    "eventname": "Encountered the Borg",
                    "category": "Achievement",
                    "notes": "This should be fun"
                }
            ],
            "fields": [
                *ect..*
               
            ],
            "_parsers": [
                null,
                null,
            ],
            "_types": {
                "_types": {
                    *ect..*
                },
                "text": {},
                "binary": {}
            },
            "RowCtor": null,
            "rowAsArray": false
        }
    ]