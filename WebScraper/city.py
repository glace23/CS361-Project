import requests
from bs4 import BeautifulSoup
import string
import re
from flask_restful import Resource
from flask import request as flareq


class City(Resource):
    """
    Resource class for CityScraper
    ...

    post()
        returns city data in json format or a string via post request


    """

    def post(self):
        req = flareq.get_json()
        city = req['city']
        state = req['state']
        city_data = CityScraper(city, state)
        city_response = city_data.fill_city_data()
        if city_response == 300:
            return 'City page does not exist', 404
        elif city_response == 250:
            return 'City table does not exist', 404

        return city_response, 201


class CityScraper:
    """
    A class represents scraped city from website.

    ...

    Attributes:
    -----------
    city: str
        the name of the city
    state: str
        the two letter abbreviation of the state

    Methods:
    --------
    fill_city_data()
        fills city data in a dict format into city_key variable

    get_page(page, city=None, State=None)
        returns the webpage from website

    _search_labels(city_info_table)
        Searches for all data labels and corresponding in city_info_table, add them to label and data list

    _add_labels()
        adds label list data to city list data

    _find_index()
        transform data and update city_data

    get_city_key()
        returns city_key dict

    """
    def __init__(self, city, state):
        """
        Parameters:
        -----------
        City: str
            name of city
        State: str
            2 letter abbreviation of state name
        page: str
            url of webpage to scrape
        label_list: list
            list of label names in table
        data_list: list
            list of data of the label in table
        city_label: list
            pre-determined list of labels to find
        city_data: list
            corresponding list of data to find
        city_key: dict
            dict to return as json format
        """
        self.city = city
        self.state = state

        self.page = 'https://en.wikipedia.org/wiki/'
        self.label_list = []
        self.data_list = []
        self.city_label = ['City', 'Country', 'State', 'County', 'Founded', 'Named for', 'Mayor', 'Area', 'Elevation',
                           'Population', 'Rank', 'Density', 'Population_Metro', 'Demonym(s)', 'Time Zone', 'ZIP Codes',
                           'Area Code', 'Website']
        self.city_data = [None] * len(self.city_label)
        self.city_key = {}

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
                Successfully updated city_key

        """
        city_page = self.get_page(self.page, self.city, self.state)
        if city_page is False:
            return 300

        soup = BeautifulSoup(city_page.content, 'lxml')
        city_info_table = soup.find("table", {"class": "infobox"})
        if city_info_table is None:
            return 250
        self._search_labels(city_info_table)
        self._add_labels()
        self._find_index()

        for i in range(len(self.city_label)):
            self.city_key[self.city_label[i]] = self.city_data[i]
        return self.city_key

    def get_city_key(self):
        """Return city_key"""
        return self.city_key

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

    def _search_labels(self, city_info_table):
        """Searches for data and labels in city info table"""
        for element in city_info_table.find_all(class_="infobox-label"):
            # Add header, if element has bullet point and
            # element.parent.previous sibling does not have bullet point
            if chr(8226) not in element.parent.find_previous_sibling().text and chr(8226) in element.text:
                header = element.parent.find_previous_sibling().text
                label = header.replace(u'\xa0', ' ').strip() + '_' + \
                        element.text.replace(u'\xa0', ' ').replace(chr(8226), '').strip()
            # if element has bullet point, continue use header
            elif chr(8226) in element.text:
                label = header.replace(u'\xa0', ' ').strip() + '_' + \
                        element.text.replace(u'\xa0', ' ').replace(chr(8226), '').strip()
            # if no bullet point
            else:
                label = element.text.replace(u'\xa0', ' ').replace(chr(8226), '').strip()

            data = element.find_next_sibling().text.replace(u'\xa0', ' ')
            while '[' in label:
                label = label[:label.index('[')] + label[label.index(']') + 1:]
            while '[' in data:
                data = data[:data.index('[')] + data[data.index(']') + 1:]

            self.label_list.append(label)
            self.data_list.append(data)

    def _add_labels(self):
        """Add label to city_data and data to data_list"""
        for i in range(len(self.city_label)):
            for j in range(len(self.label_list)):
                if self.city_label[i].lower() == self.label_list[j].lower():
                    self.city_data[i] = self.data_list[j]

    def _find_index(self):
        """Find and transform data found in label list and data list"""
        founded = []
        government = []
        population = []
        area = []
        self.city_data[0] = self.city.capitalize()
        for i in range(len(self.label_list)):
            label = self.label_list[i].lower()
            if 'founded' in label or 'incorporate' in label or 'settle' in label:
                founded.append(i)
            elif 'government' in label:
                government.append(i)
            elif 'area code' in label:
                self._find_area_code(i)
            elif 'area' in label:
                area.append(i)
            elif 'population' in label:
                population.append(i)
            elif 'zip' in label:
                self._find_zip(i)
            elif 'elevation' in label and 'low' not in label and 'high' not in label:
                self._find_elevation(i)
            elif 'demonym' in label:
                self._find_demonym(i)
            elif 'time' in label and 'summer' not in label:
                self._find_time(i)
            elif i < 5 and ('county' in label or 'borough' in label or 'counties' in label):
                self._find_county(i)
        self._find_founded(founded)
        self._find_mayor(government)
        self._find_population(population)
        self._find_area(area)

    def _find_founded(self, founded):
        """Transform data for label 'founded'"""
        for i in founded:
            if 'founded' == self.label_list[i].lower():
                self.city_data[4] = self.data_list[i]
                return
            elif 'incorporate' in self.label_list[i].lower():
                self.city_data[4] = self.data_list[i]
                return
            elif 'settle' in self.label_list[i].lower():
                self.city_data[4] = self.data_list[i]
                return

    def _find_mayor(self, government):
        """Transform data for label 'mayor'"""
        for i in government:
            if 'mayor' in self.label_list[i].lower():
                self.city_data[6] = self.data_list[i]
                return

    def _find_population(self, population):
        """Transform data for label 'population'"""
        for i in population:
            if 'estimate' in self.label_list[i].lower() or 'population' == self.label_list[i].lower():
                if ' ' in self.data_list[i]:
                    self.city_data[9] = self.data_list[i][:self.data_list[i].index(' ')]
                else:
                    self.city_data[9] = self.data_list[i]
            if 'rank' in self.label_list[i].lower():
                ranking = re.split("\D", self.data_list[i])
                for j in range(len(ranking)):
                    if ranking[j] != '':
                        self.city_data[10] = ranking[j]
            if 'density' in self.label_list[i].lower():
                self.city_data[11] = self.data_list[i][:self.data_list[i].index('/')]
            if 'metro' in self.label_list[i].lower():
                self.city_data[12] = self.data_list[i][:self.data_list[i].index(' ')]

    def _find_area(self, area):
        """Transform data for label 'area'"""
        for i in area:
            area_data = self.data_list[i][:self.data_list[i].index(' ')]
            if 'city' in self.label_list[i].lower() or 'total' in self.label_list[i].lower() or 'area' == \
                    self.label_list[
                        i].lower():
                self.city_data[7] = area_data
                return

    def _find_zip(self, zipcode):
        """Transform data for label 'zipcode'"""
        if len(self.data_list[zipcode]) > 5:
            modded_zipcode = re.sub("\D", "", self.data_list[zipcode])
            self.city_data[15] = modded_zipcode[:5] + '-' + modded_zipcode[-5:]

    def _find_elevation(self, elevation):
        """Transform data for label 'elevation'"""
        self.city_data[8] = self.data_list[elevation][:self.data_list[elevation].index('ft')]

    def _find_demonym(self, demonym):
        """Transform data for label 'demonym'"""
        self.city_data[13] = self.data_list[demonym].replace(' or', ',')

    def _find_time(self, timezone):
        """Transform data for label 'timezone'"""
        self.city_data[14] = self.data_list[timezone][:self.data_list[timezone].index(' ')]
        self.city_data[14] = self.city_data[14].replace(chr(8722), '-')

    def _find_county(self, county):
        """Transform data for label 'county'"""
        counties = self.data_list[county]
        while '(' in counties:
            counties = counties[:counties.index('(')] + counties[counties.index(')') + 1:]

        cap = re.findall('[A-Z][^A-Z]*', counties)
        county_data = cap[0]
        for count in cap:
            if count not in county_data:
                county_data += ', ' + count.replace('\n', '')
        self.city_data[3] = county_data

    def _find_area_code(self, area_code):
        """Transform data for label 'area code'"""
        code = self.data_list[area_code]
        if 'and' in code:
            code = code.replace(' and', ',')
        if '/' in code:
            code = code.replace('/', ', ')
        if 'or' in code:
            code = code.replace(' or', ',')
        self.city_data[16] = code


if __name__ == '__main__':
    print(CityScraper('seattle', 'wa').fill_city_data())