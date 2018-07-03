# Soccer Draw REST API #

* REST API app where users can upload a json file, simulate a World Cup competition draw and query data. *

## Routes ##

* /upload
  * POST
    - upload data to be used in the application
    - success: 201, returns json "Data uploaded succesfully."
    - error: 400, returns json "No files were uploaded."
    - trying to access any of the /api routes prior to uploading file returns 400 error and json "No data was provided. Please upload file."
* api/draw
  * GET
    - triggers the draw process and forms the competition groups
    - success: 200, returns json "Team draw completed succesfully."
* api/teams
  * GET
    - get all the teams info from database
    - success: 200, returns json with array of teams like this:
    ```
    [
    {
        "group": "H",
        "name": "Russia",
        "pot": "P1"
    },
    {
        "group": "F",
        "name": "Germany",
        "pot": "P1"
    },  
    ]    
    ```
* api/teams/:teamName
  - accepts name of a team as parameter (case insensitive)
  * GET
    - success: 200, returns json with team data
    - error: 404, :teamName doesn't match any team in database
  * PUT
    - modify only the name or pot fields for a team
    - success: 201, return json with the updated team data
  * DELETE
    - delete a team from database
    - success: 204, no content
* api/groups
  * GET
    - success: 200, returns the groups formed after draw:
    ```
    {
    "A": [
        {
            "group": "A",
            "name": "Belgium",
            "pot": "P1"
        },
        {
            "group": "A",
            "name": "Croatia",
            "pot": "P2"
        },
        {
            "group": "A",
            "name": "Sweden",
            "pot": "P3"
        },
        {
            "group": "A",
            "name": "Australia",
            "pot": "P4"
        }
    ],
    "B": [
        {
            "group": "B",
            "name": "Argentina",
            "pot": "P1"
        },
        {
            "group": "B",
            "name": "Peru",
            "pot": "P2"
        },
        {
            "group": "B",
            "name": "Iran",
            "pot": "P3"
        },
        {
            "group": "B",
            "name": "Morocco",
            "pot": "P4"
        }
      ],
    }
    ```
    - error: 400, trying to access this route prior to performing draw returns json "Please perform draw to form groups."
* api/groups/:groupName
  - accepts parameter :groupName with values from A to H (case insensitive)
  * GET
    - display the teams in the group provided as parameter
* api/pots
  * GET
    - success: 200, returns json with the initial pots:
    ```
    {
    "P1": [
        {
            "group": "H",
            "name": "Russia",
            "pot": "P1"
        },
        {
            "group": "E",
            "name": "Brazil",
            "pot": "P1"
        },
        {
            "group": "D",
            "name": "Portugal",
            "pot": "P1"
        },
        {
            "group": "B",
            "name": "Argentina",
            "pot": "P1"
        },
        {
            "group": "A",
            "name": "Belgium",
            "pot": "P1"
        },
        {
            "group": "C",
            "name": "Poland",
            "pot": "P1"
        },
        {
            "group": "G",
            "name": "France",
            "pot": "P1"
        }
      ],
    }
    ```

* api/pots/:potName
  * GET
    - accepts parameter :potName with values P1, P2, P3 , P4 for each initial pot (case insensitive)
    - success: 200, returns json with the teams in the pot provided as parameter
    - error: 404, parameter doesn't match any of the pots
