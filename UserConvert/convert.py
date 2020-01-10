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


def hashPassword(password, salt):

    res = bcrypt.hashpw(password.encode(), salt)
    return res


def checkHash(password, hashedPassword):
    coded = password.encode()
    return bcrypt.checkpw(coded, hashedPassword)


users = open('users.json', 'r')
data = json.load(users)
salt = bcrypt.gensalt()
# for user in data:
#     password = user["password"]
#     print(password)
#     print(hashPassword(password, salt))
#     checkHash(password)
#     print("-------------------------\n")

original = "testingPassword"
hashedPass = hashPassword("original", salt)

if(checkHash(original, hashedPass)):
    print("the hashing is working")
else:
    print("the hashing did not work")
