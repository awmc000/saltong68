import random
import time
from itertools import chain
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import psycopg2
import os

app = FastAPI()

dbConnection = psycopg2.connect(
    dbname="neondb",
    user="neondb_owner",
    password=os.getenv('SALTONG_DB_PASS'),
    host=os.getenv('SALTONG_DB_HOST')
)

def connect():
    '''
    Reconnects to the DB, updating the global connection variable.
    '''
    global dbConnection
    dbConnection = psycopg2.connect(
        dbname="neondb",
        user="neondb_owner",
        password="ZA4VqJ8lFRvu",
        host="ep-odd-paper-a6qfm216-pooler.us-west-2.aws.neon.tech"
    )

def close_connection():
    '''
    Closes the global DB connection.
    '''
    dbConnection.close()

def get_cursor():
    '''
    Creates a connection to return a cursor, re-trying for up to 10 seconds if it fails.
    '''
    attempts = 0
    while True:
        try:
            connect()
            cur = dbConnection.cursor()
            return cur
        except psycopg2.InterfaceError:
            print('db connection failed')
            close_connection()
        time.sleep(1)
        attempts += 1
        if attempts == 10:
            return None

def create_table():
    '''
    For interactive shell use. Creates the `words` table only if it does
    not exist and prints the result of a check of whether it exists.
    '''
    cursor = get_cursor()
    
    cursor.execute(
        '''
            CREATE TABLE IF NOT EXISTS words (
                word VARCHAR(20)
            );
        '''
    )
    
    cursor.execute(
        '''
            SELECT EXISTS (
                SELECT FROM pg_tables
                WHERE schemaname = 'public'
                AND tablename = 'words'
            )
        '''
    )
    table_exists = cursor.fetchone()
    
    print(f'Table exists: {table_exists}')
    close_connection()

origins = [
    "http://localhost",
    "http://localhost:5173",
    "localhost:5173",
    "*" #TODO: remove, allow access from saltong68.vercel.app
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def insert_words():
    '''
    For interactive shell use. Loads the words database
    and inserts it, commiting after each word, to the DB.
    '''
    sixWords = open('six.txt', 'r').read().split('\n')
    eightWords = open('eight.txt', 'r').read().split('\n')

    cursor = get_cursor()

    for word in chain(sixWords, eightWords):
        print(word)
        cursor.execute(f"INSERT INTO words (word) VALUES ('{word}')")
        dbConnection.commit()
    close_connection()

# 6 letter word target
@app.get("/six")
def six():
    '''
    API target which returns the 6-letter word of the day.
    '''
    cur = get_cursor()
    cur.execute(
        '''
        SELECT word
        FROM WORDS
        WHERE LENGTH(word) = 6
        ORDER BY md5(CURRENT_DATE::text || word::text)::uuid
        LIMIT 1;
        '''
    )
    word = cur.fetchone()
    close_connection()
    return {"word": word}

# 8 letter word target
@app.get("/eight")
def eight():
    '''
    API target which returns the 8-letter word of the day.
    '''
    cur = get_cursor()
    cur.execute(
        '''
        SELECT word
        FROM WORDS
        WHERE LENGTH(word) = 8
        ORDER BY md5(CURRENT_DATE::text || word::text)::uuid
        LIMIT 1;
        '''
    )
    word = cur.fetchone()
    close_connection()
    return {"word": word}

# Random word target with length parameter
@app.get("/rand/{length}")
def random_word(length: int):
    '''
    API target which returns a random word of a given length.
    NOT ready to use!
    '''
    query = f'''
    SELECT word FROM words WHERE LENGTH(word) = {length} ORDER BY RANDOM() LIMIT 1;
    '''
    cur = get_cursor()
    cur.execute(query)
    word = cur.fetchone()
    close_connection()
    return {"word": word}

# Check if a word is in the dictionary
@app.get("/isword/{word}")
def is_word(word: str):
    '''
    API target which returns `{"word": true}` if it is in the dictionary,
    and `{"word": false}` otherwise.
    '''
    cur = get_cursor()
    cur.execute(
        f'''
        SELECT 1
        FROM WORDS
        WHERE word LIKE '{word}'
        '''
    )
    res = cur.fetchone()
    close_connection()
    return {"isword": res is not None and 1 in res}
