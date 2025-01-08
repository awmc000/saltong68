import random
import time
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = [
    "http://localhost",
    "http://localhost:5173",
    "localhost:5173"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load word lists
eightWords = open('eight.txt', 'r').read().split('\n')
sixWords = open('six.txt', 'r').read().split('\n')

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
    return {"word": selectByDate(sixWords)}

# 8 letter word target
@app.get("/eight")
def eight():
    return {"word": selectByDate(eightWords)}

# Random word target with length parameter
@app.get("/rand/{length}")
def random_word(length: int):
    return {"todo": sixWords[random.randint(0, len(sixWords)-1)] if length == 6 else eightWords[random.randint(0, len(eightWords) - 1)]}

# Check if a word is in the dictionary
@app.get("/isword/{word}")
def is_word(word: str):
    return {"isword": word in sixWords or word in eightWords}