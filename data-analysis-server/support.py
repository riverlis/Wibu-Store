import mysql.connector

from configs import *



def executeQuery(query):
    connection = mysql.connector.connect(
        host=MYSQL_HOST,
        username=MYSQL_USER,
        password=MYSQL_PASSWORD,
        database=MYSQL_DATABASE
    )

    try:
        cursor = connection.cursor()
        
        cursor.execute(query)

        result = cursor.fetchall()
        return result
    except Exception as e:
        print(e)