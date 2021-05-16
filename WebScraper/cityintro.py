import requests
from bs4 import BeautifulSoup
import string
from flask_restful import Resource
from flask import request as flareq


class CityText(Resource):
    """
    Resource class for CityTextScraper
    ...

    post()
        returns city paragraphs in json format or a string via post request

    """
    def post(self):
        req = flareq.get_json()
        city = ''
        state = ''
        text = 2
        for key in req:
            if key.lower() == 'city':
                city = req[key]
            if key.lower() == 'state':
                state = req[key]
            if key.lower() == 'text' and isinstance(req[key], int):
                text = req[key]

        city_text = CityTextScraper(city, state, text)
        code = city_text.fill_city_data()
        if code == 300:
            return 'Page does not exist', 404
        elif code == 250:
            return 'City does not have text content', 404

        return code, 201


class CityTextScraper:
    """
        A class represents scraped texts of a city from website.

        ...

        Attributes:
        -----------
        city: str
            the name of the city
        state: str
            the two letter abbreviation of the state
        text: int
            number of paragraphs will be scraped

        Methods:
        --------
        fill_city_data()
            fills city text data in a dict format into paragraph variable

        get_page(page, city=None, State=None)
            returns the webpage from website

        get_text()
            returns paragraph

        """
    def __init__(self, city, state, text):
        """
        Parameters:
        -----------
        City: str
            name of city
        State: str
            2 letter abbreviation of state name
        page: str
            url of webpage to scrape
        paragraph: dict
            dict to return as json format
        """
        self.city = city
        self.state = state
        self.text = text

        self.page = 'https://en.wikipedia.org/wiki/'
        self.paragraph = {}

    def fill_city_data(self):
        """
        fills city_key dict and return corresponding code

        Returns:
        --------
            300:
                Web Page does not exist
            250:
                City table does not exist
            200:
                Successfully updated paragraph

        """
        city_page = self.get_page(self.page, self.city, self.state)
        if city_page is False:
            return 300

        soup = BeautifulSoup(city_page.content, 'lxml')
        city_info_text = soup.findAll("p")
        if city_info_text is None:
            return 250
        for i in range(len(city_info_text)):
            if i > self.text:
                continue
            self.paragraph[f'paragraph{i}'] = city_info_text[i].get_text()
        return self.paragraph

    def get_text(self):
        """Returns paragraph"""
        return self.paragraph

    def get_page(self, page, city=None, state=None):
        """Gets city web page"""
        # remove front and end white space
        city = city.strip()
        # capitalize all words
        city = string.capwords(city)
        # replace all space with underscore
        city = city.replace(' ', '_')
        response = requests.get(f'{page}{city},_{state.upper()}')
        try:
            if response.status_code == 200:
                return response
            else:
                return False
        except RequestException as e:  # if the request is not successful, print out the exceptions content
            return False


if __name__ == '__main__':
    pass
