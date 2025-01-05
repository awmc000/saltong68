import random
import time
from fastapi import FastAPI

app = FastAPI()

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