import bcrypt
import csv
import json

# csvfile = open('users3.csv', 'r')
# res = open('users.json', 'w')

# fieldnames = ("fname", "lname", "street", "city", "state",
#               "zip_code", "email", "password", "phone")
# reader = csv.DictReader(csvfile, fieldnames)
# output = json.dumps([row for row in reader])
# res.write(output)


def hashPassword(password):
    res = bcrypt.hashpw(password, bcrypt.gensalt())
    return res


users = open('users.json', 'r')
data = json.load(users)
for user in data:
    password = user["password"]
    hashedPas = hashPassword(password)
    print(hashedPas)
    print("-------------------------\n")
