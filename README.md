

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
        {"username": "Picard", "password": "Makeitso#1"}
    ]


*username must be unique, password must contain 8 characters long and inclue Capital, number, and one of #?!@$%^&*-

Response  

    [
        {user_id: 99, username: "Picard"}
    ]
