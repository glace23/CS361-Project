import pandas as pd
import requests
from bs4 import BeautifulSoup
import string
from flask_restful import Resource
from flask import request as flareq


class Tax(Resource):
    """
    Resource class for TaxScraper
    ...

    post()
        returns city data in json format or a string via post request

    """

    def post(self):
        req = flareq.get_json()
        city = ''
        state = ''
        for key in req:
            if key.lower() == 'city':
                city = req[key]
            if key.lower() == 'state':
                state = req[key]

        data = TaxScraper(city, state)
        tax_data = data.find_rate()
        if tax_data == 300:
            return 'Main Page is not found', 404
        elif tax_data == 350:
            return 'Tax table is not found', 404
        elif tax_data == 250:
            # City does not exist, return state tax data
            return data.get_state_rate(state), 230

        return tax_data, 201


class TaxScraper:
    """
        A class represents scraped taxes of a city from website.

        ...

        Attributes:
        -----------
        city: str
            the name of the city
        state: str
            the two letter abbreviation of the state

        Methods:
        --------
        fill_rate()
            fills city rate data in a dict format

        get_page(page, city=None, State=None)
            returns the webpage from website

        find_state_rate()
            finds state rate of parameter

        get_text()
            returns paragraph

        """
    def __init__(self, city, state):
        self.city = city.strip()
        self.state = state.strip()

        self.page = 'https://www.sale-tax.com/'
        self.label_list = []
        self.data_list = []
        self.state_rates = {}
        self.rate_data = {'state': 0.0, 'city': 0.0, 'county': 0.0, 'total': 0.0}

    def find_rate(self):
        """Finds rate data for state and city"""
        if self.check_dc(self.state):
            return self.rate_data

        if self.find_state_rates():
            self.rate_data['state'] = self.state_rates[self.state.upper()]
            self.rate_data['total'] = self.rate_data['state']
        # state_name = f"{self.get_state_name(self.state)} State"
        else:
            return 300

        tax_page = self.get_page(self.page, self.city, self.state)
        if tax_page is False:
            return 350

        soup = BeautifulSoup(tax_page.content, 'lxml')
        tax_info_table = soup.find("table", {"class": "breakdown-table"})
        if tax_info_table is None:
            return 250

        df = pd.read_html(str(tax_info_table))
        newdf = df[0]  # build data frame

        for row in newdf.itertuples():
            district = row[1]
            rate = row[2]

            if isinstance(district, str):
                if district.lower() == self.city.lower():
                    self.rate_data['city'] = float(rate[:rate.index('%')])
                elif district.lower() == 'total':
                    self.rate_data['total'] = float(rate[:rate.index('%')])

        self.rate_data['county'] = round(self.rate_data['total'] - self.rate_data['city'] - self.rate_data['state'], 3)

        return self.rate_data

    def find_state_rates(self):
        """Finds state rate data"""
        tax_page = self.get_page(self.page)
        if tax_page is False:
            return False

        soup = BeautifulSoup(tax_page.content, 'lxml')
        tax_info_table = soup.find("table", {"class": "rate-table"})
        if tax_info_table is None:
            return False

        df = pd.read_html(str(tax_info_table))
        newdf = df[0]  # build data frame

        for row in newdf.itertuples():
            district = row[1]
            rate = row[2]
            stateAbb = district[district.index('(') + 1:district.index(')')]
            self.state_rates[stateAbb] = float(rate[:rate.index('%')])
        return True

    def get_state_rate(self, state):
        """Returns state rate"""
        return self.state_rates[state.upper()]

    def check_dc(self, state):
        """Checks if state is D.C."""
        if state.lower() == 'dc':
            self.rate_data['city'] = 6.0
            self.rate_data['total'] = 6.0
            return True
        return False

    def get_state_name(self, state):
        """Gets state full name from abbreviation"""
        state_list = {
            "AL": "Alabama",
            "AK": "Alaska",
            "AS": "American Samoa",
            "AZ": "Arizona",
            "AR": "Arkansas",
            "CA": "California",
            "CO": "Colorado",
            "CT": "Connecticut",
            "DE": "Delaware",
            "DC": "District Of Columbia",
            "FM": "Federated States Of Micronesia",
            "FL": "Florida",
            "GA": "Georgia",
            "GU": "Guam",
            "HI": "Hawaii",
            "ID": "Idaho",
            "IL": "Illinois",
            "IN": "Indiana",
            "IA": "Iowa",
            "KS": "Kansas",
            "KY": "Kentucky",
            "LA": "Louisiana",
            "ME": "Maine",
            "MH": "Marshall Islands",
            "MD": "Maryland",
            "MA": "Massachusetts",
            "MI": "Michigan",
            "MN": "Minnesota",
            "MS": "Mississippi",
            "MO": "Missouri",
            "MT": "Montana",
            "NE": "Nebraska",
            "NV": "Nevada",
            "NH": "New Hampshire",
            "NJ": "New Jersey",
            "NM": "New Mexico",
            "NY": "New York",
            "NC": "North Carolina",
            "ND": "North Dakota",
            "MP": "Northern Mariana Islands",
            "OH": "Ohio",
            "OK": "Oklahoma",
            "OR": "Oregon",
            "PW": "Palau",
            "PA": "Pennsylvania",
            "PR": "Puerto Rico",
            "RI": "Rhode Island",
            "SC": "South Carolina",
            "SD": "South Dakota",
            "TN": "Tennessee",
            "TX": "Texas",
            "UT": "Utah",
            "VT": "Vermont",
            "VI": "Virgin Islands",
            "VA": "Virginia",
            "WA": "Washington",
            "WV": "West Virginia",
            "WI": "Wisconsin",
            "WY": "Wyoming"
        }
        return state_list[state.upper()]

    def get_page(self, page, city='', state=''):
        """Gets web page from website"""
        # remove front and end white space
        city = city.strip()
        # capitalize all words
        city = string.capwords(city)
        # replace all space with underscore
        city = city.replace(' ', '')

        response = requests.get(page + f'{city} + {state.upper()}')
        try:
            if response.status_code == 200:
                return response
            else:
                return response
        except RequestException as e:  # if the request is not successful, print out the exceptions content
            return 'Requests Failed: ' + str(e)


if __name__ == '__main__':
    print(TaxScraper('Seattle', 'WA').find_rate())
