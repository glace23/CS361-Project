import requests
from bs4 import BeautifulSoup
import string
from flask_restful import Resource
from flask import request as flareq


class SalesTaxTable(Resource):
    """
    Resource class for SalesTaxTableScraper
    ...

    post()
        returns sales tax html in json format or a string via post request

    """
    def post(self):
        sales_tax_table = SalesTaxTableScraper()
        code = sales_tax_table.get_table_data()

        if code == 300:
            return 'Page does not exist', 404
        elif code == 250:
            return 'Tax table does exist', 404

        return code, 201


class SalesTaxTableScraper:
    """
        A class represents scraped texts of a sales tax table from website.

        ...

        Methods:
        --------
        get_table_data()
            finds sales tax table data

        get_page(page, city=None, State=None)
            returns the webpage from website

        get_text()
            returns sales tax table

        """
    def __init__(self):
        """
        Parameters:
        -----------
        """

        self.page = 'https://www.sale-tax.com/'
        self.table = {}

    def get_table_data(self):
        """
        fills self.table and return corresponding code

        Returns:
        --------
            300:
                Web Page does not exist
            250:
                table does not exist
            200:
                Successfully updated self.table

        """
        table_page = self.get_page(self.page)
        if table_page is False:
            return 300

        soup = BeautifulSoup(table_page.content, 'lxml')
        table_info_text = soup.find("table")
        if table_info_text is None:
            return 250
        self.table['table'] = str(table_info_text)
        return self.table

    def get_table(self):
        """Returns paragraph"""
        return self.table

    def get_page(self, page, city=None, state=None):
        """Gets table web page"""

        response = requests.get(f'{page}')
        try:
            if response.status_code == 200:
                return response
            else:
                return False
        except RequestException as e:  # if the request is not successful, print out the exceptions content
            return False


if __name__ == '__main__':
    pass