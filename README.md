# CS361-Project
---------------------------------
## Microservice

### City Data Scraper - url/citydata

Send data in json format via post request:
```
{
  'city':'seattle'
  'state':'wa'
}
```

Returns

```
Status Code: 201

Response:
{
  "City": "Seattle",
  "Country": "United States",
  "State": "Washington",
  "County": "King",
  "Founded": "November 13, 1851",
  "Named for": "Chief Si'ahl",
  "Mayor": "Jenny Durkan (D)",
  "Area": "142.07",
  "Elevation": "175 ",
  "Population": "753,675",
  "Rank": "18",
  "Density": "8,973.18",
  "Population_Metro": "3,979,845",
  "Demonym(s)": "Seattleite, Seattlite",
  "Time Zone": "UTC-8",
  "ZIP Codes": "98101-98199",
  "Area Code": "206",
  "Website": "Seattle.gov "
}
```

If unable to find page
```
Status Code: 404
Response: "City page does not exist"
```
If unable to find page
```
Status Code: 404
Response: "City table does not exist"
```

### Tax Data Scraper - url/taxdata
Send data in json format via post request:
```
{
  'city':'seattle'
  'state':'wa'
}
```

Returns

```
Status Code: 201

Response:
{
  "state": 6.5,
  "city": 0.15,
  "county": 3.6,
  "total": 10.25
}
```

If unable to find page
```
Status Code: 404
Response: "Main Page is not found"
```

If unable to find tax table
```
Status Code: 404
Response: "Tax table is not found"
```

If city is not found in state, will only update state and total data:
```
Status Code: 230
Response: 
{
  "state": 6.5,
  "city": 0.0,
  "county": 0.0,
  "total": 6.5
}
```
### City Text Scraper - url/citytextdata
Send data in json format via post request:
```
{
  'city':'seattle'
  'state':'wa'
  'text': 3
}

'text' default is set to 2
```

Returns

```
Status Code: 201

Response:
{
"paragraph0": " ",
"paragraph1": "Seattle (/siˈætəl/ (listen) see-AT-əl) is a seaport city on the West Coast of the United States. It is the seat of King County, Washington. With a 2019 population of 753,675, it is the largest city in both the state of Washington and the Pacific Northwest region of North America. The Seattle metropolitan area's population is 3.98 million, making it the 15th-largest in the United States.[9] In 2013-2016, Seattle rated the fastest-growing major city and[10] remained in the top five in May 2015 with an annual growth rate of 2.1%.[11] In July 2016, Seattle ranked as the fastest-growing major U.S. city, with a 3.1% annual growth rate, and continuously among the fastest growing cities in the United States.[12] ",
"paragraph2": "Seattle is situated on an isthmus between Puget Sound (an inlet of the Pacific Ocean) and Lake Washington. It is the northern largest city in the United States, located about 100 miles (160 km) south of the Canadian border. A major gateway for trade with northern Asia, Seattle is the fourth-largest port in North America in terms of container handling as of 2015[update].[13] ",
"paragraph3": "The Seattle area was inhabited by Native Americans for at least 4,000 years before the first permanent European settlers.[14] Arthur A. Denny and his group of travelers, subsequently known as the Denny Party, arrived from Illinois via Portland, Oregon, on the schooner Exact at Alki Point on November 13, 1851.[15] The settlement was moved to the eastern shore of Elliott Bay and named "Seattle" in 1852, in honor of Chief Si'ahl of the local Duwamish and Suquamish tribes. Today, Seattle has high populations of Native, Scandinavian, Asian American and African American people, as well as a thriving LGBT community that ranks sixth in the United States by population.[16] "
}
```

If unable to find page
```
Status Code: 404
Response: "Page does not exist"
```

If unable to find html label "\<p>"
```
Status Code: 404
Response: "City does not have text content"
```
