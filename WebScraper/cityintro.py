import requests
from bs4 import BeautifulSoup
import string
from flask_restful import Resource
from flask import request as flareq


class CityText(Resource):
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
        if code == 404:
            return 'Page does not exist', 404
        elif code == 300:
            return 'City page does not exist', 404
        return city_text.get_text(), 201


class CityTextScraper:
    def __init__(self, city, state, text):
        self.city = city
        self.state = state
        self.text = text

        self.page = 'https://en.wikipedia.org/wiki/'
        self.paragraph = {}

    def fill_city_data(self):
        city_page = self.get_page(self.page, self.city, self.state)
        if city_page is False:
            return 404

        soup = BeautifulSoup(city_page.content, 'lxml')
        city_info_table = soup.findAll("p")
        if city_info_table is None:
            return 300
        for i in range(len(city_info_table)):
            if i > self.text:
                continue
            self.paragraph[f'paragraph{i}'] = city_info_table[i].get_text()
        return 200

    def get_text(self):
        return self.paragraph

    def get_page(self, page, city=None, state=None):
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
    CityScraper('seattle', 'wa').fill_city_data()