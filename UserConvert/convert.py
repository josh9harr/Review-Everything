import bcrypt
import csv
import json

# csvfile = open('users3.csv', 'r')
res = open('usersHashed.json', 'w')

# fieldnames = ("fname", "lname", "street", "city", "state",
#               "zip_code", "email", "password", "phone")
# reader = csv.DictReader(csvfile, fieldnames)
# output = json.dumps([row for row in reader])
# res.write(output)


def hashPassword(password, salt):

    res = bcrypt.hashpw(password.encode(), salt)
    return res


def checkHash(password, hashedPassword):
    coded = password.encode()
    return bcrypt.checkpw(coded, hashedPassword)


users = open('users.json', 'r')
data = json.load(users)
salt = bcrypt.gensalt()

for user in data:
    password = user["password"]
    hashedPassword = hashPassword(password, salt)
    user["orig-password"] = password
    user["password"] = hashedPassword.decode()
    print(user)
output = json.dumps(data)
res.write(output)
print(data)
