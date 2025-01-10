import random
import time
from itertools import chain
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import psycopg2

app = FastAPI()

dbConnection = psycopg2.connect(
    dbname="neondb",
    user="neondb_owner",
    password="ZA4VqJ8lFRvu",
    host="ep-odd-paper-a6qfm216-pooler.us-west-2.aws.neon.tech"
)

def create_table():
    '''
    For interactive shell use. Creates the `words` table only if it does
    not exist and prints the result of a check of whether it exists.
    '''
    cursor = dbConnection.cursor()
    
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

origins = [
    "http://localhost",
    "http://localhost:5173",
    "localhost:5173",
    "*" #TODO: remove
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

    cursor = dbConnection.cursor()

    for word in chain(sixWords, eightWords):
        print(word)
        cursor.execute(f"INSERT INTO words (word) VALUES ('{word}')")
        dbConnection.commit()

# Selects an element determined by current date
def selectByDate(arr):
    date_str = time.strftime('%Y%m%d')
    date_num = int(date_str)
    
    hash_value = date_num * 2654435761
    
    index = hash_value % len(arr)
    
    return arr[index]

# 6 letter word target
@app.get("/six")
def six():
    cur = dbConnection.cursor()
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
    return {"word": word}

# 8 letter word target
@app.get("/eight")
def eight():
    cur = dbConnection.cursor()
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
    return {"word": word}

# Random word target with length parameter
@app.get("/rand/{length}")
def random_word(length: int):
    query = f'''
    SELECT word FROM words WHERE LENGTH(word) = {length} ORDER BY RANDOM() LIMIT 1;
    '''
    cur = dbConnection.cursor()
    cur.execute(query)
    word = cur.fetchone()
    return {"word": word}

# Check if a word is in the dictionary
@app.get("/isword/{word}")
def is_word(word: str):
    cur = dbConnection.cursor()
    cur.execute(
        f'''
        SELECT 1
        FROM WORDS
        WHERE word LIKE '{word}'
        '''
    )
    return {"isword": 1 in cur.fetchone()}